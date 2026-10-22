"use client";
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {programs,levelMeta,type StudyLevel} from '@/data/programs';
import {DEFAULT_LANDING,normalizeLanding,type LandingContent} from '@/lib/landing';
import Photo from './Photo';
import InstagramFeed from './InstagramFeed';

const levels:StudyLevel[]=['S1','D4','S2','S3','PROFESI'];
const icons=['bi-mortarboard','bi-book','bi-journal-bookmark','bi-bank','bi-award'];
const services=[
 {icon:'bi-file-earmark-text',title:'Permohonan Sospro',desc:'Ajukan permintaan sosialisasi ke Admisi.',href:'/layanan/sospro',className:'wide'},
 {icon:'bi-projector',title:'Peminjaman Alat',desc:'Ajukan peminjaman fasilitas kegiatan.',href:'/layanan/peminjaman',className:''},
 {icon:'bi-collection',title:'Bahan Sospro',desc:'Unduh materi, brosur, dan presentasi.',href:'/layanan/bahan',className:''},
 {icon:'bi-search-heart',title:'Cek Status',desc:'Pantau proses pengajuan secara mandiri.',href:'/layanan/status',className:''},
];
type EventRow={id:string;title:string;description:string;date:string;location:string;status?:string};
type MaterialRow={id:string;title:string;category:string;description:string};
function prettyDate(date:string) {if(!/^\d{4}-\d{2}-\d{2}$/.test(date||''))return 'Agenda Sospro';const d=new Date(date+'T12:00:00');return Number.isNaN(+d)?date:new Intl.DateTimeFormat('id-ID',{day:'2-digit',month:'short',year:'numeric'}).format(d)}
export default function LandingHome(){
 const [content,setContent]=useState<LandingContent>(DEFAULT_LANDING);
 const [slide,setSlide]=useState(0);
 const [events,setEvents]=useState<EventRow[]>([]);
 const [materials,setMaterials]=useState<MaterialRow[]>([]);
 const [query,setQuery]=useState('');
 useEffect(()=>{
  let active=true;
  fetch('/api/public/landing',{cache:'no-store'}).then(r=>r.json()).then(j=>{if(active&&j.ok&&j.data){setContent(normalizeLanding(j.data));setSlide(0)}}).catch(()=>{});
  fetch('/api/public/events').then(r=>r.json()).then(j=>{if(active&&j.ok)setEvents((j.data||[]).filter((e:EventRow)=>e.status!=='draft').slice(0,3))}).catch(()=>{});
  fetch('/api/office/materials').then(r=>r.json()).then(j=>{if(active&&j.ok)setMaterials((j.data||[]).slice(0,3))}).catch(()=>{});
  return ()=>{active=false};
 },[]);
 useEffect(()=>{if(content.banners.length<2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const timer=window.setInterval(()=>setSlide(s=>(s+1)%content.banners.length),7500);return()=>window.clearInterval(timer)},[content.banners.length]);
 const active=content.banners[slide%content.banners.length];
 const highlighted=programs.filter(p=>p.isNew).slice(0,3);
 return <main className="lp-root">
  <div className="lp-announcement"><div className="container lp-announcement-inner"><span className="lp-announcement-bullet" aria-hidden="true"/><span>{content.announcement}</span><Link href={content.announcementHref}>Selengkapnya <i className="bi bi-arrow-up-right"/></Link></div></div>
  <section className="lp-hero lp-cinematic" aria-label="Jelajahi UIN Sunan Kalijaga">
    <div className="lp-cinema-visual" key={active.id}><Photo src={active.imageUrl} alt="Suasana dan lingkungan UIN Sunan Kalijaga Yogyakarta" className="lp-cinema-image" /></div>
    <div className="lp-cinema-shade" aria-hidden="true" />
    <div className="container lp-cinema-layout">
      <div className="lp-cinema-copy" key={`copy-${active.id}`}>
        <div className="lp-cinema-kicker"><span className="lp-cinema-spark"/> {active.eyebrow}</div>
        <h1>{active.title}</h1>
        <p>{active.description}</p>
        <div className="lp-hero-actions">
          <Link href={active.ctaHref} className="lp-btn lp-btn-gold">{active.ctaLabel}<i className="bi bi-arrow-up-right"/></Link>
          <Link href="/layanan" className="lp-cinema-secondary">Eksplorasi layanan <i className="bi bi-arrow-up-right"/></Link>
        </div>
      </div>
      <aside className="lp-cinema-aside" aria-label="Informasi kampus">
        <span className="lp-cinema-counter">01 / CAMPUS EXPERIENCE</span>
        <div className="lp-cinema-aside-line" />
        <span className="lp-cinema-aside-icon"><i className="bi bi-mortarboard"/></span>
        <strong>Kenali kampus.<br/>Temukan pilihanmu.</strong>
        <p>Program studi, pengalaman kampus, dan layanan Sospro dalam satu platform.</p>
        <Link href="/program-studi">Temukan program studi <i className="bi bi-arrow-up-right"/></Link>
      </aside>
    </div>
    <div className="container lp-cinema-footer">
      <div className="lp-cinema-dots" aria-label="Pilih gambar banner">
        {content.banners.map((b,i)=><button key={b.id+i} className={i===slide?'is-active':''} onClick={()=>setSlide(i)} aria-label={`Tampilkan slide ${i+1}`} aria-current={i===slide?'true':undefined}><span /></button>)}
        <small>{String(slide+1).padStart(2,'0')} <span>/</span> {String(content.banners.length).padStart(2,'0')}</small>
      </div>
      <a className="lp-cinema-scroll" href="#jelajah-studi">Scroll untuk jelajahi <i className="bi bi-arrow-down"/></a>
      <div className="lp-cinema-location"><i className="bi bi-geo-alt"/> Yogyakarta, Indonesia</div>
    </div>
  </section>
  <section className="lp-search-section" id="jelajah-studi"><div className="container"><div className="lp-search-panel"><div><span className="lp-eyebrow">MULAI PERJALANANMU</span><h2>Apa yang ingin kamu pelajari?</h2><p>Temukan program studi yang sesuai dengan minat dan rencana masa depanmu.</p></div><form action="/program-studi" method="GET" className="lp-search-form"><label htmlFor="lp-search" className="sr-only">Cari program studi</label><i className="bi bi-search" aria-hidden="true"/><input id="lp-search" type="search" name="q" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari program studi, fakultas, atau bidang minat..."/><button type="submit">Cari Prodi <i className="bi bi-arrow-right"/></button></form></div></div></section>
  <section className="lp-section lp-levels"><div className="container"><div className="lp-heading"><div><span className="lp-eyebrow">PENDIDIKAN UNTUK SETIAP LANGKAH</span><h2>Temukan jenjang<br/><em>yang tepat untukmu.</em></h2></div><Link className="lp-text-link" href="/program-studi">Semua program studi <i className="bi bi-arrow-up-right"/></Link></div><div className="lp-level-grid">{levels.map((lv,i)=>{const total=programs.filter(p=>p.level===lv).length;return <Link key={lv} href={`/program-studi?jenjang=${lv}`} className="lp-level-card"><div className="lp-level-icon"><i className={`bi ${icons[i]}`}/></div><div className="lp-level-number">{String(i+1).padStart(2,'0')}</div><span>{lv}</span><h3>{levelMeta[lv].title}</h3><p>{total} program studi</p><div className="lp-circle-link"><i className="bi bi-arrow-up-right"/></div></Link>})}</div></div></section>
  <section className="lp-feature-strip"><div className="container lp-feature-strip-inner"><div><i className="bi bi-mortarboard"/><span><strong>{programs.length}</strong><small>Program dalam katalog</small></span></div><div><i className="bi bi-buildings"/><span><strong>{new Set(programs.map(p=>p.faculty)).size}</strong><small>Fakultas & unit</small></span></div><div><i className="bi bi-compass"/><span><strong>5</strong><small>Pilihan jenjang</small></span></div><div className="lp-feature-strip-note">Data berasal dari katalog Sospro dan dapat berubah. Verifikasi informasi penerimaan melalui Admisi resmi.</div></div></section>
  <section className="lp-section lp-highlight"><div className="container"><div className="lp-heading"><div><span className="lp-eyebrow">PELUANG BARU</span><h2>Program studi<br/><em>untuk masa depan.</em></h2></div><p>Jelajahi pilihan studi terbaru dari katalog Sospro. Informasi penerimaan final mengikuti kanal Admisi resmi.</p></div><div className="lp-highlight-grid">{highlighted.map((p,i)=><article className="lp-highlight-card" key={p.id}><span className="lp-highlight-index">0{i+1} / PROGRAM BARU</span><div className="lp-highlight-icon"><i className={`bi ${['bi-lightning-charge','bi-stars','bi-diagram-3'][i]}`}/></div><span className="lp-highlight-level">{p.level} · {p.faculty}</span><h3>{p.name}</h3><a href={p.officialUrl} target="_blank" rel="noopener noreferrer">Info program <i className="bi bi-arrow-up-right"/></a></article>)}</div></div></section>
  <section className="lp-section lp-services" id="layanan"><div className="container lp-services-layout"><div className="lp-services-intro"><span className="lp-eyebrow">SATU PORTAL, BANYAK KEMUDAHAN</span><h2>Semua layanan<br/><em>dalam satu tempat.</em></h2><p>Dari permohonan sosialisasi hingga materi presentasi, layanan Sospro membantu proses berjalan lebih tertata.</p><Link className="lp-btn lp-btn-outline-green" href="/layanan">Lihat semua layanan <i className="bi bi-arrow-up-right"/></Link></div><div className="lp-service-grid">{services.map((s,i)=><Link href={s.href} key={s.title} className={`lp-service-tile ${i===0?'lp-service-primary':''}`}><div className="lp-service-tile-head"><i className={`bi ${s.icon}`}/><span>0{i+1}</span></div><div><h3>{s.title}</h3><p>{s.desc}</p></div><span className="lp-service-arrow"><i className="bi bi-arrow-up-right"/></span></Link>)}</div></div></section>
  <section className="lp-section lp-events"><div className="container"><div className="lp-heading"><div><span className="lp-eyebrow">KEGIATAN & AGENDA</span><h2>Ruang bertemu,<br/><em>tempat berbagi.</em></h2></div><Link href="/kegiatan" className="lp-text-link">Seluruh kegiatan <i className="bi bi-arrow-up-right"/></Link></div><div className="lp-events-grid">{events.length>0?events.map((e,i)=><Link href={`/kegiatan/${encodeURIComponent(e.id)}`} className="lp-event-card" key={e.id}><div className="lp-event-num">{String(i+1).padStart(2,'0')}</div><div><small>{prettyDate(e.date)} · {e.location||'Sospro'}</small><h3>{e.title}</h3><p>{e.description||'Lihat informasi lengkap kegiatan Sospro.'}</p></div><i className="bi bi-arrow-up-right"/></Link>):<div className="lp-empty-events"><i className="bi bi-calendar-event"/><div><h3>Kegiatan Sospro terbaru</h3><p>Agenda yang dipublikasikan Admin akan otomatis muncul di bagian ini.</p></div><Link href="/kegiatan">Lihat agenda <i className="bi bi-arrow-right"/></Link></div>}</div></div></section>
  <section className="lp-section lp-materials"><div className="container lp-materials-inner"><div><span className="lp-eyebrow">PERPUSTAKAAN DIGITAL SOSPRO</span><h2>Bahan sosialisasi,<br/><em>siap digunakan.</em></h2><p>Akses brosur, materi presentasi, serta dokumen sosialisasi terbaru yang telah dipublikasikan Admisi.</p><Link href="/layanan/bahan" className="lp-btn lp-btn-gold">Buka Bahan Sospro <i className="bi bi-arrow-up-right"/></Link></div><div className="lp-material-list">{materials.length>0?materials.map(m=><Link href="/layanan/bahan" key={m.id}><div className="lp-material-icon"><i className="bi bi-file-earmark-arrow-down"/></div><div><small>{m.category}</small><strong>{m.title}</strong></div><i className="bi bi-arrow-up-right"/></Link>):<><div className="lp-material-placeholder"><i className="bi bi-file-earmark-pdf"/><span>01 / Brosur digital & panduan</span></div><div className="lp-material-placeholder"><i className="bi bi-file-earmark-slides"/><span>02 / Presentasi Sospro</span></div><div className="lp-material-placeholder"><i className="bi bi-file-earmark-text"/><span>03 / Materi pendukung</span></div><small className="lp-material-note">Materi asli akan muncul setelah Admin mempublikasikannya.</small></>}</div></div></section>
  <section className="lp-section lp-gallery"><div className="container"><div className="lp-heading"><div><span className="lp-eyebrow">SEKILAS KEHIDUPAN KAMPUS</span><h2>Rasakan suasana<br/><em>UIN Sunan Kalijaga.</em></h2></div><p>Potret kampus dan kegiatan yang dapat diperbarui dari dashboard pengelola landing page.</p></div><div className="lp-gallery-grid">{content.gallery.slice(0,6).map((g,i)=><figure key={g.id+i} className={`lp-gallery-item lp-gallery-${i}`}><Photo src={g.imageUrl} alt={g.title}/><figcaption><small>{g.category}</small><b>{g.title}</b></figcaption></figure>)}</div></div></section>
  <InstagramFeed title={content.instagramTitle}/>
  <section className="lp-bottom-cta"><div className="container lp-bottom-cta-inner"><div><span className="lp-eyebrow">SIAP MENENTUKAN LANGKAH?</span><h2>Masa depan dimulai<br/><em>dari pilihan hari ini.</em></h2><p>Informasi pendaftaran, jadwal, dan persyaratan final tersedia di situs Admisi resmi UIN Sunan Kalijaga.</p></div><a href="https://admisi.uin-suka.ac.id/" target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-gold">Kunjungi Admisi Resmi <i className="bi bi-arrow-up-right"/></a></div></section>
 </main>
}
