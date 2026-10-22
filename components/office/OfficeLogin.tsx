"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function OfficeLogin() {
  const router=useRouter();
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  async function login(e:FormEvent) {
    e.preventDefault();setLoading(true);setError("");
    try {
      const r=await fetch("/api/office/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password})});
      const j=await r.json();
      if(!r.ok)throw new Error(j.error||"Login gagal");
      router.push("/admin");router.refresh();
    }catch(e){setError(e instanceof Error?e.message:"Gagal masuk")}finally{setLoading(false)}
  }
  return (
    <main className="office-shell office-login">
      <form className="office-panel office-form" onSubmit={login}>
        <div className="office-login-icon"><i className="bi bi-shield-lock"/></div>
        <span className="office-kicker">Dashboard SosPro</span>
        <h1>Login</h1>
        <p>Satu akun untuk dashboard SosPro. Admin mengelola semua modul; pejabat dapat memproses persetujuan sesuai kewenangannya.</p>
        <label>Username<input required autoComplete="username" value={username} onChange={e=>setUsername(e.target.value)}/></label>
        <label>Password<input required autoComplete="current-password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/></label>
        {error&&<div className="office-error" role="alert">{error}</div>}
        <button className="office-btn" type="submit" disabled={loading}>{loading?"Memeriksa...":"Masuk Dashboard"}</button>
      </form>
    </main>
  );
}
