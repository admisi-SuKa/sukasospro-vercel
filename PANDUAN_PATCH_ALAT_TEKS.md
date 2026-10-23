# PATCH SuKaSospro — Alat Peminjaman Isian Teks

Patch ini diterapkan **di atas** PATCH_SuKaSospro_Form_Permohonan_Bahan_Alat_Neon.zip (23 Oktober 2026).

## Yang berubah

- Kolom **Alat yang ingin dipinjam** di form `/layanan/peminjaman` kini **textarea** teks bebas, bukan dropdown inventaris.
- Pemohon dapat menuliskan daftar beserta jumlah alat, misalnya: `Proyektor 1 unit; Mikrofon 2 unit`.
- Bahan Sospro dan alat sama-sama opsional secara individual; **minimal salah satu harus diisi**.
- Data teks disimpan ke properti JSONB `equipmentRequest` di collection `requests` Neon.
- Admin bisa membaca teks alat, memproses persetujuan, serah terima, dan pengembalian.
- Riwayat permohonan lama yang menggunakan `itemId` tetap bisa dibaca dan diproses menggunakan stok inventaris seperti sebelumnya.

## Cara memasang

1. Ekstrak ZIP patch.
2. Timpa empat file kode dalam proyek SuKaSospro sesuai lokasi foldernya.
3. Commit dan push ke GitHub branch yang dideploy oleh Vercel.
4. Pastikan deployment Vercel terbaru berstatus **Ready**.
5. Uji form `/layanan/peminjaman`: isi bahan saja, alat saja, kemudian keduanya.
6. Periksa detail yang masuk di dashboard Admin dan penanganan serah terima/pengembalian.

**Tidak perlu menjalankan SQL baru**: `sospro_entities.payload` menggunakan JSONB dan bisa menyimpan `equipmentRequest`.
**Tidak perlu mengubah Apps Script** karena operasi Google Drive tetap sama.

## Catatan operasional

Karena alat berupa input teks bebas tanpa ID inventaris, **sistem tidak dapat memeriksa stok otomatis**. Admin harus memastikan ketersediaan dan jumlah alat secara manual sebelum menyetujui. Aksi serah-terima/pengembalian tetap tersedia.

## File dalam ZIP

- `components/office/ApplicationForm.tsx`
- `components/office/OfficeDashboard.tsx`
- `app/api/office/public/route.ts`
- `lib/neon-actions.ts`
