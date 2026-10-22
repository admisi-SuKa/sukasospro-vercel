"use client";

import { FormEvent, useState } from "react";

export default function AttendanceForm({ eventId }: { eventId: string }) {
  const [form, setForm] = useState({ name: "", phone: "", institution: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/public/attendance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ eventId, ...form }) });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Presensi gagal disimpan.");
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Presensi gagal disimpan.");
    } finally { setLoading(false); }
  }

  if (success) return <div className="success-box"><h2 style={{marginTop: 0}}><i className="bi bi-check-circle-fill" aria-hidden="true" /> Presensi berhasil</h2><p>Terima kasih. Kehadiran Anda telah dicatat. Jika kegiatan menggunakan doorprize, data presensi dapat digunakan sebagai daftar peserta eligible.</p><p style={{fontSize: 12}}>Data peserta tidak ditampilkan kepada publik.</p></div>;

  return (
    <form className="form-card" onSubmit={submit}>
      <span className="badge">Presensi Peserta</span>
      <h2 style={{fontSize: 30, marginBottom: 8}}>Konfirmasi keikutsertaan</h2>
      <p style={{color: "var(--muted)", marginTop: 0}}>Tidak perlu login. Isi data yang benar agar presensi dan proses doorprize dapat diidentifikasi dengan tepat.</p>
      {error && <div className="error-box" style={{marginBottom: 16}}>{error}</div>}
      <div className="form-field"><label className="label">Nama lengkap</label><input className="input" required maxLength={100} value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></div>
      <div className="form-row">
        <div className="form-field"><label className="label">Nomor HP / WhatsApp</label><input className="input" required inputMode="tel" maxLength={30} value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} /><div className="form-help">Digunakan untuk identifikasi presensi dan mencegah duplikasi.</div></div>
        <div className="form-field"><label className="label">Sekolah / Instansi</label><input className="input" required maxLength={120} value={form.institution} onChange={(e) => setForm({...form, institution: e.target.value})} /></div>
      </div>
      <div className="notice green" style={{marginBottom: 16}}>Dengan mengirim presensi, peserta memahami bahwa data ini digunakan untuk administrasi kegiatan Sospro dan proses doorprize bila ada.</div>
      <button className="btn btn-green" disabled={loading} type="submit">{loading ? "Menyimpan..." : "Kirim Presensi"}</button>
    </form>
  );
}
