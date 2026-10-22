import { NextRequest, NextResponse } from "next/server";
import { authenticateOffice, officeCookie, officeToken, validOrigin } from "@/lib/office";
export async function POST(req: NextRequest) {
  if (!validOrigin(req)) return NextResponse.json({error:"Origin tidak diizinkan"},{status:403});
  const body = await req.json().catch(() => ({}));
  const username = String(body.username || "").slice(0,100);
  const password = String(body.password || "");
  if (password.length > 512) return NextResponse.json({error:"Kredensial tidak valid"},{status:401});
  try {
    const user = await authenticateOffice(username,password);
    if (!user) return NextResponse.json({error:"Nama pengguna atau password salah"},{status:401});
    const res = NextResponse.json({ok:true,user});
    res.cookies.set(officeCookie.name,officeToken(user),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:officeCookie.maxAge});
    return res;
  } catch (e) { return NextResponse.json({error:e instanceof Error?e.message:"Konfigurasi server bermasalah"},{status:503}); }
}
