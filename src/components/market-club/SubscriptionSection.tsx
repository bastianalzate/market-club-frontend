import SubscriptionCard from "./SubscriptionCard";
import { SubscriptionSectionConfig } from "@/types/market-club";

interface SubscriptionSectionProps extends SubscriptionSectionConfig {
  containerClassName?: string;
}

export default function SubscriptionSection({ 
  plans,
  containerClassName = "bg-white py-16 px-4"
}: SubscriptionSectionProps) {
  return (
    <div className={containerClassName}>
      <div className="max-w-7xl mx-auto">
        <div className="space-y-12">
          {plans.map((plan) => (
            <SubscriptionCard
              key={plan.id}
              {...plan}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
