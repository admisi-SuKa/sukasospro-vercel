# PATCH SuKaSospro — Perbaikan build Vercel (inventaris)

## Error yang diperbaiki
`./lib/neon-actions.ts:26:46 Type error: Property 'id' does not exist on type '{ total: number; active: boolean; }'.`

## Perubahan
Mengganti penentuan tipe fungsi `inventory()` agar hasilnya memiliki properti `id`, `total`, dan `active` secara eksplisit. Tidak ada perubahan database atau endpoint.

## Cara memasang
1. Ekstrak ZIP ini.
2. Timpa file `lib/neon-actions.ts` di repository `sukasospro-vercel` dengan file dari patch (jangan membuat folder tambahan).
3. Commit/push perubahan ke branch `main` GitHub.
4. Deploy ulang dari Vercel dan periksa build log.

Tidak perlu mengubah Neon, Apps Script, Google Drive, maupun Environment Variables.

## Pengujian
- Pemeriksaan tipe TypeScript lokal untuk modul `neon-actions.ts`, `neon-db.ts`, `drive.ts`, `landing.ts` lulus dengan deklarasi pengganti sementara untuk paket Neon.
- Build Next.js produksi penuh **belum diuji** di lingkungan ini karena registry npm tidak dapat diakses. Pengujian selanjutnya terjadi di build Vercel.
- Warning Autoprefixer CSS `start`/`end` dalam log bukan penyebab build gagal; patch ini tidak mengubah CSS.

Jika Vercel menampilkan error berikutnya pada berkas lain, kirim baris `Type error:` berikutnya agar bisa diperbaiki spesifik.
