import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Oswald,
  Inter,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";
import ReduxProvider from "@/providers/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Market Club - Tu Destino para las Mejores Cervezas",
  description:
    "Descubre la mejor selección de cervezas artesanales e importadas. Envíos rápidos y atención personalizada en Market Club.",
  keywords:
    "cerveza, cervezas artesanales, cervezas importadas, ecommerce, bebidas",
  authors: [{ name: "Market Club" }],
  openGraph: {
    title: "Market Club - Tu Destino para las Mejores Cervezas",
    description:
      "Descubre la mejor selección de cervezas artesanales e importadas.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} ${inter.variable} ${plusJakartaSans.variable} antialiased`}
      >
        <ReduxProvider>
          <MainLayout>{children}</MainLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
