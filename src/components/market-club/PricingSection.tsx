import PricingCard from "./PricingCard";
import { PricingSectionConfig } from "@/types/market-club";

interface PricingSectionProps extends PricingSectionConfig {
  containerClassName?: string;
}

export default function PricingSection({ 
  plans,
  backgroundColor = "#B58E31",
  containerClassName
}: PricingSectionProps) {
  const defaultClassName = "py-16 px-4";
  const finalClassName = containerClassName || defaultClassName;

  return (
    <div 
      className={finalClassName}
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              {...plan}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
