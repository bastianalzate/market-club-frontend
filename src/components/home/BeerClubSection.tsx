"use client";

import Link from "next/link";
import { Gift } from "lucide-react";
import clubCerveceroImage from "@/assets/images/home/club-cervecero.png";

export default function BeerClubSection() {
  return (
    <section className="w-full h-auto">
      {/* Imagen de fondo - Solo visible en desktop */}
      <div className="hidden xl:block w-full h-full relative">
        <img
          src={clubCerveceroImage.src}
          alt="Beer Club - Jóvenes disfrutando cerveza en un bar"
          className="w-full h-full object-cover min-h-[600px]"
        />

        {/* Overlay con contenido superpuesto - Solo desktop */}
        <div className="absolute inset-0 flex">
          {/* Sección izquierda - Vacía */}
          <div className="w-1/2 relative flex items-start justify-start"></div>

          {/* Sección derecha - Contenido del club */}
          <div className="w-2/5 relative flex flex-col justify-center items-start pl-24 py-16">
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
                <Link
                  href="/about"
                  className="inline-flex bg-black text-white px-8 py-4 rounded-lg font-bold uppercase tracking-wide items-center gap-3 hover:bg-gray-800 transition-colors duration-200 focus:outline-none"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  <Gift className="w-5 h-5" />
                  QUIERO UNIRME
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layout intermedio para 1024px - Layout horizontal con mejor distribución */}
      <div className="hidden lg:block xl:hidden w-full h-full relative">
        <img
          src={clubCerveceroImage.src}
          alt="Beer Club - Jóvenes disfrutando cerveza en un bar"
          className="w-full h-full object-cover min-h-[500px]"
        />

        {/* Overlay con contenido superpuesto - Layout horizontal para 1024px */}
        <div className="absolute inset-0 flex">
          {/* Sección izquierda - Imagen con texto */}
          <div className="w-3/5 relative flex items-start justify-start">            <div className="absolute top-8 left-4 z-10">
            </div>
          </div>

          {/* Sección derecha - Contenido del club con fondo dorado */}
          <div className="w-2/5 relative flex flex-col justify-center items-start px-6 py-16">
            {/* Fondo dorado para la sección derecha */}
            <div 
              className="absolute inset-0 w-full h-full"
              style={{
                background: "linear-gradient(135deg, #B58E31 0%, #D4AF37 50%, #B58E31 100%)",
                backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"25\" cy=\"25\" r=\"1\" fill=\"%23ffffff\" opacity=\"0.1\"/><circle cx=\"75\" cy=\"75\" r=\"1\" fill=\"%23ffffff\" opacity=\"0.1\"/><circle cx=\"50\" cy=\"10\" r=\"0.5\" fill=\"%23ffffff\" opacity=\"0.05\"/><circle cx=\"10\" cy=\"60\" r=\"0.5\" fill=\"%23ffffff\" opacity=\"0.05\"/><circle cx=\"90\" cy=\"40\" r=\"0.5\" fill=\"%23ffffff\" opacity=\"0.05\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>')",
              }}
            ></div>
            
            {/* Contenido superpuesto */}
            <div className="relative z-10 w-full text-left">
              {/* Texto "CERVECERO" con outline */}
              <h2
                className="text-white text-4xl font-bold mb-4"
                style={{
                  fontFamily: "var(--font-oswald)",
                  fontWeight: 700,
                  lineHeight: "100%",
                  letterSpacing: "0px",
                  textTransform: "uppercase",
                  textShadow: "2px 2px 0px rgba(0,0,0,0.3), -2px -2px 0px rgba(0,0,0,0.3), 2px -2px 0px rgba(0,0,0,0.3), -2px 2px 0px rgba(0,0,0,0.3)",
                }}
              >
                CERVECERO
              </h2>

              {/* Contenido principal */}
              <h3
                className="text-white mb-4 text-xl font-bold"
                style={{
                  fontFamily: "var(--font-oswald)",
                  fontWeight: 700,
                  lineHeight: "100%",
                  letterSpacing: "0px",
                  textTransform: "capitalize",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                Únete Al Market Club
              </h3>

              <p
                className="text-white mb-6 text-base max-w-sm"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 400,
                  lineHeight: "1.4",
                  letterSpacing: "0px",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                Beneficios del club: descuentos, acceso exclusivo, caja
                sorpresa mensual.
              </p>

              {/* Botón de llamada a la acción */}
              <button
                className="bg-black text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wide flex items-center gap-2 hover:bg-gray-800 transition-colors duration-200 text-sm"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                <Gift className="w-4 h-4" />
                QUIERO UNIRME
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Layout móvil y tablet - Imagen separada del contenido */}
      <div className="lg:hidden">
        {/* Imagen de fondo para móvil/tablet */}
        <div className="w-full h-full relative">
          <img
            src={clubCerveceroImage.src}
            alt="Beer Club - Jóvenes disfrutando cerveza en un bar"
            className="w-full h-full object-cover min-h-[300px] sm:min-h-[400px]"
          />
        </div>

        {/* Tarjeta independiente con fondo dorado */}
        <div 
          className="w-full px-4 py-8 sm:px-8 sm:py-12 md:px-12 md:py-16"
          style={{
            background: "linear-gradient(135deg, #B58E31 0%, #D4AF37 50%, #B58E31 100%)",
            backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"25\" cy=\"25\" r=\"1\" fill=\"%23ffffff\" opacity=\"0.1\"/><circle cx=\"75\" cy=\"75\" r=\"1\" fill=\"%23ffffff\" opacity=\"0.1\"/><circle cx=\"50\" cy=\"10\" r=\"0.5\" fill=\"%23ffffff\" opacity=\"0.05\"/><circle cx=\"10\" cy=\"60\" r=\"0.5\" fill=\"%23ffffff\" opacity=\"0.05\"/><circle cx=\"90\" cy=\"40\" r=\"0.5\" fill=\"%23ffffff\" opacity=\"0.05\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>')",
          }}
        >
          <div className="max-w-4xl mx-auto">
            {/* Texto "CERVECERO" con outline */}
            <h2
              className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-center"
              style={{
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
                lineHeight: "100%",
                letterSpacing: "0px",
                textTransform: "uppercase",
                textShadow: "2px 2px 0px rgba(0,0,0,0.3), -2px -2px 0px rgba(0,0,0,0.3), 2px -2px 0px rgba(0,0,0,0.3), -2px 2px 0px rgba(0,0,0,0.3)",
              }}
            >
              CERVECERO
            </h2>

            {/* Contenido principal */}
            <div className="text-center">
              <h3
                className="text-white mb-4 sm:mb-6 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold"
                style={{
                  fontFamily: "var(--font-oswald)",
                  fontWeight: 700,
                  lineHeight: "100%",
                  letterSpacing: "0px",
                  textTransform: "capitalize",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                Únete Al Market Club
              </h3>

              <p
                className="text-white mb-6 sm:mb-8 text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 400,
                  lineHeight: "1.4",
                  letterSpacing: "0px",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                Beneficios del club: descuentos, acceso exclusivo, caja
                sorpresa mensual.
              </p>

              {/* Botón de llamada a la acción */}
              <button
                className="bg-black text-white px-6 py-4 sm:px-8 sm:py-4 md:px-10 md:py-5 rounded-lg font-bold uppercase tracking-wide flex items-center gap-3 hover:bg-gray-800 transition-colors duration-200 text-base sm:text-lg mx-auto"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
                QUIERO UNIRME
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
