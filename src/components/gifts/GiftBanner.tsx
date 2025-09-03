"use client";

export default function GiftBanner() {
  return (
    <section className="w-full">
      {/* Banner de "Armá tu regalo" con 100% de ancho */}
      <div className="w-full">
        <img
          src="/images/arma_tu_regalo/banner-arma-tu-regalo.png"
          alt="Armá tu regalo - MARKET CLUB - Regala lujo, arma momentos"
          className="w-full h-auto object-cover"
        />
      </div>
    </section>
  );
}
