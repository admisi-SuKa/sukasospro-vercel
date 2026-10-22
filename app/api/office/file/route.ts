import {NextRequest,NextResponse} from "next/server";
import {callOffice,getOfficeRequest} from "@/lib/office";
export const maxDuration=60;
export async function GET(req:NextRequest){
  const code=req.nextUrl.searchParams.get("code")||"";
  const type=req.nextUrl.searchParams.get("type")||"";
  const token=req.nextUrl.searchParams.get("token")||"";
  const user=getOfficeRequest(req);
  if(!/^((SOS|ALT)-\d{4}-\d{5})$/.test(code)||!["attachment","signature","signedPdf"].includes(type)) return NextResponse.json({error:"Parameter tidak valid"},{status:400});
  if(!user && (type!=="signedPdf" || token.length<25)) return NextResponse.json({error:"Tidak diizinkan"},{status:403});
  try{
    const data=await callOffice<{mime:string;name:string;base64:string}>("getFile",{code,type,token:!user?token:undefined,actor:user||null});
    const bytes=Buffer.from(data.base64,"base64");
    if(bytes.byteLength>2_500_000) throw new Error("Dokumen terlalu besar untuk pratinjau");
    const mime=type==="signature"?"image/png":"application/pdf";
    return new NextResponse(new Uint8Array(bytes),{headers:{"Content-Type":mime,"Content-Disposition":`attachment; filename="${type==="signature"?"signature.png":"dokumen.pdf"}"`,"X-Content-Type-Options":"nosniff","Cache-Control":"no-store"}});
  }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Berkas tidak ditemukan"},{status:404});}
}
