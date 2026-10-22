"use client";
import {useEffect,useState} from 'react';
import Photo from './Photo';
type Post={id:string;caption:string;media_type:string;media_url?:string;thumbnail_url?:string;permalink:string;timestamp:string};
export default function InstagramFeed({title}:{title:string}){
 const [posts,setPosts]=useState<Post[]>([]);
 const [connected,setConnected]=useState(false);
 useEffect(()=>{let alive=true;fetch('/api/public/instagram').then(r=>r.json()).then(j=>{if(alive){setConnected(!!j.connected);if(Array.isArray(j.data))setPosts(j.data)}}).catch(()=>{});return()=>{alive=false}},[]);
 return <section className="lp-section lp-instagram"><div className="container"><div className="lp-heading"><div><span className="lp-eyebrow"><i className="bi bi-instagram"/> @ADMISI.UINSK</span><h2>{title}<span className="lp-ig-dot">.</span></h2><p>Ikuti informasi, kegiatan, dan cerita terbaru melalui Instagram Admisi.</p></div><a href="https://www.instagram.com/admisi.uinsk/" target="_blank" rel="noopener noreferrer" className="lp-text-link">Kunjungi Instagram <i className="bi bi-arrow-up-right"/></a></div>
  {connected&&posts.length?<div className="lp-ig-grid">{posts.slice(0,6).map((p,i)=><a key={p.id} href={p.permalink} target="_blank" rel="noopener noreferrer" className="lp-ig-item"><Photo src={p.media_type==='VIDEO'?(p.thumbnail_url||p.media_url||'/campus-illustration.svg'):(p.media_url||'/campus-illustration.svg')} alt={p.caption? p.caption.slice(0,100):`Postingan Instagram ${i+1}`}/><span><i className={`bi ${p.media_type==='VIDEO'?'bi-play-circle':'bi-instagram'}`}/></span></a>)}</div>:<div className="lp-ig-unconnected"><div className="lp-ig-decoration"><i className="bi bi-instagram"/><i className="bi bi-heart"/><i className="bi bi-chat"/></div><div><h3>Terhubung dengan setiap momen.</h3><p>{connected?'Belum ada postingan yang tersedia melalui API.':'Koleksi postingan terbaru akan tampil otomatis di sini setelah akun Instagram profesional @admisi.uinsk dihubungkan melalui Meta API.'}</p><a href="https://www.instagram.com/admisi.uinsk/" target="_blank" rel="noopener noreferrer">Lihat Instagram Admisi <i className="bi bi-arrow-up-right"/></a></div></div>}
 </div></section>;
}
