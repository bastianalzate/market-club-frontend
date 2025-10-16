"use client";

import { useState } from "react";
import Image from "next/image";

export default function AgeVerificationWrapper() {
  const [showModal, setShowModal] = useState(() => {
    // Verificar inmediatamente si ya se ha verificado la edad
    if (typeof window !== "undefined") {
      const ageVerified = localStorage.getItem("ageVerified");
      return ageVerified === null;
    }
    return true; // Por defecto mostrar el modal
  });

  const handleAgeVerification = (verified: boolean) => {
    localStorage.setItem("ageVerified", verified.toString());
    setShowModal(false);

    if (!verified) {
      // Redirigir a una página externa o mostrar mensaje de edad no permitida
      window.location.href = "https://www.google.com";
    }
  };

  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(181, 142, 49, 0.8)",
      }}
    >
      <div
        className="relative bg-black rounded-[14px] overflow-hidden"
        style={{
          width: "582px",
          height: "626px",
        }}
      >
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src="/images/modales/fondo-modal-mayor-de-edad.png"
            alt="Fondo modal verificación de edad"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Contenido del modal */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 text-center">
          {/* Pregunta principal */}
          <h2 className="text-white text-3xl font-bold mb-6 leading-tight">
            ¿Eres mayor de edad?
          </h2>

          {/* Texto de descargo */}
          <p className="text-white text-sm mb-8 max-w-md leading-relaxed opacity-90">
            Al confirmar tu respuesta, declaras que tienes la edad legal
            requerida para consumir bebidas alcohólicas en tu país.
          </p>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              onClick={() => handleAgeVerification(true)}
              className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 min-w-[120px]"
            >
              Sí, lo soy
            </button>
            <button
              onClick={() => handleAgeVerification(false)}
              className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 min-w-[120px]"
            >
              No, lo soy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
