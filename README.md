# SuKaSospro — Vercel + Neon + Google Drive

Website Next.js 15 / React 19 UIN Sunan Kalijaga untuk program studi, Sospro, kegiatan, presensi, doorprize, surat, inventaris, bahan Sospro, dan landing page modern.

**Arsitektur baru**

- **Vercel**: hosting Next.js, API Routes, sesi petugas.
- **Neon PostgreSQL**: semua metadata/transaksi dan akun (tanpa Google Sheets).
- **Google Apps Script**: hanya menjembatani file privat di **Google Drive**.
- **Instagram**: opsional melalui Meta API dengan akun berizin.

**Mulai dari:** [PANDUAN_VERCEL_NEON_DRIVE.md](PANDUAN_VERCEL_NEON_DRIVE.md)

Menjalankan: `npm install`, `npm run dev`, `npm run build`.
Database: `database/schema.sql`. Backend Drive: `apps-script-drive/Code.gs`.

> Migrasi data dari Spreadsheet lama **tidak otomatis**. Panduan ekspor/impor tersedia dan tidak mengimpor password akun lama.
> Tanda tangan pemohon berupa gambar PNG (bukan TTE tersertifikasi); persetujuan pejabat menggunakan PDF final yang telah ditandatangani di luar aplikasi.
