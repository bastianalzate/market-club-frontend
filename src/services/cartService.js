import { API_CONFIG, getSessionHeaders, getOrCreateSessionId } from '../config/api';

export class CartService {
    static async getCart() {
        try {
            // Asegurar que tenemos session_id antes de hacer la petición
            const sessionId = getOrCreateSessionId();
            console.log('🛒 Session ID:', sessionId);
            
            const headers = getSessionHeaders();
            console.log('🛒 Headers:', headers);
            
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART.GET}`, {
                method: 'GET',
                headers: headers
            });
            
            console.log('🛒 Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
                console.error('🛒 Error response:', errorData);
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('🛒 Cart data:', result);
            return result;
        } catch (error) {
            console.error('🛒 Error getting cart:', error);
            throw error;
        }
    }

    static async addProduct(productId, quantity = 1) {
        try {
            console.log(`🛒 Adding product ${productId} with quantity ${quantity}`);
            
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART.ADD}`, {
                method: 'POST',
                headers: getSessionHeaders(),
                body: JSON.stringify({
                    product_id: productId,
                    quantity: quantity
                })
            });
            
            console.log('🛒 Add product response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
                console.error('🛒 Add product error:', errorData);
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('🛒 Add product result:', result);
            return result;
        } catch (error) {
            console.error('🛒 Error adding product to cart:', error);
            throw error;
        }
    }

    static async updateQuantity(productId, quantity) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART.UPDATE}`, {
                method: 'PUT',
                headers: getSessionHeaders(),
                body: JSON.stringify({
                    product_id: productId,
                    quantity: quantity
                })
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error updating cart quantity:', error);
            throw error;
        }
    }

    static async removeProduct(productId) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART.REMOVE}`, {
                method: 'DELETE',
                headers: getSessionHeaders(),
                body: JSON.stringify({
                    product_id: productId
                })
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error removing product from cart:', error);
            throw error;
        }
    }

    static async clearCart() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART.CLEAR}`, {
                method: 'DELETE',
                headers: getSessionHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    }

    static async getCartSummary() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART.SUMMARY}`, {
                method: 'GET',
                headers: getSessionHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error getting cart summary:', error);
            throw error;
        }
    }

    static async syncCart() {
        try {
            // Para sincronización necesitamos tanto el token como el session_id
            const headers = getSessionHeaders();
            const token = localStorage.getItem('token');
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART.SYNC}`, {
                method: 'POST',
                headers: headers
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error syncing cart:', error);
            throw error;
        }
    }
}
