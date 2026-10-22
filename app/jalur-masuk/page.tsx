import { admissionGroups } from "@/data/admissions";

export default function JalurMasukPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{color: "#0b6b5b"}}>Panduan PMB</span>
          <h1>Jalur Masuk</h1>
          <p>Ringkasan untuk membantu peserta sosialisasi memahami perbedaan jalur. Jadwal dan persyaratan detail dapat berubah dan harus dikonfirmasi di kanal resmi.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="admission-grid">
            {admissionGroups.map((group) => (
              <article className="admission-card" key={group.level}>
                <span className="badge">{group.level}</span>
                <h2>{group.title}</h2>
                <p>{group.description}</p>
                {group.pathways.map((path) => (
                  <div className="pathway" key={path.name}>
                    <div className="pathway-head">
                      <div>
                        <h3>{path.name}</h3>
                        <p>{path.description}</p>
                      </div>
                      <a className="small-link" href={path.officialUrl} target="_blank" rel="noreferrer">Resmi <i className="bi bi-box-arrow-up-right" aria-hidden="true" /></a>
                    </div>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
