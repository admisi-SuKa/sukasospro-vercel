import {NextResponse} from 'next/server';
export const runtime='nodejs';
export const revalidate=1800;
export async function GET(){
 const token=process.env.INSTAGRAM_ACCESS_TOKEN;
 const userId=process.env.INSTAGRAM_USER_ID;
 const loginMethod=process.env.INSTAGRAM_LOGIN_METHOD==='facebook'?'facebook':'instagram';
 if(!token||!userId)return NextResponse.json({ok:true,connected:false,data:[]},{headers:{'Cache-Control':'public, s-maxage=1800'}});
 try{
  const base=loginMethod==='facebook'?'https://graph.facebook.com':'https://graph.instagram.com';
  const url=new URL(`${base}/v23.0/${encodeURIComponent(userId)}/media`);
  url.searchParams.set('fields','id,caption,media_type,media_url,thumbnail_url,permalink,timestamp');
  url.searchParams.set('limit','6');
  const res=await fetch(url.toString(),{headers:{Authorization:`Bearer ${token}`},next:{revalidate:1800},signal:AbortSignal.timeout(12000)});
  if(!res.ok)throw new Error('Tidak dapat mengakses Instagram API');
  const json=await res.json();
  if(!Array.isArray(json.data))throw new Error('Respons Instagram tidak sesuai');
  const posts=json.data.filter((p:Record<string,unknown>)=>typeof p.id==='string'&&typeof p.permalink==='string'&&/^https:\/\/www\.instagram\.com\//.test(p.permalink)).slice(0,6).map((p:Record<string,string>)=>({id:p.id,caption:p.caption||'',media_type:p.media_type||'IMAGE',media_url:p.media_url||'',thumbnail_url:p.thumbnail_url||'',permalink:p.permalink,timestamp:p.timestamp||''}));
  return NextResponse.json({ok:true,connected:true,data:posts},{headers:{'Cache-Control':'public, s-maxage=1800, stale-while-revalidate=3600'}});
 }catch{
  return NextResponse.json({ok:true,connected:false,data:[]},{headers:{'Cache-Control':'public, s-maxage=180'}});
 }
}
