"use client";

import { Headphones, Shield, Package } from "lucide-react";

export default function ServicesBanner() {
  return (
    <section className="py-16 bg-black">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Sección 1: Atención al Cliente */}
          <div className="text-center md:text-left">
            <div className="flex flex-col items-center md:items-start space-y-4">
              {/* Icono */}
              <div className="w-16 h-16 flex items-center justify-center">
                <Headphones className="w-12 h-12 text-white" />
              </div>

              {/* Contenido */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                  Atención al Cliente
                </h3>
                <p className="text-lg text-white font-medium">
                  ¿Necesitas Ayuda?
                </p>
                <p className="text-sm text-white text-gray-300 leading-relaxed">
                  Puedes Escribirnos Por Whatsapp O A Través De Nuestras Redes.
                </p>
              </div>
            </div>
          </div>

          {/* Sección 2: Pago Seguro */}
          <div className="text-center md:text-left">
            <div className="flex flex-col items-center md:items-start space-y-4">
              {/* Icono */}
              <div className="w-16 h-16 flex items-center justify-center">
                <Shield className="w-12 h-12 text-white" />
              </div>

              {/* Contenido */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                  Pago Seguro
                </h3>
                <p className="text-lg text-white font-medium">
                  Seguro Y Rápido
                </p>
                <p className="text-sm text-white text-gray-300 leading-relaxed">
                  Transacciones 100% Seguras.
                </p>
              </div>
            </div>
          </div>

          {/* Sección 3: Devoluciones */}
          <div className="text-center md:text-left">
            <div className="flex flex-col items-center md:items-start space-y-4">
              {/* Icono */}
              <div className="w-16 h-16 flex items-center justify-center">
                <Package className="w-12 h-12 text-white" />
              </div>

              {/* Contenido */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                  Devoluciones
                </h3>
                <p className="text-lg text-white font-medium">Fácil Y Gratis</p>
                <p className="text-sm text-white text-gray-300 leading-relaxed">
                  100% De Garantía De Devolución De Dinero.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
