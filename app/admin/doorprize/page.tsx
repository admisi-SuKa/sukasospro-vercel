import { redirect } from "next/navigation";
import { getOfficePage } from "@/lib/office";
import AdminTop from "@/components/AdminTop";
import DoorprizeWheel from "@/components/DoorprizeWheel";

export default async function AdminDoorprizePage() {
  const user = await getOfficePage();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/admin");
  return <main className="admin-shell"><AdminTop user={user} /><section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow" style={{color: "#0b6b5b"}}>Doorprize</span><h2>Wheel Peserta</h2><p>Hanya peserta yang tercatat pada presensi kegiatan yang masuk kandidat. Pemenang dipilih backend dan disimpan ke Neon PostgreSQL.</p></div></div><DoorprizeWheel /></div></section></main>;
}
