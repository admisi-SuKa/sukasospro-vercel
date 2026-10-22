"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { EventItem } from "@/data/demo-events";
import styles from "./DoorprizeWheel.module.css";

type Participant = {
  id: string;
  eventId: string;
  name: string;
  institution: string;
  phone?: string;
  won?: boolean;
};

type Winner = {
  id: string;
  participantId?: string;
  name: string;
  institution: string;
  prize?: string;
};

const SEGMENT_COLORS = [
  "#075f67",
  "#14866d",
  "#d5a62a",
  "#0b6b5b",
  "#e5b83b",
  "#197565",
];

function wheelGradient(count: number) {
  if (!count) return "conic-gradient(#e7eeec 0deg 360deg)";
  const step = 360 / count;
  const stops = Array.from({ length: count }, (_, index) => {
    const start = index * step;
    const end = (index + 1) * step;
    return `${SEGMENT_COLORS[index % SEGMENT_COLORS.length]} ${start}deg ${end}deg`;
  });
  return `conic-gradient(from -90deg, ${stops.join(", ")})`;
}

function labelFontSize(count: number) {
  if (count <= 10) return 13;
  if (count <= 20) return 11;
  if (count <= 35) return 9;
  if (count <= 60) return 8;
  return 7;
}

export default function DoorprizeWheel() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventId, setEventId] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [prize, setPrize] = useState("Doorprize");
  const [winner, setWinner] = useState<Winner | null>(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/events")
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) setEvents(j.data || []);
        else setError(j.error || "Gagal memuat kegiatan.");
      })
      .catch(() => setError("Gagal memuat kegiatan."));
  }, []);

  useEffect(() => {
    if (!eventId) {
      setParticipants([]);
      setWinner(null);
      setRotation(0);
      return;
    }

    setWinner(null);
    setRotation(0);
    setError("");
    setLoadingParticipants(true);

    fetch(`/api/admin/attendance?eventId=${encodeURIComponent(eventId)}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) setParticipants(j.data || []);
        else setError(j.error || "Gagal memuat peserta presensi.");
      })
      .catch(() => setError("Gagal memuat peserta presensi."))
      .finally(() => setLoadingParticipants(false));
  }, [eventId]);

  // Hanya peserta yang benar-benar tercatat di Attendance dan belum pernah menang
  // yang ditampilkan pada wheel serta menjadi kandidat pengundian.
  const eligible = useMemo(
    () => participants.filter((participant) => !participant.won),
    [participants]
  );

  const background = useMemo(() => wheelGradient(eligible.length), [eligible.length]);
  const fontSize = labelFontSize(eligible.length);

  async function draw() {
    if (!eventId || !eligible.length || spinning) return;

    setSpinning(true);
    setWinner(null);
    setError("");

    try {
      // Backend menentukan pemenang terlebih dahulu. Frontend hanya menganimasikan
      // wheel agar berhenti tepat pada nama pemenang yang sudah dipilih backend.
      const response = await fetch("/api/admin/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, prize }),
      });
      const json = await response.json();
      if (!response.ok || !json.ok) throw new Error(json.error || "Pengundian gagal.");

      const selected = json.data as Winner;
      const selectedParticipantId = selected.participantId || selected.id;
      const winnerIndex = eligible.findIndex((participant) => participant.id === selectedParticipantId);

      // Fallback berdasarkan nama hanya untuk kompatibilitas data demo/versi lama.
      const resolvedIndex = winnerIndex >= 0
        ? winnerIndex
        : eligible.findIndex((participant) => participant.name === selected.name);

      if (resolvedIndex < 0) {
        throw new Error("Pemenang tidak ditemukan pada daftar peserta presensi terbaru.");
      }

      const slice = 360 / eligible.length;
      const winnerCenter = resolvedIndex * slice + slice / 2;
      const normalizedCurrent = ((rotation % 360) + 360) % 360;
      const target = (360 - winnerCenter) % 360;
      const alignmentDelta = (target - normalizedCurrent + 360) % 360;
      const extraTurns = 6 * 360;
      const nextRotation = rotation + extraTurns + alignmentDelta;

      setRotation(nextRotation);
      await new Promise((resolve) => setTimeout(resolve, 5200));

      setWinner(selected);
      setParticipants((current) =>
        current.map((participant) =>
          participant.id === selectedParticipantId
            ? { ...participant, won: true }
            : participant
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pengundian gagal.");
    } finally {
      setSpinning(false);
    }
  }

  return (
    <>
      <div className="filter-panel">
        <div className="filter-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <label className="label">Pilih kegiatan</label>
            <select
              className="select"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              disabled={spinning}
            >
              <option value="">— pilih kegiatan —</option>
              {events.map((event) => (
                <option value={event.id} key={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Nama hadiah</label>
            <input
              className="input"
              value={prize}
              onChange={(e) => setPrize(e.target.value)}
              placeholder="Contoh: Tumbler"
              disabled={spinning}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="error-box" style={{ marginBottom: 18 }}>
          {error}
        </div>
      )}

      <section className={styles.participantCard} aria-labelledby="participant-list-title">
        <div className={styles.participantHeader}>
          <div>
            <span className={styles.participantEyebrow}>Peserta Kegiatan</span>
            <h3 id="participant-list-title">Daftar Peserta Presensi</h3>
            <p>Daftar ini diambil langsung dari data presensi kegiatan yang dipilih.</p>
          </div>
          <div className={styles.participantCount} title="Jumlah peserta yang sudah presensi">
            <i className="bi bi-people-fill" aria-hidden="true" />
            <strong>{participants.length}</strong> peserta
          </div>
        </div>

        {loadingParticipants ? (
          <div className={styles.participantEmpty}>
            <i className="bi bi-arrow-repeat" aria-hidden="true" /> Memuat daftar peserta presensi...
          </div>
        ) : !eventId ? (
          <div className={styles.participantEmpty}>
            <i className="bi bi-info-circle" aria-hidden="true" /> Pilih kegiatan terlebih dahulu untuk melihat daftar peserta.
          </div>
        ) : participants.length === 0 ? (
          <div className={styles.participantEmpty}>
            <i className="bi bi-person-x" aria-hidden="true" /> Belum ada peserta yang melakukan presensi pada kegiatan ini.
          </div>
        ) : (
          <div className={styles.participantTableWrap}>
            <table className={styles.participantTable}>
              <thead>
                <tr>
                  <th scope="col">No.</th>
                  <th scope="col">Nama Peserta</th>
                  <th scope="col">Sekolah / Instansi</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant, index) => (
                  <tr key={participant.id}>
                    <td>{index + 1}</td>
                    <td>
                      <strong>{participant.name}</strong>
                    </td>
                    <td>{participant.institution || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className={styles.layout}>
        <div>
          <div className={styles.wheelStage}>
            <div className={styles.pointer} aria-hidden="true" />
            <div
              className={`${styles.wheel} ${spinning ? styles.spinning : ""}`}
              style={
                {
                  transform: `rotate(${rotation}deg)`,
                  background,
                } as CSSProperties
              }
              aria-label={`Wheel doorprize berisi ${eligible.length} peserta presensi`}
            >
              {eligible.map((participant, index) => {
                const step = 360 / eligible.length;
                const angle = index * step + step / 2;
                const flip = angle > 90 && angle < 270 ? 180 : 0;
                return (
                  <div
                    className={styles.nameLabel}
                    key={participant.id}
                    title={`${participant.name}${participant.institution ? ` — ${participant.institution}` : ""}`}
                    style={
                      {
                        fontSize: `${fontSize}px`,
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(-1 * var(--wheel-label-radius))) rotate(${flip}deg)`,
                      } as CSSProperties
                    }
                  >
                    <span>{participant.name}</span>
                  </div>
                );
              })}
              <div className={styles.hub} aria-hidden="true">
                <i className="bi bi-gift-fill" />
              </div>
            </div>
          </div>

          <div className={styles.legendRow}>
            <span>
              <i className="bi bi-person-check-fill" aria-hidden="true" /> Peserta presensi: <b>{participants.length}</b>
            </span>
            <span>
              <i className="bi bi-stars" aria-hidden="true" /> Masuk wheel: <b>{eligible.length}</b>
            </span>
          </div>
          <p className={styles.helpText}>
            Nama pada roda berasal langsung dari peserta yang tercatat di sheet Attendance untuk kegiatan yang dipilih. Peserta yang sudah menang otomatis dikeluarkan dari putaran berikutnya.
          </p>
        </div>

        <div className="winner-card">
          <span className="badge">Pengundian</span>
          <h2 style={{ fontSize: 30 }}>Putar Doorprize</h2>

          {loadingParticipants ? (
            <div className="notice green">Memuat nama peserta presensi...</div>
          ) : !eventId ? (
            <div className="notice green">Pilih kegiatan terlebih dahulu untuk menampilkan nama peserta di roda.</div>
          ) : eligible.length === 0 ? (
            <div className="notice green">Belum ada peserta eligible pada kegiatan ini.</div>
          ) : winner ? (
            <div className="success-box">
              <div style={{ fontSize: 12, fontWeight: 800 }}>
                <i className="bi bi-trophy-fill" aria-hidden="true" /> SELAMAT
              </div>
              <div className="winner-name">{winner.name}</div>
              <div>{winner.institution}</div>
              <div style={{ marginTop: 10 }}>
                <strong>Hadiah:</strong> {winner.prize || prize}
              </div>
            </div>
          ) : (
            <div className="notice green">
              <b>{eligible.length}</b> nama peserta presensi sudah masuk ke wheel dan siap diundi.
            </div>
          )}

          <button
            className="btn btn-gold"
            style={{ width: "100%", marginTop: 16 }}
            onClick={draw}
            disabled={spinning || loadingParticipants || !eventId || !eligible.length}
          >
            <i className={`bi ${spinning ? "bi-arrow-repeat" : "bi-play-fill"}`} aria-hidden="true" />{" "}
            {spinning ? "RODA BERPUTAR..." : "PUTAR WHEEL"}
          </button>
          <p style={{ fontSize: 11, color: "var(--muted)" }}>
            Pemenang tetap ditentukan di backend agar hasil tidak dapat dimanipulasi dari browser. Animasi roda akan berhenti pada nama pemenang tersebut.
          </p>
        </div>
      </div>
    </>
  );
}
