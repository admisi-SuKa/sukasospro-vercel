import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const router=read('lib/neon-actions.ts'),schema=read('database/schema.sql'),drive=read('apps-script-drive/Code.gs'),landing=read('components/landing/LandingHome.tsx');
for(const a of ['authOffice','listPublicEvents','listAdminEvents','createEvent','updateEvent','submitAttendance','getAttendance','drawWinner','inventoryPublic','submit','track','dashboard','addItem','decision','handover','returnItem','getFile','listMaterials','adminMaterials','saveMaterial','deleteMaterial','getMaterialFile','getLanding','saveLanding','uploadLandingImage','getLandingImage']){
 assert.match(router,new RegExp("['\"]"+a+"['\"]"),'Action missing: '+a);
}
for(const table of ['sospro_entities','sospro_sequences','sospro_users'])assert.ok(schema.includes(table));
assert.ok(schema.includes('pg_advisory_xact_lock'),'Atomic inventory protection missing');
assert.ok(drive.includes('DRIVE_FOLDER_ID')&&drive.includes('DRIVE_GAS_SECRET'));
assert.ok(!drive.includes('SpreadsheetApp'),'Drive bridge must not access Google Sheets');
assert.ok(landing.includes('lp-cinematic')&&landing.includes('lp-cinema-visual'));
assert.ok(router.includes("crypto.scryptSync")&&router.includes('timingSafeEqual'));
assert.ok(!fs.existsSync(path.join(root,'app/biaya-beasiswa/page.tsx')));
console.log('PASS: 26 data actions, schema, Drive-only bridge, auth, cinema landing, no Beasiswa');
