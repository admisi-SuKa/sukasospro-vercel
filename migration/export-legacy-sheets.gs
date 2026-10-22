/** OPSIONAL & SATU KALI SAJA. Tambahkan kode ini ke proyek Apps Script LAMA
 * yang memiliki akses ke Spreadsheet. Jalankan function exportLegacySosproToDrive().
 * Simpan hasil JSON secara privat dan hapus setelah impor. JANGAN deploy publik.
 */
function exportLegacySosproToDrive() {
  var props=PropertiesService.getScriptProperties();
  var ss=SpreadsheetApp.openById(props.getProperty('SHEET_ID'));
  var names=['Events','Attendance','Winners','PERMOHONAN','INVENTARIS','RIWAYAT_STATUS','BAHAN_SOSPRO','LANDING_PAGE','LANDING_ASSETS'];
  var dump={exportedAt:new Date().toISOString(),sheets:{}};
  names.forEach(function(name){
    var sh=ss.getSheetByName(name);if(!sh)return;
    var data=sh.getDataRange().getDisplayValues();if(data.length<2){dump.sheets[name]=[];return;}
    var head=data[0];dump.sheets[name]=data.slice(1).filter(function(r){return r.some(Boolean)}).map(function(row){var out={};head.forEach(function(k,i){out[k]=row[i]});return out});
  });
  var folder=DriveApp.getFolderById(props.getProperty('DRIVE_FOLDER_ID'));
  var file=folder.createFile(Utilities.newBlob(JSON.stringify(dump), 'application/json','sospro-legacy-export.json'));
  file.setSharing(DriveApp.Access.PRIVATE,DriveApp.Permission.NONE);
  Logger.log('Ekspor selesai. Download file dari Drive (privat): '+file.getId());
}
