import GiftBanner from "@/components/gifts/GiftBanner";
import GiftInfoSection from "@/components/gifts/GiftInfoSection";
import GiftProcessSteps from "@/components/gifts/GiftProcessSteps";
import ProductSelectionFlow from "@/components/gifts/ProductSelectionFlow";
import SuggestedProducts from "@/components/gifts/SuggestedProducts";
import GiftBuilder from "@/components/gifts/GiftBuilder";

export default function GiftsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner principal de "Armá tu regalo" */}
      <GiftBanner />

      {/* Sección de información */}
      <GiftInfoSection />

      {/* Pasos del proceso */}
      <GiftProcessSteps />

      {/* Constructor de Regalos */}
      <GiftBuilder />
    </div>
  );
}
