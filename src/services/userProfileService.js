import { API_CONFIG, getSessionHeaders } from '../config/api';

export class UserProfileService {
    // 1. Datos del Usuario
    static async getUserProfile() {
        try {
            const headers = getSessionHeaders();
            console.log('🔑 Request headers:', headers);
            console.log('🌐 Requesting:', `${API_CONFIG.BASE_URL}/user/profile`);
            
            // Verificar si el token existe
            const token = localStorage.getItem('auth_token');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }
            
            const response = await fetch(`${API_CONFIG.BASE_URL}/user/profile`, {
                method: 'GET',
                headers: headers
            });

            console.log('📡 Response status:', response.status);
            console.log('📡 Response ok:', response.ok);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
                console.error('❌ API Error:', errorData);
                
                // Si es error 401, limpiar el token
                if (response.status === 401) {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user_id');
                    localStorage.removeItem('user');
                }
                
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ API Response:', result);
            return result;
        } catch (error) {
            console.error('❌ Error getting user profile:', error);
            throw error;
        }
    }

    static async updateUserProfile(profileData) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/user/profile`, {
                method: 'PUT',
                headers: getSessionHeaders(),
                body: JSON.stringify(profileData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    }

    static async changePassword(passwordData) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/user/password`, {
                method: 'PUT',
                headers: getSessionHeaders(),
                body: JSON.stringify(passwordData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    }

    // 2. Órdenes del Usuario
    static async getUserOrders(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (params.page) queryParams.append('page', params.page);
            if (params.per_page) queryParams.append('per_page', params.per_page);
            if (params.status) queryParams.append('status', params.status);
            if (params.search) queryParams.append('search', params.search);

            const url = `${API_CONFIG.BASE_URL}/user/orders${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: getSessionHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error getting user orders:', error);
            throw error;
        }
    }

    static async getOrderDetails(orderId) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/user/orders/${orderId}`, {
                method: 'GET',
                headers: getSessionHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error getting order details:', error);
            throw error;
        }
    }

    // 3. Productos Favoritos
    static async getUserFavorites(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (params.page) queryParams.append('page', params.page);
            if (params.per_page) queryParams.append('per_page', params.per_page);
            if (params.search) queryParams.append('search', params.search);

            const url = `${API_CONFIG.BASE_URL}/user/favorites${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: getSessionHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error getting user favorites:', error);
            throw error;
        }
    }

    static async addToFavorites(productId) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/user/favorites`, {
                method: 'POST',
                headers: getSessionHeaders(),
                body: JSON.stringify({ product_id: productId })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error adding to favorites:', error);
            throw error;
        }
    }

    static async removeFromFavorites(productId) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/user/favorites/${productId}`, {
                method: 'DELETE',
                headers: getSessionHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error removing from favorites:', error);
            throw error;
        }
    }

    // 4. Configuraciones del Usuario
    static async getUserSettings() {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/user/settings`, {
                method: 'GET',
                headers: getSessionHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error getting user settings:', error);
            throw error;
        }
    }

    static async updateUserSettings(settingsData) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/user/settings`, {
                method: 'PUT',
                headers: getSessionHeaders(),
                body: JSON.stringify(settingsData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error updating user settings:', error);
            throw error;
        }
    }
}
