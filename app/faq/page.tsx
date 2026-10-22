const faqs = [
  ["Apakah website ini website resmi UIN Sunan Kalijaga?", "Bukan. Website ini dibuat khusus untuk keperluan sosialisasi dan promosi. Informasi resmi tetap merujuk pada uin-suka.ac.id dan admisi.uin-suka.ac.id."],
  ["Apakah kuota program studi ditampilkan?", "Tidak. Sesuai tujuan microsite, kuota tidak ditampilkan agar materi tetap ringkas dan tidak cepat kedaluwarsa. Cek kuota terbaru di Admisi resmi."],
  ["Apa perbedaan SNBP/SNBT dengan SPAN-PTKIN/UM-PTKIN?", "SNBP dan SNBT merupakan jalur nasional yang digunakan untuk program studi yang tersedia melalui mekanisme SNPMB. SPAN-PTKIN dan UM-PTKIN digunakan untuk program studi keagamaan yang tersedia melalui mekanisme PTKIN."],
  ["Apakah semua program studi memiliki jalur yang sama?", "Tidak. Jalur yang tersedia berbeda menurut program studi. Gunakan filter Program Studi dan selalu verifikasi pada Admisi resmi."],
  ["Apakah peserta Sospro perlu login?", "Tidak. Peserta hanya mengisi presensi pada kegiatan yang sedang dibuka. Akun hanya diperlukan untuk admin pengelola kegiatan."],
  ["Apakah peserta yang hadir otomatis dapat ikut doorprize?", "Secara default, peserta yang berhasil mengisi presensi pada kegiatan aktif dapat masuk daftar eligible doorprize. Admin dapat menutup presensi sebelum pengundian."],
  ["Apakah pemenang dapat menang dua kali?", "Implementasi default mengeluarkan pemenang yang sudah tersimpan dari undian berikutnya pada kegiatan yang sama."],
];

export default function FAQPage() {
  return (
    <main>
      <section className="page-hero"><div className="container"><span className="eyebrow" style={{color: "#0b6b5b"}}>Pertanyaan umum</span><h1>FAQ</h1><p>Jawaban singkat untuk pertanyaan yang sering muncul saat kegiatan sosialisasi.</p></div></section>
      <section className="section"><div className="container"><div className="faq-list">{faqs.map(([q,a]) => <details className="faq-item" key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></div></section>
    </main>
  );
}
