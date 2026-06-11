import type { Metadata } from "next";
import "./globals.css";
import Footer from '@/app/components/Footer'

export const metadata: Metadata = {
  title: "RentEase — Gestion locative",
  description: "Application de gestion de locations immobilières",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col">
        {children}
        <Footer />
      </body>
    </html>
  );
}