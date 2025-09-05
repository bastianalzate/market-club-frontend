import Header from "./Header";
import Footer from "./Footer";
import AnnouncementBanner from "./AnnouncementBanner";
import LegalWarning from "./LegalWarning";
import Copyright from "./Copyright";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBanner />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <LegalWarning />
      <Copyright />
    </div>
  );
}
