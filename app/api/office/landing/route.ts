import {NextRequest,NextResponse} from 'next/server';
import {callOffice,getOfficeRequest,validOrigin} from '@/lib/office';
import {normalizeLanding} from '@/lib/landing';
export const runtime='nodejs';
export const maxDuration=60;
export async function GET(req:NextRequest){
 const user=getOfficeRequest(req);
 if(!user||user.role!=='admin')return NextResponse.json({error:'Hanya Admin Admisi yang dapat mengelola beranda'},{status:403});
 try{return NextResponse.json({ok:true,data:normalizeLanding(await callOffice('getLanding'))},{headers:{'Cache-Control':'no-store'}})}
 catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Gagal memuat beranda'},{status:503})}
}
export async function POST(req:NextRequest){
 if(!validOrigin(req))return NextResponse.json({error:'Origin tidak diizinkan'},{status:403});
 const user=getOfficeRequest(req);
 if(!user||user.role!=='admin')return NextResponse.json({error:'Akses khusus Admin Admisi'},{status:403});
 if(Number(req.headers.get('content-length')||0)>2_800_000)return NextResponse.json({error:'Permintaan terlalu besar'},{status:413});
 try{
  const b=await req.json();
  if(b.action==='save'){
   if(!b.data||typeof b.data!=='object'||JSON.stringify(b.data).length>12000)return NextResponse.json({error:'Konten tidak valid atau terlalu besar'},{status:400});
   const data=await callOffice('saveLanding',{actor:user,payload:normalizeLanding(b.data)});
   return NextResponse.json({ok:true,data});
  }
  if(b.action==='upload'){
   const f=b.file;
   if(!f||typeof f.name!=='string'||f.name.length>160||!['image/jpeg','image/png','image/webp'].includes(f.mime)||typeof f.data!=='string'||!/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(f.data)||f.data.length>2_100_000)return NextResponse.json({error:'Foto harus JPG, PNG, atau WebP maksimal 1,5 MB'},{status:400});
   const data=await callOffice('uploadLandingImage',{actor:user,file:f});
   return NextResponse.json({ok:true,data});
  }
  return NextResponse.json({error:'Aksi tidak dikenal'},{status:400});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Gagal menyimpan beranda'},{status:503})}
}
