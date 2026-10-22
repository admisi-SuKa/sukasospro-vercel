import ProgramExplorer from "@/components/ProgramExplorer";

export default async function ProgramStudiPage({ searchParams }: { searchParams: Promise<{ jenjang?: string; q?: string }> }) {
  const { jenjang, q } = await searchParams;
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow" style={{color: "#0b6b5b"}}>Jelajah Studi</span>
          <h1>Program Studi</h1>
          <p>Temukan program S1, D4, S2, S3, dan Profesi. Kuota sengaja tidak ditampilkan. Gunakan tautan resmi pada setiap baris tabel untuk memeriksa informasi terbaru.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="notice" style={{marginBottom: 22}}><strong>Bukan daftar resmi penerimaan.</strong> Master data ini disusun untuk keperluan sosialisasi dan promosi berdasarkan materi PMB dan sumber UIN/Admisi. Jika ada perubahan, informasi resmi yang berlaku adalah informasi pada kanal UIN Sunan Kalijaga.</div>
          <ProgramExplorer initialLevel={jenjang || "ALL"} initialQuery={(q || "").slice(0,120)} />
        </div>
      </section>
    </main>
  );
}
