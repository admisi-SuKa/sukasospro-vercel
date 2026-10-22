export type EventItem = {
  id: string;
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  status: "draft" | "published" | "finished";
  attendanceOpen: boolean;
};

export const demoEvents: EventItem[] = [
  {
    id: "EVT-DEMO-001",
    slug: "sosialisasi-pmb-uin-suka-2026",
    title: "Sosialisasi PMB UIN Sunan Kalijaga 2026",
    date: "2026-09-10",
    time: "09:00 WIB",
    location: "Aula Sekolah / Instansi",
    description: "Pengenalan jalur S1, D4, S2, S3, Program Profesi, serta sesi tanya jawab penerimaan mahasiswa baru.",
    status: "published",
    attendanceOpen: true,
  },
];
