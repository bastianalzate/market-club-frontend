import { useState, useEffect, useCallback } from 'react';
import { UserProfileService } from '../services/userProfileService';
import { useProfileContext } from '../contexts/ProfileContext';

// Interfaces para tipado
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  is_wholesaler: boolean;
  created_at: string;
  updated_at: string;
  profile_image?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
}

interface UserStats {
  total_orders: number;
  total_spent: number;
  favorite_products_count: number;
  member_since: string;
  last_order_date?: string;
  average_order_value: number;
}

interface Order {
  id: string;
  order_number: string;
  status: 'Pendiente' | 'Procesando' | 'En camino' | 'Entregado' | 'Cancelado';
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  created_at: string;
  updated_at: string;
  shipping_address: {
    first_name: string;
    last_name: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
  };
  tracking_number?: string;
  estimated_delivery?: string;
  items: {
    id: number;
    product_id: number;
    product_name: string;
    product_image?: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[];
}

interface FavoriteProduct {
  id: number;
  product_id: number;
  user_id: number;
  added_at: string;
  product: {
    id: number;
    name: string;
    price: number;
    current_price: number;
    image?: string;
    image_url?: string;
    brand: string;
    category: string;
    in_stock: boolean;
    stock_quantity: number;
    description?: string;
    alcohol_content?: number;
    volume?: number;
    origin?: string;
  };
}

interface UserSettings {
  notification_settings: {
    email_notifications: boolean;
    sms_notifications: boolean;
    order_updates: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
  privacy_settings: {
    profile_visibility: 'public' | 'private' | 'friends';
    show_orders: boolean;
    show_favorites: boolean;
  };
}

interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export const useUserProfile = () => {
  const { profile, updateProfile: updateProfileContext } = useProfileContext();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar perfil del usuario
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await UserProfileService.getUserProfile();
      
      if (response.success) {
        // Manejar diferentes estructuras de respuesta del backend
        const userData = response.data.user || response.data;
        const statsData = response.data.stats || response.data;
        
        updateProfileContext(userData);
        setStats(statsData);
      } else {
        throw new Error(response.message || 'Error al cargar el perfil');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar perfil
  const updateProfile = useCallback(async (profileData: Partial<UserProfile>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await UserProfileService.updateUserProfile(profileData);
      
      if (response.success) {
        // Actualizar el contexto global con los nuevos datos del backend
        updateProfileContext(response.data);
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Cambiar contraseña
  const changePassword = useCallback(async (passwordData: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await UserProfileService.changePassword(passwordData);
      
      if (response.success) {
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar perfil al montar el componente
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    stats,
    loading,
    error,
    loadProfile,
    updateProfile,
    changePassword,
  };
};

export const useUserOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar órdenes del usuario
  const loadOrders = useCallback(async (params: {
    page?: number;
    per_page?: number;
    status?: string;
    search?: string;
  } = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await UserProfileService.getUserOrders(params);
      
      if (response.success) {
        setOrders(response.data.orders);
        setPagination(response.data.pagination);
      } else {
        throw new Error(response.message || 'Error al cargar las órdenes');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener detalles de una orden específica
  const getOrderDetails = useCallback(async (orderId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await UserProfileService.getOrderDetails(orderId);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Error al cargar los detalles de la orden');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    pagination,
    loading,
    error,
    loadOrders,
    getOrderDetails,
  };
};

export const useUserFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar favoritos del usuario
  const loadFavorites = useCallback(async (params: {
    page?: number;
    per_page?: number;
    search?: string;
  } = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await UserProfileService.getUserFavorites(params);
      
      if (response.success) {
        setFavorites(response.data.favorites);
        setPagination(response.data.pagination);
      } else {
        throw new Error(response.message || 'Error al cargar los favoritos');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Agregar a favoritos
  const addToFavorites = useCallback(async (productId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await UserProfileService.addToFavorites(productId);
      
      if (response.success) {
        // Recargar la lista de favoritos
        await loadFavorites();
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Error al agregar a favoritos');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [loadFavorites]);

  // Remover de favoritos
  const removeFromFavorites = useCallback(async (productId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await UserProfileService.removeFromFavorites(productId);
      
      if (response.success) {
        // Recargar la lista de favoritos
        await loadFavorites();
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Error al remover de favoritos');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [loadFavorites]);

  return {
    favorites,
    pagination,
    loading,
    error,
    loadFavorites,
    addToFavorites,
    removeFromFavorites,
  };
};

export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar configuraciones del usuario
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await UserProfileService.getUserSettings();
      
      if (response.success) {
        setSettings(response.data);
      } else {
        throw new Error(response.message || 'Error al cargar las configuraciones');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar configuraciones
  const updateSettings = useCallback(async (settingsData: Partial<UserSettings>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await UserProfileService.updateUserSettings(settingsData);
      
      if (response.success) {
        setSettings(response.data);
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Error al actualizar las configuraciones');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar configuraciones al montar el componente
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    error,
    loadSettings,
    updateSettings,
  };
};
