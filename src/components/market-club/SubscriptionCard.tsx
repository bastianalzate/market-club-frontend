import Image from "next/image";
import { SubscriptionPlan } from "@/types/market-club";

interface SubscriptionCardProps extends SubscriptionPlan {
  className?: string;
  onSubscribeClick?: (planId: string) => void;
  isBusy?: boolean;
}

export default function SubscriptionCard({
  name,
  price,
  description,
  features,
  image,
  buttonText,
  buttonColor = "#B58E31",
  id,
  onSubscribeClick,
  imagePosition = "left",
  className = "",
  isBusy = false,
}: SubscriptionCardProps) {
  const isImageLeft = imagePosition === "left";
  const isMaestroPlan = name.includes("Maestro");

  return (
    <div
      className={`bg-white rounded-lg overflow-hidden max-w-5xl mx-auto relative ${className}`}
    >
      <div
        className={`flex flex-row ${!isImageLeft ? "flex-row-reverse" : ""}`}
      >
        {/* Imagen del plan */}
        <div className="w-1/2 md:w-2/5 relative overflow-hidden rounded-3xl">
          {/* Badge Premium para Maestro Cervecero - encima de la imagen */}
          {isMaestroPlan && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div
                className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider shadow-xl"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                <span className="text-yellow-800">⭐</span> Premium
              </div>
            </div>
          )}
          <Image
            src={image}
            alt={`Plan ${name}`}
            width={300}
            height={450}
            className="w-full h-full object-contain rounded-3xl"
          />
        </div>

        {/* Contenido del plan */}
        <div className="w-1/2 md:w-3/5 p-3 md:p-10 lg:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-4 flex-wrap">
            <h3
              className="text-black text-[14px] md:text-[32px]"
              style={{
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
              }}
            >
              {name}:
            </h3>
          </div>

          <div
            className="text-black mb-1 md:mb-4 text-[13px] md:text-[28px]"
            style={{
              fontFamily: "var(--font-oswald)",
              fontWeight: 400,
            }}
          >
            {price}
          </div>

          <p
            className="text-gray-700 mb-2 md:mb-6 text-left text-[9px] md:text-[16px] whitespace-pre-line"
            style={{
              fontFamily: "var(--font-lato)",
              fontWeight: 400,
              lineHeight: "1.2",
            }}
          >
            {description}
          </p>

          <div className="mb-2 md:mb-6">
            <h4
              className="text-black mb-1 md:mb-3 text-[9px] md:text-[16px]"
              style={{
                fontFamily: "var(--font-lato)",
                fontWeight: 600,
              }}
            >
              Beneficios:
            </h4>
            <ul className="space-y-0.5 md:space-y-2">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="text-gray-700 text-[8px] md:text-[14px]"
                  style={{
                    fontFamily: "var(--font-lato)",
                    fontWeight: 400,
                    lineHeight: "1.2",
                  }}
                >
                  • {feature}
                </li>
              ))}
            </ul>
          </div>

          <button
            className="px-4 py-2 md:w-40 md:px-6 md:py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity cursor-pointer text-[10px] md:text-[16px]"
            style={{
              backgroundColor: buttonColor,
              fontFamily: "var(--font-lato)",
              fontWeight: 600,
            }}
            onClick={() => onSubscribeClick?.(id as unknown as string)}
            disabled={isBusy}
          >
            {isBusy ? "Procesando…" : buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
