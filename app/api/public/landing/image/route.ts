import {NextRequest,NextResponse} from 'next/server';
import {callOffice} from '@/lib/office';
export const runtime='nodejs';
export const maxDuration=60;
export async function GET(req:NextRequest){
 const id=req.nextUrl.searchParams.get('id')||'';
 if(!/^IMG-[A-F0-9]{12}$/.test(id))return NextResponse.json({error:'ID gambar tidak valid'},{status:400});
 try{
  const data=await callOffice<{mime:string;base64:string}>('getLandingImage',{id});
  if(!['image/jpeg','image/png','image/webp'].includes(data.mime))throw Error('Format gambar tidak didukung');
  const bytes=Buffer.from(data.base64,'base64');
  if(!bytes.length||bytes.length>1_600_000)throw Error('Ukuran gambar tidak valid');
  return new NextResponse(new Uint8Array(bytes),{headers:{'Content-Type':data.mime,'X-Content-Type-Options':'nosniff','Cache-Control':'public, max-age=300, s-maxage=3600'}});
 }catch{return NextResponse.json({error:'Gambar tidak tersedia'},{status:404})}
}
