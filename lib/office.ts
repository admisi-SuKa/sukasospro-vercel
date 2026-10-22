import crypto from "node:crypto";
import { callGas } from "./gas";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export type OfficeRole = "admin" | "pejabat";
export type OfficeUser = { username: string; name: string; role: OfficeRole; sessionVersion: string };
const COOKIE = "sospro_office";
const LIFETIME = 60 * 60 * 2;

function signingKey() {
  const key = process.env.OFFICE_SESSION_SECRET;
  if (!key || key.length < 32) throw new Error("OFFICE_SESSION_SECRET harus diisi minimal 32 karakter.");
  return key;
}
/** Kredensial diverifikasi dari Neon PostgreSQL, bukan dari Spreadsheet/ENV. */
export async function authenticateOffice(username: string, password: string): Promise<OfficeUser | null> {
  if (!/^[a-z][a-z0-9._-]{3,39}$/i.test(username.trim()) || password.length > 128 || !password) return null;
  const user = await callOffice<OfficeUser | null>("authOffice", {username, password});
  if (!user || !["admin", "pejabat"].includes(user.role) || !user.sessionVersion) return null;
  return { username:user.username, name:user.name, role:user.role, sessionVersion:user.sessionVersion };
}
function sign(value: string) { return crypto.createHmac("sha256", signingKey()).update(value).digest("base64url"); }
export function officeToken(user: OfficeUser): string {
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Math.floor(Date.now()/1000)+LIFETIME }), "utf8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}
export function parseOfficeToken(token?: string): OfficeUser | null {
  try {
    if (!token) return null;
    const [payload, mac, extra] = token.split(".");
    if (!payload || !mac || extra || mac.length !== sign(payload).length || !crypto.timingSafeEqual(Buffer.from(mac),Buffer.from(sign(payload)))) return null;
    const data = JSON.parse(Buffer.from(payload,"base64url").toString("utf8"));
    if (!data || data.exp < Date.now()/1000 || !["admin","pejabat"].includes(data.role)) return null;
    if (!/^[a-z][a-z0-9._-]{3,39}$/i.test(data.username) || typeof data.name !== "string" || data.name.length > 100 || typeof data.sessionVersion !== "string" || data.sessionVersion.length < 20) return null;
    return {username: data.username, name:data.name, role:data.role, sessionVersion:data.sessionVersion};
  } catch { return null; }
}
export function getOfficeRequest(req: NextRequest) { return parseOfficeToken(req.cookies.get(COOKIE)?.value); }
export async function getOfficePage() { return parseOfficeToken((await cookies()).get(COOKIE)?.value); }
export const officeCookie = { name: COOKIE, maxAge: LIFETIME };
export function validOrigin(req: NextRequest): boolean {
  const origin=req.headers.get('origin');
  if(!origin) return process.env.NODE_ENV !== 'production';
  try {
    const supplied=new URL(origin);
    if(supplied.protocol!=='https:' && process.env.NODE_ENV==='production')return false;
    const allowed=[process.env.PUBLIC_SITE_URL,process.env.VERCEL_URL?`https://${process.env.VERCEL_URL}`:'',new URL(req.url).origin]
      .filter((x):x is string=>!!x).map(x=>new URL(x).origin);
    return allowed.includes(supplied.origin);
  } catch {return false;}
}

// Modul layanan dan kegiatan menggunakan database Neon.
export async function callOffice<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  return callGas<T>(action, payload, true);
}
export const isSafeString = (v: unknown, max = 180) => typeof v === "string" && v.trim().length > 0 && v.trim().length <= max;
export function safeUpload(v: unknown, maxBytes = 2_000_000): v is {name:string; mime:string; data:string} {
  if (!v || typeof v !== "object") return false;
  const f = v as Record<string,unknown>;
  if (!isSafeString(f.name,160) || f.mime !== "application/pdf" || typeof f.data !== "string") return false;
  if (!/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(f.data) || !f.data.length) return false;
  return (f.data.length/4*3 - ((f.data.endsWith("==") ? 2 : f.data.endsWith("=") ? 1 : 0))) <= maxBytes;
}
