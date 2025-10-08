"use client";

import { User, MapPin, Phone, Mail, Crown } from "lucide-react";
import { useProfileContext } from "@/contexts/ProfileContext";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isGuest?: boolean;
}

interface PerfilHeaderProps {
  user: User;
}

export default function PerfilHeader({ user }: PerfilHeaderProps) {
  const { profile, isLoading } = useProfileContext();

  // Usar los datos actualizados del perfil si están disponibles, sino usar los datos del user prop
  const displayName = profile?.name || user.name;
  const displayEmail = profile?.email || user.email;
  const displayPhone = profile?.phone || user.phone;
  const isWholesaler = profile?.is_wholesaler || false;

  // Si se está cargando el perfil, mostrar skeleton
  if (isLoading) {
    return (
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar Skeleton */}
            <div className="relative">
              <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            {/* Información del usuario - Skeleton */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-3">
                  {/* Nombre skeleton */}
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-64"></div>

                  {/* Email y teléfono skeleton */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                  </div>
                </div>

                {/* Badge skeleton */}
                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-12 h-12 text-white" />
            </div>
            {user.isGuest && (
              <div className="absolute -bottom-1 -right-1 bg-gray-600 rounded-full p-1">
                <Crown className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          {/* Información del usuario */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {displayName}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{displayEmail}</span>
                  </div>
                  {displayPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{displayPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Badge de tipo de usuario */}
              <div className="flex items-center gap-2">
                {user.isGuest ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <Crown className="w-3 h-3 mr-1" />
                    Usuario Invitado
                  </span>
                ) : isWholesaler ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Crown className="w-3 h-3 mr-1" />
                    Mayorista
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <User className="w-3 h-3 mr-1" />
                    Miembro
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
