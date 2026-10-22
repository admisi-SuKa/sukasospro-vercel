import EventList from "@/components/EventList";

export default function KegiatanPage() {
  return <main><section className="page-hero"><div className="container"><span className="eyebrow" style={{color: "#0b6b5b"}}>Agenda Sospro</span><h1>Kegiatan Sosialisasi</h1><p>Lihat kegiatan yang dipublikasikan admin. Peserta tidak perlu login untuk membaca informasi atau mengisi presensi.</p></div></section><section className="section"><div className="container"><EventList /></div></section></main>;
}
