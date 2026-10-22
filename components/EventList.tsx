"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { EventItem } from "@/data/demo-events";

export default function EventList() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/public/events", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (!j.ok) throw new Error(j.error || "Gagal memuat kegiatan.");
        setEvents(j.data || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="notice green">Memuat kegiatan...</div>;
  if (error) return <div className="error-box">{error}</div>;
  if (!events.length) return <div className="notice">Belum ada kegiatan Sospro yang dipublikasikan.</div>;

  return (
    <div className="event-grid">
      {events.filter((e) => e.status !== "draft").map((event) => (
        <article className="event-card" key={event.id}>
          <div className="event-top"><div className="date">{formatDate(event.date)}</div></div>
          <div className="event-body">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <div className="event-meta">
              <span><i className="bi bi-clock" aria-hidden="true" /> {event.time || "Waktu mengikuti pengumuman"}</span>
              <span><i className="bi bi-geo-alt" aria-hidden="true" /> {event.location}</span>
              <span>Presensi: <strong>{event.attendanceOpen ? "Dibuka" : "Ditutup"}</strong></span>
            </div>
            <div className="actions">
              <Link className="btn btn-green" href={`/kegiatan/${encodeURIComponent(event.id)}`}>Lihat kegiatan</Link>
              {event.attendanceOpen && <Link className="btn btn-ghost" href={`/presensi/${encodeURIComponent(event.id)}`}>Isi presensi</Link>}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function formatDate(value: string) {
  if (!value) return "Tanggal kegiatan";
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(d);
}
