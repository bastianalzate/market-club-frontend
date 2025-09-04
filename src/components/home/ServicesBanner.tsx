"use client";

import Image from "next/image";

export default function ServicesBanner() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-black">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-14">
          {/* Sección 1: Atención al Cliente */}
          <div className="flex items-center space-x-4 sm:space-x-5 lg:space-x-6 h-full">
            {/* Icono */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center flex-shrink-0">
              <Image
                src="/images/bannerServicios/Icono-01.png"
                alt="Atención al Cliente"
                width={94}
                height={94}
                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[94px] lg:h-[94px]"
              />
            </div>

            {/* Contenido */}
            <div className="flex flex-col justify-start space-y-2 flex-1">
              <h3 
                className="text-white uppercase text-[18px] lg:text-[26px]"
                style={{
                  fontFamily: "var(--font-oswald)",
                  fontWeight: 700,
                  letterSpacing: "1px"
                }}
              >
                Atención al Cliente
              </h3>
              <p 
                className="text-white text-[16px] lg:text-[24px]"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 400
                }}
              >
                ¿Necesitas Ayuda?
              </p>
              <p 
                className="text-white text-[12px] lg:text-[16px]"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 400,
                  lineHeight: "1.4"
                }}
              >
                Puedes Escribirnos Por Whatsapp O A Través De Nuestras Redes.
              </p>
            </div>
          </div>

          {/* Sección 2: Pago Seguro */}
          <div className="flex items-center space-x-4 sm:space-x-5 lg:space-x-6 h-full">
            {/* Icono */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center flex-shrink-0">
              <Image
                src="/images/bannerServicios/Icono-03.png"
                alt="Pago Seguro"
                width={94}
                height={94}
                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[94px] lg:h-[94px]"
              />
            </div>

            {/* Contenido */}
            <div className="flex flex-col justify-start space-y-2 flex-1">
              <h3 
                className="text-white uppercase text-[18px] lg:text-[26px]"
                style={{
                  fontFamily: "var(--font-oswald)",
                  fontWeight: 700,
                  letterSpacing: "1px"
                }}
              >
                Pago Seguro
              </h3>
              <p 
                className="text-white text-[16px] lg:text-[24px]"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 400
                }}
              >
                Seguro Y Rápido
              </p>
              <p 
                className="text-white text-[12px] lg:text-[16px]"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 400,
                  lineHeight: "1.4"
                }}
              >
                Transacciones 100% Seguras.
              </p>
            </div>
          </div>

          {/* Sección 3: Devoluciones */}
          <div className="flex items-center space-x-4 sm:space-x-5 lg:space-x-6 h-full sm:col-span-2 lg:col-span-1">
            {/* Icono */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center flex-shrink-0">
              <Image
                src="/images/bannerServicios/Icono-02.png"
                alt="Devoluciones"
                width={94}
                height={94}
                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[94px] lg:h-[94px]"
                />
            </div>

            {/* Contenido */}
            <div className="flex flex-col justify-start space-y-2 flex-1">
              <h3 
                className="text-white uppercase text-[18px] lg:text-[26px]"
                style={{
                  fontFamily: "var(--font-oswald)",
                  fontWeight: 700,
                  letterSpacing: "1px"
                }}
              >
                Devoluciones
              </h3>
              <p 
                className="text-white text-[16px] lg:text-[24px]"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 400
                }}
              >
                Fácil Y Gratis
              </p>
              <p 
                className="text-white text-[12px] lg:text-[16px]"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 400,
                  lineHeight: "1.4"
                }}
              >
                100% De Garantía De Devolución De Dinero.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
