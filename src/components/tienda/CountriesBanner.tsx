"use client";

export default function CountriesBanner() {
  return (
    <section className="w-full bg-white">
      {/* Imagen de países con 100% de ancho y altura máxima de 300px */}
      <div className="w-full h-[300px]">
        <img
          src="/images/tienda/Paises.png"
          alt="Países representados - Estados Unidos, España, Corea del Sur, Alemania, Francia, México"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
}
