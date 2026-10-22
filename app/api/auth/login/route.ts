import { NextResponse } from "next/server";
// Endpoint kata sandi bersama lama dinonaktifkan agar tidak ada dua jalur autentikasi.
export async function POST() {
  return NextResponse.json({ok:false,error:"Login lama telah dinonaktifkan. Gunakan /login dan akun pribadi."},{status:410});
}
