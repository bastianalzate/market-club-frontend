"use client";

import { useState, useEffect } from "react";
import { CheckCircle, X, ShoppingCart } from "lucide-react";

interface NotificationToastProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
}

export default function NotificationToast({
  isVisible,
  onClose,
  title,
  message,
  type = "success",
  duration = 4000,
}: NotificationToastProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "error":
        return <X className="w-6 h-6 text-red-500" />;
      default:
        return <ShoppingCart className="w-6 h-6 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <style jsx>{`
        @keyframes slideInFromTop {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideOutToTop {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-100%);
            opacity: 0;
          }
        }

        @keyframes bounce {
          0%,
          20%,
          53%,
          80%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          40%,
          43% {
            transform: translate3d(0, -8px, 0);
          }
          70% {
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }
      `}</style>

      <div
        className={`fixed top-4 right-4 z-50 max-w-sm w-full ${getBackgroundColor()} border rounded-xl shadow-lg p-4 transition-all duration-300 ${
          isAnimating ? "animate-slideInFromTop" : "animate-slideOutToTop"
        }`}
        style={{
          animation: isAnimating
            ? "slideInFromTop 0.5s ease-out, bounce 0.6s ease-out 0.3s"
            : "slideOutToTop 0.3s ease-in",
        }}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">{getIcon()}</div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              {title}
            </h4>
            <p className="text-sm text-gray-600">{message}</p>
          </div>

          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
          <div
            className={`h-1 rounded-full transition-all duration-100 ease-linear ${
              type === "success"
                ? "bg-green-500"
                : type === "error"
                ? "bg-red-500"
                : "bg-blue-500"
            }`}
            style={{
              width: "100%",
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </>
  );
}
