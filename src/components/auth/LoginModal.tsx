"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

interface GuestData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

type ModalMode = "options" | "login" | "register" | "guest";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, register, guestCheckout, isLoading, error, clearError } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [mode, setMode] = useState<ModalMode>("options");
  const [showPassword, setShowPassword] = useState(false);

  // Estados para formularios
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [guestData, setGuestData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Manejar la animación de salida
  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, 300);
  }, [onClose]);

  // Manejar la animación de entrada
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsAnimating(true);
      setMode("options");
    }
  }, [isOpen]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError(); // Limpiar errores previos
    
    try {
      switch (mode) {
        case "login":
          await login(loginData.email, loginData.password);
          // Si llegamos aquí, el login fue exitoso
          console.log('Login exitoso, cerrando modal...');
          handleClose();
          break;
        case "register":
          await register(registerData);
          // Si llegamos aquí, el registro fue exitoso
          console.log('Registro exitoso, cerrando modal...');
          handleClose();
          break;
        case "guest":
          await guestCheckout(guestData);
          // Si llegamos aquí, el checkout fue exitoso
          console.log('Checkout exitoso, cerrando modal...');
          handleClose();
          break;
      }
    } catch (error) {
      // Si hay error, el modal permanece abierto para mostrar el mensaje
      console.log('Error en autenticación, modal permanece abierto:', error);
    }
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
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          animation: isAnimating
            ? "fadeIn 0.3s ease-in-out"
            : "fadeOut 0.3s ease-in-out",
        }}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          style={{
            animation: isAnimating
              ? "slideInFromBottom 0.3s ease-in-out"
              : "slideOutToBottom 0.3s ease-in-out",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === "options" && "Bienvenido a Market Club"}
                {mode === "login" && "Iniciar Sesión"}
                {mode === "register" && "Crear Cuenta"}
                {mode === "guest" && "Continuar como Invitado"}
              </h2>
              <p className="text-gray-600 mt-1">
                {mode === "options" && "Elige cómo quieres continuar"}
                {mode === "login" && "Ingresa a tu cuenta"}
                {mode === "register" &&
                  "Crea tu cuenta para una mejor experiencia"}
                {mode === "guest" && "Completa tus datos para la entrega"}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {mode === "options" && (
              <div className="space-y-4">
                <button
                  onClick={() => setMode("login")}
                  className="w-full flex items-center justify-center px-6 py-4 text-white rounded-xl font-semibold transition-colors"
                  style={{ backgroundColor: "rgb(181, 142, 49)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgb(160, 120, 23)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgb(181, 142, 49)";
                  }}
                >
                  <User className="w-5 h-5 mr-2" />
                  Ya tengo cuenta
                </button>

                <button
                  onClick={() => setMode("register")}
                  className="w-full flex items-center justify-center px-6 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                  <User className="w-5 h-5 mr-2" />
                  Crear cuenta nueva
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">o</span>
                  </div>
                </div>

                <button
                  onClick={() => setMode("guest")}
                  className="w-full flex items-center justify-center px-6 py-4 border-2 border-gray-300 text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Continuar como invitado
                </button>
              </div>
            )}

            {(mode === "login" || mode === "register" || mode === "guest") && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Back button */}
                <button
                  type="button"
                  onClick={() => setMode("options")}
                  className="font-medium text-sm transition-colors"
                  style={{ color: "rgb(181, 142, 49)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "rgb(160, 120, 23)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgb(181, 142, 49)";
                  }}
                >
                  ← Volver
                </button>

                {/* Name field (register and guest) */}
                {(mode === "register" || mode === "guest") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={
                          mode === "register"
                            ? registerData.name
                            : guestData.name
                        }
                        onChange={(e) => {
                          if (mode === "register") {
                            setRegisterData({
                              ...registerData,
                              name: e.target.value,
                            });
                          } else {
                            setGuestData({
                              ...guestData,
                              name: e.target.value,
                            });
                          }
                        }}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-500 text-gray-900"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                  </div>
                )}

                {/* Email field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={
                        mode === "login"
                          ? loginData.email
                          : mode === "register"
                          ? registerData.email
                          : guestData.email
                      }
                      onChange={(e) => {
                        if (mode === "login") {
                          setLoginData({ ...loginData, email: e.target.value });
                        } else if (mode === "register") {
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          });
                        } else {
                          setGuestData({ ...guestData, email: e.target.value });
                        }
                      }}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-500 text-gray-900"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                {/* Password field (login and register) */}
                {(mode === "login" || mode === "register") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={
                          mode === "login"
                            ? loginData.password
                            : registerData.password
                        }
                        onChange={(e) => {
                          if (mode === "login") {
                            setLoginData({
                              ...loginData,
                              password: e.target.value,
                            });
                          } else {
                            setRegisterData({
                              ...registerData,
                              password: e.target.value,
                            });
                          }
                        }}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-500 text-gray-900"
                        placeholder="Tu contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Phone field (register and guest) */}
                {(mode === "register" || mode === "guest") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={
                          mode === "register"
                            ? registerData.phone
                            : guestData.phone
                        }
                        onChange={(e) => {
                          if (mode === "register") {
                            setRegisterData({
                              ...registerData,
                              phone: e.target.value,
                            });
                          } else {
                            setGuestData({
                              ...guestData,
                              phone: e.target.value,
                            });
                          }
                        }}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-500 text-gray-900"
                        placeholder="+57 300 123 4567"
                      />
                    </div>
                  </div>
                )}

                {/* Address field (guest only) */}
                {mode === "guest" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección de entrega
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <textarea
                        required
                        value={guestData.address}
                        onChange={(e) =>
                          setGuestData({
                            ...guestData,
                            address: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none placeholder-gray-500 text-gray-900"
                        rows={3}
                        placeholder="Calle 123 #45-67, Medellín"
                      />
                    </div>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-white py-3 px-6 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "rgb(181, 142, 49)" }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = "rgb(160, 120, 23)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = "rgb(181, 142, 49)";
                    }
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </div>
                  ) : (
                    <>
                      {mode === "login" && "Iniciar Sesión"}
                      {mode === "register" && "Crear Cuenta"}
                      {mode === "guest" && "Continuar al Checkout"}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
