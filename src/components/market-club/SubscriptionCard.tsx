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
  const isPremium = name === "Maestro Cervecero";

  return (
    <div
      className={`${
        isPremium ? "bg-gray-900" : "bg-white"
      } rounded-lg overflow-hidden max-w-5xl mx-auto relative ${className}`}
    >
      {/* Badge PREMIUM para Maestro Cervecero */}
      {isPremium && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-yellow-500 text-black px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <span>★</span>
            <span>PREMIUM</span>
          </div>
        </div>
      )}
      <div
        className={`flex flex-row ${!isImageLeft ? "flex-row-reverse" : ""}`}
      >
        {/* Imagen del plan */}
        <div className="w-1/2 md:w-2/5 relative overflow-hidden">
          <Image
            src={image}
            alt={`Plan ${name}`}
            width={300}
            height={450}
            className="w-full h-full object-contain rounded-4xl"
          />
        </div>

        {/* Contenido del plan */}
        <div className="w-1/2 md:w-3/5 p-3 md:p-10 lg:p-12 flex flex-col justify-center">
          <h3
            className={`${
              isPremium ? "text-white" : "text-black"
            } mb-1 md:mb-4 text-[14px] md:text-[32px]`}
            style={{
              fontFamily: "var(--font-oswald)",
              fontWeight: 700,
            }}
          >
            {name}:
          </h3>

          <div
            className={`${
              isPremium ? "text-white" : "text-black"
            } mb-1 md:mb-4 text-[13px] md:text-[28px]`}
            style={{
              fontFamily: "var(--font-oswald)",
              fontWeight: 400,
            }}
          >
            {price}
          </div>

          <p
            className={`${
              isPremium ? "text-gray-300" : "text-gray-700"
            } mb-2 md:mb-6 text-left text-[9px] md:text-[16px] whitespace-pre-line`}
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
              className={`${
                isPremium ? "text-white" : "text-black"
              } mb-1 md:mb-3 text-[9px] md:text-[16px]`}
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
                  className={`${
                    isPremium ? "text-gray-300" : "text-gray-700"
                  } text-[8px] md:text-[14px]`}
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
