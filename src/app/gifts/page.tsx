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
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Construí tu Regalo Perfecto
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Elige tu caja favorita y personalízala con las cervezas que más te
            gusten. Crea un regalo único y especial.
          </p>
        </div>

        <GiftBuilder />
      </div>
    </div>
  );
}
