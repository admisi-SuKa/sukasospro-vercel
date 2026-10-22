import AttendanceForm from "@/components/AttendanceForm";

export default async function AttendancePage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  return <main><section className="page-hero"><div className="container"><span className="eyebrow" style={{color: "#0b6b5b"}}>Tanpa akun peserta</span><h1>Presensi Sospro</h1><p>Isi presensi untuk kegiatan yang sedang berlangsung.</p></div></section><section className="section soft"><div className="container"><AttendanceForm eventId={decodeURIComponent(eventId)} /></div></section></main>;
}
