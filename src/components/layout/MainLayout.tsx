import Header from "./Header";
import Footer from "./Footer";
import AnnouncementBanner from "./AnnouncementBanner";
import AgeVerificationWrapper from "@/components/shared/AgeVerificationWrapper";
import LegalWarning from "./LegalWarning";
import Copyright from "./Copyright";
import CountriesCarousel from "@/components/shared/CountriesCarousel";
import ServicesBanner from "@/components/home/ServicesBanner";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <AgeVerificationWrapper />
      <AnnouncementBanner />
      <Header />
      <main className="flex-1">{children}</main>
      <CountriesCarousel />
      <ServicesBanner />
      <Footer />
      <LegalWarning />
      <Copyright />
    </div>
  );
}
