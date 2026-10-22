"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { EventItem } from "@/data/demo-events";

export default function EventDetail({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/public/events", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (!j.ok) throw new Error(j.error || "Gagal memuat kegiatan.");
        const found = (j.data || []).find((x: EventItem) => x.id === eventId || x.slug === eventId);
        if (!found) throw new Error("Kegiatan tidak ditemukan atau belum dipublikasikan.");
        setEvent(found);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) return <div className="notice green">Memuat detail kegiatan...</div>;
  if (error || !event) return <div className="error-box">{error || "Kegiatan tidak ditemukan."}</div>;

  return (
    <div className="form-card" style={{maxWidth: 820}}>
      <div className="badge-row"><span className="badge">Kegiatan Sospro</span><span className={`badge ${event.attendanceOpen ? "" : "neutral"}`}>Presensi {event.attendanceOpen ? "Dibuka" : "Ditutup"}</span></div>
      <h2 style={{fontSize: 34, lineHeight: 1.15, marginBottom: 8}}>{event.title}</h2>
      <p style={{color: "var(--muted)"}}>{event.description}</p>
      <div className="event-meta" style={{fontSize: 14}}><span><i className="bi bi-calendar3" aria-hidden="true" /> {event.date}</span><span><i className="bi bi-clock" aria-hidden="true" /> {event.time}</span><span><i className="bi bi-geo-alt" aria-hidden="true" /> {event.location}</span></div>
      <div className="notice green">Peserta tidak perlu membuat akun. Presensi hanya tersedia ketika admin membuka presensi untuk kegiatan ini.</div>
      <div className="hero-actions" style={{marginTop: 20}}>
        {event.attendanceOpen ? <Link className="btn btn-green" href={`/presensi/${encodeURIComponent(event.id)}`}>Isi Presensi <i className="bi bi-arrow-right" aria-hidden="true" /></Link> : <span className="btn btn-ghost" aria-disabled>Presensi Ditutup</span>}
        <Link className="btn btn-ghost" href="/program-studi">Jelajahi Program Studi</Link>
      </div>
    </div>
  );
}
