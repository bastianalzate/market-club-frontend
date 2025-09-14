// services/checkoutService.js
import { API_CONFIG, getSessionHeaders } from '../config/api';

export class CheckoutService {
    static async calculateShipping(city, state, postalCode) {
        const headers = getSessionHeaders();
        console.log('🚚 Calculate Shipping Headers:', headers);
        
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHECKOUT.CALCULATE_SHIPPING}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                city: city,
                state: state,
                postal_code: postalCode
            })
        });
        
        console.log('🚚 Calculate Shipping Response:', response.status, response.statusText);
        const data = await response.json();
        console.log('🚚 Calculate Shipping Data:', data);
        
        return data;
    }

    static async createOrder(shippingAddress, billingAddress = null, notes = '') {
        const headers = getSessionHeaders();
        console.log('📦 Create Order Headers:', headers);
        
        // Obtener información del usuario si está logueado
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('user_id');
        
        // Transformar datos al formato que espera el backend
        const backendShippingAddress = {
            name: `${shippingAddress.first_name} ${shippingAddress.last_name}`.trim(),
            address: shippingAddress.address_line_1,
            address_line_2: shippingAddress.address_line_2 || '',
            city: shippingAddress.city,
            state: shippingAddress.state,
            postal_code: shippingAddress.postal_code,
            country: shippingAddress.country,
            phone: shippingAddress.phone || ''
        };
        
        // Preparar el body de la petición
        const requestBody = {
            shipping_address: backendShippingAddress,
            billing_address: billingAddress,
            notes: notes
        };
        
        // Si el usuario está logueado, incluir el user_id
        if (token && userId) {
            requestBody.user_id = parseInt(userId);
            console.log('📦 User authenticated, including user_id:', userId);
        } else {
            console.log('📦 User not authenticated, using session_id');
        }
        
        console.log('📦 Transformed Shipping Address:', backendShippingAddress);
        console.log('📦 Request Body:', requestBody);
        
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHECKOUT.CREATE_ORDER}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });
        
        console.log('📦 Create Order Response:', response.status, response.statusText);
        const data = await response.json();
        console.log('📦 Create Order Data:', data);
        console.log('🔍 Order object keys:', Object.keys(data.data?.order || {}));
        console.log('🔍 Order object full:', JSON.stringify(data.data?.order, null, 2));
        
        // Manejar errores del backend
        if (!response.ok || !data.success) {
            const errorMessage = data.message || 'Error al crear la orden';
            console.error('📦 Create Order Error:', errorMessage);
            throw new Error(errorMessage);
        }
        
        return data;
    }
}
