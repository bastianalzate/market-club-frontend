// Configuración de tipografías para Market Club

export const FONT_CONFIG = {
  // Tipografía principal
  PRIMARY: 'oswald',
  PRIMARY_FAMILY: 'var(--font-oswald)',
  
  // Tipografía secundaria - Lato
  SECONDARY: 'lato',
  SECONDARY_FAMILY: 'var(--font-lato)',
  
  // Tipografía de sistema
  SANS: 'sans',
  SANS_FAMILY: 'var(--font-geist-sans)',
  
  // Tipografía monoespaciada
  MONO: 'mono',
  MONO_FAMILY: 'var(--font-geist-mono)',
} as const;

// Clases de utilidad para tipografías
export const FONT_CLASSES = {
  PRIMARY: 'font-oswald',
  SECONDARY: 'font-lato',
  SANS: 'font-sans',
  MONO: 'font-mono',
} as const;

// Variables de entorno para tipografías
export const FONT_ENV_VARS = {
  PRIMARY_FONT: process.env.NEXT_PUBLIC_PRIMARY_FONT || 'Oswald',
  SECONDARY_FONT: process.env.NEXT_PUBLIC_SECONDARY_FONT || 'Lato',
  SECONDARY_FONT_FAMILY: process.env.NEXT_PUBLIC_SECONDARY_FONT_FAMILY || 'var(--font-lato)',
} as const;
