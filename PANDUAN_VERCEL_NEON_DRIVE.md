# PANDUAN PEMASANGAN SOSPRO — VERCEL + NEON + GOOGLE DRIVE

Versi ini menggantikan backend Google Sheets. Semua metadata dan data administrasi berada di Neon. Apps Script **khusus file Drive**, tidak memakai SHEET_ID.

## 1. Siapkan database Neon

1. Buat project PostgreSQL di https://console.neon.tech/ (region Singapura / dekat Vercel jika tersedia).
2. Salin **pooled connection string** dari Neon (host biasanya mengandung `-pooler`). Jangan kirim string ini ke orang lain atau commit di GitHub.
3. Buka SQL Editor Neon dan jalankan **seluruh isi** `database/schema.sql`.
4. Verifikasi ada tabel `sospro_entities`, `sospro_sequences`, `sospro_users` dan fungsi `sospro_loan_transition`.

## 2. Apps Script Drive BARU (hanya satu proyek)

1. Buat folder Google Drive atau gunakan folder lama jika ingin mempertahankan file terdahulu.
2. Buat Apps Script baru di https://script.google.com/. Ganti `Code.gs` dengan `apps-script-drive/Code.gs`.
3. Project Settings → Script Properties → **DRIVE_FOLDER_ID** = ID folder Google Drive.
4. Pada editor, pilih `setupDriveSospro` → **Run** → beri izin. Script otomatis menghasilkan `DRIVE_GAS_SECRET`; salin dari Script Properties.
5. Deploy → New deployment → Web app → Execute as **Me** → Who has access **Anyone** → Deploy.
6. Salin URL **/exec** menjadi `DRIVE_GAS_ENDPOINT` di Vercel.
7. Gunakan nilai **DRIVE_GAS_SECRET** sebagai `DRIVE_GAS_SECRET` di Vercel.
8. Setelah kode Drive berubah, Deploy → Manage deployments → Edit → New version.

**Penting:** URL `/exec` bersifat publik, tetapi operasi upload/download wajib memakai secret pada body POST dan berjalan hanya dari server Next.js. Jangan masukkan secret ke komponen React atau variabel `NEXT_PUBLIC_`.

## 3. Buat akun Admin awal di Neon

1. Salin `.env.example` menjadi `.env.local` di komputer Anda, isi `DATABASE_URL`, `AUTH_PEPPER` dan `OFFICE_SESSION_SECRET` dengan benar.
2. `AUTH_PEPPER` adalah secret **berbeda** dari `OFFICE_SESSION_SECRET`, minimum 32 karakter. Jangan diubah setelah akun dibuat karena password lama tidak akan cocok.
3. Jalankan pada terminal (Node.js 22+):

```bash
npm install
node --env-file=.env.local scripts/setup-neon-admin.mjs adminadmisi admin "Admin SosPro"
```

4. Masukkan password di prompt (tidak tampak). Password minimal 12 karakter, mengandung huruf dan angka.
5. Jika diperlukan, buat akun pejabat dengan:

```bash
node --env-file=.env.local scripts/setup-neon-admin.mjs kepalaadmisi pejabat "Pejabat Admisi"
```

Perintah sama dapat dijalankan kembali untuk **mengganti password** akun. Sesi lama dibatalkan otomatis. Tidak lagi ada `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `RESET_PASSWORD`, `OFFICE_USERS_JSON`, atau `SHEET_ID`.

## 4. Environment Variables di Vercel

Vercel → Project → Settings → Environment Variables:

| Variable | Isi |
|---|---|
| `DATABASE_URL` | Pooled connection string Neon |
| `AUTH_PEPPER` | String rahasia tetap, min. 32 karakter, sama dengan saat akun dibuat |
| `OFFICE_SESSION_SECRET` | String acak lain, min. 32 karakter |
| `DRIVE_GAS_ENDPOINT` | Web App URL Apps Script Drive-only berakhiran `/exec` |
| `DRIVE_GAS_SECRET` | Nilai Script Property `DRIVE_GAS_SECRET` |
| `PUBLIC_SITE_URL` | URL production Vercel, contoh `https://sukasospro.vercel.app` |
| `NEXT_PUBLIC_DEMO_MODE` | `0` |
| `INSTAGRAM_ACCESS_TOKEN` | Opsional, akun Instagram profesional dengan izin Meta |
| `INSTAGRAM_USER_ID` | Opsional, ID akun Instagram |

