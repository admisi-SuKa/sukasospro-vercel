import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" className="footer-wordmark-wrap" aria-label="SosPro — Beranda"><img className="footer-wordmark" src="/sospro-wordmark.png" width={184} height={49} alt="SosPro" /></Link>
            <h3>Jelajah Studi & Layanan Sospro</h3>
            <p>Informasi program studi, kegiatan sosialisasi, bahan promosi, dan layanan administrasi dalam satu portal.</p>
            <p><strong style={{color: "#ffe8a0"}}>Catatan penting:</strong> jadwal, persyaratan, biaya, status akreditasi, dan pembukaan jalur dapat berubah. Verifikasi kembali melalui situs resmi sebelum mengambil keputusan pendaftaran.</p>
          </div>
          <div>
            <h3>Jelajah</h3>
            <div className="footer-links">
              <Link href="/program-studi">Program Studi</Link>
              <Link href="/jalur-masuk">Jalur Masuk</Link>
              <Link href="/kegiatan">Kegiatan Sospro</Link>
              <Link href="/layanan">Layanan Surat & Alat</Link>
              <Link href="/layanan/bahan">Bahan Sospro</Link>
            </div>
          </div>
          <div>
            <h3>Kanal Resmi</h3>
            <div className="footer-links">
              <a href="https://uin-suka.ac.id/" target="_blank" rel="noreferrer">Website UIN Sunan Kalijaga <i className="bi bi-box-arrow-up-right" aria-hidden="true" /></a>
              <a href="https://admisi.uin-suka.ac.id/" target="_blank" rel="noreferrer">Admisi UIN Sunan Kalijaga <i className="bi bi-box-arrow-up-right" aria-hidden="true" /></a>
              <a href="https://tanya.admisi.uin-suka.ac.id/" target="_blank" rel="noreferrer">FAQ Admisi Resmi <i className="bi bi-box-arrow-up-right" aria-hidden="true" /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>SosPro · Sosialisasi dan Promosi</span>
          <span><Link href="/login">Login</Link></span>
        </div>
      </div>
    </footer>
  );
}
