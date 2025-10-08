"use client";

import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  Package,
  CreditCard,
  MapPin,
  Bell,
} from "lucide-react";

type PerfilTab = "overview" | "orders" | "favorites" | "settings";

interface PerfilNavigationProps {
  activeTab: PerfilTab;
  onTabChange: (tab: PerfilTab) => void;
}

const navigationItems = [
  {
    id: "overview" as PerfilTab,
    label: "Resumen",
    icon: User,
    description: "Información general",
  },
  {
    id: "orders" as PerfilTab,
    label: "Mis Pedidos",
    icon: ShoppingBag,
    description: "Historial de compras",
  },
  {
    id: "favorites" as PerfilTab,
    label: "Favoritos",
    icon: Heart,
    description: "Productos guardados",
  },
  {
    id: "settings" as PerfilTab,
    label: "Configuración",
    icon: Settings,
    description: "Editar perfil y configuración",
  },
];

export default function PerfilNavigation({
  activeTab,
  onTabChange,
}: PerfilNavigationProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Mi Cuenta</h2>

      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                isActive
                  ? "bg-yellow-50 border border-yellow-200 text-yellow-900"
                  : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? "text-yellow-600" : "text-gray-400"
                }`}
                style={isActive ? { color: "rgb(180, 140, 43)" } : {}}
              />
              <div className="flex-1">
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-gray-500">{item.description}</div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Información adicional */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Package className="w-4 h-4" />
            <span>Envíos gratis desde $200.000</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <CreditCard className="w-4 h-4" />
            <span>Pagos seguros</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>Entrega a domicilio</span>
          </div>
        </div>
      </div>
    </div>
  );
}
