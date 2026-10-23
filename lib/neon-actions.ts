import crypto from 'node:crypto';
import { db, record, records, saveRecord, deleteRecord, logAction, nextCode, now, rowId } from './neon-db';
import { uploadDrive, downloadDrive, type FileUpload } from './drive';
import { normalizeLanding,DEFAULT_LANDING } from './landing';
import { programs } from '../data/programs';

type Json=Record<string,any>;
const s=(v:unknown,max=200)=>{const x=String(v??'').trim();if(x.length>max)throw Error('Teks terlalu panjang');return x};
const sha=(s:string)=>crypto.createHash('sha256').update(s).digest('hex');
const isTrue=(v:unknown)=>v===true||String(v).toLowerCase()==='true';
const yes=(v:unknown)=>Boolean(v);
const currentUser=async(actor:any,required?:'admin'|'pejabat')=>{
  if(!actor||!actor.username||!actor.sessionVersion)throw Error('Sesi tidak tersedia. Login kembali.');
  const rows=await db()`SELECT username,display_name,role,session_version,active FROM sospro_users WHERE username=${actor.username} LIMIT 1`;
  const u=rows[0];if(!u||!u.active||u.role!==actor.role||u.session_version!==actor.sessionVersion||(required&&u.role!==required))throw Error('Sesi tidak berlaku atau akses ditolak. Silakan login ulang.');
  return {username:u.username,name:u.display_name,role:u.role,sessionVersion:u.session_version};
};
const validFile=(file:FileUpload|undefined,types:string[],max:number)=>{
  if(!file||!types.includes(file.mime)||!file.name||file.name.length>160||!/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(file.data||''))throw Error('File tidak valid');
  if(Buffer.from(file.data,'base64').length>max)throw Error(`Ukuran file maksimal ${Math.ceil(max/1e6)} MB`);
  return file;
};
const pdf='application/pdf',png='image/png';
const materialTypes=[pdf,png,'image/jpeg','application/zip','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
type InventoryRow = Json & { id: string; total: number; active: boolean };
const inventory = async (): Promise<InventoryRow[]> =>
  (await records<Json>('inventory')).map((it): InventoryRow => ({
    ...it,
    id: String(it.id ?? ''),
    total: Number(it.total),
    active: isTrue(it.active),
  }));
async function available(request:Json){
  const item=(await inventory()).find(it=>it.id===request.itemId&&it.active);
  if(!item)throw Error('Alat tidak terdaftar / nonaktif.');
  const used=(await records<Json>('requests')).filter(r=>r.kind==='ALAT'&&r.code!==request.code&&r.itemId===request.itemId&&['APPROVED','OUT'].includes(r.status)&&r.dateStart<=request.dateEnd&&r.dateEnd>=request.dateStart).reduce((n,r)=>n+Number(r.quantity),0);
  if(used+Number(request.quantity)>item.total)throw Error(`Stok alat tidak cukup pada tanggal tersebut. Terpesan ${used} dari ${item.total} unit.`);
}
const eventRows=async()=> (await records<Json>('events')).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
const materialView=(m:Json)=>({id:m.id,title:m.title,category:m.category,description:m.description,fileName:m.fileName||'',mime:m.mime||'',size:Number(m.size||0),hasFile:!!m.fileId,externalUrl:m.externalUrl||'',published:isTrue(m.published),createdAt:m.createdAt,updatedAt:m.updatedAt});

export async function runNeon<T=unknown>(action:string,b:Json={}):Promise<T>{
 let result:any;
 switch(action){
  case 'authOffice': {
   if(!process.env.AUTH_PEPPER || process.env.AUTH_PEPPER.length<32) throw Error('AUTH_PEPPER minimal 32 karakter wajib diisi di Vercel.');
   const username=s(b.username,40).toLowerCase(),password=String(b.password||'');
   if(!/^[a-z][a-z0-9._-]{3,39}$/.test(username)||!password||password.length>128)return null as T;
   const rs=await db()`SELECT * FROM sospro_users WHERE username=${username} LIMIT 1`;const u=rs[0];
   if(!u||!u.active)return null as T;
   if(u.locked_until&&new Date(u.locked_until).getTime()>Date.now())throw Error('Terlalu banyak percobaan login. Coba lagi dalam 15 menit.');
   const actual=crypto.scryptSync(password+String(process.env.AUTH_PEPPER||''),u.salt,64);
   const expected=Buffer.from(u.password_hash,'hex');const good=expected.length===actual.length&&crypto.timingSafeEqual(actual,expected);
   if(!good){await db()`UPDATE sospro_users SET login_failures=login_failures+1,locked_until=CASE WHEN login_failures+1>=6 THEN now()+interval '15 minutes' ELSE NULL END WHERE username=${username}`;return null as T;}
   await db()`UPDATE sospro_users SET login_failures=0,locked_until=NULL,last_login_at=now() WHERE username=${username}`;
   return {username:u.username,name:u.display_name,role:u.role,sessionVersion:u.session_version} as T;
  }
  case 'listPublicEvents':result=(await eventRows()).filter(e=>e.status==='published');break;
  case 'listAdminEvents':await currentUser(b.actor,'admin');result=await eventRows();break;
  case 'createEvent':case 'updateEvent': {
   await currentUser(b.actor,'admin');const e=b.event||{};
   for(const k of ['title','date','time','location','description'])if(!s(e[k],k==='description'?2000:240))throw Error(`Data kegiatan ${k} wajib diisi`);
   const old=action==='updateEvent'?await record<Json>('events',s(e.id,80)):null;
   if(action==='updateEvent'&&!old)throw Error('Kegiatan tidak ditemukan');
   const id=old?.id||rowId('EVT');result={...old,...e,id,slug:s(e.slug||String(e.title).toLowerCase().replace(/[^a-z0-9]+/g,'-'),180),status:['published','draft','finished'].includes(e.status)?e.status:'published',attendanceOpen:!!e.attendanceOpen,createdAt:old?.createdAt||now(),updatedAt:now()};
   await saveRecord('events',id,result);break;
  }
  case 'submitAttendance':{
   const event=await record<Json>('events',s(b.eventId,80));if(!event||event.status!=='published'||!isTrue(event.attendanceOpen))throw Error('Presensi belum dibuka atau kegiatan tidak tersedia.');
   const name=s(b.name,200),phone=s(b.phone,100).replace(/[^\d+]/g,''),institution=s(b.institution,200);
   if(!name||!phone||!institution)throw Error('Lengkapi data presensi');
   // UNIQUE key: satu nomor telepon per kegiatan; insert atomik untuk mencegah presensi ganda.
   const key=sha(event.id+':'+phone);
   const id=rowId('ATT'),participant={id,eventId:event.id,name,phone,institution,timestamp:now()};
   const rows=await db()`INSERT INTO sospro_entities(collection,id,payload) VALUES('attendance',${key},${JSON.stringify(participant)}::jsonb) ON CONFLICT DO NOTHING RETURNING id`;
   if(!rows.length)throw Error('Nomor HP ini sudah tercatat pada kegiatan yang sama.');
   result={attendanceId:id};break;
  }
  case 'getAttendance':{
   await currentUser(b.actor,'admin');const attendees=(await records<Json>('attendance')).filter(a=>a.eventId===b.eventId),won=new Set((await records<Json>('winners')).filter(w=>w.eventId===b.eventId).map(w=>w.participantId));result=attendees.map(a=>({...a,won:won.has(a.id)}));break;
  }
  case 'drawWinner':{
   await currentUser(b.actor,'admin');const attendees=(await records<Json>('attendance')).filter(a=>a.eventId===b.eventId);const winners=(await records<Json>('winners')).filter(w=>w.eventId===b.eventId);
   const won=new Set(winners.map(w=>w.participantId));const pool=attendees.filter(a=>!won.has(a.id));if(!pool.length)throw Error('Tidak ada peserta eligible yang tersisa.');
   const chosen=pool[crypto.randomInt(pool.length)];result={id:rowId('WIN'),eventId:b.eventId,participantId:chosen.id,name:chosen.name,phone:chosen.phone,institution:chosen.institution,prize:s(b.prize||'Doorprize',100),timestamp:now()};
   // UNIQUE key per peserta-event mencegah pemenang yang sama dicatat ulang.
   const wonKey=sha(String(b.eventId)+':'+chosen.id);
   const inserted=await db()`INSERT INTO sospro_entities(collection,id,payload) VALUES('winners',${wonKey},${JSON.stringify(result)}::jsonb) ON CONFLICT DO NOTHING RETURNING id`;
   if(!inserted.length)throw Error('Pemenang sudah terpilih, muat ulang peserta.');break;
  }
  case 'inventoryPublic':result=(await inventory()).filter(i=>i.active);break;
  case 'submit': {
   if(!['SOSPRO','ALAT'].includes(b.kind)||b.consent!==true)throw Error('Pengajuan tidak valid');
   const f=b.form||{};for(const k of ['name','phone','email','purpose','location','dateStart','dateEnd'])if(!s(f[k],k==='purpose'?1500:200))throw Error(`Kolom ${k} wajib diisi`);
   if(!/^\S+@\S+\.\S+$/.test(s(f.email)))throw Error('Email tidak valid');
   if(b.kind==='SOSPRO'&&(!s(f.institution)||!s(f.position,150)))throw Error('Sekolah/Institusi dan jabatan wajib diisi');
   const study=b.kind==='ALAT'?programs.find(p=>p.id===f.prodiId&&p.faculty===f.faculty):null;
   if(b.kind==='ALAT'&&!study)throw Error('Fakultas dan Prodi tidak valid');
   const materialsRequest=s(f.materialsRequest,2000);
   const equipmentRequest=s(f.equipmentRequest,2000);
   if(b.kind==='ALAT'&&!materialsRequest&&!equipmentRequest)throw Error('Isi bahan Sospro atau alat yang dipinjam');
   if(f.dateStart>f.dateEnd)throw Error('Rentang tanggal tidak valid');
   if(b.kind==='SOSPRO'&&(!Number(f.target)||!b.attachment))throw Error('Target peserta dan surat PDF wajib diisi');
   const sign=String(b.signature||'');if(!/^data:image\/png;base64,/.test(sign))throw Error('Tanda tangan wajib berupa PNG');
   const code=await nextCode(b.kind==='SOSPRO'?'SOS':'ALT');const token=crypto.randomBytes(32).toString('hex');
   // Upload ke Drive lebih dahulu, simpan ID file di Neon; kegagalan DB dapat menyisakan file privat orphan.
   const attId=b.attachment?(await uploadDrive(validFile(b.attachment,[pdf],2_000_000))).id:'';
   const signatureId=(await uploadDrive(validFile({name:code+'-ttd.png',mime:png,data:sign.split(',')[1]},[png],500_000))).id;
   const req={code,tokenHash:sha(token),kind:b.kind,name:s(f.name),position:b.kind==='SOSPRO'?s(f.position,150):'',institution:b.kind==='SOSPRO'?s(f.institution):s(f.location),faculty:b.kind==='ALAT'?s(f.faculty):'',prodi:b.kind==='ALAT'?study?.name||'':'',prodiLevel:b.kind==='ALAT'?study?.level||'':'',prodiId:b.kind==='ALAT'?s(f.prodiId):'',school:b.kind==='SOSPRO'?s(f.institution):'',phone:s(f.phone),email:s(f.email),purpose:s(f.purpose,1500),target:s(f.target,20),location:s(f.location),dateStart:f.dateStart,dateEnd:f.dateEnd,itemId:'',quantity:'',materialsRequest:b.kind==='ALAT'?materialsRequest:'',equipmentRequest:b.kind==='ALAT'?equipmentRequest:'',status:'PENDING',note:'',attachmentId:attId,signatureId,signedPdfId:'',createdAt:now(),updatedAt:now()};
   await saveRecord('requests',code,req);await logAction(code,'Pemohon','PENDING','Pengajuan masuk');result={code,token};break;
  }
  case 'track':{
   const r=await record<Json>('requests',s(b.code,80));if(!r||sha(String(b.token||''))!==r.tokenHash)throw Error('Nomor registrasi atau kode rahasia tidak cocok');result={code:r.code,kind:r.kind,name:r.name,purpose:r.purpose,status:r.status,note:r.note,updatedAt:r.updatedAt,hasFinalPdf:!!r.signedPdfId};break;
  }
  case 'dashboard':{
   await currentUser(b.actor);const rs=await records<Json>('requests'),logs=await records<Json>('logs');
   result={requests:rs.map(r=>({...r,tokenHash:undefined,attachmentId:undefined,signatureId:undefined,signedPdfId:undefined,hasAttachment:!!r.attachmentId,hasFinalPdf:!!r.signedPdfId})),items:await inventory(),logs:logs.slice(0,200)};break;
  }
  case 'addItem':{
   const u=await currentUser(b.actor,'admin');const d=b.payload||{},total=Number(d.total),name=s(d.name,120),category=s(d.category,100);
   if(!name||!category||!Number.isInteger(total)||total<1||total>100000)throw Error('Data alat tidak valid');
   const id=rowId('INV');await saveRecord('inventory',id,{id,name,category,total,active:true,createdAt:now()});await logAction(id,u.name,'ITEM_ADDED',name);result={id};break;
  }
  case 'decision':case 'handover':case 'returnItem':{
   const user=await currentUser(b.actor),d=b.payload||{},r=await record<Json>('requests',s(d.code,80));if(!r)throw Error('Permohonan tidak ditemukan');
   const next=action==='handover'?'OUT':action==='returnItem'?'RETURNED':s(d.status,30),note=s(d.note,2000);
   if(action==='decision'&&!['REVIEWED','REVISION','REJECTED','APPROVED'].includes(next))throw Error('Status tidak dikenal');
   const hasEquipment=Boolean(r.itemId||r.equipmentRequest);
   if(action==='handover' && (user.role!=='admin'||r.kind!=='ALAT'||!hasEquipment||r.status!=='APPROVED'))throw Error('Serah terima tidak diizinkan');
   if(action==='returnItem' && (user.role!=='admin'||r.kind!=='ALAT'||!hasEquipment||r.status!=='OUT'))throw Error('Pengembalian tidak diizinkan');
   if(action==='decision'){
    if(!['PENDING','REVIEWED','REVISION'].includes(r.status))throw Error('Permohonan sudah diproses final');
    if(r.kind==='SOSPRO'){
      if(user.role==='admin'&&!['REVIEWED','REVISION','REJECTED'].includes(next))throw Error('Admin hanya memverifikasi surat');
      if(user.role==='pejabat'&&(r.status!=='REVIEWED'||!['APPROVED','REJECTED'].includes(next)))throw Error('Surat harus diverifikasi admin terlebih dahulu');
      if(next==='APPROVED')r.signedPdfId=(await uploadDrive(validFile(d.signedPdf,[pdf],2_000_000))).id;
    }else if(user.role!=='admin'||next==='REVIEWED')throw Error('Hanya admin yang memproses peminjaman');
    if(next==='REVISION'&&!note)throw Error('Catatan revisi wajib diisi');
   }
   if(r.kind==='ALAT'&&r.itemId&&['APPROVED','OUT','RETURNED'].includes(next)){
     // Pengajuan lama dengan inventaris terdaftar tetap memakai pemeriksaan stok atomik.
     await db()`SELECT sospro_loan_transition(${r.code},${next},${note})`;
   }else{
     // Pengajuan alat berupa teks bebas diverifikasi stok/ketersediaannya secara manual oleh Admin.
     r.status=next;r.note=note;r.updatedAt=now();await saveRecord('requests',r.code,r);
   }
   await logAction(r.code,`${user.name} (${user.username})`,next,note);result={code:r.code,status:next};break;
  }
  case 'getFile':{
   const r=await record<Json>('requests',s(b.code,80));if(!r)throw Error('Berkas tidak ditemukan');
   if(b.actor)await currentUser(b.actor);else if(b.type!=='signedPdf'||r.status!=='APPROVED'||sha(String(b.token||''))!==r.tokenHash)throw Error('Tidak berhak membuka berkas');
   const id=b.type==='attachment'?r.attachmentId:b.type==='signature'?r.signatureId:r.signedPdfId;if(!id)throw Error('Berkas belum tersedia');result=await downloadDrive(id);break;
  }
  case 'listMaterials':case 'adminMaterials':{
   if(action==='adminMaterials')await currentUser(b.actor,'admin');
   result=(await records<Json>('materials')).filter(m=>!m.deleted&&(action==='adminMaterials'||m.published)).map(materialView);break;
  }
  case 'saveMaterial':{
   const u=await currentUser(b.actor,'admin'),d=b.payload||{};const title=s(d.title,160),category=s(d.category,80),description=s(d.description,1200),externalUrl=s(d.externalUrl,1000);
   if(!title||!category)throw Error('Judul dan kategori wajib diisi');if(externalUrl&&!/^https:\/\//.test(externalUrl))throw Error('Tautan harus HTTPS');
   const old=d.id?await record<Json>('materials',s(d.id,80)):null;if(d.id&&!old)throw Error('Materi tidak ditemukan');
   const id=old?.id||rowId('MAT');let fileId=old?.fileId||'',fileName=old?.fileName||'',mime=old?.mime||'',size=old?.size||0;
   if(d.file){const f=validFile(d.file,materialTypes,3_000_000);fileId=(await uploadDrive(f)).id;fileName=f.name;mime=f.mime;size=Buffer.from(f.data,'base64').length;}
   if(!fileId&&!externalUrl)throw Error('Unggah berkas atau masukkan URL materi');
   const obj={...old,id,title,category,description,externalUrl,fileId,fileName,mime,size,published:d.published===true,deleted:false,createdAt:old?.createdAt||now(),updatedAt:now()};
   await saveRecord('materials',id,obj);await logAction(id,u.name,old?'MATERIAL_UPDATED':'MATERIAL_ADDED',title);result=materialView(obj);break;
  }
  case 'deleteMaterial':{
   const u=await currentUser(b.actor,'admin'),id=s(b.payload?.id,80),m=await record<Json>('materials',id);if(!m)throw Error('Materi tidak ditemukan');
   m.deleted=true;m.published=false;await saveRecord('materials',id,m);await logAction(id,u.name,'MATERIAL_REMOVED',m.title);result={id,deleted:true};break;
  }
  case 'getMaterialFile':{
   const m=await record<Json>('materials',s(b.id,80));if(!m||m.deleted||!m.fileId)throw Error('Bahan Sospro tidak ditemukan');
   if(!m.published)await currentUser(b.actor,'admin');result=await downloadDrive(m.fileId);break;
  }
  case 'getLanding':result=await record<Json>('landing','homepage')||DEFAULT_LANDING;break;
  case 'saveLanding':{
   const u=await currentUser(b.actor,'admin');result=normalizeLanding(b.payload);await saveRecord('landing','homepage',result);await logAction('LANDING',u.name,'LANDING_UPDATED','Konten landing page diperbarui');break;
  }
  case 'uploadLandingImage':{
   const u=await currentUser(b.actor,'admin'),file=validFile(b.file,['image/png','image/jpeg','image/webp'],1_500_000),id=rowId('IMG');
   const drive=(await uploadDrive(file)).id;await saveRecord('assets',id,{id,driveId:drive,mime:file.mime,name:file.name,createdAt:now(),actor:u.username});result={id,url:'/api/public/landing/image?id='+id};break;
  }
  case 'getLandingImage':{
   const a=await record<Json>('assets',s(b.id,80));if(!a)throw Error('Gambar tidak ditemukan');result=await downloadDrive(a.driveId);break;
  }
  default: throw Error(`Aksi database tidak dikenal: ${action}`);
 }
 return result as T;
}
