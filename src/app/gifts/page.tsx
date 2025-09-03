import GiftBanner from "@/components/gifts/GiftBanner";
import GiftInfoSection from "@/components/gifts/GiftInfoSection";
import GiftProcessSteps from "@/components/gifts/GiftProcessSteps";
import ProductSelectionFlow from "@/components/gifts/ProductSelectionFlow";

export default function GiftsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner principal de "Armá tu regalo" */}
      <GiftBanner />

      {/* Sección de información */}
      <GiftInfoSection />

      {/* Pasos del proceso */}
      <GiftProcessSteps />

      {/* Flujo de selección de productos */}
      <ProductSelectionFlow />

      {/* Contenido adicional de la página */}
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Armá tu Regalo Perfecto
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre nuestra selección exclusiva de regalos cerveceros. Desde
            packs personalizados hasta experiencias únicas, tenemos todo lo que
            necesitas para sorprender a los amantes de la cerveza.
          </p>
        </div>

        {/* Aquí puedes agregar más contenido como productos, categorías, etc. */}
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder para contenido futuro */}
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎁</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Packs Personalizados
              </h3>
              <p className="text-gray-600">
                Crea el regalo perfecto con nuestra selección de cervezas
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍺</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cervezas Premium
              </h3>
              <p className="text-gray-600">
                Las mejores cervezas artesanales e importadas
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Experiencias Únicas
              </h3>
              <p className="text-gray-600">
                Regalos que crean momentos inolvidables
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
