"use client";

import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BottomNavigation from "./BottomNavigation";
import AnnouncementBanner from "./AnnouncementBanner";
import AgeVerificationWrapper from "@/components/shared/AgeVerificationWrapper";
import LegalWarning from "./LegalWarning";
import Copyright from "./Copyright";
import CountriesCarousel from "@/components/shared/CountriesCarousel";
import ServicesBanner from "@/components/home/ServicesBanner";
import { useAuth } from "@/hooks/useAuth";
import { WholesalerCartProvider } from "@/contexts/WholesalerCartContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { restoreUser, user, isAuthenticated } = useAuth();

  // Restaurar usuario al cargar la aplicación
  useEffect(() => {
    restoreUser();
  }, [restoreUser]);

  return (
    <WholesalerCartProvider>
      <div className="min-h-screen flex flex-col">
        <AgeVerificationWrapper />
        <AnnouncementBanner />
        <Header />
        <main className="flex-1 pb-16 lg:pb-0">{children}</main>
        {/* Solo mostrar CountriesCarousel para usuarios no mayoristas */}
        {!(isAuthenticated && user?.is_wholesaler) && <CountriesCarousel />}
        <ServicesBanner />
        <Footer />
        <LegalWarning />
        <Copyright />
        <BottomNavigation />
      </div>
    </WholesalerCartProvider>
  );
}
