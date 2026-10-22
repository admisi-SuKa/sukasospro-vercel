import { NextResponse } from "next/server";
import { officeCookie } from "@/lib/office";
import { adminCookie } from "@/lib/auth";
// Untuk klien lama, logout tetap menghapus kedua cookie.
export async function POST() {
  const res=NextResponse.json({ok:true});
  res.cookies.set(officeCookie.name,"",{maxAge:0,path:"/"});
  res.cookies.set(adminCookie.name,"",{maxAge:0,path:"/"});
  return res;
}
