import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Ethiopic } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
  title: "Addis ERP — Ethiopian Business Suite",
  description: "Secure, scalable ERP for Ethiopian business owners. Finance, Inventory, HR, Sales & Compliance with ETB support, Amharic + English bilingual interface.",
  keywords: ["ERP", "Ethiopia", "Amharic", "ETB", "Business", "Finance", "Inventory", "HR", "Sales", "Compliance"],
  authors: [{ name: "Addis ERP" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Addis ERP — Ethiopian Business Suite",
    description: "Secure, scalable ERP for Ethiopian business owners",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansEthiopic.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
