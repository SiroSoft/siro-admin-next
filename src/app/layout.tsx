import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/providers";
import { Toaster } from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Siro Admin",
  description: "Siro Admin Starter - Modern admin panel for SiroPHP APIs",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Siro Admin - SiroPHP Demo",
    description: "Try the live demo, then grab the open-source admin template and SiroPHP skeleton.",
    url: "https://admin-next.sirophp.com",
    siteName: "Siro Admin",
    type: "website",
  },
  twitter: { card: "summary", title: "Siro Admin - SiroPHP Demo" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
