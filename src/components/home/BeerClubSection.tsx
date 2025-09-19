"use client";

import { Gift } from "lucide-react";
import clubCerveceroImage from "@/assets/images/home/club-cervecero.png";

export default function BeerClubSection() {
  return (
    <section className="w-full h-auto relative">
      {/* Imagen de fondo completa */}
      <div className="w-full h-full relative">
        <img
          src={clubCerveceroImage.src}
          alt="Beer Club - Jóvenes disfrutando cerveza en un bar"
          className="w-full h-full object-cover"
        />

        {/* Overlay con contenido superpuesto */}
        <div className="absolute inset-0 flex">
          {/* Sección izquierda - Vacía */}
          <div className="w-1/2 relative flex items-start justify-start"></div>

          {/* Sección derecha - Contenido del club */}
          <div className="w-2/5 relative flex flex-col justify-center items-start pl-24  py-16">
            {/* Contenido superpuesto */}
            <div className="relative z-10">
              {/* Contenido principal */}
              <div>
                <h3
                  className="text-white mb-6"
                  style={{
                    fontFamily: "var(--font-oswald)",
                    fontWeight: 700,
                    fontSize: "64px",
                    lineHeight: "100%",
                    letterSpacing: "0px",
                    textTransform: "capitalize",
                  }}
                >
                  Únete Al Market Club
                </h3>

                <p
                  className="text-white mb-8"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 400,
                    fontSize: "32px",
                    lineHeight: "34px",
                    letterSpacing: "0px",
                  }}
                >
                  Beneficios del club: descuentos, acceso exclusivo, caja
                  sorpresa mensual.
                </p>

                {/* Botón de llamada a la acción */}
                <button
                  onClick={() => window.open("/market-club", "_blank")}
                  className="bg-black text-white px-8 py-4 rounded-lg font-bold uppercase tracking-wide flex items-center gap-3 hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  <Gift className="w-5 h-5" />
                  QUIERO UNIRME
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
