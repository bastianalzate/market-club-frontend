import { constants } from '../config/constants';
import { getAuthHeaders } from '../utils/authHeaders';
import { getOrCreateSessionId } from '../config/api';
import {
  WholesalerCartResponse,
  AddToWholesalerCartPayload,
  UpdateWholesalerCartQuantityPayload,
  RemoveFromWholesalerCartPayload,
  ApplyDiscountPayload,
  AddNotesPayload,
} from '../types/wholesaler-cart';

class WholesalerCartService {
  private baseUrl = `${constants.api_url}/wholesaler/cart`;

  // Obtener el carrito de mayoristas
  async getCart(): Promise<WholesalerCartResponse> {
    const sessionId = getOrCreateSessionId();
    
    const response = await fetch(this.baseUrl, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
        'X-Session-ID': sessionId,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Agregar producto al carrito de mayoristas
  async addProduct(payload: AddToWholesalerCartPayload): Promise<WholesalerCartResponse> {
    const sessionId = getOrCreateSessionId();
    
    const response = await fetch(`${this.baseUrl}/add`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'X-Session-ID': sessionId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: payload.productId,
        quantity: payload.quantity || 1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Actualizar cantidad de un producto
  async updateQuantity(payload: UpdateWholesalerCartQuantityPayload): Promise<WholesalerCartResponse> {
    const sessionId = getOrCreateSessionId();
    
    const response = await fetch(`${this.baseUrl}/update`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'X-Session-ID': sessionId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: payload.productId,
        quantity: payload.quantity,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Remover producto del carrito
  async removeProduct(payload: RemoveFromWholesalerCartPayload): Promise<WholesalerCartResponse> {
    const sessionId = getOrCreateSessionId();
    
    const response = await fetch(`${this.baseUrl}/remove`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        'X-Session-ID': sessionId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: payload.productId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Limpiar carrito
  async clearCart(): Promise<WholesalerCartResponse> {
    const sessionId = getOrCreateSessionId();
    
    const response = await fetch(`${this.baseUrl}/clear`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        'X-Session-ID': sessionId,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Obtener resumen del carrito
  async getSummary(): Promise<WholesalerCartResponse> {
    const sessionId = getOrCreateSessionId();
    
    const response = await fetch(`${this.baseUrl}/summary`, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
        'X-Session-ID': sessionId,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Aplicar descuento especial
  async applyDiscount(payload: ApplyDiscountPayload): Promise<WholesalerCartResponse> {
    const sessionId = getOrCreateSessionId();
    
    const response = await fetch(`${this.baseUrl}/discount`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'X-Session-ID': sessionId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        discount_amount: payload.discountAmount,
        reason: payload.reason,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Agregar notas al carrito
  async addNotes(payload: AddNotesPayload): Promise<WholesalerCartResponse> {
    const sessionId = getOrCreateSessionId();
    
    const response = await fetch(`${this.baseUrl}/notes`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'X-Session-ID': sessionId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notes: payload.notes,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Sincronizar carrito (solo para mayoristas autenticados)
  async syncCart(): Promise<WholesalerCartResponse> {
    const sessionId = getOrCreateSessionId();
    
    const response = await fetch(`${this.baseUrl}/sync`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'X-Session-ID': sessionId,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}

export const wholesalerCartService = new WholesalerCartService();
