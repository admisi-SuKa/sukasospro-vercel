export type StudyLevel = "S1" | "D4" | "S2" | "S3" | "PROFESI";

export type Program = {
  id: string;
  level: StudyLevel;
  faculty: string;
  name: string;
  accreditation?: string;
  pathways?: string[];
  concentrations?: string[];
  officialUrl: string;
  officialLabel?: string;
  isNew?: boolean;
};

const UIN_ADMISI = "https://admisi.uin-suka.ac.id/";

export const programs: Program[] = [
  // S1 — Fakultas Kedokteran
  { id: "s1-kedokteran", level: "S1", faculty: "Fakultas Kedokteran", name: "Kedokteran", accreditation: "Prodi Baru", pathways: ["Mandiri"], officialUrl: "https://kedokteran.uin-suka.ac.id/", officialLabel: "Website fakultas", isNew: true },

  // S1 — Fakultas Adab dan Ilmu Budaya
  { id: "s1-bsa", level: "S1", faculty: "Fakultas Adab dan Ilmu Budaya", name: "Bahasa dan Sastra Arab", accreditation: "Unggul", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri", "IUP"], officialUrl: "https://bsa.uin-suka.ac.id/" },
  { id: "s1-ski", level: "S1", faculty: "Fakultas Adab dan Ilmu Budaya", name: "Sejarah dan Kebudayaan Islam", accreditation: "Unggul", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri"], officialUrl: "https://ski.uin-suka.ac.id/" },
  { id: "s1-ip", level: "S1", faculty: "Fakultas Adab dan Ilmu Budaya", name: "Ilmu Perpustakaan", accreditation: "A", pathways: ["SNBP", "SNBT", "Mandiri", "IUP"], officialUrl: "https://ip.uin-suka.ac.id/" },
  { id: "s1-sastra-inggris", level: "S1", faculty: "Fakultas Adab dan Ilmu Budaya", name: "Sastra Inggris", accreditation: "Unggul", pathways: ["SNBP", "SNBT", "Mandiri", "IUP"], officialUrl: "https://sastrainggris.uin-suka.ac.id/" },

  // S1 — Fakultas Dakwah dan Komunikasi
  { id: "s1-kpi", level: "S1", faculty: "Fakultas Dakwah dan Komunikasi", name: "Komunikasi dan Penyiaran Islam", accreditation: "Unggul", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri"], officialUrl: "https://kpi.uin-suka.ac.id/" },
  { id: "s1-bki", level: "S1", faculty: "Fakultas Dakwah dan Komunikasi", name: "Bimbingan dan Konseling Islam", accreditation: "Unggul (FIBAA)", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri"], officialUrl: "https://bki.uin-suka.ac.id/" },
  { id: "s1-pmi", level: "S1", faculty: "Fakultas Dakwah dan Komunikasi", name: "Pengembangan Masyarakat Islam", accreditation: "Unggul (FIBAA)", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri"], officialUrl: "https://pmi.uin-suka.ac.id/" },
  { id: "s1-md", level: "S1", faculty: "Fakultas Dakwah dan Komunikasi", name: "Manajemen Dakwah", accreditation: "Unggul", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri", "IUP"], officialUrl: "https://md.uin-suka.ac.id/" },
  { id: "s1-iks", level: "S1", faculty: "Fakultas Dakwah dan Komunikasi", name: "Ilmu Kesejahteraan Sosial", accreditation: "A", pathways: ["SNBP", "SNBT", "Mandiri", "IUP"], officialUrl: "https://iks.uin-suka.ac.id/" },

  // S1 — FEBI
  { id: "s1-es", level: "S1", faculty: "Fakultas Ekonomi dan Bisnis Islam", name: "Ekonomi Syariah", accreditation: "Unggul", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri", "IUP"], officialUrl: "https://es.uin-suka.ac.id/" },
  { id: "s1-ps", level: "S1", faculty: "Fakultas Ekonomi dan Bisnis Islam", name: "Perbankan Syariah", accreditation: "Unggul (FIBAA)", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri", "IUP"], officialUrl: "https://ps.uin-suka.ac.id/" },
  { id: "s1-mks", level: "S1", faculty: "Fakultas Ekonomi dan Bisnis Islam", name: "Manajemen Keuangan Syariah", accreditation: "Unggul (FIBAA)", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri", "IUP"], officialUrl: "https://mks.uin-suka.ac.id/" },
  { id: "s1-aks", level: "S1", faculty: "Fakultas Ekonomi dan Bisnis Islam", name: "Akuntansi Syariah", accreditation: "Unggul", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri", "IUP"], officialUrl: "https://aks.uin-suka.ac.id/" },

  // S1 — Isoshum
  { id: "s1-psikologi", level: "S1", faculty: "Fakultas Ilmu Sosial dan Humaniora", name: "Psikologi", accreditation: "Baik Sekali", pathways: ["SNBP", "SNBT", "Mandiri", "IUP"], officialUrl: "https://psikologi.uin-suka.ac.id/" },
  { id: "s1-sosiologi", level: "S1", faculty: "Fakultas Ilmu Sosial dan Humaniora", name: "Sosiologi", accreditation: "Unggul (FIBAA)", pathways: ["SNBP", "SNBT", "Mandiri"], officialUrl: "https://sosiologi.uin-suka.ac.id/" },
  { id: "s1-ilkom", level: "S1", faculty: "Fakultas Ilmu Sosial dan Humaniora", name: "Ilmu Komunikasi", accreditation: "Unggul (FIBAA)", pathways: ["SNBP", "SNBT", "Mandiri", "IUP"], officialUrl: "https://komunikasi.uin-suka.ac.id/" },

  // S1 — FITK
  { id: "s1-pai", level: "S1", faculty: "Fakultas Ilmu Tarbiyah dan Keguruan", name: "Pendidikan Agama Islam", accreditation: "Unggul (FIBAA)", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri"], officialUrl: "https://pai.uin-suka.ac.id/" },
  { id: "s1-pba", level: "S1", faculty: "Fakultas Ilmu Tarbiyah dan Keguruan", name: "Pendidikan Bahasa Arab", accreditation: "Unggul (FIBAA)", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri", "IUP"], officialUrl: "https://pba.uin-suka.ac.id/" },
  { id: "s1-mpi", level: "S1", faculty: "Fakultas Ilmu Tarbiyah dan Keguruan", name: "Manajemen Pendidikan Islam", accreditation: "Unggul (FIBAA)", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri"], officialUrl: "https://mpi.uin-suka.ac.id/" },
  { id: "s1-pgmi", level: "S1", faculty: "Fakultas Ilmu Tarbiyah dan Keguruan", name: "Pendidikan Guru Madrasah Ibtidaiyah", accreditation: "Unggul (FIBAA)", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri"], officialUrl: "https://pgmi.uin-suka.ac.id/" },
  { id: "s1-piaud", level: "S1", faculty: "Fakultas Ilmu Tarbiyah dan Keguruan", name: "Pendidikan Islam Anak Usia Dini", accreditation: "Unggul (FIBAA)", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri"], officialUrl: "https://piaud.uin-suka.ac.id/" },
  { id: "s1-pmat", level: "S1", faculty: "Fakultas Ilmu Tarbiyah dan Keguruan", name: "Pendidikan Matematika", accreditation: "Unggul", pathways: ["SNBP", "SNBT", "Mandiri"], officialUrl: "https://pmat.uin-suka.ac.id/" },
  { id: "s1-pfis", level: "S1", faculty: "Fakultas Ilmu Tarbiyah dan Keguruan", name: "Pendidikan Fisika", accreditation: "Unggul", pathways: ["SNBP", "SNBT", "Mandiri"], officialUrl: "https://pfis.uin-suka.ac.id/" },
  { id: "s1-pkim", level: "S1", faculty: "Fakultas Ilmu Tarbiyah dan Keguruan", name: "Pendidikan Kimia", accreditation: "Unggul", pathways: ["SNBP", "SNBT", "Mandiri", "IUP"], officialUrl: "https://pkim.uin-suka.ac.id/" },
  { id: "s1-pbio", level: "S1", faculty: "Fakultas Ilmu Tarbiyah dan Keguruan", name: "Pendidikan Biologi", accreditation: "Unggul", pathways: ["SNBP", "SNBT", "Mandiri"], officialUrl: "https://pbio.uin-suka.ac.id/" },

  // S1 — Saintek
  { id: "s1-matematika", level: "S1", faculty: "Fakultas Sains dan Teknologi", name: "Matematika", accreditation: "Unggul (ASIIN)", pathways: ["SNBP", "SNBT", "Mandiri"], officialUrl: "https://matematika.uin-suka.ac.id/" },
  { id: "s1-fisika", level: "S1", faculty: "Fakultas Sains dan Teknologi", name: "Fisika", accreditation: "Unggul (ASIIN)", pathways: ["SNBP", "SNBT", "Mandiri"], officialUrl: "https://fisika.uin-suka.ac.id/" },
  { id: "s1-kimia", level: "S1", faculty: "Fakultas Sains dan Teknologi", name: "Kimia", accreditation: "Unggul (ASIIN)", pathways: ["SNBP", "SNBT", "Mandiri"], officialUrl: "https://kimia.uin-suka.ac.id/" },
  { id: "s1-biologi", level: "S1", faculty: "Fakultas Sains dan Teknologi", name: "Biologi", accreditation: "Unggul (ASIIN)", pathways: ["SNBP", "SNBT", "Mandiri"], officialUrl: "https://biologi.uin-suka.ac.id/" },
  { id: "s1-informatika", level: "S1", faculty: "Fakultas Sains dan Teknologi", name: "Informatika", accreditation: "Unggul", pathways: ["SNBP", "SNBT", "Mandiri", "IUP"], officialUrl: "https://informatika.uin-suka.ac.id/" },
  { id: "s1-teknik-industri", level: "S1", faculty: "Fakultas Sains dan Teknologi", name: "Teknik Industri", accreditation: "Unggul", pathways: ["SNBP", "SNBT", "Mandiri"], officialUrl: "https://industri.uin-suka.ac.id/" },
  { id: "s1-arsitektur", level: "S1", faculty: "Fakultas Sains dan Teknologi", name: "Arsitektur", accreditation: "Baik", pathways: ["SNBP", "SNBT", "Mandiri"], officialUrl: "https://arsitektur.uin-suka.ac.id/" },
  { id: "s1-sains-biomedis", level: "S1", faculty: "Fakultas Sains dan Teknologi", name: "Sains Biomedis", accreditation: "Baik", pathways: ["SNBP", "SNBT", "Mandiri"], officialUrl: "https://sainsbiomedis.uin-suka.ac.id/" },

  // D4
  { id: "d4-teknologi-produksi-halal", level: "D4", faculty: "Fakultas Sains dan Teknologi", name: "Teknologi Produksi Halal", accreditation: "Prodi Baru", pathways: ["Mandiri"], officialUrl: "https://admisi.uin-suka.ac.id/berita/149", officialLabel: "Info resmi Admisi", isNew: true },

  // Program Profesi — FITK
  { id: "profesi-ppg", level: "PROFESI", faculty: "Fakultas Ilmu Tarbiyah dan Keguruan", name: "Pendidikan Profesi Guru", accreditation: "Unggul", officialUrl: "https://ppg.uin-suka.ac.id/", officialLabel: "Website PPG" },

  // S1 — Syariah
  { id: "s1-hki", level: "S1", faculty: "Fakultas Syariah dan Hukum", name: "Hukum Keluarga Islam", accreditation: "Unggul", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri"], officialUrl: "https://hki.uin-suka.ac.id/" },
  { id: "s1-pm", level: "S1", faculty: "Fakultas Syariah dan Hukum", name: "Perbandingan Mazhab", accreditation: "Unggul", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri", "IUP"], officialUrl: "https://pm.uin-suka.ac.id/" },
  { id: "s1-htn", level: "S1", faculty: "Fakultas Syariah dan Hukum", name: "Hukum Tata Negara", accreditation: "Unggul", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri"], officialUrl: "https://syariah.uin-suka.ac.id/", officialLabel: "Website fakultas" },
  { id: "s1-hes", level: "S1", faculty: "Fakultas Syariah dan Hukum", name: "Hukum Ekonomi Syariah", accreditation: "Unggul", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri"], officialUrl: "https://hes.uin-suka.ac.id/" },
  { id: "s1-ilmu-hukum", level: "S1", faculty: "Fakultas Syariah dan Hukum", name: "Ilmu Hukum", accreditation: "Unggul", pathways: ["SNBP", "SNBT", "Mandiri"], officialUrl: "https://ilmuhukum.uin-suka.ac.id/" },

  // S1 — Ushuluddin
  { id: "s1-afi", level: "S1", faculty: "Fakultas Ushuluddin dan Pemikiran Islam", name: "Aqidah dan Filsafat Islam", accreditation: "Unggul (FIBAA)", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri"], officialUrl: "https://afi.uin-suka.ac.id/" },
  { id: "s1-saa", level: "S1", faculty: "Fakultas Ushuluddin dan Pemikiran Islam", name: "Studi Agama-Agama", accreditation: "Unggul (FIBAA)", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri"], officialUrl: "https://saa.uin-suka.ac.id/" },
  { id: "s1-iat", level: "S1", faculty: "Fakultas Ushuluddin dan Pemikiran Islam", name: "Ilmu Al-Qur'an dan Tafsir", accreditation: "Unggul (FIBAA)", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri", "IUP"], officialUrl: "https://iat.uin-suka.ac.id/" },
  { id: "s1-sosiologi-agama", level: "S1", faculty: "Fakultas Ushuluddin dan Pemikiran Islam", name: "Sosiologi Agama", accreditation: "A", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri"], officialUrl: "https://sosiologiagama.uin-suka.ac.id/" },
  { id: "s1-ilmu-hadis", level: "S1", faculty: "Fakultas Ushuluddin dan Pemikiran Islam", name: "Ilmu Hadis", accreditation: "Unggul (FIBAA)", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri"], officialUrl: "https://ilmuhadis.uin-suka.ac.id/" },
  { id: "s1-studi-islam", level: "S1", faculty: "Fakultas Ushuluddin dan Pemikiran Islam", name: "Studi Islam", accreditation: "Baik", pathways: ["SPAN-PTKIN", "UM-PTKIN", "Mandiri"], officialUrl: "https://studiislam.uin-suka.ac.id/" },

  // S2 — Pascasarjana
  { id: "s2-iis", level: "S2", faculty: "Pascasarjana", name: "Interdisciplinary Islamic Studies", accreditation: "Unggul", pathways: ["CBT", "Non Tes", "Portofolio"], concentrations: ["Psikologi Pendidikan Islam", "Islam dan Kebijakan Publik", "Islam, Gender, dan Studi Minoritas", "Studi Islam Kawasan", "Hermeneutika Al-Qur'an dan Hadis", "Kajian Industri dan Bisnis Halal", "Filantropi, Kebencanaan, dan Pembangunan Berkelanjutan", "Agama, Media, dan Masyarakat Muslim", "Islam, Sains, dan Ekoteologi", "Al-Dirasat al-Islamiyya wa al-'Arabiyya (DIA)", "Islamic Thought and Muslim Society (ITMS)"], officialUrl: "https://pps.uin-suka.ac.id/id/page/prodi/2460-Magister-%28S2%29" },

  // S2 — FADIB
  { id: "s2-bsa", level: "S2", faculty: "Fakultas Adab dan Ilmu Budaya", name: "Bahasa dan Sastra Arab", accreditation: "Unggul", pathways: ["CBT", "Non Tes", "Portofolio"], officialUrl: "https://bsamagister.uin-suka.ac.id/" },
  { id: "s2-spi", level: "S2", faculty: "Fakultas Adab dan Ilmu Budaya", name: "Sejarah Peradaban Islam", accreditation: "Baik Sekali", pathways: ["CBT", "Non Tes", "Portofolio"], officialUrl: "https://spimagister.uin-suka.ac.id/" },
  { id: "s2-ksb", level: "S2", faculty: "Fakultas Adab dan Ilmu Budaya", name: "Kajian Sastra dan Budaya", accreditation: "Terakreditasi", pathways: ["CBT", "Non Tes", "Portofolio"], officialUrl: "https://adab.uin-suka.ac.id/", officialLabel: "Website fakultas", isNew: true },
  { id: "s2-psi", level: "S2", faculty: "Fakultas Adab dan Ilmu Budaya", name: "Perpustakaan dan Sains Informasi", accreditation: "Terakreditasi", pathways: ["CBT", "Non Tes", "Portofolio"], officialUrl: "https://adab.uin-suka.ac.id/", officialLabel: "Website fakultas", isNew: true },

  // S2 — Dakwah
  { id: "s2-kpi", level: "S2", faculty: "Fakultas Dakwah dan Komunikasi", name: "Komunikasi dan Penyiaran Islam", accreditation: "Unggul", pathways: ["CBT", "Non Tes", "Portofolio"], officialUrl: "https://kpimagister.uin-suka.ac.id/" },
  { id: "s2-pmi", level: "S2", faculty: "Fakultas Dakwah dan Komunikasi", name: "Pengembangan Masyarakat Islam", accreditation: "Baik", pathways: ["CBT", "Non Tes", "Portofolio"], officialUrl: "https://pmimagister.uin-suka.ac.id/" },
  { id: "s2-bki", level: "S2", faculty: "Fakultas Dakwah dan Komunikasi", name: "Bimbingan Konseling Islam", accreditation: "Baik Sekali", pathways: ["CBT", "Non Tes", "Portofolio"], officialUrl: "https://bkimagister.uin-suka.ac.id/" },
  { id: "s2-kessos", level: "S2", faculty: "Fakultas Dakwah dan Komunikasi", name: "Kesejahteraan Sosial", accreditation: "Baik", pathways: ["CBT", "Non Tes", "Portofolio"], officialUrl: "https://magisterkessos.uin-suka.ac.id/" },

  // S2 — Saintek
  { id: "s2-informatika", level: "S2", faculty: "Fakultas Sains dan Teknologi", name: "Informatika", accreditation: "Unggul", pathways: ["CBT", "Non Tes", "Portofolio", "RPL"], officialUrl: "https://informatikamagister.uin-suka.ac.id/" },
  { id: "s2-teknik-industri", level: "S2", faculty: "Fakultas Sains dan Teknologi", name: "Teknik Industri", accreditation: "Baik Sekali", pathways: ["CBT", "Non Tes", "Portofolio", "RPL"], officialUrl: "https://industrimagister.uin-suka.ac.id/" },
  { id: "s2-matematika", level: "S2", faculty: "Fakultas Sains dan Teknologi", name: "Matematika", accreditation: "Terakreditasi", pathways: ["CBT", "Non Tes", "Portofolio"], officialUrl: "https://matematika.uin-suka.ac.id/", officialLabel: "Website prodi Matematika", isNew: true },

  // S2 — Syariah
  { id: "s2-ilmu-syariah", level: "S2", faculty: "Fakultas Syariah dan Hukum", name: "Ilmu Syariah", accreditation: "Unggul", pathways: ["CBT", "Non Tes", "Portofolio"], concentrations: ["Hukum Keluarga Islam", "Hukum Ekonomi Syariah", "Hukum Tata Negara"], officialUrl: "https://ilmusyariahmagister.uin-suka.ac.id/" },
  { id: "s2-hukum", level: "S2", faculty: "Fakultas Syariah dan Hukum", name: "Hukum", accreditation: "Terakreditasi", pathways: ["CBT", "Non Tes", "Portofolio"], officialUrl: "https://hukummagister.uin-suka.ac.id/" },

  // S2 — Ushuluddin
  { id: "s2-afi", level: "S2", faculty: "Fakultas Ushuluddin dan Pemikiran Islam", name: "Aqidah dan Filsafat Islam", accreditation: "A", pathways: ["CBT", "Non Tes", "Portofolio"], officialUrl: "https://afimagister.uin-suka.ac.id/" },
  { id: "s2-iat", level: "S2", faculty: "Fakultas Ushuluddin dan Pemikiran Islam", name: "Ilmu Al-Qur'an dan Tafsir", accreditation: "Baik Sekali", pathways: ["CBT", "Non Tes", "Portofolio"], officialUrl: "https://iatmagister.uin-suka.ac.id/" },
  { id: "s2-saa", level: "S2", faculty: "Fakultas Ushuluddin dan Pemikiran Islam", name: "Studi Agama-Agama", accreditation: "Unggul", pathways: ["CBT", "Non Tes", "Portofolio"], officialUrl: "https://saamagister.uin-suka.ac.id/" },
  { id: "s2-sosiologi-agama", level: "S2", faculty: "Fakultas Ushuluddin dan Pemikiran Islam", name: "Sosiologi Agama", accreditation: "Baik", pathways: ["CBT", "Non Tes", "Portofolio"], officialUrl: "https://ushuluddin.uin-suka.ac.id/", officialLabel: "Website fakultas" },
  { id: "s2-ilmu-hadis", level: "S2", faculty: "Fakultas Ushuluddin dan Pemikiran Islam", name: "Ilmu Hadis", accreditation: "Prodi Baru", pathways: ["CBT", "Non Tes", "Portofolio"], officialUrl: "https://admisi.uin-suka.ac.id/berita/146", officialLabel: "Info resmi Admisi", isNew: true },

  // S2 — Isoshum
  { id: "s2-sosiologi", level: "S2", faculty: "Fakultas Ilmu Sosial dan Humaniora", name: "Sosiologi", accreditation: "Baik", pathways: ["CBT", "Non Tes", "Portofolio"], officialUrl: "https://sosiologimagister.uin-suka.ac.id/" },
  { id: "s2-medkom", level: "S2", faculty: "Fakultas Ilmu Sosial dan Humaniora", name: "Media dan Komunikasi", accreditation: "Baik", pathways: ["CBT", "Non Tes", "Portofolio"], officialUrl: "https://medkom.uin-suka.ac.id/" },
  { id: "s2-psikologi", level: "S2", faculty: "Fakultas Ilmu Sosial dan Humaniora", name: "Psikologi", accreditation: "Terakreditasi", pathways: ["CBT", "Non Tes", "Portofolio"], officialUrl: "https://psikologimagister.uin-suka.ac.id/" },

  // S2 — FITK
  { id: "s2-pai", level: "S2", faculty: "Fakultas Ilmu Tarbiyah dan Keguruan", name: "Pendidikan Agama Islam", accreditation: "Unggul", pathways: ["CBT", "Non Tes", "Portofolio"], officialUrl: "https://paimagister.uin-suka.ac.id/" },
  { id: "s2-pgmi", level: "S2", faculty: "Fakultas Ilmu Tarbiyah dan Keguruan", name: "Pendidikan Guru Madrasah Ibtidaiyah", accreditation: "Unggul (FIBAA)", pathways: ["CBT", "Non Tes", "Portofolio", "RPL"], officialUrl: "https://pgmimagister.uin-suka.ac.id/" },
  { id: "s2-piaud", level: "S2", faculty: "Fakultas Ilmu Tarbiyah dan Keguruan", name: "Pendidikan Islam Anak Usia Dini", accreditation: "Unggul (FIBAA)", pathways: ["CBT", "Non Tes", "Portofolio", "RPL"], officialUrl: "https://piaudmagister.uin-suka.ac.id/" },
  { id: "s2-pba", level: "S2", faculty: "Fakultas Ilmu Tarbiyah dan Keguruan", name: "Pendidikan Bahasa Arab", accreditation: "Unggul", pathways: ["CBT", "Non Tes", "Portofolio", "RPL"], officialUrl: "https://pbamagister.uin-suka.ac.id/" },
  { id: "s2-mpi", level: "S2", faculty: "Fakultas Ilmu Tarbiyah dan Keguruan", name: "Manajemen Pendidikan Islam", accreditation: "Unggul", pathways: ["CBT", "Non Tes", "Portofolio"], officialUrl: "https://mpimagister.uin-suka.ac.id/" },
  { id: "s2-pmat", level: "S2", faculty: "Fakultas Ilmu Tarbiyah dan Keguruan", name: "Pendidikan Matematika", accreditation: "Terakreditasi", pathways: ["CBT", "Non Tes", "Portofolio"], officialUrl: "https://pmatmagister.uin-suka.ac.id/" },

  // S2 — FEBI
  { id: "s2-es", level: "S2", faculty: "Fakultas Ekonomi dan Bisnis Islam", name: "Ekonomi Syariah", accreditation: "Unggul", pathways: ["CBT", "Non Tes", "Portofolio"], officialUrl: "https://esmagister.uin-suka.ac.id/" },
  { id: "s2-aks", level: "S2", faculty: "Fakultas Ekonomi dan Bisnis Islam", name: "Akuntansi Syariah", accreditation: "Terakreditasi", pathways: ["CBT", "Non Tes", "Portofolio"], officialUrl: "https://aksmagister.uin-suka.ac.id/" },

  // S3
  { id: "s3-bsa", level: "S3", faculty: "Fakultas Adab dan Ilmu Budaya", name: "Bahasa dan Sastra Arab", accreditation: "Terakreditasi", pathways: ["Reguler", "Kerja Sama"], officialUrl: "https://adab.uin-suka.ac.id/", officialLabel: "Website fakultas", isNew: true },
  { id: "s3-ilmu-syariah", level: "S3", faculty: "Fakultas Syariah dan Hukum", name: "Ilmu Syariah", accreditation: "Baik Sekali", pathways: ["Reguler", "Kerja Sama"], officialUrl: "https://ilmusyariahdoktoral.uin-suka.ac.id/" },
  { id: "s3-afi", level: "S3", faculty: "Fakultas Ushuluddin dan Pemikiran Islam", name: "Aqidah dan Filsafat Islam", accreditation: "Baik", pathways: ["Reguler", "Kerja Sama"], concentrations: ["Aqidah dan Filsafat Islam", "Ilmu Al-Qur'an dan Tafsir", "Studi Agama-Agama"], officialUrl: "https://afidoktoral.uin-suka.ac.id/" },
  { id: "s3-pai", level: "S3", faculty: "Fakultas Ilmu Tarbiyah dan Keguruan", name: "Pendidikan Agama Islam", accreditation: "Unggul", pathways: ["Reguler", "Kerja Sama"], officialUrl: "https://paidoktoral.uin-suka.ac.id/" },
  { id: "s3-pba", level: "S3", faculty: "Fakultas Ilmu Tarbiyah dan Keguruan", name: "Pendidikan Bahasa Arab", accreditation: "Unggul", pathways: ["Reguler", "Kerja Sama"], officialUrl: "https://pbadoktoral.uin-suka.ac.id/" },
  { id: "s3-pgmi", level: "S3", faculty: "Fakultas Ilmu Tarbiyah dan Keguruan", name: "Pendidikan Guru Madrasah Ibtidaiyah", accreditation: "Baik Sekali", pathways: ["Reguler", "Kerja Sama"], officialUrl: "https://pgmidoktoral.uin-suka.ac.id/" },
  { id: "s3-studi-islam", level: "S3", faculty: "Pascasarjana", name: "Studi Islam", accreditation: "Unggul (FIBAA)", pathways: ["Reguler", "Kerja Sama"], concentrations: ["Studi Islam dan Peradaban Muslim", "Studi Al-Qur'an dan Hadis", "Studi Islam Kawasan", "Kependidikan Islam", "Kajian Antar Iman", "Ilmu Hukum dan Pranata Sosial", "Filantropi, Kebencanaan, dan Pembangunan Berkelanjutan", "Islam, Sains, dan Ekoteologi", "Kajian Industri dan Bisnis Halal", "Islamic Thought and Muslim Society (ITMS)", "Al-Dirasat al-Islamiyya wa al-'Arabiyya (DIA)"], officialUrl: "https://pps.uin-suka.ac.id/id/page/prodi/2461-Doktor-%28S3%29" },
  { id: "s3-es", level: "S3", faculty: "Fakultas Ekonomi dan Bisnis Islam", name: "Ekonomi Syariah", accreditation: "Baik", pathways: ["Reguler", "Kerja Sama"], officialUrl: "https://esdoktor.uin-suka.ac.id/" },
];

export const levelMeta: Record<StudyLevel, { title: string; subtitle: string }> = {
  S1: { title: "Sarjana", subtitle: "Program akademik jenjang S1" },
  D4: { title: "Sarjana Terapan", subtitle: "Program vokasi jenjang D4" },
  S2: { title: "Magister", subtitle: "Program akademik jenjang S2" },
  S3: { title: "Doktor", subtitle: "Program akademik jenjang S3" },
  PROFESI: { title: "Profesi", subtitle: "Program Pendidikan Profesi Guru" },
};

export const facultyOfficialUrls: Record<string, string> = {
  "Fakultas Adab dan Ilmu Budaya": "https://adab.uin-suka.ac.id/",
  "Fakultas Dakwah dan Komunikasi": "https://dakwah.uin-suka.ac.id/",
  "Fakultas Ekonomi dan Bisnis Islam": "https://febi.uin-suka.ac.id/",
  "Fakultas Ilmu Sosial dan Humaniora": "https://isoshum.uin-suka.ac.id/",
  "Fakultas Kedokteran": "https://kedokteran.uin-suka.ac.id/",
  "Fakultas Ilmu Tarbiyah dan Keguruan": "https://tarbiyah.uin-suka.ac.id/",
  "Fakultas Sains dan Teknologi": "https://saintek.uin-suka.ac.id/",
  "Fakultas Syariah dan Hukum": "https://syariah.uin-suka.ac.id/",
  "Fakultas Ushuluddin dan Pemikiran Islam": "https://ushuluddin.uin-suka.ac.id/",
  Pascasarjana: "https://pps.uin-suka.ac.id/",
};

export const officialAdmissionUrl = UIN_ADMISI;
