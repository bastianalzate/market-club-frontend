// Configuración de Wompi
export const WOMPI_CONFIG = {
  // Clave pública de Wompi (debe venir de variables de entorno)
  PUBLIC_KEY: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || 'pub_test_6j4AFOkyelP8Sb8HsS9u9l7aagAaRak4',
  
  // Configuración por defecto
  CURRENCY: 'COP',
  BASE_URL: 'https://checkout.wompi.co',
  WIDGET_URL: 'https://checkout.wompi.co/widget.js',
  
  // URLs de redirección
  getRedirectUrl: (orderId: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    return `${baseUrl}/checkout/success?order_id=${orderId}`;
  },
  
  // URL de redirección para suscripciones
  getSubscriptionRedirectUrl: () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    return `${baseUrl}/suscripciones/exito`;
  }
};

// Validar configuración
export const validateWompiConfig = () => {
  if (!WOMPI_CONFIG.PUBLIC_KEY || WOMPI_CONFIG.PUBLIC_KEY === 'pub_test_123456789') {
    console.warn('⚠️  Wompi: Usando clave pública de prueba. Configura NEXT_PUBLIC_WOMPI_PUBLIC_KEY en producción.');
  }
  
  return {
    isValid: true,
    isProduction: WOMPI_CONFIG.PUBLIC_KEY.startsWith('pub_prod_'),
    isTest: WOMPI_CONFIG.PUBLIC_KEY.startsWith('pub_test_')
  };
};
