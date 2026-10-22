"use client";

import { FormEvent, useEffect, useState } from "react";
import type { EventItem } from "@/data/demo-events";

const emptyForm = {
  title: "",
  date: "",
  time: "",
  location: "",
  description: "",
  status: "published",
  attendanceOpen: true,
};

async function readJsonSafely(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Server mengirim respons yang tidak valid (${response.status}). Coba buka Vercel Logs untuk detail.`
    );
  }
}

export default function AdminEventsManager() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [qrEvent, setQrEvent] = useState<EventItem | null>(null);
  const [copyStatus, setCopyStatus] = useState("");

  async function load(options: { silent?: boolean } = {}) {
    if (!options.silent) setLoading(true);
    setError("");

    try {
      const r = await fetch("/api/admin/events", { cache: "no-store" });
      const j = await readJsonSafely(r);
      if (!r.ok || !j.ok) throw new Error(j.error || "Gagal memuat kegiatan.");
      setEvents(j.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat kegiatan.");
    } finally {
      if (!options.silent) setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = { ...form, slug: slugify(form.title) };
      const r = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await readJsonSafely(r);

      if (!r.ok || !j.ok) {
        throw new Error(j.error || "Gagal menyimpan kegiatan.");
      }

      const saved = j.data as EventItem | undefined;
      if (saved?.id) {
        setEvents((old) => [saved, ...old.filter((item) => item.id !== saved.id)]);
      }

      setForm(emptyForm);
      setSuccess("Kegiatan berhasil disimpan.");

      // Refresh dari database dilakukan di belakang layar. Tombol tidak lagi
      // menunggu proses refresh sehingga tidak terlihat terus berputar.
      void load({ silent: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan kegiatan.");
    } finally {
      setSaving(false);
    }
  }

  async function update(event: EventItem, patch: Partial<EventItem>) {
    setError("");
    setSuccess("");
    try {
      const payload = { ...event, ...patch };
      const r = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await readJsonSafely(r);
      if (!r.ok || !j.ok) throw new Error(j.error || "Gagal memperbarui kegiatan.");
      setEvents((old) => old.map((x) => (x.id === event.id ? (j.data || payload) : x)));
      setSuccess("Kegiatan berhasil diperbarui.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memperbarui kegiatan.");
    }
  }

  return (
    <div className="admin-grid">
      <div className="admin-card">
        <h2>Kegiatan</h2>
        <p style={{ color: "var(--muted)", fontSize: 13 }}>
          Admin dapat membuka/menutup presensi tanpa mengubah materi statis website.
        </p>
        {error && <div className="error-box" style={{ marginBottom: 14 }}>{error}</div>}
        {success && <div className="notice green" style={{ marginBottom: 14 }}>{success}</div>}
        {loading ? (
          <div className="notice green">Memuat...</div>
        ) : events.length === 0 ? (
          <div className="notice">Belum ada kegiatan.</div>
        ) : (
          events.map((event) => (
            <div className="event-admin-item" key={event.id}>
              <b>{event.title}</b>
              <span>{event.date} · {event.time} · {event.location}</span>
              <div className="badge-row" style={{ marginTop: 7 }}>
                <span className="badge neutral">{event.status}</span>
                <span className="badge">Presensi {event.attendanceOpen ? "OPEN" : "CLOSED"}</span>
              </div>
              <div className="inline-actions">
                <button
                  className="mini-btn"
                  onClick={() => update(event, { attendanceOpen: !event.attendanceOpen })}
                >
                  {event.attendanceOpen ? "Tutup presensi" : "Buka presensi"}
                </button>
                <button
                  className="mini-btn"
                  onClick={() => update(event, { status: event.status === "published" ? "draft" : "published" })}
                >
                  {event.status === "published" ? "Jadikan draft" : "Publikasikan"}
                </button>
                <button
                  className="mini-btn"
                  type="button"
                  onClick={() => {
                    setQrEvent(event);
                    setCopyStatus("");
                  }}
                >
                  Lihat publik <i className="bi bi-qr-code" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <form className="admin-card" onSubmit={submit}>
        <h2>Tambah kegiatan</h2>
        <div className="form-field">
          <label className="label">Nama kegiatan</label>
          <input className="input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="form-row">
          <div className="form-field">
            <label className="label">Tanggal</label>
            <input className="input" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="form-field">
            <label className="label">Waktu</label>
            <input className="input" placeholder="09:00 WIB" required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          </div>
        </div>
        <div className="form-field">
          <label className="label">Lokasi</label>
          <input className="input" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
        <div className="form-field">
          <label className="label">Deskripsi</label>
          <textarea className="textarea" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="form-row">
          <div className="form-field">
            <label className="label">Status</label>
            <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="form-field">
            <label className="label">Presensi awal</label>
            <select className="select" value={form.attendanceOpen ? "open" : "closed"} onChange={(e) => setForm({ ...form, attendanceOpen: e.target.value === "open" })}>
              <option value="open">Dibuka</option>
              <option value="closed">Ditutup</option>
            </select>
          </div>
        </div>
        <button className="btn btn-green" disabled={saving} type="submit">
          {saving ? (
            <><i className="bi bi-arrow-repeat" aria-hidden="true" /> Menyimpan...</>
          ) : (
            <><i className="bi bi-plus-lg" aria-hidden="true" /> Tambah Kegiatan</>
          )}
        </button>
      </form>

      {qrEvent && (
        <PublicQrModal
          event={qrEvent}
          copyStatus={copyStatus}
          onCopyStatus={setCopyStatus}
          onClose={() => {
            setQrEvent(null);
            setCopyStatus("");
          }}
        />
      )}
    </div>
  );
}

function PublicQrModal({
  event,
  copyStatus,
  onCopyStatus,
  onClose,
}: {
  event: EventItem;
  copyStatus: string;
  onCopyStatus: (value: string) => void;
  onClose: () => void;
}) {
  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/kegiatan/${encodeURIComponent(event.id)}`
    : `/kegiatan/${encodeURIComponent(event.id)}`;

  // QR dibuat oleh layanan QR Server. Data yang dikirim hanya URL publik kegiatan,
  // tidak berisi data peserta atau secret admin.
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=420x420&margin=12&data=${encodeURIComponent(publicUrl)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      onCopyStatus("Tautan disalin.");
    } catch {
      onCopyStatus("Gagal menyalin. Silakan salin tautan secara manual.");
    }
  }

  return (
    <div className="qr-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="qr-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="qr-modal-close" type="button" onClick={onClose} aria-label="Tutup">
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>

        <div className="qr-modal-head">
          <span className="eyebrow" style={{ color: "var(--green-700)" }}>Akses publik kegiatan</span>
          <h3 id="qr-modal-title">{event.title}</h3>
          <p>Scan QR Code untuk membuka halaman publik kegiatan dan akses presensi.</p>
        </div>

        <div className="qr-code-frame">
          <img src={qrUrl} alt={`QR Code halaman publik ${event.title}`} width="300" height="300" />
        </div>

        <div className="qr-public-url">{publicUrl}</div>
        {copyStatus && <div className="qr-copy-status">{copyStatus}</div>}

        <div className="qr-modal-actions">
          <a className="btn btn-green" href={publicUrl} target="_blank" rel="noreferrer">
            <i className="bi bi-box-arrow-up-right" aria-hidden="true" /> Buka halaman publik
          </a>
          <button className="btn btn-outline" type="button" onClick={copyLink}>
            <i className="bi bi-copy" aria-hidden="true" /> Salin tautan
          </button>
          <a className="btn btn-outline" href={qrUrl} target="_blank" rel="noreferrer">
            <i className="bi bi-download" aria-hidden="true" /> Buka QR
          </a>
        </div>

        <p className="qr-helper">QR Code mengarah ke halaman publik kegiatan ini. Peserta tidak perlu login.</p>
      </div>
    </div>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
