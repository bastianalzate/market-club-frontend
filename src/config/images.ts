/**
 * Configuración centralizada de imágenes del proyecto
 * Organizada por arquitectura basada en features
 */

export const IMAGE_PATHS = {
  // Imágenes de la página principal
  HOME: {
    HERO: '/images/home/hero-bg.jpg',
    BEER_CLUB: '/images/home/club-cervecero.png',
    BRANDS: '/images/home/brands-bg.jpg',
  },

  // Imágenes de productos
  PRODUCTS: {
    PLACEHOLDER: '/images/products/placeholder.jpg',
    CATEGORIES: '/images/products/categories/',
    THUMBNAILS: '/images/products/thumbnails/',
  },

  // Logos de marcas
  BRANDS: {
    LOGOS: '/images/brands/logos/',
    BANNERS: '/images/brands/banners/',
  },

  // Elementos de UI
  UI: {
    ICONS: '/images/ui/icons/',
    BUTTONS: '/images/ui/buttons/',
    BACKGROUNDS: '/images/ui/backgrounds/',
  },

  // Imágenes comunes compartidas
  COMMON: {
    LOGO: '/images/common/logo.png',
    FAVICON: '/images/common/favicon.ico',
    PLACEHOLDER: '/images/common/placeholder.jpg',
  },
} as const;

/**
 * Función helper para construir rutas de imágenes dinámicas
 */
export const getImagePath = (category: keyof typeof IMAGE_PATHS, subcategory?: string, filename?: string): string => {
  const basePath = IMAGE_PATHS[category];
  
  if (typeof basePath === 'string') {
    return basePath;
  }
  
  if (subcategory && typeof basePath === 'object') {
    const subPath = (basePath as any)[subcategory];
    if (typeof subPath === 'string') {
      return filename ? `${subPath}${filename}` : subPath;
    }
  }
  
  // If basePath is an object and no valid subcategory, throw an error
  throw new Error(`Invalid image path: category="${category}", subcategory="${subcategory}". When category is an object, a valid subcategory must be provided.`);
};

/**
 * Rutas para imágenes importadas desde src/assets
 */
export const ASSET_IMAGE_PATHS = {
  HOME: {
    HERO: '/src/assets/images/home/hero-bg.jpg',
    BEER_CLUB: '/src/assets/images/home/club-cervecero.png',
  },
  PRODUCTS: {
    PLACEHOLDER: '/src/assets/images/products/placeholder.jpg',
  },
  BRANDS: {
    LOGOS: '/src/assets/images/brands/',
  },
} as const;
