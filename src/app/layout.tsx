import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import EmailPopup from "@/components/EmailPopup";
import StickyShopButton from "@/components/StickyShopButton";
import CookieBanner from "@/components/CookieBanner";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://the00sversion.com";

export const metadata: Metadata = {
  title: {
    default: "The 00s Version — Premium Streetwear",
    template: "%s — The 00s Version",
  },
  description:
    "Premium streetwear rooted in early 2000s culture. Every piece tells a story. Every drop is an era.",
  keywords: ["streetwear", "clothing", "early 2000s", "rap aesthetic", "premium fashion", "EU fashion"],
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: "website",
    siteName: "The 00s Version",
    title: "The 00s Version — Premium Streetwear",
    description:
      "Premium streetwear rooted in early 2000s culture. Every piece tells a story. Every drop is an era.",
    url: BASE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The 00s Version — Premium Streetwear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The 00s Version — Premium Streetwear",
    description: "Premium streetwear rooted in early 2000s culture.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#080808] text-neutral-200 antialiased">
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <EmailPopup />
          <StickyShopButton />
          <CookieBanner />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
