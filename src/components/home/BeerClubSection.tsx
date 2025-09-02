"use client";

import { Gift } from "lucide-react";
import clubCerveceroImage from "@/assets/images/home/club-cervecero.png";

export default function BeerClubSection() {
  return (
    <section className="w-full h-auto flex">
      {/* Sección izquierda - Imagen en blanco y negro (30-35% del ancho) */}
      <div className="w-full relative overflow-hidden">
        {/* Imagen de fondo en blanco y negro */}
        <div className="w-full h-full relative">
          {/* Imagen real del Beer Club */}
          <img
            src={clubCerveceroImage.src}
            alt="Beer Club - Jóvenes disfrutando cerveza en un bar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
