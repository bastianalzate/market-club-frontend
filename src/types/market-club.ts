export interface BannerConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export interface HeroSectionConfig {
  title: string;
  subtitle?: string;
  description: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  image: string;
  buttonText: string;
  buttonColor?: string;
  imagePosition?: 'left' | 'right';
}

export interface SubscriptionSectionConfig {
  plans: SubscriptionPlan[];
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonColor?: string;
  isHighlighted?: boolean;
}

export interface PricingSectionConfig {
  plans: PricingPlan[];
  backgroundColor?: string;
}

export interface MarketClubPageConfig {
  banner: BannerConfig;
  heroSection: HeroSectionConfig;
  subscriptionSection: SubscriptionSectionConfig;
  pricingSection: PricingSectionConfig;
}
