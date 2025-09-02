export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  brand: string;
  alcoholContent: number;
  volume: number;
  style: string;
  origin: string;
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface ProductFilter {
  category?: string;
  brand?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  alcoholContent?: {
    min: number;
    max: number;
  };
  style?: string;
  origin?: string;
  inStock?: boolean;
  featured?: boolean;
  sortBy?: 'name' | 'price' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductSearchParams {
  query?: string;
  page?: number;
  limit?: number;
  filters?: ProductFilter;
}

