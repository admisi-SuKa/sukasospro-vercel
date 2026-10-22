import {NextRequest,NextResponse} from "next/server";
import {callOffice,getOfficeRequest} from "@/lib/office";
export const runtime="nodejs";
export const maxDuration=60;
const allowed=["application/pdf","image/png","image/jpeg","application/vnd.openxmlformats-officedocument.presentationml.presentation","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/zip"];
export async function GET(req:NextRequest){
 const id=req.nextUrl.searchParams.get("id")||"";
 if(!/^MAT-[A-F\d-]{8,36}$/i.test(id))return NextResponse.json({error:"ID bahan tidak valid"},{status:400});
 const user=getOfficeRequest(req);
 try{
  const data=await callOffice<{name:string;mime:string;base64:string}>("getMaterialFile",{id,actor:user?.role==="admin"?user:null});
  if(!allowed.includes(data.mime))throw new Error("Jenis berkas tidak diizinkan");
  const bytes=Buffer.from(data.base64,"base64");
  if(bytes.length>3_200_000)throw new Error("Berkas terlalu besar");
  const name=(data.name||"bahan-sospro").replace(/[^a-zA-Z0-9._ -]/g,"_").replace(/^\.+/,"").slice(0,120)||"bahan-sospro";
  return new NextResponse(new Uint8Array(bytes),{headers:{"Content-Type":data.mime,"Content-Disposition":`attachment; filename="${name}"`,"X-Content-Type-Options":"nosniff","Cache-Control":"private, no-store"}});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Tidak bisa mengunduh bahan"},{status:404});}
}
