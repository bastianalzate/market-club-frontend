/**
 * Utilidad para obtener headers de autenticación para peticiones HTTP
 */

// Obtener token de autenticación del localStorage
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Obtener headers básicos con autenticación opcional
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('🔑 Token agregado a headers para petición de productos');
  } else {
    console.log('⚠️ No hay token disponible para petición de productos');
  }

  return headers;
};

// Obtener headers para peticiones que requieren autenticación
export const getRequiredAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Token de autenticación requerido');
  }

  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};
