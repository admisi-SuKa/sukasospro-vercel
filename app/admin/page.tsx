import Link from "next/link";
import { redirect } from "next/navigation";
import { getOfficePage } from "@/lib/office";
import AdminTop from "@/components/AdminTop";
import OfficeDashboard from "@/components/office/OfficeDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getOfficePage();
  if (!user) redirect("/login");
  return (
    <main className="admin-shell">
      <AdminTop user={user} />
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow" style={{color:"#0b6b5b"}}>Satu Dashboard SosPro</span>
              <h2>Selamat datang, {user.name}</h2>
              <p>{user.role === "admin"
                ? "Semua pengelolaan kegiatan, presensi, doorprize, permohonan, alat, dan bahan tersedia dalam satu dashboard."
                : "Tinjau permohonan dan lakukan persetujuan surat sesuai kewenangan pejabat."}</p>
            </div>
          </div>
          {user.role === "admin" && (
            <div className="feature-grid" aria-label="Akses cepat pengelolaan">
              <Link className="feature-card" href="/admin/kegiatan"><div className="feature-icon"><i className="bi bi-calendar2-plus" aria-hidden="true"/></div><h3>Kegiatan & Presensi</h3><p>Kelola agenda dan presensi peserta.</p></Link>
              <Link className="feature-card" href="/admin/doorprize"><div className="feature-icon"><i className="bi bi-gift" aria-hidden="true"/></div><h3>Doorprize</h3><p>Undi peserta yang memenuhi syarat.</p></Link>
              <Link className="feature-card" href="/admin/layanan/bahan"><div className="feature-icon"><i className="bi bi-collection" aria-hidden="true"/></div><h3>Bahan Sospro</h3><p>Tambah dan publikasikan materi promosi.</p></Link>
              <Link className="feature-card" href="/admin/layanan/landing"><div className="feature-icon"><i className="bi bi-layout-text-window-reverse" aria-hidden="true"/></div><h3>Landing Page</h3><p>Atur banner dan konten beranda.</p></Link>
            </div>
          )}
        </div>
      </section>
      <OfficeDashboard user={user} embedded />
    </main>
  );
}
