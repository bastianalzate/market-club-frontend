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

  return (
    <div
      className={`bg-white rounded-lg overflow-hidden max-w-5xl mx-auto ${className}`}
    >
      <div
        className={`flex flex-col md:flex-row ${
          !isImageLeft ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* Imagen del plan */}
        <div className="md:w-1/2 relative overflow-hidden">
          <div className="absolute top-4 left-4 z-10">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <Image
            src={image}
            alt={`Plan ${name}`}
            width={600}
            height={600}
            className="w-full h-full object-cover"
            style={{ minHeight: "100%" }}
          />
        </div>

        {/* Contenido del plan */}
        <div className="md:w-1/2 p-10 md:p-12">
          <h3
            className="text-black mb-4"
            style={{
              fontFamily: "var(--font-oswald)",
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            {name}:
          </h3>

          <div
            className="text-black mb-4"
            style={{
              fontFamily: "var(--font-oswald)",
              fontSize: "28px",
              fontWeight: 400,
            }}
          >
            {price}
          </div>

          <p
            className="text-gray-700 mb-6 text-left"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "1.5",
            }}
          >
            {description}
          </p>

          <div className="mb-6">
            <h4
              className="text-black mb-3"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              Incluye:
            </h4>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="text-gray-700"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "14px",
                    fontWeight: 400,
                  }}
                >
                  • {feature}
                </li>
              ))}
            </ul>
          </div>

          <button
            className="px-8 py-3 text-white rounded-md font-medium hover:opacity-90 transition-opacity cursor-pointer"
            style={{
              backgroundColor: buttonColor,
              fontFamily: "var(--font-inter)",
              fontSize: "16px",
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
