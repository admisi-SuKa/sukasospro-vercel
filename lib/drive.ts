/**
 * SuKaSospro Google Drive bridge.
 * Only official, HTTPS Apps Script Web App deployment URLs can receive a Drive secret.
 * File metadata is stored in Neon. This bridge only handles file bytes.
 */
export type FileUpload = { name: string; mime: string; data: string };

export type DriveConfigurationStatus = {
  endpointConfigured: boolean;
  secretConfigured: boolean;
  endpointValid: boolean;
  endpointKind: 'official-web-app' | 'redirect-url' | 'editor-or-test-url' | 'non-google-url' | 'invalid-url' | 'missing';
  message: string;
};

function configuredEndpoint(): { url?: string; kind: DriveConfigurationStatus['endpointKind']; message: string } {
  const raw = (process.env.DRIVE_GAS_ENDPOINT || '').trim();
  if (!raw) {
    return { kind: 'missing', message: 'DRIVE_GAS_ENDPOINT belum tersedia untuk deployment ini. Periksa Environment: Production di Vercel, lalu redeploy.' };
  }
  // A pasted .env assignment is a frequent source of invalid Vercel values.
  if (/^DRIVE_GAS_ENDPOINT\s*=/i.test(raw)) {
    return { kind: 'invalid-url', message: 'Kolom Value di Vercel harus berisi URL saja, tanpa tulisan DRIVE_GAS_ENDPOINT=.' };
  }
  const candidate = raw.replace(/^(['"`])([\s\S]*)\1$/, '$2').trim();
  let parsed: URL;
  try { parsed = new URL(candidate); }
  catch { return { kind: 'invalid-url', message: 'DRIVE_GAS_ENDPOINT bukan URL HTTPS yang valid. Salin Web app URL dari Apps Script → Deploy → Manage deployments.' }; }

  if (parsed.hostname === 'script.googleusercontent.com') {
    return { kind: 'redirect-url', message: 'Yang tersimpan adalah URL redirect script.googleusercontent.com, bukan URL deployment. Salin Web app URL asli melalui Apps Script → Deploy → Manage deployments; jangan salin alamat setelah membuka /exec di browser.' };
  }
  if (parsed.hostname !== 'script.google.com' || parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.port) {
    return { kind: 'non-google-url', message: 'DRIVE_GAS_ENDPOINT harus berupa HTTPS Web app URL dengan host script.google.com, bukan link editor, folder Drive, atau domain lain.' };
  }

  // Standard deployment: /macros/s/<deployment-id>/exec
  // Workspace deployments can also use: /a/macros/<domain>/s/<deployment-id>/exec
  // Reject /dev, editor URLs and arbitrary script.google.com paths.
  const official = /^\/macros\/s\/[A-Za-z0-9_-]+\/exec\/?$/.test(parsed.pathname) ||
    /^\/a\/macros\/[^/]+\/s\/[A-Za-z0-9_-]+\/exec\/?$/.test(parsed.pathname);
  if (!official) {
    return { kind: 'editor-or-test-url', message: 'URL Apps Script belum menggunakan deployment Web app /exec yang benar. Pilih Deploy → Manage deployments → Web app → Copy Web app URL (bukan /dev, Script ID, atau URL editor).' };
  }
  if (parsed.search || parsed.hash) {
    return { kind: 'invalid-url', message: 'DRIVE_GAS_ENDPOINT harus berisi URL /exec tanpa tambahan query (?...) atau fragment (#...).' };
  }
  return { kind: 'official-web-app', url: parsed.toString(), message: 'Format URL Web app resmi valid.' };
}

/** Safe to display to an administrator: never exposes deployment ID, full URL, or secrets. */
export function driveConfigurationStatus(): DriveConfigurationStatus {
  const resolved = configuredEndpoint();
  return {
    endpointConfigured: !!process.env.DRIVE_GAS_ENDPOINT?.trim(),
    secretConfigured: !!process.env.DRIVE_GAS_SECRET?.trim(),
    endpointValid: !!resolved.url,
    endpointKind: resolved.kind,
    message: resolved.message,
  };
}

/** An authenticated administrator may verify the Web app's public doGet without uploading anything. */
export async function probeDriveBridge(): Promise<{ reachable: boolean; message: string }> {
  const resolved = configuredEndpoint();
  if (!resolved.url) return { reachable: false, message: resolved.message };
  try {
    const response = await fetch(resolved.url, { method: 'GET', redirect: 'follow', cache: 'no-store', signal: AbortSignal.timeout(12000) });
    if (!response.ok) return { reachable: false, message: `Apps Script merespons HTTP ${response.status}; periksa izin deployment Web app.` };
    const json: unknown = await response.json();
    if (typeof json === 'object' && json !== null && 'ok' in json && json.ok === true &&
      'service' in json && json.service === 'SosPro Google Drive Bridge') {
      return { reachable: true, message: 'Google Drive Bridge versi Drive-only dapat diakses melalui Web app /exec.' };
    }
    return { reachable: false, message: 'Endpoint merespons, tetapi bukan API SosPro Google Drive Bridge. Periksa Code.gs dan deployment versinya.' };
  } catch {
    return { reachable: false, message: 'Endpoint tidak mengembalikan respons JSON yang sesuai. Periksa izin publik Web app dan apakah URL deployment benar.' };
  }
}

export async function driveCall<T>(action: 'upload' | 'download', body: Record<string, unknown>): Promise<T> {
  const resolved = configuredEndpoint();
  if (!resolved.url) throw new Error(resolved.message);
  const secret = process.env.DRIVE_GAS_SECRET?.trim();
  if (!secret) throw new Error('DRIVE_GAS_SECRET belum diatur di Environment Variables Production Vercel.');

  const response = await fetch(resolved.url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, secret, ...body }),
    cache: 'no-store',
    redirect: 'follow',
    signal: AbortSignal.timeout(55000),
  });
  if (!response.ok) throw new Error(`Google Drive bridge HTTP ${response.status}. Periksa Deploy Web app Apps Script dan akses publiknya.`);
  let json: { ok: boolean; error?: string; data?: T };
  try { json = await response.json(); }
  catch { throw new Error('Google Drive mengembalikan respons bukan JSON. Pastikan endpoint adalah Apps Script Drive-only yang benar dan deployment dapat diakses.'); }
  if (!json.ok) throw new Error(json.error || 'Google Drive gagal diproses.');
  return json.data as T;
}

export async function uploadDrive(file: FileUpload) {
  return driveCall<{ id: string }>('upload', { file });
}
export async function downloadDrive(id: string) {
  return driveCall<{ name: string; mime: string; base64: string }>('download', { id });
}
