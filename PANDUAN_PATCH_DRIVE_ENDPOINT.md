# PATCH SuKaSospro — DRIVE_GAS_ENDPOINT tetap ditolak

Perubahan: `lib/drive.ts` dan satu route diagnosis `/api/office/drive-diagnostics`. **Tidak ada perubahan Neon, Apps Script, schema SQL atau username/password.**

## Memasang
1. Ekstrak ZIP dan salin folder `lib` serta `app` ke proyek SuKaSospro Vercel Anda.
2. Ganti `lib/drive.ts`, dan tambahkan file `app/api/office/drive-diagnostics/route.ts`.
3. Commit/push ke GitHub dan deploy ulang di Vercel.
4. Login sebagai **admin**. Buka `https://DOMAIN-VERCEL-ANDA/api/office/drive-diagnostics` di browser.
5. Periksa keluaran `configuration` dan `connectivity` (tidak menampilkan secret atau ID deployment). Kirim hasil JSON tersebut jika belum berhasil.

## Arti hasil
- `endpointConfigured: false`: variabel `DRIVE_GAS_ENDPOINT` tidak terbaca di deployment itu. Periksa Environment=Production dan redeploy.
- `endpointKind: "redirect-url"`: yang dimasukkan URL `script.googleusercontent.com` dari alamat browser setelah redirect. Ambil URL resmi dari **Deploy > Manage deployments > Web app > Web app URL**.
- `endpointKind: "editor-or-test-url"`: bukan URL deployment `/exec`; jangan pakai `/dev` atau link editor.
- `endpointKind: "non-google-url"`: hostname bukan `https://script.google.com`.
- `endpointValid: true`, `connectivity.reachable: false`: format benar, tetapi deployment Apps Script tidak sesuai/aksesnya dibatasi/kodenya bukan Drive bridge terbaru.
- `endpointValid: true`, `connectivity.reachable: true`: GET Apps Script berjalan. Coba unggah dokumen untuk memeriksa secret dan operasi tulis.

## Konfigurasi yang benar
Di Apps Script proyek **Drive-only**, Script Properties:
- `DRIVE_FOLDER_ID` = ID folder Drive
- `DRIVE_GAS_SECRET` = secret yang dihasilkan `setupDriveSospro()`

Di Vercel -> Project -> Settings -> Environment Variables, environment **Production**:
- `DRIVE_GAS_ENDPOINT` = Web app URL berbentuk `https://script.google.com/macros/s/ID_DEPLOYMENT/exec` (hanya URL, tanpa `DRIVE_GAS_ENDPOINT=`, tanda kutip, atau `/dev`)
- `DRIVE_GAS_SECRET` = sama dengan Script Properties di atas

Google Apps Script: Deploy > Manage deployments > Edit > New version > Deploy, jika kode Code.gs berubah. Execute as = Me, Who has access = Anyone (berlaku untuk bridge yang diautentikasi dengan secret).

Keamanan: jangan pernah mengirim `DRIVE_GAS_SECRET`, URL penuh dengan ID deployment, atau screenshot kredensial Anda.
