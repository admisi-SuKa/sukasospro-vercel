import {NextRequest,NextResponse} from "next/server";
import {callOffice,getOfficeRequest,validOrigin,safeUpload} from "@/lib/office";
export const maxDuration=60;
export async function GET(req:NextRequest){
  const user=getOfficeRequest(req);
  if(!user) return NextResponse.json({error:"Silakan masuk sebagai petugas"},{status:401});
  try {const data=await callOffice("dashboard",{actor:user});return NextResponse.json({ok:true,data,user},{headers:{"Cache-Control":"no-store"}})}
  catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Tidak bisa memuat dashboard"},{status:503});}
}
export async function POST(req:NextRequest){
  if(!validOrigin(req)) return NextResponse.json({error:"Origin ditolak"},{status:403});
  const user=getOfficeRequest(req);
  if(!user) return NextResponse.json({error:"Sesi tidak valid"},{status:401});
  if(Number(req.headers.get("content-length")||0)>5_000_000) return NextResponse.json({error:"File terlalu besar"},{status:413});
  try {
    const body=await req.json();
    if(!["decision","addItem","handover","returnItem"].includes(body.action)) return NextResponse.json({error:"Aksi tidak valid"},{status:400});
    if(body.action==="decision") {
      if(!["REVIEWED","REVISION","REJECTED","APPROVED"].includes(body.status)) return NextResponse.json({error:"Status tidak valid"},{status:400});
      if(body.status==="APPROVED" && body.kind==="SOSPRO") {
        if(user.role!=="pejabat") return NextResponse.json({error:"Hanya pejabat yang boleh menerbitkan persetujuan surat"},{status:403});
        if(!safeUpload(body.signedPdf)) return NextResponse.json({error:"PDF final bertanda tangan (maks. 2 MB) wajib diunggah"},{status:400});
      }
      if(body.kind==="SOSPRO" && body.status==="REVIEWED" && user.role!=="admin") return NextResponse.json({error:"Hanya admin yang dapat memverifikasi"},{status:403});
      if(body.kind==="ALAT" && user.role!=="admin") return NextResponse.json({error:"Hanya admin yang dapat mengelola peminjaman"},{status:403});
    }
    if(body.action!=="decision" && user.role!=="admin") return NextResponse.json({error:"Hanya admin yang dapat mengelola inventaris"},{status:403});
    const data=await callOffice(body.action,{payload:body,actor:user});
    return NextResponse.json({ok:true,data});
  }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Permintaan gagal"},{status:500});}
}
