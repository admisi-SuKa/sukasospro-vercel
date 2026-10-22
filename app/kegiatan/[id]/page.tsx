import EventDetail from "@/components/EventDetail";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <main><section className="page-hero"><div className="container"><span className="eyebrow" style={{color: "#0b6b5b"}}>Kegiatan Sospro</span><h1>Detail Kegiatan</h1><p>Informasi kegiatan dan akses presensi.</p></div></section><section className="section"><div className="container"><EventDetail eventId={decodeURIComponent(id)} /></div></section></main>;
}
