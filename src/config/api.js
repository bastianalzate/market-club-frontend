// Base URL de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Endpoints de Carrito
const CART_ENDPOINTS = {
    GET: '/cart',                    // Ver carrito
    ADD: '/cart/add',               // Agregar producto
    ADD_GIFT: '/cart/add-gift',     // Agregar regalo personalizado
    UPDATE: '/cart/update',         // Actualizar cantidad
    REMOVE: '/cart/remove',         // Remover producto
    CLEAR: '/cart/clear',           // Limpiar carrito
    SUMMARY: '/cart/summary',       // Resumen del carrito
    SYNC: '/cart/sync',             // Sincronizar carrito
};

// Endpoints de Checkout
const CHECKOUT_ENDPOINTS = {
    CALCULATE_SHIPPING: '/checkout/calculate-shipping', // Calcular envío
    CREATE_ORDER: '/checkout/create-order', // Crear orden
};

// Endpoints de Pagos
const PAYMENT_ENDPOINTS = {
    CREATE_SESSION: '/payments/wompi/create-session',    // Crear sesión de pago con Wompi
    VERIFY: '/payments/verify',                          // Verificar pago
    PROCESS: '/payments/process',                        // Procesar pago (alternativo)
};

export const API_CONFIG = {
    BASE_URL: API_BASE_URL,
    ENDPOINTS: {
        CART: CART_ENDPOINTS,
        CHECKOUT: CHECKOUT_ENDPOINTS,
        PAYMENTS: PAYMENT_ENDPOINTS,
    }
};

// Utilidades de autenticación
export const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};

export const getSessionHeaders = () => {
    const headers = getAuthHeaders();
    const sessionId = localStorage.getItem('session_id');
    
    if (sessionId) {
        headers['X-Session-ID'] = sessionId;
    }
    
    return headers;
};

// Utilidades de sesión
export const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const getOrCreateSessionId = () => {
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
        sessionId = generateSessionId();
        localStorage.setItem('session_id', sessionId);
    }
    return sessionId;
};
