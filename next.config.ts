import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    suppressHydrationWarning: true,
  },
  // Suprimir warnings específicos de hidratación causados por extensiones del navegador
  onDemandEntries: {
    // período en ms donde la página se mantiene en memoria
    maxInactiveAge: 25 * 1000,
    // número de páginas que se mantienen simultáneamente sin ser utilizadas
    pagesBufferLength: 2,
  },
};

export default nextConfig;
