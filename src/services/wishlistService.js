import { constants } from '@/config/constants';

class WishlistService {
  constructor() {
    this.baseURL = constants.api_url;
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  // Función para logging condicional
  log(message, ...args) {
    if (this.isDevelopment) {
      console.log(message, ...args);
    }
  }

  warn(message, ...args) {
    if (this.isDevelopment) {
      console.warn(message, ...args);
    }
  }

  error(message, ...args) {
    console.error(message, ...args); // Los errores siempre se muestran
  }

  // Obtener token de autenticación
  getAuthToken() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        this.warn('⚠️ No se encontró token de autenticación');
      } else {
        this.log('🔑 Token de autenticación encontrado');
      }
      return token;
    }
    return null;
  }

  // Headers con autenticación
  getAuthHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  // Toggle favorito (agregar/quitar) - Usando los nuevos endpoints específicos
  async toggleWishlist(productId) {
    try {
      this.log(`🚀 Iniciando toggle para producto ${productId}`);
      
      // Primero verificar si está en favoritos
      const checkResult = await this.checkWishlist(productId);
      const isInFavorites = checkResult.isInWishlist;
      
      this.log(`📋 Producto ${productId} está en favoritos: ${isInFavorites}`);
      
      let response;
      let action;
      
      if (isInFavorites) {
        // Remover de favoritos
        this.log(`🗑️ Removiendo producto ${productId} de favoritos...`);
        response = await fetch(`${this.baseURL}/user/favorites/${productId}`, {
          method: 'DELETE',
          headers: this.getAuthHeaders()
        });
        action = 'removed';
      } else {
        // Agregar a favoritos
        this.log(`❤️ Agregando producto ${productId} a favoritos...`);
        response = await fetch(`${this.baseURL}/user/favorites/${productId}`, {
          method: 'POST',
          headers: this.getAuthHeaders()
        });
        action = 'added';
      }

      this.log(`📡 Respuesta del servidor:`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      const data = await response.json();
      this.log(`📥 Datos recibidos:`, data);
      
      if (!response.ok) {
        this.error(`❌ Error HTTP ${response.status}:`, data);
        throw new Error(data.message || `Error HTTP ${response.status}: ${response.statusText}`);
      }

      // Verificar que la respuesta sea exitosa
      if (!data.success) {
        this.error(`❌ Backend reportó error:`, data);
        throw new Error(data.message || 'El servidor reportó un error');
      }

      this.log(`✅ Operación exitosa: ${action}`);

      // Formatear respuesta para mantener compatibilidad con el hook
      return {
        success: true,
        data: {
          action: action,
          is_in_wishlist: action === 'added',
          total_favorites: data.data?.total_favorites || 0,
          product: data.data?.product || { 
            id: productId, 
            name: 'Producto', 
            price: '0', 
            image: '' 
          }
        },
        message: data.message
      };
    } catch (error) {
      this.error(`💥 Error crítico en toggleWishlist para producto ${productId}:`, {
        error: error.message,
        stack: error.stack,
        name: error.name
      });
      
      return {
        success: false,
        message: error.message || 'Error de conexión. Verifica tu internet y el estado del servidor.',
        error: {
          type: error.name || 'UnknownError',
          details: error.message
        }
      };
    }
  }

  // Obtener lista de favoritos
  async getWishlist() {
    try {
      const response = await fetch(`${this.baseURL}/user/favorites`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener favoritos');
      }

      return {
        success: true,
        data: data.data || []
      };
    } catch (error) {
      console.error('Error en getWishlist:', error);
      return {
        success: false,
        data: [],
        message: error.message || 'Error de conexión'
      };
    }
  }

  // Verificar si un producto está en favoritos
  async checkWishlist(productId) {
    try {
      const response = await fetch(`${this.baseURL}/wishlist/check`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          product_id: productId
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al verificar favoritos');
      }

      return {
        success: true,
        isInWishlist: data.data?.is_in_wishlist || false
      };
    } catch (error) {
      console.error('Error en checkWishlist:', error);
      return {
        success: false,
        isInWishlist: false,
        message: error.message || 'Error de conexión'
      };
    }
  }

  // Mover producto del wishlist al carrito
  async moveToCart(productId, quantity = 1) {
    try {
      const response = await fetch(`${this.baseURL}/wishlist/move-to-cart`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al mover al carrito');
      }

      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error) {
      console.error('Error en moveToCart:', error);
      return {
        success: false,
        message: error.message || 'Error de conexión'
      };
    }
  }

  // Limpiar todos los favoritos
  async clearWishlist() {
    try {
      const response = await fetch(`${this.baseURL}/wishlist/clear`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al limpiar favoritos');
      }

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Error en clearWishlist:', error);
      return {
        success: false,
        message: error.message || 'Error de conexión'
      };
    }
  }
}

export default new WishlistService();
