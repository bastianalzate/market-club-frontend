"use client";

import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Eye,
  Download,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserOrders } from "@/hooks/useUserProfile";
import { constants } from "@/config/constants";
import OrderDetailsModal from "./OrderDetailsModal";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isGuest?: boolean;
}

interface PerfilOrdersProps {
  user: User;
}

export default function PerfilOrders({ user }: PerfilOrdersProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const { orders, pagination, loading, error, loadOrders, getOrderDetails } =
    useUserOrders();

  // Helper function para obtener la URL de imagen del producto
  const getProductImageUrl = (imageUrl?: string, productName?: string) => {
    // Si es un regalo personalizado, usar imagen de regalo
    if (
      productName &&
      productName.toLowerCase().includes("regalo personaliz")
    ) {
      return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSI4IiBmaWxsPSIjQjU4RTMxIi8+PHJlY3QgeD0iMyIgeT0iOCIgd2lkdGg9IjE4IiBoZWlnaHQ9IjQiIHJ4PSIxIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xMiA4djEzIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xOSAxMnY3YTIgMiAwIDAgMS0yIDJIN2EyIDIgMCAwIDEtMi0ydi03IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik03LjUgOGEyLjUgMi41IDAgMCAxIDAtNUE0LjggOCAwIDAgMSAxMiA4YTQuOCA4IDAgMCAxIDQuNS01IDIuNSAyLjUgMCAwIDEgMCA1IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPgo=";
    }

    if (!imageUrl) {
      return "/images/cervezas/bottella-01.png"; // Imagen por defecto
    }

    // Si la imagen ya incluye la URL completa, usarla tal como está
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    // Si es una ruta relativa, construir la URL completa
    const baseUrl = constants.api_url.replace("/api", "");

    if (imageUrl.startsWith("/storage/") || imageUrl.startsWith("storage/")) {
      const cleanPath = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
      return `${baseUrl}/${cleanPath}`;
    }

    // Para rutas que no empiezan con storage/, asumir que van en storage/
    return `${baseUrl}/storage/${imageUrl}`;
  };

  // Cargar órdenes al montar el componente
  useEffect(() => {
    loadOrders({
      page: currentPage,
      per_page: 10,
      status: statusFilter !== "all" ? statusFilter : undefined,
      search: searchTerm || undefined,
    });
  }, [currentPage, statusFilter, searchTerm, loadOrders]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Entregado":
        return <CheckCircle className="w-4 h-4" />;
      case "En camino":
        return <Truck className="w-4 h-4" />;
      case "Procesando":
        return <Package className="w-4 h-4" />;
      case "Pendiente":
        return <Clock className="w-4 h-4" />;
      case "Cancelado":
        return <Package className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadOrders({
      page: 1,
      per_page: 10,
      status: statusFilter !== "all" ? statusFilter : undefined,
      search: searchTerm || undefined,
    });
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewOrder = async (orderId: string) => {
    try {
      setSelectedOrderId(orderId);
      setModalLoading(true);

      const orderData = await getOrderDetails(orderId);

      if (orderData && orderData.id) {
        setOrderDetails(orderData);
      } else {
        console.error("❌ No valid order data received");
        setOrderDetails(null);
      }
    } catch (error) {
      console.error("❌ Error getting order details:", error);
      setOrderDetails(null);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedOrderId(null);
    setOrderDetails(null);
    setModalLoading(false);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando órdenes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
                Error al cargar las órdenes
              </h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Pedidos</h1>
          <p className="text-gray-600">
            Gestiona y revisa el estado de tus pedidos
          </p>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Filtrar Pedidos
          </h3>
          <p className="text-sm text-gray-600">
            Busca y filtra tus pedidos por número o estado
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Búsqueda */}
          <div className="flex-1">
            <label
              htmlFor="search-orders"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Buscar pedido
            </label>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="search-orders"
                  type="text"
                  placeholder="Ingresa el número de orden (ej: ORD-68CB3EA79B116)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none transition-colors"
                />
              </div>
            </form>
          </div>

          {/* Filtro de Estado */}
          <div className="lg:w-64">
            <label
              htmlFor="status-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Filtrar por estado
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none transition-colors appearance-none"
              >
                <option value="all" className="text-gray-900">
                  Todos los estados
                </option>
                <option value="Pendiente" className="text-gray-900">
                  ⏳ Pendiente
                </option>
                <option value="Procesando" className="text-gray-900">
                  📦 Procesando
                </option>
                <option value="En camino" className="text-gray-900">
                  🚚 En camino
                </option>
                <option value="Entregado" className="text-gray-900">
                  ✅ Entregado
                </option>
                <option value="Cancelado" className="text-gray-900">
                  ❌ Cancelado
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Órdenes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {orders.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Información Principal */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Pedido #{order.order_number}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        Realizado el {formatDate(order.created_at)}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>{order.items.length} productos</span>
                        {order.tracking_number && (
                          <span>Tracking: {order.tracking_number}</span>
                        )}
                        {order.estimated_delivery && (
                          <span>
                            Entrega estimada:{" "}
                            {formatDate(order.estimated_delivery)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Precio y Acciones */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(order.total_amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Subtotal: {formatPrice(order.subtotal)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewOrder(order.id)}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver detalles
                      </button>
                      {order.status === "Entregado" && (
                        <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
                          <Download className="w-4 h-4" />
                          Factura
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Productos del Pedido */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Productos del pedido:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={getProductImageUrl(
                            item.product_image,
                            item.product_name
                          )}
                          alt={item.product_name}
                          className="w-12 h-12 rounded-lg object-cover shadow-sm flex-shrink-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/cervezas/bottella-01.png";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.product_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Cantidad: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatPrice(item.total_price)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes pedidos
            </h3>
            <p className="text-gray-500 mb-6">
              Cuando realices tu primera compra, aparecerá aquí.
            </p>
            <button 
              onClick={() => router.push('/tienda')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer"
            >
              Ir a la tienda
            </button>
          </div>
        )}

        {/* Paginación */}
        {pagination && pagination.last_page > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando{" "}
                {(pagination.current_page - 1) * pagination.per_page + 1} a{" "}
                {Math.min(
                  pagination.current_page * pagination.per_page,
                  pagination.total
                )}{" "}
                de {pagination.total} resultados
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="px-3 py-2 text-sm font-medium text-gray-700">
                  Página {currentPage} de {pagination.last_page}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.last_page}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalles del Pedido */}
      <OrderDetailsModal
        isOpen={selectedOrderId !== null}
        onClose={handleCloseModal}
        orderDetails={orderDetails}
        loading={modalLoading}
      />
    </div>
  );
}
