import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_Ethiopic } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansEthiopic = Noto_Sans_Ethiopic({
  variable: "--font-noto-sans-ethiopic",
  subsets: ["ethiopic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hisab ERP — Ethiopian Business Intelligence",
  description: "Secure, scalable ERP for Ethiopian business owners. Finance, Inventory, HR, Sales & Compliance with ETB support, Amharic + English bilingual interface, HisabAI assistant, and ERCA tax compliance.",
  keywords: ["ERP", "Ethiopia", "Amharic", "ETB", "Business", "Finance", "Inventory", "HR", "Sales", "Compliance", "Hisab", "HisabAI", "HisabTech"],
  authors: [{ name: "HisabTech" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Hisab ERP — Ethiopian Business Intelligence",
    description: "Secure, scalable ERP for Ethiopian business owners with AI assistant, bilingual support, and ERCA compliance.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0B141A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansEthiopic.variable} antialiased`}
        style={{ margin: 0, padding: 0, overflow: "hidden", background: "#0B141A" }}
      >
        {children}
      </body>
    </html>
  );
}
