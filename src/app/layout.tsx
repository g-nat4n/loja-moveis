import type { Metadata } from "next";
import { Arimo, Playfair_Display } from "next/font/google";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

const arimo = Arimo({
  subsets: ["latin"],
  variable: "--font-arimo",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: APP_NAME,
    template: `%s · ${APP_NAME}`,
  },
  description: APP_TAGLINE,
  openGraph: {
    title: APP_NAME,
    description: APP_TAGLINE,
    locale: "pt_BR",
    type: "website",
    siteName: APP_NAME,
    images: [{ url: "/brand/logo-mareli.jpg" }],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${arimo.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
