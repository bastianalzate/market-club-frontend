// Configuración de Wompi
export const WOMPI_CONFIG = {
  // Clave pública de Wompi (debe venir de variables de entorno)
  PUBLIC_KEY: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || 'pub_test_6j4AFOkyelP8Sb8HsS9u9l7aagAaRak4',
  
  // Merchant ID (debe venir de variables de entorno)
  MERCHANT_ID: process.env.NEXT_PUBLIC_WOMPI_MERCHANT_ID || 'your_merchant_id_here',
  
  // Configuración por defecto
  CURRENCY: 'COP',
  BASE_URL: 'https://checkout.wompi.co',
  
  // URL del widget de Wompi
  WIDGET_URL: 'https://checkout.wompi.co/widget.js',
  
  // URLs de redirección
  getRedirectUrl: (orderId: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    return `${baseUrl}/checkout/success?order_id=${orderId}`;
  },
  
  // URL de redirección para pagos fallidos
  getFailureRedirectUrl: (orderId: string, reason?: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const params = new URLSearchParams({ order_id: orderId });
    if (reason) params.set('reason', reason);
    return `${baseUrl}/checkout/failed?${params.toString()}`;
  },
  
  // URL de redirección para suscripciones
  getSubscriptionRedirectUrl: () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    return `${baseUrl}/club-socios?subscription=success`;
  },
  
  // URL del webhook para notificaciones de Wompi
  getWebhookUrl: () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    return `${baseUrl}/api/webhooks/wompi`;
  }
};

// Validar configuración
export const validateWompiConfig = () => {
  const warnings = [];
  
  if (!WOMPI_CONFIG.PUBLIC_KEY || WOMPI_CONFIG.PUBLIC_KEY === 'pub_test_123456789') {
    warnings.push('⚠️  Wompi: Usando clave pública de prueba. Configura NEXT_PUBLIC_WOMPI_PUBLIC_KEY en producción.');
  }
  
  if (!WOMPI_CONFIG.MERCHANT_ID || WOMPI_CONFIG.MERCHANT_ID === 'your_merchant_id_here') {
    warnings.push('⚠️  Wompi: Merchant ID no configurado. Configura NEXT_PUBLIC_WOMPI_MERCHANT_ID.');
  }
  
  warnings.forEach(warning => console.warn(warning));
  
  return {
    isValid: WOMPI_CONFIG.PUBLIC_KEY && WOMPI_CONFIG.MERCHANT_ID && 
             WOMPI_CONFIG.PUBLIC_KEY !== 'pub_test_123456789' && 
             WOMPI_CONFIG.MERCHANT_ID !== 'your_merchant_id_here',
    isProduction: WOMPI_CONFIG.PUBLIC_KEY.startsWith('pub_prod_'),
    isTest: WOMPI_CONFIG.PUBLIC_KEY.startsWith('pub_test_'),
    warnings
  };
};
