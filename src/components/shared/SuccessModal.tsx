"use client";

import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  autoClose = true,
  autoCloseDelay = 3000,
}: SuccessModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Manejar la animación de entrada
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsAnimating(true);

      // Auto-cerrar después del delay
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);

        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, autoClose, autoCloseDelay]);

  // Manejar la animación de salida
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, 300);
  };

  if (!shouldRender) return null;

  return (
    <>
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes slideInFromBottom {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideOutToBottom {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(100%);
            opacity: 0;
          }
        }

        @keyframes checkmarkAnimation {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60]"
        style={{
          backgroundColor: "#00000091",
          animation: isAnimating
            ? "fadeIn 0.3s ease-in-out"
            : "fadeOut 0.3s ease-in-out",
        }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        style={{
          animation: isAnimating
            ? "fadeIn 0.3s ease-in-out"
            : "fadeOut 0.3s ease-in-out",
        }}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
          style={{
            animation: isAnimating
              ? "slideInFromBottom 0.3s ease-in-out"
              : "slideOutToBottom 0.3s ease-in-out",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header con botón de cerrar */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex-1" />
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 text-center">
            {/* Icono de éxito animado */}
            <div className="mb-6">
              <div
                className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
                style={{
                  animation: isAnimating ? "pulse 0.6s ease-in-out" : "none",
                }}
              >
                <CheckCircle
                  className="w-12 h-12 text-green-600"
                  style={{
                    animation: isAnimating
                      ? "checkmarkAnimation 0.8s ease-in-out"
                      : "none",
                  }}
                />
              </div>
            </div>

            {/* Título */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>

            {/* Mensaje */}
            <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

            {/* Botón de acción */}
            <button
              onClick={handleClose}
              className="w-full text-white py-3 px-6 rounded-xl font-semibold transition-colors"
              style={{ backgroundColor: "rgb(181, 142, 49)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgb(160, 120, 23)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgb(181, 142, 49)";
              }}
            >
              ¡Perfecto!
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
