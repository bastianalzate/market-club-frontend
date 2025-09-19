import { useMemo, useState } from "react";
import { PricingPlan } from "@/types/market-club";

interface PricingCardProps extends PricingPlan {
  className?: string;
  onActionClick?: () => void;
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
  onActionClick
}: PricingCardProps) {
  const [expanded, setExpanded] = useState(false);
  const MAX_CHARS = 220;
  const truncated = useMemo(() => {
    if (!description) return "";
    if (expanded) return description;
    if (description.length <= MAX_CHARS) return description;
    return description.slice(0, MAX_CHARS).trimEnd() + "…";
  }, [description, expanded]);
  return (
    <div className={`${
      isHighlighted ? 'bg-black text-white' : 'bg-white'
    } rounded-lg p-8 flex flex-col h-full ${className}`}>
      {/* Header alineado */}
      <div 
        className="mb-6 grid"
        style={{ gridTemplateRows: 'auto 1fr auto', minHeight: 240 }}
      >
        <h3 
          className={`mb-4 ${isHighlighted ? 'text-white' : 'text-black'}`}
          style={{
            fontFamily: "var(--font-oswald)",
            fontSize: "18px",
            fontWeight: 600
          }}
        >
          {name}
        </h3>
        
        <p 
          className={`text-sm ${isHighlighted ? 'text-gray-300' : 'text-gray-600'}`}
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "1.4"
          }}
        >
          {truncated}
          {description && description.length > MAX_CHARS && (
            <button
              type="button"
              className={`ml-1 text-xs underline align-baseline ${isHighlighted ? 'text-gray-300' : 'text-gray-700'}`}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? 'Ver menos' : 'Ver más'}
            </button>
          )}
        </p>

        <div className="mt-6">
          <span 
            className={`${isHighlighted ? 'text-white' : 'text-black'}`}
            style={{
              fontFamily: "var(--font-oswald)",
              fontSize: "36px",
              fontWeight: 700
            }}
          >
            {price}
          </span>
          <span 
            className={`ml-2 ${isHighlighted ? 'text-gray-300' : 'text-gray-600'}`}
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "14px",
              fontWeight: 400
            }}
          >
            {period}
          </span>
        </div>
      </div>

      {/* Botón en posición consistente */}
      <div className="mb-6">
        <button
          className={`w-full py-3 px-4 rounded-md font-medium transition-opacity hover:opacity-90 ${
            isHighlighted ? 'bg-white text-black' : 'text-white'
          }`}
          style={{
            backgroundColor: isHighlighted ? 'white' : buttonColor,
            fontFamily: "var(--font-inter)",
            fontSize: "14px",
            fontWeight: 600
          }}
          onClick={onActionClick}
        >
          {buttonText}
        </button>
      </div>

      {/* Features */}
      <div className="flex-1">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="mr-3 mt-1 flex-shrink-0">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: isHighlighted ? 'white' : '#B58E315C' }}
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="#846008" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <span 
                className={`${isHighlighted ? 'text-gray-300' : 'text-gray-700'}`}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: "1.4"
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
