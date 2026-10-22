export type AdmissionGroup = {
  level: "S1" | "D4" | "S2" | "S3" | "PROFESI";
  title: string;
  description: string;
  pathways: { name: string; description: string; officialUrl: string }[];
};

export const admissionGroups: AdmissionGroup[] = [
  {
    level: "S1",
    title: "Jalur Masuk Sarjana S1",
    description: "Jalur nasional dan mandiri. Ketersediaan jalur berbeda menurut kelompok program studi.",
    pathways: [
      { name: "SNBP", description: "Seleksi nasional berbasis prestasi untuk program studi yang tersedia melalui jalur nasional.", officialUrl: "https://snpmb.id/" },
      { name: "UTBK-SNBT", description: "Seleksi nasional berbasis tes melalui UTBK untuk program studi yang tersedia.", officialUrl: "https://snpmb.id/" },
      { name: "SPAN-PTKIN", description: "Seleksi prestasi akademik nasional untuk program studi keagamaan PTKIN.", officialUrl: "https://ptkin.ac.id/" },
      { name: "UM-PTKIN", description: "Ujian masuk nasional PTKIN untuk program studi keagamaan yang tersedia.", officialUrl: "https://ptkin.ac.id/" },
      { name: "Mandiri", description: "Seleksi yang diselenggarakan UIN Sunan Kalijaga, termasuk CBT, prestasi, portofolio, dan skema lain yang dibuka pada periode PMB.", officialUrl: "https://admisi.uin-suka.ac.id/" },
      { name: "IUP", description: "International Undergraduate Program pada program studi tertentu. Cek persyaratan bahasa dan seleksi pada Admisi resmi.", officialUrl: "https://admisi.uin-suka.ac.id/" },
    ],
  },
  {
    level: "D4",
    title: "Jalur Masuk Sarjana Terapan D4",
    description: "Program Sarjana Terapan Teknologi Produksi Halal dibuka melalui jalur yang diumumkan pada Admisi resmi.",
    pathways: [
      { name: "Mandiri", description: "Ikuti pengumuman jalur Mandiri D4 Teknologi Produksi Halal pada situs Admisi resmi.", officialUrl: "https://admisi.uin-suka.ac.id/" },
    ],
  },
  {
    level: "S2",
    title: "Jalur Masuk Magister S2",
    description: "Jenis seleksi utama pada materi PMB S2 meliputi CBT, Non Tes, Portofolio, dan RPL untuk program yang dibuka.",
    pathways: [
      { name: "CBT", description: "Seleksi berbasis tes. Materi dan mekanisme mengikuti ketentuan PMB pada periode pendaftaran.", officialUrl: "https://admisi.uin-suka.ac.id/" },
      { name: "Non Tes", description: "Seleksi berkas akademik dengan persyaratan yang ditetapkan oleh PMB UIN Sunan Kalijaga.", officialUrl: "https://admisi.uin-suka.ac.id/" },
      { name: "Portofolio", description: "Seleksi berkas akademik dan pendukung yang mencerminkan kompetensi, minat, dan pengalaman calon mahasiswa.", officialUrl: "https://admisi.uin-suka.ac.id/" },
      { name: "RPL", description: "Rekognisi Pembelajaran Lampau untuk program studi tertentu dan periode yang dinyatakan dibuka secara resmi.", officialUrl: "https://admisi.uin-suka.ac.id/" },
    ],
  },
  {
    level: "S3",
    title: "Jalur Masuk Doktor S3",
    description: "Seleksi Doktor pada materi PMB mencakup jalur reguler dan kerja sama. Pembukaan jalur mengikuti pengumuman resmi.",
    pathways: [
      { name: "Reguler", description: "Seleksi Doktor berdasarkan jadwal PMB, dengan tahapan sesuai ketentuan resmi yang berlaku.", officialUrl: "https://admisi.uin-suka.ac.id/" },
      { name: "Kerja Sama", description: "Seleksi berdasarkan perjanjian kerja sama dengan lembaga atau instansi mitra.", officialUrl: "https://admisi.uin-suka.ac.id/" },
    ],
  },
  {
    level: "PROFESI",
    title: "Program Profesi — Pendidikan Profesi Guru",
    description: "PPG merupakan program profesi di Fakultas Ilmu Tarbiyah dan Keguruan. Penerimaan peserta mengikuti skema dan pengumuman resmi PPG/FITK serta ketentuan kementerian, sehingga tidak diperlakukan sebagai jalur PMB reguler S1–S3.",
    pathways: [
      { name: "Informasi PPG", description: "Periksa pengumuman, persyaratan, bidang studi, dan periode penyelenggaraan langsung pada website resmi Pendidikan Profesi Guru UIN Sunan Kalijaga.", officialUrl: "https://ppg.uin-suka.ac.id/" },
    ],
  },
];
