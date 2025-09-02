"use client";

import { Gift } from "lucide-react";
import clubCerveceroImage from "@/assets/images/home/club-cervecero.png";

export default function BeerClubSection() {
  return (
    <section className="w-full h-[810px] flex">
      {/* Sección izquierda - Imagen en blanco y negro (30-35% del ancho) */}
      <div className="w-1/3 relative overflow-hidden">
        {/* Imagen de fondo en blanco y negro */}
        <div className="w-full h-full relative">
          {/* Imagen real del Beer Club */}
          <img
            src={clubCerveceroImage.src}
            alt="Beer Club - Jóvenes disfrutando cerveza en un bar"
            className="w-full h-full object-cover"
          />

          {/* Texto "TÚ CLUB" sobre la imagen con efecto de capas */}
          <div className="absolute top-8 left-8">
            <h2 className="text-6xl font-bold text-white uppercase tracking-wider drop-shadow-lg">
              <span className="text-stroke-white text-black">TÚ CLUB</span>
            </h2>
            {/* Segunda capa del texto para efecto de sombra */}
            <h2 className="text-6xl font-bold text-white uppercase tracking-wider drop-shadow-lg absolute -top-1 -left-1 opacity-70">
              <span className="text-stroke-white text-black">TÚ CLUB</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Sección central - Panel dorado (30-35% del ancho) */}
      <div className="w-1/3 bg-amber-600 relative">
        {/* Textura sutil de papel arrugado */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        {/* Contenido del panel central */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <h2 className="text-6xl font-bold text-white uppercase tracking-wider drop-shadow-lg">
            <span className="text-stroke-white text-amber-600">CERVECERO</span>
          </h2>
        </div>
      </div>

      {/* Sección derecha - Panel naranja (30-35% del ancho) */}
      <div className="w-1/3 bg-orange-600 relative">
        {/* Contenido del panel derecho */}
        <div className="relative z-10 p-12 h-full flex flex-col justify-center">
          {/* Título "CERVECERO" */}
          <div className="mb-8">
            <h2 className="text-6xl font-bold text-white uppercase tracking-wider drop-shadow-lg">
              <span className="text-stroke-white text-orange-600">
                CERVECERO
              </span>
            </h2>
          </div>

          {/* Call to Action */}
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">
              Únete Al Market Club
            </h3>

            {/* Lista de beneficios */}
            <div className="text-white text-lg space-y-2">
              <p>
                <strong>Beneficios del club:</strong>
              </p>
              <ul className="ml-4 space-y-1">
                <li>• Descuentos exclusivos</li>
                <li>• Acceso a productos premium</li>
                <li>• Caja sorpresa mensual</li>
                <li>• Eventos especiales</li>
              </ul>
            </div>
          </div>

          {/* Botón de acción */}
          <div className="mt-auto">
            <button className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-lg transition-colors duration-300 flex items-center space-x-3 group">
              <Gift className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="font-bold uppercase tracking-wide">
                QUIERO UNIRME
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
