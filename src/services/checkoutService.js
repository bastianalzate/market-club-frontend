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
        console.log('📦 Token exists:', !!localStorage.getItem('token'));
        console.log('📦 Authorization header:', headers['Authorization']);
        
        // Transformar datos al formato que espera el backend
        const backendShippingAddress = {
            name: `${shippingAddress.first_name} ${shippingAddress.last_name}`.trim(),
            email: shippingAddress.email,
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
        
        // El backend ahora maneja automáticamente la autenticación opcional
        console.log('📦 Backend will handle user authentication automatically via Authorization header');
        
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
