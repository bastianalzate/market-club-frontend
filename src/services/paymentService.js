// services/paymentService.js
import { API_CONFIG, getAuthHeaders } from '../config/api';

export class PaymentService {
    // Procesar pago (método temporal hasta implementar Wompi)
    static async processPayment(orderId, totalAmount, paymentMethod = 'credit_card') {
        console.log('💳 Processing payment for order:', orderId);
        
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENTS.PROCESS}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                order_id: orderId,
                amount: totalAmount,
                payment_method: paymentMethod,
                currency: 'COP'
            })
        });
        
        console.log('💳 Payment processing response:', response.status);
        const data = await response.json();
        console.log('💳 Payment processing data:', data);
        
        return data;
    }

    // Crear sesión de pago con Wompi (flujo simplificado)
    static async createPaymentSession(orderId, totalAmount, redirectUrl, customerData = {}) {
        console.log('💳 Creating Wompi payment session for order:', orderId);
        
        // Flujo simplificado: el backend obtiene los datos del cliente automáticamente
        const requestBody = {
            order_id: orderId,
            amount: totalAmount,
            currency: 'COP',
            redirect_url: redirectUrl
        };
        
        // Solo agregar datos del cliente si están disponibles (opcional)
        if (customerData.email) {
            requestBody.customer_email = customerData.email;
        }
        if (customerData.name) {
            requestBody.customer_name = customerData.name;
        }
        if (customerData.phone) {
            requestBody.customer_phone = customerData.phone;
        }
        
        console.log('💳 Payment session request body:', requestBody);
        
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENTS.CREATE_SESSION}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(requestBody)
        });
        
        console.log('💳 Payment session response:', response.status);
        const data = await response.json();
        console.log('💳 Payment session data:', data);
        
        return data;
    }

    // Verificar el estado del pago después de que Wompi redirige
    static async verifyPayment(transactionId) {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENTS.VERIFY}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                transaction_id: transactionId
            })
        });
        return response.json();
    }

    // Obtener información de la transacción por referencia
    static async getTransactionByReference(reference) {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENTS.TRANSACTION_BY_REFERENCE}`, {
            method: 'GET',
            headers: getAuthHeaders(),
            params: new URLSearchParams({ reference })
        });
        return response.json();
    }

    // Confirmar orden después de pago exitoso
    static async confirmOrder(orderId, transactionId) {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENTS.CONFIRM_ORDER}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                order_id: orderId,
                transaction_id: transactionId
            })
        });
        return response.json();
    }
}
