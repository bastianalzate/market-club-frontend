import GiftBanner from "@/components/gifts/GiftBanner";
import GiftInfoSection from "@/components/gifts/GiftInfoSection";

export default function GiftsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner principal de "Armá tu regalo" */}
      <GiftBanner />

      {/* Sección de información */}
      <GiftInfoSection />
    </div>
  );
}
