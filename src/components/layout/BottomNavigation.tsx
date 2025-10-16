"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  Heart,
  User,
  MapPin,
  Store,
  Bell,
  LogIn,
} from "lucide-react";
import { useCartContext } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const cartContext = useCartContext();
  const { openLoginModal } = useAuth();

  // Validar que el contexto esté disponible
  if (!cartContext) {
    return null;
  }

  const { itemsCount } = cartContext;

  // Usar el itemsCount ya calculado del contexto
  const totalCartItems = itemsCount || 0;

  const navigationItems = [
    {
      id: "home",
      label: "Inicio",
      icon: Home,
      path: "/",
      isActive: pathname === "/",
    },
    {
      id: "tienda",
      label: "Tienda",
      icon: ShoppingBag,
      path: "/tienda",
      isActive: pathname === "/tienda",
      badge: totalCartItems > 0 ? totalCartItems : null,
    },
    {
      id: "contacto",
      label: "Contacto",
      icon: MapPin,
      path: "/contacto",
      isActive: pathname === "/contacto",
    },
    {
      id: "login",
      label: "Login",
      icon: LogIn,
      path: null, // No navigation, will open modal
      isActive: false,
    },
  ];

  const handleNavigation = (item: any) => {
    if (item.id === "login") {
      openLoginModal();
    } else if (item.path) {
      router.push(item.path);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg lg:hidden">
      <div className="grid grid-cols-4 h-16">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`flex flex-col items-center justify-center space-y-1 relative transition-colors ${
                item.isActive
                  ? "text-[#B58E31]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="relative">
                <IconComponent className="w-5 h-5" />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
