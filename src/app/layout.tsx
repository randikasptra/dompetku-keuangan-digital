import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PWAProvider } from "@/components/pwa/PWAProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dompetku - Kelola Keuanganmu",
  description:
    "Aplikasi pencatatan keuangan pribadi untuk mahasiswa dan pekerja muda Indonesia",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dompetku",
  },
  icons: {
    icon: [{ url: "/icon-192.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* PWA Color Scheme */}
        <meta name="color-scheme" content="light" />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        {/* PWA Installation Prompt */}
        <PWAProvider />
      </body>
    </html>
  );
}
