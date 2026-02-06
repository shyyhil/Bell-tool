

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// --- THIS IS THE SECTION TO UPDATE ---
export const metadata: Metadata = {
  title: "Bell TV Channel Lookup Tool",
  description: "Bell TV channel lookup tool for Bell Bundles 1, 2, and 3.",
  icons: {
    icon: '/favicon.ico', // This points to the icon file
  },
  // This fixes the preview when you share on WhatsApp/iMessage/LinkedIn
  openGraph: {
    title: "Bell TV Sales Tool",
    description: "Instant channel lookup for Bell Bundles 1, 2, and 3.",
    siteName: "Bell Sales Tool",
    locale: "en_CA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
