import crypto from 'node:crypto';
import { neon } from '@neondatabase/serverless';

export function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL Neon belum diisi di Vercel.');
  return neon(url);
}
export const now = () => new Date().toISOString();
export const rowId = (prefix:string) => `${prefix}-${crypto.randomUUID().replaceAll('-', '').slice(0,12).toUpperCase()}`;

export async function records<T=Record<string,unknown>>(collection:string):Promise<T[]> {
  const rows = await db()`SELECT payload FROM sospro_entities WHERE collection=${collection} ORDER BY created_at DESC`;
  return rows.map(r=>r.payload as T);
}
export async function record<T=Record<string,unknown>>(collection:string,id:string):Promise<T|null> {
  const rows = await db()`SELECT payload FROM sospro_entities WHERE collection=${collection} AND id=${id} LIMIT 1`;
  return rows.length ? rows[0].payload as T : null;
}
export async function saveRecord(collection:string,id:string,value:unknown) {
  const payload=JSON.stringify(value);
  await db()`INSERT INTO sospro_entities(collection,id,payload) VALUES(${collection},${id},${payload}::jsonb)
     ON CONFLICT(collection,id) DO UPDATE SET payload=EXCLUDED.payload,updated_at=now()`;
}
export async function deleteRecord(collection:string,id:string) {
  await db()`DELETE FROM sospro_entities WHERE collection=${collection} AND id=${id}`;
}
export async function logAction(code:string,actor:string,status:string,note:string) {
  const id=rowId('LOG');await saveRecord('logs',id,{code,actor,status,note,time:now()});
}
export async function nextCode(prefix:string){
  const year=String(new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Jakarta'}).slice(0,4));
  const result=await db()`INSERT INTO sospro_sequences(prefix,year,value) VALUES(${prefix},${year},1)
    ON CONFLICT(prefix,year) DO UPDATE SET value=sospro_sequences.value+1 RETURNING value`;
  return `${prefix}-${year}-${String(result[0].value).padStart(5,'0')}`;
}
