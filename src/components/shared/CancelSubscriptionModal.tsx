"use client";

import { useState } from "react";
import { X, AlertTriangle, Crown, Calendar, DollarSign } from "lucide-react";

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  subscriptionName?: string;
  subscriptionPrice?: number;
  daysRemaining?: number;
  loading?: boolean;
}

export default function CancelSubscriptionModal({
  isOpen,
  onClose,
  onConfirm,
  subscriptionName = "Market Club Premium",
  subscriptionPrice = 0,
  daysRemaining = 0,
  loading = false,
}: CancelSubscriptionModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleConfirm = () => {
    onConfirm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 ${
            isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Cancelar Suscripción
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Warning Message */}
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">
                ¿Estás seguro de que quieres cancelar tu suscripción a
              </p>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200 mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-gray-900">
                    {subscriptionName}
                  </h3>
                </div>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{formatPrice(subscriptionPrice)} / mes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{daysRemaining} días restantes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Consequences */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Al cancelar perderás:
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Acceso a cervezas exclusivas mensuales</li>
                <li>• Descuentos especiales en productos</li>
                <li>• Invitaciones a eventos privados</li>
                <li>• Beneficios de miembro premium</li>
              </ul>
            </div>

            {/* Alternative */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">
                ¿Prefieres pausar tu suscripción?
              </h4>
              <p className="text-sm text-blue-700">
                Puedes pausar temporalmente tu suscripción y reactivarla cuando
                quieras, sin perder tus beneficios acumulados.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 pt-0">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Mantener Suscripción
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 px-4 py-3 text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Cancelando...
                </div>
              ) : (
                "Sí, Cancelar"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
