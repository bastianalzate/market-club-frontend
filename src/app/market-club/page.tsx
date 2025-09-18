import Banner from "@/components/market-club/Banner";
import HeroSection from "@/components/market-club/HeroSection";
import SubscriptionSection from "@/components/market-club/SubscriptionSection";
import { useMarketClubConfig } from "@/hooks/useMarketClubConfig";

export default function MarketClubPage() {
  const config = useMarketClubConfig();

  return (
    <div className="bg-white">
      {/* Banner de Market Club */}
      <Banner {...config.banner} />

      {/* Sección ¿Qué hace único a Market Club? */}
      <HeroSection {...config.heroSection} />

      {/* Sección de Planes de Suscripción */}
      <SubscriptionSection {...config.subscriptionSection} />
    </div>
  );
}
