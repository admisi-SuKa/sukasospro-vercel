"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { OfficeUser } from "@/lib/office";

export default function AdminTop({user}: {user: OfficeUser}) {
  const router = useRouter();
  async function logout() {
    const res = await fetch("/api/office/logout", { method: "POST" });
    if (!res.ok) return;
    router.push("/login");
    router.refresh();
  }
  return (
    <div className="admin-top"><div className="container">
      <div><strong>SosPro Admin</strong><div style={{fontSize: 11, opacity: .68}}>{user.name} · {user.role === "admin" ? "Admin" : "Pejabat"}</div></div>
      <div className="admin-nav">
        <Link href="/admin">Dashboard</Link>
        {user.role === "admin" && <><Link href="/admin/kegiatan">Kegiatan</Link><Link href="/admin/doorprize">Doorprize</Link></>}
        <Link href="/admin#administrasi">Surat &amp; Alat</Link>
        {user.role === "admin" && <><Link href="/admin/layanan/bahan">Bahan Sospro</Link><Link href="/admin/layanan/landing">Landing Page</Link></>}
        <button className="mini-btn" type="button" onClick={logout}>Keluar</button>
      </div>
    </div></div>
  );
}