**Jangan set GAS_ENDPOINT / GAS_SECRET lama** — sudah tidak dipakai. Semua URL dan secret tetap disimpan di sisi server.

## 5. Deploy Next.js ke Vercel

1. Unggah semua isi ZIP (folder proyek) ke repository GitHub baru atau branch Anda.
2. Buka https://vercel.com/new → Import Git Repository.
3. Framework Preset = **Next.js**, Root Directory = folder yang memiliki `package.json`.
4. Masukkan semua Environment Variables.
5. Klik Deploy. Untuk perubahan ENV berikutnya, jalankan Redeploy.
6. Buka `/login` (Admin), `/admin`, `/layanan/sospro`, `/layanan/peminjaman`, `/layanan/bahan`, dan `/kegiatan`.

**Catatan:** build & uji database end-to-end harus dijalankan dengan kredensial Neon/Drive Anda. Paket ini telah diperiksa secara statis, tetapi koneksi ke akun Anda belum dapat diuji dari lingkungan pembuatan.

## 6. Bila data Spreadsheet LAMA perlu dipindahkan

Data lama **tidak otomatis disalin**, dan jangan hapus Spreadsheet/Apps Script lama dahulu.

1. Pada proyek Apps Script **lama** (yang masih punya `SHEET_ID` dan `DRIVE_FOLDER_ID`), tempel `migration/export-legacy-sheets.gs` dan jalankan `exportLegacySosproToDrive` **sekali**. Jangan deploy ekspor sebagai Web App.
2. Unduh `sospro-legacy-export.json` dari Drive ke komputer Anda. File mengandung data pemohon, simpan secara privat.
3. Jalankan dari folder proyek:

```bash
node --env-file=.env.local scripts/import-legacy-data.mjs /lokasi/sospro-legacy-export.json
```

4. Periksa jumlah rekaman di Neon. Hapus salinan ekspor dari Drive dan komputer saat tidak diperlukan.
5. **Akun lama tidak diimpor**, sebab hash password Sheets lama berbeda; buat/reset akun via perintah `setup-neon-admin.mjs`.
6. Agar file lama tetap bisa diambil, set `DRIVE_FOLDER_ID` ke folder Drive lama yang memuat semua dokumen terkait. Jika sebelumnya tersebar di folder lain, pindahkan/atur akses secara benar sebelum migrasi.

## 7. Hal yang tetap dan berubah

- Tetap: satu login, role `admin`/`pejabat`, kegiatan, presensi, doorprize, TTD pemohon, PDF pejabat, inventaris, bahan Sospro, program studi, IG opsional, landing page manager.
- Berubah: seluruh data dari Sheets berpindah ke Neon, akun dibuat di Neon, Apps Script hanya untuk file Drive.
- Foto kampus dari URL UIN dan foto masjid lokal tetap tersedia dalam banner default.
- Folder Drive bersifat privat. PDF dan gambar unduhan dilayani lewat endpoint Next.js dengan cek hak akses; QR/tautan tracking tidak menampilkan lampiran internal.
- Password disimpan sebagai hash **scrypt+salt+pepper** di Neon, bukan teks biasa.
- Persetujuan peminjaman memakai fungsi SQL `sospro_loan_transition` dengan advisory lock untuk menghindari stok ganda.
- Instagram otomatis memerlukan token Meta resmi; tanpa token tampil tautan akun, bukan postingan palsu.

## 8. Tes awal setelah Deploy

1. Login Admin berhasil → dashboard terbuka.
2. Buat kegiatan → terlihat di `/kegiatan`.
3. Lakukan presensi satu kali; input nomor sama kedua kali harus ditolak.
4. Buka Bahan Sospro → tambah materi → unggah ke Google Drive → dapat diunduh.
5. Landing Page Manager → simpan judul/banner → tampil di homepage.
6. Ajukan surat dengan TTD pemohon dan PDF → memperoleh kode + token → bisa dilacak.
7. Uji verifikasi Admisi dan unggah PDF bertanda tangan dengan akun pejabat.
8. Coba peminjaman alat pada tanggal yang bertabrakan dan pastikan stok tidak bisa dilebihi.

**Jika gagal**, periksa Vercel Logs dan Apps Script Executions; jangan membagikan `DATABASE_URL`, password, `AUTH_PEPPER`, atau `DRIVE_GAS_SECRET`.
