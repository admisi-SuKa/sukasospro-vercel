# PATCH FORM SuKaSospro — Vercel + Neon

## Perubahan

### Form Permohonan Sospro (`/layanan/sospro`)
Form ini untuk **sekolah/institusi yang meminta kegiatan Sospro dari UIN Sunan Kalijaga**. Bagian identitas: Nama Pemohon, Jabatan Pemohon, No. WhatsApp, Email, Sekolah/Institusi. Bagian detail kegiatan dan lampiran surat PDF tetap tersedia. Tanda tangan pemohon tetap diwajibkan.

### Permintaan Bahan Sospro dan Peminjaman Alat (`/layanan/peminjaman`)
Untuk pemohon dari internal fakultas/prodi UIN. Bagian identitas: Nama, Fakultas (dropdown), Prodi (mengikuti pilihan Fakultas), No. WA, Email. Daftar Fakultas dan Prodi mengambil data yang **sudah ada** di `data/programs.ts`, sehingga tidak membuat dua daftar yang berbeda. Bagian detail mencakup kebutuhan bahan fisik (nama + jumlah ditulis), alat dan jumlah (opsional), tanggal serta Lokasi Kegiatan dengan placeholder **Sekolah/Instansi**. Pemohon boleh meminta hanya bahan, hanya alat, atau kedua-duanya.

### Dashboard
Menyertakan Jabatan Pemohon, Fakultas, Prodi, Email dan daftar bahan yang diminta. Nomor registrasi, status dan kode pelacakan tidak berubah. Pengajuan terdahulu tetap dapat dibuka.

## Apakah perlu ALTER TABLE / menjalankan ulang `schema.sql`?
**Tidak perlu.** Permohonan disimpan dalam `sospro_entities` yang menggunakan `payload jsonb`. Properti baru (`position`, `prodi`, `prodiId`, `prodiLevel`, `materialsRequest`) ditambahkan ke data permohonan baru saja. Data lama tidak diubah.

Untuk kompatibilitas, layanan kedua **tetap disimpan dengan `kind=ALAT`** sehingga nomor registrasi `ALT-...` dan alur administrasi lama tetap berlaku. Jika pengguna hanya meminta bahan dan tidak memilih alat, persetujuan dicatat tanpa menjalankan fungsi SQL peminjaman `sospro_loan_transition`. Jika ada alat, stok tetap diperiksa oleh fungsi SQL lama secara atomik.

**Catatan:** Permintaan *bahan fisik* menggunakan kolom teks bebas yang diperiksa dan ditindaklanjuti Admin. Ini berbeda dari koleksi file "Bahan Sospro" digital yang dapat diunduh di website. Pengaturan stok dan serah-terima bahan fisik belum dibuat (hanya stok peminjaman alat).

## Pemasangan

1. Ekstrak ZIP dan salin `app`, `components`, dan `lib` ke root repositori SuKaSospro Vercel Anda (pilih Replace untuk file yang berubah).
2. Pastikan file `data/programs.ts` yang sudah ada tidak dihapus karena digunakan untuk pilihan Fakultas–Prodi.
3. Commit perubahan dan push ke GitHub, lalu deploy ulang di Vercel.
4. Tidak perlu mengubah `DATABASE_URL`, akun Admin, Apps Script Drive, atau menjalankan SQL lagi.
5. Uji 3 skenario: permohonan sekolah, permintaan bahan saja, serta permintaan bahan plus alat. Lihat hasil masing-masing di Dashboard Admin dan Neon.

## Verifikasi dan batas pengujian

- Sintaks TS/TSX seluruh file yang diubah lolos pemeriksaan TypeScript transpile.
- Validasi API disesuaikan dengan kedua skenario permohonan.
- Belum diuji end-to-end dengan database Neon/Drive milik Anda. Setelah deploy, lakukan pengajuan uji dan periksa data yang tersimpan.

## Lokasi kode
- `components/office/ApplicationForm.tsx`
- `app/api/office/public/route.ts`
- `lib/neon-actions.ts` (termasuk perbaikan tipe inventaris dari patch sebelumnya)
- `components/office/OfficeDashboard.tsx`
- `components/office/StatusLookup.tsx`
- `app/layanan/page.tsx`
- `components/landing/LandingHome.tsx`
