/** SuKaSospro: Drive-only bridge. Tidak memakai Spreadsheet. */
function setupDriveSospro() {
  var p=PropertiesService.getScriptProperties();
  var id=p.getProperty('DRIVE_FOLDER_ID');
  if(!id)throw new Error('Isi DRIVE_FOLDER_ID di Script Properties dahulu');
  var folder=DriveApp.getFolderById(id);
  if(!p.getProperty('DRIVE_GAS_SECRET'))p.setProperty('DRIVE_GAS_SECRET',Utilities.getUuid()+Utilities.getUuid()+Utilities.getUuid());
  Logger.log('Folder siap: '+folder.getName()+'. Salin DRIVE_GAS_SECRET dari Script Properties ke Vercel.');
}
/**
 * Utilities.base64Decode returns signed bytes (-128..127).
 * & 255 normalizes to unsigned bytes (0..255) before checking file signatures.
 */
function matchesSignatureSospro_(bytes, signature, offset) {
  offset = offset || 0;
  if (!bytes || bytes.length < offset + signature.length) return false;
  for (var i = 0; i < signature.length; i++) {
    if ((bytes[offset + i] & 255) !== signature[i]) return false;
  }
  return true;
}
function validImageOrDocumentSignatureSospro_(mime, bytes) {
  if (mime === 'image/png') return matchesSignatureSospro_(bytes, [137,80,78,71,13,10,26,10]);
  if (mime === 'image/jpeg') return matchesSignatureSospro_(bytes, [255,216,255]);
  if (mime === 'application/pdf') return matchesSignatureSospro_(bytes, [37,80,68,70]);
  if (mime === 'image/webp') return matchesSignatureSospro_(bytes, [82,73,70,70]) && matchesSignatureSospro_(bytes, [87,69,66,80], 8);
  return true;
}
/** Safe developer test: no Drive writes and no secrets are logged. */
function ujiValidasiGambarSospro() {
  var png = Utilities.base64Decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/rbcAAAAASUVORK5CYII=');
  var jpg = [-1,-40,-1,-32,0,16,74,70,73,70];
  var invalid = [65,66,67,68];
  if (!validImageOrDocumentSignatureSospro_('image/png', png)) throw Error('Uji PNG valid gagal');
  if (!validImageOrDocumentSignatureSospro_('image/jpeg', jpg)) throw Error('Uji JPEG valid gagal');
  if (validImageOrDocumentSignatureSospro_('image/png', invalid)) throw Error('Uji PNG palsu gagal');
  Logger.log('LULUS: PNG valid, JPEG valid, dan PNG palsu ditolak.');
}
function doGet(){return ContentService.createTextOutput(JSON.stringify({ok:true,service:'SosPro Google Drive Bridge'})).setMimeType(ContentService.MimeType.JSON)}
function doPost(e) {
  var response;
  try {
    var b=JSON.parse(e.postData.contents||'{}');var p=PropertiesService.getScriptProperties();
    if(!p.getProperty('DRIVE_GAS_SECRET')||b.secret!==p.getProperty('DRIVE_GAS_SECRET'))throw Error('Akses ditolak');
    var folder=DriveApp.getFolderById(p.getProperty('DRIVE_FOLDER_ID'));
    if(b.action==='upload') {
      var file=b.file||{};var allowed=['application/pdf','image/png','image/jpeg','image/webp','application/zip','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if(allowed.indexOf(file.mime)<0)throw Error('Jenis file tidak didukung');
      if(typeof file.name!=='string'||!file.name||file.name.length>160||typeof file.data!=='string'||file.data.length>4400000)throw Error('Nama/ukuran file tidak valid');
      var bytes=Utilities.base64Decode(file.data);
      if(!bytes.length||bytes.length>3200000)throw Error('File maksimal 3,2 MB');
      if(file.mime==='application/pdf' && !validImageOrDocumentSignatureSospro_(file.mime,bytes))throw Error('Bukan PDF valid');
      if(file.mime==='image/png' && !validImageOrDocumentSignatureSospro_(file.mime,bytes))throw Error('Bukan PNG valid');
      if(file.mime==='image/jpeg' && !validImageOrDocumentSignatureSospro_(file.mime,bytes))throw Error('Bukan JPEG valid');
      if(file.mime==='image/webp' && !validImageOrDocumentSignatureSospro_(file.mime,bytes))throw Error('Bukan WebP valid');
      var safeName=file.name.replace(/[^\w. -]/g,'_');
      var f=folder.createFile(Utilities.newBlob(bytes,file.mime,safeName));
      f.setSharing(DriveApp.Access.PRIVATE,DriveApp.Permission.NONE);
      response={ok:true,data:{id:f.getId()}};
    } else if(b.action==='download') {
      if(!/^[a-zA-Z0-9_-]{10,180}$/.test(String(b.id||'')))throw Error('ID tidak valid');
      var f=DriveApp.getFileById(b.id);
      // Tolak ID dari folder lain agar secret tidak digunakan membaca Drive sembarang.
      var inFolder=false,parents=f.getParents();while(parents.hasNext()){if(parents.next().getId()===folder.getId()){inFolder=true;break}}
      if(!inFolder)throw Error('File bukan milik folder SosPro');
      var bytes=f.getBlob().getBytes();if(bytes.length>3200000)throw Error('File terlalu besar');
      response={ok:true,data:{name:f.getName(),mime:f.getMimeType(),base64:Utilities.base64Encode(bytes)}};
    } else throw Error('Aksi tidak dikenal');
  } catch(err){response={ok:false,error:String(err.message||err)}}
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}
