import {NextRequest,NextResponse} from "next/server";
import {callOffice,getOfficeRequest,validOrigin} from "@/lib/office";

export const runtime="nodejs";
export const maxDuration=60;
const allowedMime=["application/pdf","image/png","image/jpeg","application/vnd.openxmlformats-officedocument.presentationml.presentation","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/zip"];
const okText=(v:unknown,n:number) => typeof v==="string"&&v.trim().length<=n;

export async function GET(req:NextRequest){
 const admin=req.nextUrl.searchParams.get("manage")==="1";
 const user=getOfficeRequest(req);
 if(admin && (!user||user.role!=="admin"))return NextResponse.json({error:"Khusus Admin Admisi"},{status:403});
 try{
  const data=await callOffice(admin?"adminMaterials":"listMaterials",admin?{actor:user}:{});
  return NextResponse.json({ok:true,data},{headers:{"Cache-Control":"no-store"}});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Gagal memuat materi"},{status:503});}
}
export async function POST(req:NextRequest){
 if(!validOrigin(req))return NextResponse.json({error:"Origin ditolak"},{status:403});
 const user=getOfficeRequest(req);
 if(!user||user.role!=="admin")return NextResponse.json({error:"Hanya Admin Admisi yang dapat mengelola bahan"},{status:403});
 if(Number(req.headers.get("content-length")||0)>4_500_000)return NextResponse.json({error:"File terlalu besar (maksimal 3 MB)"},{status:413});
 try{
  const b=await req.json();
  if(b.action==="delete"){
    if(typeof b.id!=="string" || !/^MAT-[A-F\d-]{8,36}$/i.test(b.id))return NextResponse.json({error:"ID tidak valid"},{status:400});
    const data=await callOffice("deleteMaterial",{payload:{id:b.id},actor:user});return NextResponse.json({ok:true,data});
  }
  if(b.action!=="save")return NextResponse.json({error:"Aksi tidak valid"},{status:400});
  if(!okText(b.title,160)||!b.title.trim()||!okText(b.category,80)||!b.category.trim()||!okText(b.description||"",1200)||!okText(b.externalUrl||"",1000))return NextResponse.json({error:"Judul/kategori wajib diisi. Pastikan panjang teks sesuai."},{status:400});
  if(b.externalUrl && !/^https:\/\/[^\s<>"]+$/i.test(b.externalUrl))return NextResponse.json({error:"Tautan harus menggunakan HTTPS"},{status:400});
  if(b.id && (typeof b.id!=="string"||!/^MAT-[A-F\d-]{8,36}$/i.test(b.id)))return NextResponse.json({error:"ID tidak valid"},{status:400});
  if(typeof b.published!=="boolean")return NextResponse.json({error:"Status publikasi tidak valid"},{status:400});
  if(b.file){
    if(typeof b.file!=="object"||!okText(b.file.name,160)||!b.file.name.trim()||!allowedMime.includes(b.file.mime)||typeof b.file.data!=="string"||!/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(b.file.data)||b.file.data.length>4_000_004||!b.file.data.length)return NextResponse.json({error:"File harus PDF, JPG, PNG, PPTX, DOCX, XLSX atau ZIP maksimal 3 MB"},{status:400});
  }
  const data=await callOffice("saveMaterial",{payload:{id:b.id||"",title:b.title,category:b.category,description:b.description||"",externalUrl:b.externalUrl||"",published:b.published,file:b.file||null},actor:user});
  return NextResponse.json({ok:true,data});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Gagal menyimpan bahan"},{status:500});}
}
