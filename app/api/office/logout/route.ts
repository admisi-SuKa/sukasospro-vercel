import { NextRequest,NextResponse } from "next/server";
import { validOrigin, officeCookie } from "@/lib/office";
export async function POST(req:NextRequest) {
  if (!validOrigin(req)) return NextResponse.json({error:"Origin ditolak"},{status:403});
  const res = NextResponse.json({ok:true});
  res.cookies.set(officeCookie.name,"",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:0});
  return res;
}
