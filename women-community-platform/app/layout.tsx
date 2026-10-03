import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Women of Wisdom — WOW",
    template: "%s | Women of Wisdom",
  },
  description:
    "A premium membership community connecting women professionals, entrepreneurs, and changemakers. Discover businesses, events, and opportunities.",
  keywords: ["women", "community", "business", "networking", "events", "marketplace", "women of wisdom", "WOW"],
  openGraph: {
    type: "website",
    title: "Women of Wisdom",
    description: "Connect, grow, and thrive together.",
    siteName: "Women of Wisdom",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${fraunces.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
