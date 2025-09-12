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
} from "lucide-react";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isGuest: boolean;
}

interface PerfilOrdersProps {
  user: User;
}

interface Order {
  id: string;
  date: string;
  status: "Pendiente" | "Procesando" | "En camino" | "Entregado" | "Cancelado";
  total: number;
  items: number;
  trackingNumber?: string;
  products: {
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
}

export default function PerfilOrders({ user }: PerfilOrdersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Datos mock para demostración
  const orders: Order[] = [
    {
      id: "ORD-001",
      date: "2024-01-20",
      status: "Entregado",
      total: 85000,
      items: 3,
      trackingNumber: "TRK123456789",
      products: [
        { name: "CERVEZA ERDINGER WEIBBIER", quantity: 2, price: 22000 },
        { name: "CERVEZA ESTRELLA GALICIA", quantity: 1, price: 17000 },
      ],
    },
    {
      id: "ORD-002",
      date: "2024-01-18",
      status: "En camino",
      total: 120000,
      items: 5,
      trackingNumber: "TRK987654321",
      products: [
        { name: "CERVEZA IRON MAIDEN", quantity: 3, price: 22000 },
        { name: "CERVEZA GULDEN DRAAK", quantity: 2, price: 34000 },
      ],
    },
    {
      id: "ORD-003",
      date: "2024-01-15",
      status: "Procesando",
      total: 65000,
      items: 2,
      products: [
        { name: "CERVEZA HOLLANDIA PREMIUM", quantity: 2, price: 14000 },
      ],
    },
    {
      id: "ORD-004",
      date: "2024-01-12",
      status: "Entregado",
      total: 95000,
      items: 4,
      trackingNumber: "TRK456789123",
      products: [
        { name: "CERVEZA MAHOU", quantity: 4, price: 9000 },
        { name: "CERVEZA MODELO ESPECIAL", quantity: 2, price: 9000 },
      ],
    },
  ];

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Entregado":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "En camino":
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "Procesando":
        return <Package className="w-5 h-5 text-yellow-600" />;
      case "Pendiente":
        return <Clock className="w-5 h-5 text-gray-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Entregado":
        return "bg-green-100 text-green-800";
      case "En camino":
        return "bg-blue-100 text-blue-800";
      case "Procesando":
        return "bg-yellow-100 text-yellow-800";
      case "Pendiente":
        return "bg-gray-100 text-gray-800";
      case "Cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Mis Pedidos</h2>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar pedidos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            {/* Filtro de estado */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Procesando">Procesando</option>
              <option value="En camino">En camino</option>
              <option value="Entregado">Entregado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron pedidos
            </h3>
            <p className="text-gray-600">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Header del pedido */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Pedido #{order.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.date)} • {order.items} productos
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <p className="text-xl font-bold text-gray-900">
                      {formatPrice(order.total)}
                    </p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Productos del pedido */}
              <div className="p-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Productos:
                </h4>
                <div className="space-y-3">
                  {order.products.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Cantidad: {product.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatPrice(product.price * product.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acciones del pedido */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                      <Eye className="w-4 h-4" />
                      Ver detalles
                    </button>
                    <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                      <Download className="w-4 h-4" />
                      Descargar factura
                    </button>
                  </div>

                  {order.trackingNumber && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Seguimiento:</span>{" "}
                      {order.trackingNumber}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
