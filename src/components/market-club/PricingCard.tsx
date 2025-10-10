import { useMemo, useState } from "react";
import { PricingPlan } from "@/types/market-club";

interface PricingCardProps extends PricingPlan {
  className?: string;
  onActionClick?: () => void;
  isBusy?: boolean;
}

export default function PricingCard({
  name,
  price,
  period,
  description,
  features,
  buttonText,
  buttonColor = "#B58E31",
  isHighlighted = false,
  className = "",
  onActionClick,
  isBusy = false,
}: PricingCardProps) {
  // Función para obtener los iconos de cerveza según el plan
  const getBeerIcons = (planName: string) => {
    if (planName.includes("Curioso")) return "🍺";
    if (planName.includes("Coleccionista")) return "🍺🍺";
    if (planName.includes("Maestro")) return "🍺🍺🍺";
    return "🍺";
  };

  // Función para determinar si es el plan Maestro
  const isMaestroPlan = name.includes("Maestro");
  const [expanded, setExpanded] = useState(false);
  const MAX_CHARS = 220;
  const truncated = useMemo(() => {
    if (!description) return "";
    if (expanded) return description;
    if (description.length <= MAX_CHARS) return description;
    return description.slice(0, MAX_CHARS).trimEnd() + "…";
  }, [description, expanded]);
  return (
    <div
      className={`${
        isHighlighted ? "bg-black text-white" : "bg-white"
      } rounded-lg p-8 flex flex-col h-full relative ${className}`}
    >
      {/* Estrella dorada para Maestro Cervecero */}
      {isMaestroPlan && (
        <div className="absolute top-4 right-4 z-10">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
            <svg 
              className="w-5 h-5 text-yellow-800" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      )}
      {/* Header alineado */}
      <div
        className="mb-6 grid"
        style={{ gridTemplateRows: "auto 1fr auto", minHeight: 240 }}
      >
        <h3
          className={`mb-4 ${isHighlighted ? "text-white" : "text-black"}`}
          style={{
            fontFamily: "var(--font-oswald)",
            fontSize: "18px",
            fontWeight: 600,
          }}
        >
          {name} <span className="text-2xl ml-2">{getBeerIcons(name)}</span>
        </h3>

        <p
          className={`text-sm ${
            isHighlighted ? "text-gray-300" : "text-gray-600"
          }`}
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "1.4",
          }}
        >
          {truncated}
          {description && description.length > MAX_CHARS && (
            <button
              type="button"
              className={`ml-1 text-xs underline align-baseline ${
                isHighlighted ? "text-gray-300" : "text-gray-700"
              }`}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Ver menos" : "Ver más"}
            </button>
          )}
        </p>

        <div className="mt-6">
          <span
            className={`${isHighlighted ? "text-white" : "text-black"}`}
            style={{
              fontFamily: "var(--font-oswald)",
              fontSize: "36px",
              fontWeight: 700,
            }}
          >
            {price}
          </span>
          <span
            className={`ml-2 ${
              isHighlighted ? "text-gray-300" : "text-gray-600"
            }`}
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "14px",
              fontWeight: 400,
            }}
          >
            {period}
          </span>
        </div>
      </div>

      {/* Botón en posición consistente */}
      <div className="mb-6">
        <button
          className={`w-full py-3 px-4 rounded-md font-medium transition-all duration-200 hover:scale-105 cursor-pointer ${
            isMaestroPlan 
              ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg hover:shadow-xl" 
              : isHighlighted 
                ? "bg-white text-black hover:bg-gray-100" 
                : "text-white hover:opacity-90"
          }`}
          style={{
            backgroundColor: isMaestroPlan 
              ? undefined 
              : isHighlighted 
                ? "white" 
                : buttonColor,
            fontFamily: "var(--font-inter)",
            fontSize: "14px",
            fontWeight: 600,
          }}
          onClick={onActionClick}
          disabled={isBusy}
        >
          {isBusy ? "Procesando…" : buttonText}
        </button>
      </div>

      {/* Features */}
      <div className="flex-1">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <div className="mr-3 flex-shrink-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: isHighlighted ? "white" : "#B58E315C",
                  }}
                >
                  <svg className="w-4 h-4" fill="#846008" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <span
                className={`${
                  isHighlighted ? "text-gray-300" : "text-gray-700"
                }`}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: "1.4",
                }}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
