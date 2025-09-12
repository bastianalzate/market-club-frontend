"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import PerfilHeader from "./PerfilHeader";
import PerfilNavigation from "./PerfilNavigation";
import PerfilOverview from "./PerfilOverview";
import PerfilOrders from "./PerfilOrders";
import PerfilFavorites from "./PerfilFavorites";

type PerfilTab = "overview" | "orders" | "favorites";

export default function PerfilContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PerfilTab>("overview");

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (se redirigirá)
  if (!isAuthenticated || !user) {
    return null;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <PerfilOverview user={user} />;
      case "orders":
        return <PerfilOrders user={user} />;
      case "favorites":
        return <PerfilFavorites user={user} />;
      default:
        return <PerfilOverview user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del perfil */}
      <PerfilHeader user={user} />

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navegación lateral */}
          <div className="lg:w-64 flex-shrink-0">
            <PerfilNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Contenido de la pestaña activa */}
          <div className="flex-1">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}
