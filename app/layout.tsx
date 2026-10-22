import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Jelajah Studi UIN SUKA — Sosialisasi & Promosi",
  description: "Portal SosPro untuk informasi program studi, kegiatan sosialisasi, dan layanan permohonan Admisi UIN Sunan Kalijaga.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"
        />
        <link rel="icon" type="image/png" href="/favicon-sospro.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon-sospro.png" />
        <link rel="apple-touch-icon" href="/favicon-sospro.png" />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
