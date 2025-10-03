"use client";

import {
  ShoppingBag,
  Heart,
  Package,
  TrendingUp,
  Calendar,
  MapPin,
  CreditCard,
  Mail,
  Phone,
  Loader2,
  Crown,
  Star,
  Gift,
  Zap,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useUserProfile, useUserOrders } from "@/hooks/useUserProfile";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/useToast";
import { useEffect, useState } from "react";
import Toast from "@/components/shared/Toast";
import CancelSubscriptionModal from "@/components/shared/CancelSubscriptionModal";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isGuest: boolean;
}

interface PerfilOverviewProps {
  user: User;
}

export default function PerfilOverview({ user }: PerfilOverviewProps) {
  const {
    profile,
    stats,
    loading: profileLoading,
    error: profileError,
    loadProfile,
  } = useUserProfile();
  
  // Estado local para controlar si se está cargando el perfil
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const { orders, loading: ordersLoading, loadOrders } = useUserOrders();
  const {
    plans,
    currentSubscription,
    history,
    loading: subscriptionLoading,
    error: subscriptionError,
    loadPlans,
    loadCurrentSubscription,
    loadHistory,
    subscribe,
    cancelSubscription,
    renewSubscription,
  } = useSubscription();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setIsLoadingProfile(true);
        await loadProfile(); // Cargar datos del perfil
        loadOrders({ per_page: 3 }); // Solo las 3 órdenes más recientes
        loadCurrentSubscription(); // Cargar suscripción actual
        loadPlans(); // Cargar planes disponibles
        loadHistory(); // Cargar historial de suscripciones
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    
    loadAllData();
  }, [loadProfile, loadOrders, loadCurrentSubscription, loadPlans, loadHistory]);

  // El skeleton loader ahora solo aparece en el PerfilHeader
  // Este componente siempre muestra el contenido, incluso mientras se cargan los datos del perfil

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Entregado":
        return "bg-green-100 text-green-800";
      case "En camino":
        return "bg-yellow-100 text-yellow-800";
      case "Procesando":
        return "bg-blue-100 text-blue-800";
      case "Pendiente":
        return "bg-gray-100 text-gray-800";
      case "Cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Funciones para manejar acciones de suscripción
  const handleCancelSubscription = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    const result = await cancelSubscription();
    if (result.success) {
      showSuccess(
        "Suscripción cancelada",
        "Tu suscripción ha sido cancelada exitosamente."
      );
      // Recargar historial después de cancelar
      loadHistory();
    } else {
      showError("Error", result.message);
    }
    setShowCancelModal(false);
  };

  const handleRenewSubscription = async () => {
    const result = await renewSubscription(1); // Renovar por 1 mes
    if (result.success) {
      showSuccess(
        "Suscripción renovada",
        "Tu suscripción ha sido renovada exitosamente."
      );
      // Recargar historial después de renovar
      loadHistory();
    } else {
      showError("Error", result.message);
    }
  };

  const handleSubscribe = async (planId: number) => {
    const result = await subscribe(planId);
    if (result.success) {
      showSuccess(
        "¡Suscripción exitosa!",
        "Te has suscrito exitosamente a Market Club Premium."
      );
      // Recargar historial después de suscribirse
      loadHistory();
    } else {
      showError("Error", result.message);
    }
  };

  // Helper para obtener el plan actual desde los datos del backend
  const getCurrentPlan = () => {
    if (!currentSubscription?.plan?.id || plans.length === 0) {
      return null;
    }
    return (
      plans.find((plan) => plan.id === currentSubscription.plan.id) || null
    );
  };

  // Helper para obtener colores por plan
  const getPlanColor = (planSlug: string) => {
    switch (planSlug) {
      case "curious_brewer":
        return "amber";
      case "collector_brewer":
        return "blue";
      case "master_brewer":
        return "purple";
      default:
        return "gray";
    }
  };

  // Skeleton para la sección de suscripciones
  const SubscriptionSkeleton = () => (
    <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
            <div>
              <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
            </div>
          </div>
          <div className="text-right">
            <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
            <div className="h-3 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/70 rounded-lg p-4">
            <div className="h-4 bg-gray-300 rounded w-32 mb-3"></div>
            <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          </div>
          <div className="bg-white/70 rounded-lg p-4">
            <div className="h-4 bg-gray-300 rounded w-32 mb-3"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-2"></div>
                  <div className="h-3 bg-gray-300 rounded flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mostrar loading si están cargando los datos
  if (profileLoading || ordersLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando información del perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si hay algún problema
  if (profileError) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error al cargar el perfil
              </h3>
              <p className="mt-1 text-sm text-red-700">{profileError}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Pedidos
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.total_orders || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Gastado
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(stats?.total_spent || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Favoritos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.favorite_products_count || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {profile?.is_wholesaler ? "Mayorista desde" : "Miembro desde"}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString("es-CO", {
                        month: "short",
                        year: "numeric",
                      })
                    : user.created_at 
                    ? new Date(user.created_at).toLocaleDateString("es-CO", {
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Sección Market Club Premium */}
        <div className="space-y-6">
          {/* Mostrar skeleton mientras cargan las suscripciones */}
          {subscriptionLoading ? (
            <SubscriptionSkeleton />
          ) : currentSubscription &&
            currentSubscription.is_active &&
            getCurrentPlan() ? (
            <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-xl shadow-sm border border-amber-200 overflow-hidden">
              <div className="relative">
                {/* Patrón de fondo decorativo */}
                <div className="absolute inset-0 opacity-5">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 20px,
                  rgba(181, 142, 49, 0.1) 20px,
                  rgba(181, 142, 49, 0.1) 40px
                )`,
                    }}
                  ></div>
                </div>

                <div className="relative px-6 py-6">
                  {/* Header de la suscripción */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                          getPlanColor(currentSubscription.plan.id) === "purple"
                            ? "bg-gradient-to-br from-purple-500 to-indigo-600"
                            : getPlanColor(currentSubscription.plan.id) ===
                              "blue"
                            ? "bg-gradient-to-br from-blue-500 to-cyan-600"
                            : "bg-gradient-to-br from-amber-400 to-orange-500"
                        }`}
                      >
                        <Crown className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                          {getCurrentPlan()?.name}
                          <Star className="w-5 h-5 text-amber-500 fill-current" />
                        </h2>
                        <p className="text-sm text-gray-600">
                          {formatPrice(currentSubscription.price_paid)} /{" "}
                          {getCurrentPlan()?.period}
                        </p>
                      </div>
                    </div>

                    {/* Estado de la suscripción */}
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-2 h-2 rounded-full animate-pulse ${
                            currentSubscription.status === "active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span
                          className={`text-sm font-semibold ${
                            currentSubscription.status === "active"
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {currentSubscription.status === "active"
                            ? "Activa"
                            : "Inactiva"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Renovación:{" "}
                        {new Date(
                          currentSubscription.ends_at
                        ).toLocaleDateString("es-CO", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-amber-600 font-medium">
                        {currentSubscription.days_remaining} días restantes
                      </p>
                    </div>
                  </div>

                  {/* Beneficios dinámicos según el plan */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-amber-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="w-4 h-4 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">
                          Descripción del Plan
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {getCurrentPlan()?.description}
                      </p>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-amber-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">
                          Beneficios Incluidos
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {getCurrentPlan()?.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm text-gray-600">{feature}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Progreso del mes */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-amber-100">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        Estado de Suscripción
                      </h3>
                      <span className="text-sm font-medium text-amber-700">
                        Beneficios activos
                      </span>
                    </div>

                    {/* Indicador de estado activo */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          getPlanColor(currentSubscription.plan.id) === "purple"
                            ? "bg-gradient-to-r from-purple-400 to-indigo-500"
                            : getPlanColor(currentSubscription.plan.id) ===
                              "blue"
                            ? "bg-gradient-to-r from-blue-400 to-cyan-500"
                            : "bg-gradient-to-r from-amber-400 to-orange-500"
                        }`}
                        style={{
                          width: "100%", // Siempre 100% para suscripción activa
                        }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Inició</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(
                            currentSubscription.starts_at
                          ).toLocaleDateString("es-CO", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Finaliza</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(
                            currentSubscription.ends_at
                          ).toLocaleDateString("es-CO", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      onClick={handleRenewSubscription}
                      disabled={profileLoading || subscriptionLoading}
                      className={`flex-1 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                        getPlanColor(currentSubscription.plan.id) === "purple"
                          ? "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 focus:ring-purple-500"
                          : getPlanColor(currentSubscription.plan.id) === "blue"
                          ? "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 focus:ring-blue-500"
                          : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 focus:ring-amber-500"
                      }`}
                    >
                      {profileLoading || subscriptionLoading
                        ? "Procesando..."
                        : "Renovar Suscripción"}
                    </button>
                    <button
                      onClick={handleCancelSubscription}
                      disabled={profileLoading || subscriptionLoading}
                      className="flex-1 bg-white text-red-600 px-4 py-3 rounded-lg font-semibold border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {profileLoading || subscriptionLoading
                        ? "Procesando..."
                        : "Cancelar Suscripción"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Sin Suscripción Activa */
            <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative">
                <div className="absolute inset-0 opacity-5">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 20px,
                        rgba(59, 130, 246, 0.1) 20px,
                        rgba(59, 130, 246, 0.1) 40px
                      )`,
                    }}
                  ></div>
                </div>

                <div className="relative px-6 py-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Crown className="w-8 h-8 text-white" />
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    ¡Únete a Market Club Premium!
                  </h2>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Descubre cervezas artesanales excepcionales cada mes con
                    nuestra suscripción premium
                  </p>

                  {/* Planes disponibles - Solo mostrar si hay datos reales */}
                  {subscriptionLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border animate-pulse"
                        >
                          <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                          <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
                          <div className="h-8 bg-gray-300 rounded w-24 mb-3"></div>
                          <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-3/4 mb-3"></div>
                          <div className="h-8 bg-gray-300 rounded w-full"></div>
                        </div>
                      ))}
                    </div>
                  ) : plans.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {plans.map((plan) => (
                        <div
                          key={plan.id}
                          className={`bg-white/80 backdrop-blur-sm rounded-lg p-4 border transition-all duration-200 hover:shadow-md hover:scale-105 ${
                            plan.is_popular
                              ? "border-blue-300 ring-2 ring-blue-100"
                              : "border-gray-200"
                          }`}
                        >
                          {plan.is_popular && (
                            <div className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full mb-2 inline-block">
                              Más Popular
                            </div>
                          )}
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {plan.name}
                          </h3>
                          <p className="text-2xl font-bold text-blue-600 mb-2">
                            {formatPrice(parseFloat(plan.price))} /{" "}
                            {plan.period}
                          </p>
                          <p className="text-sm text-gray-600 mb-3">
                            {plan.description}
                          </p>

                          {/* Mostrar algunas características principales */}
                          <div className="mb-3">
                            <div className="space-y-1">
                              {plan.features
                                .slice(0, 2)
                                .map((feature, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-xs text-gray-500">
                                      {feature}
                                    </p>
                                  </div>
                                ))}
                            </div>
                          </div>
                          <button
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={subscriptionLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            {subscriptionLoading
                              ? "Procesando..."
                              : "Suscribirme"}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {!subscriptionLoading && (
                    <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Cancela cuando quieras</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-blue-500" />
                        <span>Envío incluido</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500" />
                        <span>Cervezas premium</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Historial de Suscripciones */}
          {history.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  Historial de Suscripciones
                </h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {history.map((subscription) => (
                    <div
                      key={subscription.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            subscription.status === "active"
                              ? "bg-green-100"
                              : subscription.status === "cancelled"
                              ? "bg-red-100"
                              : subscription.status === "expired"
                              ? "bg-gray-100"
                              : "bg-blue-100"
                          }`}
                        >
                          <Crown
                            className={`w-5 h-5 ${
                              subscription.status === "active"
                                ? "text-green-600"
                                : subscription.status === "cancelled"
                                ? "text-red-600"
                                : subscription.status === "expired"
                                ? "text-gray-600"
                                : "text-blue-600"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {subscription.plan_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(
                              subscription.starts_at
                            ).toLocaleDateString("es-CO", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            -{" "}
                            {new Date(subscription.ends_at).toLocaleDateString(
                              "es-CO",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(subscription.price_paid)}
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            subscription.status === "active"
                              ? "bg-green-100 text-green-800"
                              : subscription.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : subscription.status === "expired"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {subscription.status === "active"
                            ? "Activa"
                            : subscription.status === "cancelled"
                            ? "Cancelada"
                            : subscription.status === "expired"
                            ? "Expirada"
                            : subscription.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pedidos Recientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Pedidos Recientes
            </h2>
          </div>

          <div className="p-6">
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Pedido #{order.order_number}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.created_at)} • {order.items.length}{" "}
                          productos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(order.total_amount)}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No tienes pedidos recientes</p>
              </div>
            )}
          </div>
        </div>

        {/* Información de Contacto y Beneficios */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información de Contacto */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Información de Contacto
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  {profile?.email || user.email}
                </span>
              </div>
              {profile?.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{profile.phone}</span>
                </div>
              )}
              {profile?.address && (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    {profile.address.city}, {profile.address.state}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Beneficios de Miembro/Mayorista */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {profile?.is_wholesaler
                ? "Beneficios de Mayorista"
                : "Beneficios de Miembro"}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Envío Gratis</p>
                  <p className="text-sm text-gray-500">
                    En pedidos desde $200.000
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Pagos Seguros</p>
                  <p className="text-sm text-gray-500">
                    Protegido con encriptación
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Entrega a Domicilio
                  </p>
                  <p className="text-sm text-gray-500">En toda Colombia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de cancelación de suscripción */}
      <CancelSubscriptionModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        subscriptionName={getCurrentPlan()?.name}
        subscriptionPrice={currentSubscription?.price_paid}
        daysRemaining={currentSubscription?.days_remaining}
        loading={subscriptionLoading}
      />

      {/* Toast notifications */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        description={toast.description}
        type={toast.type}
        onClose={hideToast}
      />
    </>
  );
}
