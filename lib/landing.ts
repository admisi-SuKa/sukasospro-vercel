/** Public landing content. Defaults work without Google configuration. */
export type LandingBanner = { id: string; eyebrow: string; title: string; description: string; imageUrl: string; ctaLabel: string; ctaHref: string };
export type LandingGallery = { id: string; title: string; category: string; imageUrl: string };
export type LandingContent = {
  announcement: string;
  announcementHref: string;
  banners: LandingBanner[];
  gallery: LandingGallery[];
  instagramTitle: string;
};
export const DEFAULT_LANDING: LandingContent = {
  announcement: 'Jelajahi program studi, kegiatan sosialisasi, dan layanan admisi dalam satu tempat.',
  announcementHref: '/program-studi',
  banners: [
    { id: 'uin-slide-2', eyebrow: 'JELAJAH UIN SUNAN KALIJAGA', title: 'Temukan Masa Depanmu di UIN Suka.', description: 'Kenali kampus, pilihan studi, dan peluang pendidikan melalui SosPro UIN Sunan Kalijaga.', imageUrl: 'https://link.uin-suka.ac.id/theme/web/slide/s-uin2.jpg', ctaLabel: 'Jelajahi Program Studi', ctaHref: '/program-studi' },
    { id: 'masjid-sunan-kalijaga', eyebrow: 'KAMPUS YOGYAKARTA', title: 'Bertumbuh dalam Ilmu, Berkarya untuk Sesama.', description: 'Kenali lingkungan akademik UIN Sunan Kalijaga dan kegiatan Sosialisasi & Promosi.', imageUrl: '/masjid-sunan-kalijaga.jpg', ctaLabel: 'Lihat Kegiatan Sospro', ctaHref: '/kegiatan' },
    { id: 'home-1', eyebrow: 'SOSIALISASI & PROMOSI · UIN SUNAN KALIJAGA', title: 'Langkah Besar Dimulai dari Sini.', description: 'Kenali pilihan program studi, jalur masuk, dan peluang masa depanmu di UIN Sunan Kalijaga Yogyakarta.', imageUrl: 'https://servdev2.admisi.uin-suka.ac.id/storage/foto-informasi/01gvhm2fw78r6car5axdycgqqe.jpg', ctaLabel: 'Jelajahi Program Studi', ctaHref: '/program-studi' },
    { id: 'home-2', eyebrow: 'LAYANAN SOSPRO · PRAKTIS & TERINTEGRASI', title: 'Lebih Dekat. Lebih Terhubung.', description: 'Ajukan kegiatan sosialisasi, pinjam perlengkapan, dan unduh bahan promosi melalui satu portal yang mudah digunakan.', imageUrl: '/campus-illustration.svg', ctaLabel: 'Buka Pusat Layanan', ctaHref: '/layanan' },
  ],
  gallery: [
    { id: 'gal-1', title: 'Ruang belajar, ruang bertumbuh', category: 'Kampus', imageUrl: 'https://lib.uin-suka.ac.id/assets/upload/image/1__Tampak_Depan.JPG' },
    { id: 'gal-2', title: 'Identitas UIN Sunan Kalijaga', category: 'Kampus', imageUrl: 'https://servdev2.admisi.uin-suka.ac.id/storage/foto-informasi/01gvhm2fw78r6car5axdycgqqe.jpg' },
    { id: 'gal-3', title: 'Mengenal kampus lebih dekat', category: 'Jelajah', imageUrl: '/campus-illustration.svg' },
  ],
  instagramTitle: 'Cerita terbaru dari Admisi',
};
const validImage = (value: unknown) => typeof value === 'string' && value.length <= 1000 && ((value === '/campus-illustration.svg' || value === '/masjid-sunan-kalijaga.jpg') || /^\/api\/public\/landing\/image\?id=IMG-[A-F0-9]{12}$/i.test(value) || /^https:\/\/[^\s<>"']+$/i.test(value));
const validHref = (value: unknown) => typeof value === 'string' && value.length <= 500 && ((value.startsWith('/') && !value.startsWith('//')) || /^https:\/\/[^\s<>"']+$/i.test(value));
const safeText = (v: unknown, fallback: string, max: number) => typeof v === 'string' && v.trim() && v.trim().length <= max ? v.trim() : fallback;
export function normalizeLanding(value: unknown): LandingContent {
  if (!value || typeof value !== 'object') return DEFAULT_LANDING;
  const raw = value as Record<string,unknown>;
  const banners = Array.isArray(raw.banners) ? raw.banners.slice(0,4).map((v,index) => {
    const b = v && typeof v === 'object' ? v as Record<string,unknown> : {};
    const fall = DEFAULT_LANDING.banners[index % DEFAULT_LANDING.banners.length];
    return {id: safeText(b.id,`banner-${index}`,64),eyebrow:safeText(b.eyebrow,fall.eyebrow,90),title:safeText(b.title,fall.title,100),description:safeText(b.description,fall.description,260),imageUrl: validImage(b.imageUrl)?String(b.imageUrl):fall.imageUrl,ctaLabel:safeText(b.ctaLabel,fall.ctaLabel,50),ctaHref:validHref(b.ctaHref)?String(b.ctaHref):fall.ctaHref};
  }) : [];
  const gallery = Array.isArray(raw.gallery) ? raw.gallery.slice(0,8).map((v,index) => {
    const g = v && typeof v === 'object' ? v as Record<string,unknown> : {};
    return {id:safeText(g.id,`gallery-${index}`,64),title:safeText(g.title,'Kegiatan & kampus',100),category:safeText(g.category,'Kampus',40),imageUrl:validImage(g.imageUrl)?String(g.imageUrl):'/campus-illustration.svg'};
  }) : [];
  return {
    announcement:safeText(raw.announcement,DEFAULT_LANDING.announcement,230),
    announcementHref:validHref(raw.announcementHref)?String(raw.announcementHref):DEFAULT_LANDING.announcementHref,
    banners:banners.length?banners:DEFAULT_LANDING.banners,
    gallery:gallery.length?gallery:DEFAULT_LANDING.gallery,
    instagramTitle:safeText(raw.instagramTitle,DEFAULT_LANDING.instagramTitle,90)
  };
}
