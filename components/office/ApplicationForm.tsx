"use client";
import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { programs } from "@/data/programs";
import SignaturePad from "./SignaturePad";

type Result = { code: string; token: string };
const faculties = [...new Set(programs.map(p => p.faculty))].sort((a, b) => a.localeCompare(b, "id"));
function readPdf(file: File): Promise<{ name: string; mime: string; data: string }> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve({ name: file.name, mime: "application/pdf", data: String(r.result).split(",")[1] || "" });
    r.onerror = () => reject(new Error("Gagal membaca PDF"));
    r.readAsDataURL(file);
  });
}
export default function ApplicationForm({ kind }: { kind: "SOSPRO" | "ALAT" }) {
  const sos = kind === "SOSPRO";
  const [form, setForm] = useState<Record<string, string>>({
    name: "", position: "", institution: "", faculty: "", prodiId: "", phone: "", email: "",
    purpose: "", target: "", location: "", dateStart: "", dateEnd: "",
    materialsRequest: "", equipmentRequest: ""
  });
  const [files, setFiles] = useState<File | null>(null);
  const [signature, setSignature] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [consent, setConsent] = useState(false);
  const prodiOptions = useMemo(() => programs.filter(p => p.faculty === form.faculty)
    .sort((a,b) => a.name.localeCompare(b.name,"id") || a.level.localeCompare(b.level)), [form.faculty]);
  function f(field: string) {
    return { value: form[field] || "", onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setForm(prev => ({ ...prev, [field]: value, ...(field === "faculty" ? { prodiId: "" } : {}) }));
    }};
  }
  async function submit(e: FormEvent) {
    e.preventDefault(); setError("");
    if (!consent || !signature) { setError("Setujui pernyataan data dan bubuhkan tanda tangan terlebih dahulu."); return; }
    if (!sos && !form.materialsRequest.trim() && !form.equipmentRequest.trim()) {
      setError("Isi bahan Sospro yang diminta atau alat yang ingin dipinjam."); return;
    }
    setSaving(true);
    try {
      if (files && (files.size > 2_000_000 || (files.type !== "application/pdf" && !files.name.toLowerCase().endsWith(".pdf"))))
        throw new Error("Lampiran harus PDF maksimal 2 MB");
      const attachment = files ? await readPdf(files) : null;
      const res = await fetch("/api/office/public", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submit", kind, form, attachment, signature, consent, trap: "" })
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error || "Gagal mengirim data");
      setResult(j.data);
    } catch (e) { setError(e instanceof Error ? e.message : "Gagal mengirim formulir"); }
    finally { setSaving(false); }
  }
  return <main className="office-shell">
    <section className="office-hero"><div className="container"><Link className="office-back" href="/layanan">← Semua layanan</Link><span className="office-kicker">Formulir digital</span>
      <h1>{sos ? "Permohonan Sospro dari Sekolah / Institusi" : "Permintaan Bahan Sospro dan Peminjaman Alat"}</h1>
      <p>{sos ? "Khusus sekolah atau institusi yang meminta kegiatan sosialisasi dan promosi dari UIN Sunan Kalijaga." : "Untuk unit UIN Sunan Kalijaga yang membutuhkan bahan promosi, meminjam alat, atau keduanya."}</p>
    </div></section>
    <div className="container office-form-container">{result ?
      <section className="office-panel office-success"><div className="office-success-icon"><i className="bi bi-check2-circle"/></div><h2>Permohonan berhasil dikirim</h2><p>Simpan kedua kode berikut secara pribadi. Kode rahasia hanya ditampilkan sekali.</p>
        <div className="office-code"><label>Nomor registrasi</label><strong>{result.code}</strong></div><div className="office-code"><label>Kode pelacakan rahasia</label><strong>{result.token}</strong></div>
        <button className="office-btn" onClick={() => navigator.clipboard.writeText(`Nomor: ${result.code}\nKode rahasia: ${result.token}`)}>Salin kedua kode</button><Link className="office-link" href="/layanan/status">Periksa status pengajuan →</Link>
      </section> :
      <form onSubmit={submit} className="office-panel office-form">
        <div className="office-form-head"><span>01 / Identitas</span><h2>Data pemohon</h2><p>{sos ? "Diisi oleh perwakilan sekolah atau institusi yang mengundang tim Sospro." : "Diisi oleh pemohon dari fakultas atau program studi UIN Sunan Kalijaga."}</p></div>
        <div className="office-fields">
          <label>Nama pemohon <em>*</em><input required maxLength={200} autoComplete="name" placeholder="Nama lengkap" {...f("name")}/></label>
          {sos ? <>
            <label>Jabatan pemohon <em>*</em><input required maxLength={150} placeholder="Contoh: Guru BK / Wakil Kepala Sekolah" {...f("position")}/></label>
            <label>Sekolah/Institusi <em>*</em><input required maxLength={200} placeholder="Nama sekolah atau institusi" {...f("institution")}/></label>
          </> : <>
            <label>Fakultas <em>*</em><select required {...f("faculty")}><option value="">Pilih fakultas / unit</option>{faculties.map(v => <option key={v} value={v}>{v}</option>)}</select></label>
            <label>Program Studi <em>*</em><select required disabled={!form.faculty} {...f("prodiId")}><option value="">{form.faculty ? "Pilih program studi" : "Pilih fakultas terlebih dahulu"}</option>{prodiOptions.map(v => <option key={v.id} value={v.id}>{v.name} ({v.level})</option>)}</select></label>
          </>}
          <label>No. WhatsApp <em>*</em><input required type="tel" maxLength={30} placeholder="08xxxxxxxxxx" {...f("phone")}/></label>
          <label>Email <em>*</em><input required type="email" maxLength={200} autoComplete="email" placeholder="nama@contoh.ac.id" {...f("email")}/></label>
        </div>
        <div className="office-form-head"><span>02 / Detail kegiatan</span><h2>Detail permohonan</h2></div>
        <div className="office-fields">
          <label className="office-span">Perihal dan tujuan kegiatan <em>*</em><textarea required maxLength={1500} rows={3} placeholder="Jelaskan tujuan dan bentuk kegiatan" {...f("purpose")}/></label>
          {sos ? <label>Target peserta <em>*</em><input required type="number" min="1" max="1000000" placeholder="Jumlah peserta" {...f("target")}/></label> : <>
            <label className="office-span">Bahan Sospro yang diminta<textarea maxLength={2000} rows={3} placeholder="Contoh: Brosur penerimaan S1 (100 eksemplar), booklet prodi (20 eksemplar)" {...f("materialsRequest")}/><small>Isi bila membutuhkan bahan fisik. Sebutkan nama bahan dan jumlahnya.</small></label>
            <label className="office-span">Alat yang ingin dipinjam
              <textarea maxLength={2000} rows={3} placeholder="Contoh: Proyektor 1 unit, layar proyektor 1 unit, mikrofon 2 unit" {...f("equipmentRequest")}/>
              <small>Isi nama alat beserta jumlahnya. Tidak perlu memilih dari daftar inventaris.</small>
            </label>
            <small className="office-span">Isi minimal satu kebutuhan: bahan Sospro atau alat yang dipinjam. Keduanya boleh diajukan bersamaan.</small>
          </>}
          <label>Tanggal mulai <em>*</em><input required type="date" {...f("dateStart")}/></label>
          <label>Tanggal selesai <em>*</em><input required type="date" min={form.dateStart || undefined} {...f("dateEnd")}/></label>
          <label className="office-span">Lokasi kegiatan <em>*</em><input required maxLength={200} placeholder="Sekolah/Instansi" {...f("location")}/></label>
        </div>
        <div className="office-form-head"><span>03 / Berkas</span><h2>Lampiran dan tanda tangan</h2></div>
        <label className="office-upload">{sos ? "Surat permohonan sekolah/institusi (PDF) *" : "Surat pendukung (opsional, PDF)"}<input type="file" accept="application/pdf,.pdf" required={sos} onChange={e => setFiles(e.target.files?.[0] || null)}/><small>PDF maksimal 2 MB. Dokumen disimpan privat di Google Drive.</small></label>
        <div className="office-sign-label"><label>Tanda tangan pemohon <em>*</em></label><SignaturePad onChange={setSignature}/><small className="office-sign-status">{signature ? "✓ Tanda tangan sudah terisi" : "Tanda tangan wajib sebelum mengirim"}</small></div>
        <label className="office-check"><input type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)}/><span>Saya menyatakan data dan tanda tangan yang saya berikan benar serta menyetujui pemrosesan data untuk administrasi permohonan ini.</span></label>
        {error && <div className="office-error" role="alert">{error}</div>}
        <button type="submit" className="office-btn office-submit" disabled={saving}>{saving ? "Mengirim permohonan..." : "Kirim Permohonan"} <i className="bi bi-arrow-right"/></button>
      </form>}</div>
  </main>;
}
