/** Drive bridge: Apps Script hanya menyimpan/mengambil file. Metadata disimpan di Neon. */
export type FileUpload={name:string;mime:string;data:string};
export async function driveCall<T>(action:'upload'|'download',body:Record<string,unknown>):Promise<T>{
  const endpoint=process.env.DRIVE_GAS_ENDPOINT?.trim();
  const secret=process.env.DRIVE_GAS_SECRET?.trim();
  if(!endpoint||!secret)throw new Error('DRIVE_GAS_ENDPOINT / DRIVE_GAS_SECRET belum dikonfigurasi di Vercel.');
  const url=new URL(endpoint);
  if(url.protocol!=='https:'||url.hostname!=='script.google.com'||!/^\/macros\/s\/[^/]+\/exec\/?$/.test(url.pathname))throw new Error('Gunakan URL Apps Script /exec resmi untuk DRIVE_GAS_ENDPOINT.');
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action,secret,...body}),cache:'no-store',redirect:'follow',signal:AbortSignal.timeout(55000)});
  if(!response.ok)throw new Error(`Google Drive bridge HTTP ${response.status}. Cek Deploy Web App Apps Script.`);
  const json=await response.json();
  if(!json.ok)throw new Error(json.error||'Google Drive gagal diproses');
  return json.data as T;
}
export async function uploadDrive(file:FileUpload){return driveCall<{id:string}>('upload',{file});}
export async function downloadDrive(id:string){return driveCall<{name:string;mime:string;base64:string}>('download',{id});}
