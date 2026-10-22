/** Run locally, AFTER database/schema.sql. Never store the password in repo. */
import {neon} from '@neondatabase/serverless';
import {scryptSync,randomBytes} from 'node:crypto';
import readline from 'node:readline';
const url=process.env.DATABASE_URL,pepper=process.env.AUTH_PEPPER;
if(!url||!pepper||pepper.length<32){console.error('Set DATABASE_URL and AUTH_PEPPER (min 32 chars) first.');process.exit(1)}
const username=(process.argv[2]||'').trim().toLowerCase(),role=(process.argv[3]||'admin').trim(),name=(process.argv.slice(4).join(' ')||'Admin SosPro').trim();
if(!/^[a-z][a-z0-9._-]{3,39}$/.test(username)||!['admin','pejabat'].includes(role)||name.length>100){console.error('Use: npm run db:admin -- adminadmisi admin "Admin SosPro"');process.exit(1)}
async function readPassword(){
 if(process.env.ADMIN_BOOTSTRAP_PASSWORD)return process.env.ADMIN_BOOTSTRAP_PASSWORD;
 if(!process.stdin.isTTY){throw Error('Run interactively or set ADMIN_BOOTSTRAP_PASSWORD temporarily. Do not commit it.');}
 process.stdout.write('Password baru (tidak terlihat): ');
 return await new Promise((resolve,reject)=>{
   let result=''; const input=process.stdin;input.setRawMode(true);input.resume();input.setEncoding('utf8');
   function done(err){input.setRawMode(false);input.pause();input.removeListener('data',onData);process.stdout.write('\n');err?reject(err):resolve(result)}
   function onData(chunk){for(const c of chunk){if(c==='\u0003')return done(Error('Dibatalkan'));if(c==='\r'||c==='\n')return done();if(c==='\u007f')result=result.slice(0,-1);else result+=c}}
   input.on('data',onData);
 });
}
const password=await readPassword();
if(password.length<12||password.length>128||!/[A-Za-z]/.test(password)||!/[0-9]/.test(password)){console.error('Password 12–128 karakter, harus memuat huruf dan angka.');process.exit(1)}
const sql=neon(url);const salt=randomBytes(32).toString('hex'),hash=scryptSync(password+pepper,salt,64).toString('hex'),version=randomBytes(32).toString('hex');
await sql`INSERT INTO sospro_users(username,display_name,role,salt,password_hash,active,session_version,login_failures,locked_until)
 VALUES(${username},${name},${role},${salt},${hash},true,${version},0,NULL)
 ON CONFLICT(username) DO UPDATE SET display_name=EXCLUDED.display_name,role=EXCLUDED.role,salt=EXCLUDED.salt,
 password_hash=EXCLUDED.password_hash,active=true,session_version=EXCLUDED.session_version,
 login_failures=0,locked_until=NULL,updated_at=now()`;
console.log(`Akun ${username} (${role}) berhasil dibuat/diperbarui di Neon. Sesi lama dibatalkan.`);
