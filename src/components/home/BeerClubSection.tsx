"use client";

import { Gift } from "lucide-react";
import clubCerveceroImage from "@/assets/images/home/club-cervecero.png";

export default function BeerClubSection() {
  const Content = ({ align = "left" }: { align?: "left" | "center" }) => (
    <div className={`relative z-10 ${align === "center" ? "text-center" : ""}`}>
      <div>
        <h3
          className={`text-white mb-4 lg:mb-6 ${
            align === "center" ? "mx-auto" : ""
          }`}
          style={{
            fontFamily: "var(--font-oswald)",
            fontWeight: 700,
            fontSize: align === "center" ? "42px" : "64px",
            lineHeight: "100%",
            letterSpacing: "0px",
            textTransform: "capitalize",
          }}
        >
          Únete Al Market Club
        </h3>

        <p
          className="text-white mb-6 lg:mb-8"
          style={{
            fontFamily: "var(--font-inter)",
            fontWeight: 400,
            fontSize: align === "center" ? "18px" : "32px",
            lineHeight: align === "center" ? "26px" : "34px",
            letterSpacing: "0px",
          }}
        >
          Beneficios del club: descuentos, acceso exclusivo, caja sorpresa
          mensual.
        </p>

        <button
          onClick={() => (window.location.href = "/market-club")}
          className={`bg-black text-white px-6 py-3 lg:px-8 lg:py-4 rounded-lg font-bold uppercase tracking-wide flex items-center gap-3 hover:bg-gray-800 transition-colors duration-200 cursor-pointer ${
            align === "center" ? "mx-auto justify-center" : ""
          }`}
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          <Gift className="w-5 h-5" />
          QUIERO UNIRME
        </button>
      </div>
    </div>
  );

  return (
    <section className="w-full h-auto relative">
      {/* Imagen de fondo completa */}
      <div className="w-full h-full relative">
        <img
          src={clubCerveceroImage.src}
          alt="Beer Club - Jóvenes disfrutando cerveza en un bar"
          className="w-full h-full object-cover"
        />

        {/* Overlay solo en desktop */}
        <div className="absolute inset-0 hidden lg:flex">
          <div className="w-1/2 relative"></div>
          <div className="w-2/5 relative flex flex-col justify-center items-start lg:pl-24 py-16">
            <Content align="left" />
          </div>
        </div>
      </div>

      {/* Tarjeta inferior en mobile/tablet */}
      <div className="lg:hidden w-full px-4 sm:px-6">
        <div className="text-white -mt-2 mb-4 px-6 py-8 text-center">
          <Content align="center" />
        </div>
      </div>
    </section>
  );
}
