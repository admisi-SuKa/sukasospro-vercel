import {NextRequest,NextResponse} from "next/server";
import {callOffice,isSafeString,safeUpload,validOrigin} from "@/lib/office";
import {programs} from "@/data/programs";
export const maxDuration=60;
export async function POST(req:NextRequest){
  if (!validOrigin(req)) return NextResponse.json({error:"Origin ditolak"},{status:403});
  if (Number(req.headers.get("content-length") || 0) > 4_500_000) return NextResponse.json({error:"Ukuran permohonan terlalu besar"},{status:413});
  try {
    const body=await req.json();
    if(body?.trap) return NextResponse.json({error:"Permohonan tidak valid"},{status:400});
    if(body?.action === "track"){
      if(!isSafeString(body.code,80) || !isSafeString(body.token,100)) return NextResponse.json({error:"Kode dan token wajib diisi"},{status:400});
      const data=await callOffice("track",{code:body.code,token:body.token});
      return NextResponse.json({ok:true,data},{headers:{"Cache-Control":"no-store"}});
    }
    if(body?.action !== "submit" || !["SOSPRO","ALAT"].includes(body.kind)) return NextResponse.json({error:"Jenis permohonan tidak valid"},{status:400});
    const f=body.form || {};
    for(const field of ["name","phone","email","purpose","location","dateStart","dateEnd"]){
      if(!isSafeString(f[field],field==="purpose"?1500:200)) return NextResponse.json({error:`Kolom ${field} wajib diisi atau terlalu panjang`},{status:400});
    }
    if(!/^\S+@\S+\.\S+$/.test(f.email))return NextResponse.json({error:"Email tidak valid"},{status:400});
    if(!/^\d{4}-\d{2}-\d{2}$/.test(f.dateStart) || !/^\d{4}-\d{2}-\d{2}$/.test(f.dateEnd) || f.dateEnd<f.dateStart) return NextResponse.json({error:"Rentang tanggal tidak valid"},{status:400});
    if(body.kind==="SOSPRO"){
      if(!isSafeString(f.institution,200)||!isSafeString(f.position,150)||!Number.isInteger(Number(f.target))||Number(f.target)<1||Number(f.target)>1000000)
        return NextResponse.json({error:"Sekolah/Institusi, jabatan, atau target peserta tidak valid"},{status:400});
    }else{
      const prodi=programs.find(p=>p.id===f.prodiId && p.faculty===f.faculty);
      if(!prodi) return NextResponse.json({error:"Pilih Fakultas dan Prodi yang sesuai"},{status:400});
      if(typeof f.materialsRequest!=="string"||f.materialsRequest.length>2000) return NextResponse.json({error:"Rincian bahan Sospro terlalu panjang"},{status:400});
      if(typeof f.equipmentRequest!=="string"||f.equipmentRequest.length>2000) return NextResponse.json({error:"Rincian alat terlalu panjang"},{status:400});
      if(!f.materialsRequest.trim()&&!f.equipmentRequest.trim()) return NextResponse.json({error:"Isi bahan Sospro atau alat yang dipinjam"},{status:400});
    }
    if(body.attachment && !safeUpload(body.attachment)) return NextResponse.json({error:"Lampiran hanya boleh PDF maksimal 2 MB"},{status:400});
    if(body.kind==="SOSPRO" && !body.attachment) return NextResponse.json({error:"Lampiran surat PDF wajib diunggah"},{status:400});
    if (body.consent !== true) return NextResponse.json({error:"Persetujuan pemrosesan data diperlukan"},{status:400});
    const signature=String(body.signature || "");
    if(!/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(signature) || signature.length>650000 || signature.length<400) return NextResponse.json({error:"Tanda tangan pemohon wajib diisi (PNG)"},{status:400});
    const data=await callOffice("submit",{kind:body.kind,form:f,attachment:body.attachment||null,signature,consent:true});
    return NextResponse.json({ok:true,data},{status:201,headers:{"Cache-Control":"no-store"}});
  } catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Tidak bisa mengirim permohonan"},{status:500});}
}
export async function GET(){
  try {const data=await callOffice("inventoryPublic");return NextResponse.json({ok:true,data},{headers:{"Cache-Control":"no-store"}})}
  catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Gagal memuat alat"},{status:503});}
}
