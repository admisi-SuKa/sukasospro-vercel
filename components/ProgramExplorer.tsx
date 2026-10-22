"use client";

import { useMemo, useState } from "react";
import { programs, StudyLevel } from "@/data/programs";

const levelOptions: Array<"ALL" | StudyLevel> = ["ALL", "S1", "D4", "S2", "S3", "PROFESI"];
const levelOrder: Record<StudyLevel, number> = { S1: 1, D4: 2, S2: 3, S3: 4, PROFESI: 5 };

export default function ProgramExplorer({ initialLevel = "ALL", initialQuery = "" }: { initialLevel?: string; initialQuery?: string }) {
  const validInitial = levelOptions.includes(initialLevel as any) ? (initialLevel as "ALL" | StudyLevel) : "ALL";
  const [query, setQuery] = useState(initialQuery);
  const [level, setLevel] = useState<"ALL" | StudyLevel>(validInitial);
  const [faculty, setFaculty] = useState("ALL");

  const faculties = useMemo(() => Array.from(new Set(programs.map((p) => p.faculty))).sort(), []);
  const result = useMemo(() => {
    const q = query.trim().toLowerCase();
    return programs
      .filter((p) => {
        if (level !== "ALL" && p.level !== level) return false;
        if (faculty !== "ALL" && p.faculty !== faculty) return false;
        if (!q) return true;
        return `${p.name} ${p.faculty} ${(p.concentrations || []).join(" ")}`.toLowerCase().includes(q);
      })
      .sort((a, b) => {
        const levelDiff = levelOrder[a.level] - levelOrder[b.level];
        if (levelDiff !== 0) return levelDiff;
        const facultyDiff = a.faculty.localeCompare(b.faculty, "id");
        if (facultyDiff !== 0) return facultyDiff;
        return a.name.localeCompare(b.name, "id");
      });
  }, [query, level, faculty]);

  return (
    <>
      <div className="filter-panel">
        <div className="filter-grid">
          <div>
            <label className="label" htmlFor="prodi-search">Cari program studi atau konsentrasi</label>
            <input id="prodi-search" className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Contoh: Informatika, Pendidikan, Hukum, Studi Islam..." />
          </div>
          <div>
            <label className="label" htmlFor="jenjang">Jenjang</label>
            <select id="jenjang" className="select" value={level} onChange={(e) => setLevel(e.target.value as any)}>
              <option value="ALL">Semua jenjang</option>
              <option value="S1">S1 Sarjana</option>
              <option value="D4">D4 Sarjana Terapan</option>
              <option value="S2">S2 Magister</option>
              <option value="S3">S3 Doktor</option>
              <option value="PROFESI">Program Profesi</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="fakultas">Fakultas / Unit</label>
            <select id="fakultas" className="select" value={faculty} onChange={(e) => setFaculty(e.target.value)}>
              <option value="ALL">Semua fakultas</option>
              {faculties.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="result-summary">
        <span><strong>{result.length}</strong> program studi ditemukan</span>
        <button className="mini-btn" onClick={() => { setQuery(""); setLevel("ALL"); setFaculty("ALL"); }}>Reset filter</button>
      </div>

      {result.length > 0 ? (
        <div className="program-table-wrap" role="region" aria-label="Daftar program studi" tabIndex={0}>
          <table className="program-table">
            <thead>
              <tr>
                <th scope="col" className="col-no">No.</th>
                <th scope="col" className="col-level">Jenjang</th>
                <th scope="col">Program Studi</th>
                <th scope="col">Fakultas / Unit</th>
                <th scope="col">Akreditasi / Status</th>
                <th scope="col">Jalur / Konsentrasi</th>
                <th scope="col" className="col-link">Tautan Resmi</th>
              </tr>
            </thead>
            <tbody>
              {result.map((p, index) => (
                <tr key={p.id}>
                  <td className="cell-no">{index + 1}</td>
                  <td>
                    <span className="badge">{p.level}</span>
                  </td>
                  <td>
                    <div className="program-name">{p.name}</div>
                    {p.isNew && <span className="badge new table-badge">Prodi Baru</span>}
                  </td>
                  <td className="faculty-cell">{p.faculty}</td>
                  <td>
                    {p.accreditation ? <span className="status-text">{p.accreditation}</span> : <span className="muted-text">—</span>}
                  </td>
                  <td className="info-cell">
                    {p.pathways && p.pathways.length > 0 && (
                      <div className="table-meta"><b>Jalur:</b> {p.pathways.join(" · ")}</div>
                    )}
                    {p.concentrations && p.concentrations.length > 0 && (
                      <details className="table-details">
                        <summary>Konsentrasi ({p.concentrations.length})</summary>
                        <ul>{p.concentrations.map((c) => <li key={c}>{c}</li>)}</ul>
                      </details>
                    )}
                    {(!p.pathways || p.pathways.length === 0) && (!p.concentrations || p.concentrations.length === 0) && <span className="muted-text">—</span>}
                  </td>
                  <td>
                    <div className="table-links">
                      <a className="small-link" href={p.officialUrl} target="_blank" rel="noreferrer">
                        {p.officialLabel || "Website prodi"} <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                      </a>
                      <a className="small-link secondary-link" href="https://admisi.uin-suka.ac.id/" target="_blank" rel="noreferrer">
                        Admisi <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="notice">Tidak ada program studi yang cocok dengan filter. Coba hapus kata pencarian atau ubah jenjang/fakultas.</div>
      )}
    </>
  );
}
