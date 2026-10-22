/** Usage: node scripts/import-legacy-data.mjs /absolute/path/sospro-legacy-export.json
 * This import never overwrites user accounts. Review data before running.
 */
import fs from 'node:fs';import crypto from 'node:crypto';import {neon} from '@neondatabase/serverless';
const file=process.argv[2],url=process.env.DATABASE_URL;
if(!file||!url){console.error('Usage: DATABASE_URL=... node scripts/import-legacy-data.mjs ./sospro-legacy-export.json');process.exit(1)}
const json=JSON.parse(fs.readFileSync(file,'utf8'));
const sheets=json.sheets||json,sql=neon(url);
const mapping=[['Events','events','id'],['Attendance','attendance','id'],['Winners','winners','id'],['PERMOHONAN','requests','code'],['INVENTARIS','inventory','id'],['RIWAYAT_STATUS','logs','code'],['BAHAN_SOSPRO','materials','id'],['LANDING_ASSETS','assets','id']];
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
for(const [sheet,coll,idField] of mapping){
 let count=0;for(const r of sheets[sheet]||[]){
   if(!r[idField])continue;
   const record={...r};let id=String(r[idField]);
   if(coll==='attendance')id=hash(String(r.eventId)+':'+String(r.phone||'').replace(/[^\d+]/g,''));
   if(coll==='winners')id=hash(String(r.eventId)+':'+String(r.participantId));
   if(coll==='logs')id='LOG-'+hash(`${r.code}|${r.time}|${r.status}|${count}`).slice(0,12).toUpperCase();
   if(coll==='inventory')record.active=String(r.active).toLowerCase()==='true';
   if(coll==='materials') {record.published=String(r.published).toLowerCase()==='true';record.deleted=String(r.deleted).toLowerCase()==='true'}
   if(coll==='assets')record.driveId=r.fileId;
   if(coll==='requests')record.quantity=String(r.quantity||'');
   await sql`INSERT INTO sospro_entities(collection,id,payload) VALUES(${coll},${id},${JSON.stringify(record)}::jsonb)
     ON CONFLICT(collection,id) DO NOTHING`;
   count++;
 }
 console.log(sheet,'->',coll,count,'records');
}
for(const row of sheets.LANDING_PAGE||[]){
 if(row.key==='homepage'&&row.valueJson){const data=JSON.parse(row.valueJson);
 await sql`INSERT INTO sospro_entities(collection,id,payload) VALUES('landing','homepage',${JSON.stringify(data)}::jsonb)
 ON CONFLICT(collection,id) DO NOTHING`;
 console.log('Landing page imported');break;}
}
// Advance counters past old request codes, so new submissions do not collide.
for(const r of sheets.PERMOHONAN||[]){const m=String(r.code||'').match(/^(SOS|ALT)-(\d{4})-(\d+)$/);if(!m)continue;
 await sql`INSERT INTO sospro_sequences(prefix,year,value) VALUES(${m[1]},${m[2]},${Number(m[3])})
 ON CONFLICT(prefix,year) DO UPDATE SET value=GREATEST(sospro_sequences.value,EXCLUDED.value)`;}
console.log('Impor selesai. Sheet USERS tidak diimpor karena format hash lama berbeda; buat ulang akun melalui npm run db:admin.');
