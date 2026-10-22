"use client";
import Link from 'next/link';
import {useState} from 'react';
import {usePathname} from 'next/navigation';
const links=[
 {href:'/program-studi',name:'Program Studi'},
 {href:'/jalur-masuk',name:'Jalur Masuk'},
 {href:'/kegiatan',name:'Kegiatan'},
 {href:'/layanan',name:'Layanan Sospro'},
 {href:'/layanan/bahan',name:'Bahan Sospro'},
];
export default function Header(){
 const [open,setOpen]=useState(false);
 const path=usePathname();
 return <header className="site-header lp-site-header"><div className="container header-inner lp-header-inner">
  <Link href="/" className="brand" aria-label="Beranda SosPro" onClick={()=>setOpen(false)}><img className="brand-logo" src="/sospro-wordmark.png" width={194} height={52} alt="SosPro"/></Link>
  <nav className="nav lp-desktop-nav" aria-label="Navigasi utama">{links.map(l=><Link key={l.href} href={l.href} className={path===l.href?'lp-nav-active':''}>{l.name}</Link>)}<Link className="lp-login-btn" href="/login" onClick={()=>setOpen(false)}><i className="bi bi-person-lock" aria-hidden="true"/> Login</Link><a className="official-btn" href="https://admisi.uin-suka.ac.id/" target="_blank" rel="noopener noreferrer">Admisi Resmi <i className="bi bi-arrow-up-right"/></a></nav>
  <button className="lp-mobile-toggle" type="button" aria-label={open?'Tutup menu':'Buka menu navigasi'} aria-expanded={open} aria-controls="lp-mobile-menu" onClick={()=>setOpen(v=>!v)}><i className={`bi ${open?'bi-x-lg':'bi-list'}`}/></button>
 </div><nav id="lp-mobile-menu" className={`lp-mobile-panel ${open?'open':''}`} aria-label="Navigasi seluler">{links.map(l=><Link key={l.href} href={l.href} onClick={()=>setOpen(false)}>{l.name}<i className="bi bi-arrow-up-right"/></Link>)}<Link href="/faq" onClick={()=>setOpen(false)}>Pertanyaan Umum<i className="bi bi-arrow-up-right"/></Link><Link href="/login" className="lp-mobile-login" onClick={()=>setOpen(false)}><span><i className="bi bi-person-lock" aria-hidden="true"/> Login</span><i className="bi bi-arrow-right" aria-hidden="true"/></Link><a href="https://admisi.uin-suka.ac.id/" target="_blank" rel="noopener noreferrer">Admisi Resmi <i className="bi bi-box-arrow-up-right"/></a></nav></header>
}
