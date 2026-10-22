import {NextResponse} from 'next/server';
import {callOffice} from '@/lib/office';
import {normalizeLanding,DEFAULT_LANDING} from '@/lib/landing';
export const runtime='nodejs';
export const maxDuration=60;
export async function GET(){
 if(!process.env.DATABASE_URL||!process.env.AUTH_PEPPER) return NextResponse.json({ok:true,data:DEFAULT_LANDING,configured:false},{headers:{'Cache-Control':'public, max-age=60'}});
 try{
  const data=await callOffice('getLanding');
  return NextResponse.json({ok:true,data:normalizeLanding(data),configured:true},{headers:{'Cache-Control':'public, max-age=60, s-maxage=300, stale-while-revalidate=600'}});
 }catch{return NextResponse.json({ok:true,data:DEFAULT_LANDING,configured:false},{headers:{'Cache-Control':'no-store'}})}
}
