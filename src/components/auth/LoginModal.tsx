"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, Mail, Lock, User, Phone, MapPin, Eye, EyeOff, Calendar, Briefcase, Hash } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import SuccessModal from "@/components/shared/SuccessModal";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  country: string;
  isWholesaler: boolean;
}

interface GuestData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

type ModalMode = "options" | "login" | "register" | "guest" | "wholesaler";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const { login, register, guestCheckout, isLoading, error, clearError } =
    useAuth();
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [mode, setMode] = useState<ModalMode>("options");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isWholesalerSelected, setIsWholesalerSelected] = useState<boolean | null>(null);

  // Estados para formularios
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    profession: "",
    nit: "",
    country: "Colombia",
    isWholesaler: false,
  });
  const [guestData, setGuestData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Función para limpiar todos los formularios
  const clearAllForms = useCallback(() => {
    setLoginData({ email: "", password: "" });
    setRegisterData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      dateOfBirth: "",
      profession: "",
      nit: "",
      country: "Colombia",
      isWholesaler: false,
    });
    setGuestData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
    setValidationErrors({});
    setSuccessMessage("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsWholesalerSelected(null);
    clearError();
  }, [clearError]);

  // Manejar la animación de salida
  const handleClose = useCallback(() => {
    setIsAnimating(false);
    clearAllForms(); // Limpiar todos los formularios al cerrar
    setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, 250);
  }, [onClose, clearAllForms]);

  // Función para limpiar el formulario de registro
  const clearRegisterForm = () => {
    setRegisterData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      dateOfBirth: "",
      profession: "",
      nit: "",
      country: "Colombia",
      isWholesaler: false,
    });
    setValidationErrors({});
    setSuccessMessage("");
  };

  // Manejar la animación de entrada
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsAnimating(true);
      setMode("options");
      setValidationErrors({});
      setSuccessMessage("");
      setShowSuccessModal(false);
    }
  }, [isOpen]);

  // Función para validar contraseña
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("La contraseña debe tener al menos 8 caracteres");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("La contraseña debe contener al menos una letra mayúscula");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("La contraseña debe contener al menos una letra minúscula");
    }

    if (!/\d/.test(password)) {
      errors.push("La contraseña debe contener al menos un número");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("La contraseña debe contener al menos un carácter especial");
    }

    return errors;
  };

  // Función para validar campos individuales en tiempo real
  const validateField = (fieldName: string, value: string): string => {
    switch (fieldName) {
      case "name":
        if (!value.trim()) {
          return "El nombre es obligatorio";
        } else if (value.trim().length < 2) {
          return "El nombre debe tener al menos 2 caracteres";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())) {
          return "El nombre solo puede contener letras";
        }
        return "";

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          return "El email es obligatorio";
        } else if (!emailRegex.test(value.trim())) {
          return "El email no es válido";
        }
        return "";

      case "phone":
        if (!value.trim()) {
          return "El teléfono es obligatorio";
        } else if (!/^[\d\s\-\+\(\)]+$/.test(value.trim())) {
          return "El teléfono contiene caracteres inválidos";
        } else if (value.replace(/\D/g, "").length < 10) {
          return "El teléfono debe tener al menos 10 dígitos";
        }
        return "";

      case "dateOfBirth":
        if (value) {
          const birthDate = new Date(value);
          const today = new Date();
          if (isNaN(birthDate.getTime())) {
            return "La fecha de nacimiento debe ser una fecha válida";
          } else if (birthDate >= today) {
            return "La fecha de nacimiento debe ser anterior a hoy";
          }
        }
        return "";

      case "profession":
        if (value && value.trim().length > 255) {
          return "La profesión no puede exceder 255 caracteres";
        }
        return "";

      default:
        return "";
    }
  };

  // Función para validar el formulario de registro
  const validateRegisterForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validar nombre
    if (!registerData.name.trim()) {
      errors.name = "El nombre es obligatorio";
    } else if (registerData.name.trim().length < 2) {
      errors.name = "El nombre debe tener al menos 2 caracteres";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(registerData.name.trim())) {
      errors.name = "El nombre solo puede contener letras";
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!registerData.email.trim()) {
      errors.email = "El email es obligatorio";
    } else if (!emailRegex.test(registerData.email)) {
      errors.email = "El email no es válido";
    }

    // Validar contraseña
    const passwordErrors = validatePassword(registerData.password);
    if (passwordErrors.length > 0) {
      errors.password = passwordErrors[0]; // Mostrar solo el primer error
    }

    // Validar confirmación de contraseña
    if (!registerData.confirmPassword) {
      errors.confirmPassword = "Debes confirmar tu contraseña";
    } else if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    // Validar teléfono
    if (!registerData.phone.trim()) {
      errors.phone = "El teléfono es obligatorio";
    } else if (registerData.phone.trim().length < 10) {
      errors.phone = "El teléfono debe tener al menos 10 dígitos";
    }

    // Validar país
    if (!registerData.country.trim()) {
      errors.country = "El país es obligatorio";
    }

    // Validar fecha de nacimiento (opcional)
    if (registerData.dateOfBirth) {
      const birthDate = new Date(registerData.dateOfBirth);
      const today = new Date();
      if (isNaN(birthDate.getTime())) {
        errors.dateOfBirth = "La fecha de nacimiento debe ser una fecha válida";
      } else if (birthDate >= today) {
        errors.dateOfBirth = "La fecha de nacimiento debe ser anterior a hoy";
      }
    }

    // Validar profesión (opcional)
    if (registerData.profession && registerData.profession.trim().length > 255) {
      errors.profession = "La profesión no puede exceder 255 caracteres";
    }

    // Validar NIT (solo si es mayorista)
    if (registerData.isWholesaler) {
      if (!registerData.nit.trim()) {
        errors.nit = "El NIT es obligatorio para mayoristas";
      } else if (registerData.nit.trim().length < 8) {
        errors.nit = "El NIT debe tener al menos 8 caracteres";
      } else if (!/^[0-9-]+$/.test(registerData.nit.trim())) {
        errors.nit = "El NIT solo puede contener números y guiones";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError(); // Limpiar errores previos
    setValidationErrors({}); // Limpiar errores de validación
    setSuccessMessage(""); // Limpiar mensaje de éxito

    try {
      switch (mode) {
        case "login":
          await login(loginData.email, loginData.password);
          // Si llegamos aquí, el login fue exitoso
          console.log("Login exitoso, redirigiendo a perfil...");
          handleClose();
          router.push("/perfil");
          break;
        case "register":
          // Validar formulario antes de enviar
          if (!validateRegisterForm()) {
            return; // No continuar si hay errores de validación
          }

          await register({
            name: registerData.name,
            email: registerData.email,
            password: registerData.password,
            phone: registerData.phone,
            dateOfBirth: registerData.dateOfBirth,
            profession: registerData.profession,
            nit: registerData.nit,
            country: registerData.country,
            isWholesaler: registerData.isWholesaler,
          });

          // Si llegamos aquí, el registro fue exitoso
          // Limpiar el formulario
          clearRegisterForm();

          // Mostrar modal de éxito
          setShowSuccessModal(true);
          break;
        case "guest":
          await guestCheckout(guestData);
          // Si llegamos aquí, el checkout fue exitoso
          console.log("Checkout exitoso, cerrando modal...");
          handleClose();
          break;
      }
    } catch (error) {
      // Si hay error, el modal permanece abierto para mostrar el mensaje
      console.log("Error en autenticación, modal permanece abierto:", error);
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
            ? "fadeIn 0.25s ease-in-out"
            : "fadeOut 0.25s ease-in-out",
        }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          animation: isAnimating
            ? "fadeIn 0.25s ease-in-out"
            : "fadeOut 0.25s ease-in-out",
        }}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
          style={{
            animation: isAnimating
              ? "slideInFromBottom 0.25s ease-in-out"
              : "slideOutToBottom 0.25s ease-in-out",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === "options" && "Bienvenido a Market Club"}
                {mode === "login" && "Iniciar Sesión"}
                {mode === "wholesaler" && "Tipo de Cuenta"}
                {mode === "register" && "Crear Cuenta"}
                {mode === "guest" && "Continuar como Invitado"}
              </h2>
              <p className="text-gray-600 mt-1">
                {mode === "options" && "Elige cómo quieres continuar"}
                {mode === "login" && "Ingresa a tu cuenta"}
                {mode === "wholesaler" && "¿Eres mayorista?"}
                {mode === "register" &&
                  "Crea tu cuenta para una mejor experiencia"}
                {mode === "guest" && "Completa tus datos para la entrega"}
              </p>
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
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {mode === "options" && (
              <div className="space-y-4">
                <button
                  onClick={() => setMode("login")}
                  className="w-full flex items-center justify-center px-6 py-4 text-white rounded-xl font-semibold transition-colors cursor-pointer"
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
                  onClick={() => setMode("wholesaler")}
                  className="w-full flex items-center justify-center px-6 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
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
                  className="w-full flex items-center justify-center px-6 py-4 border-2 border-gray-300 text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Continuar como invitado
                </button>
              </div>
            )}

            {mode === "wholesaler" && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <p className="text-gray-600">
                    Selecciona el tipo de cuenta que mejor se adapte a tus necesidades
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    setIsWholesalerSelected(false);
                    setRegisterData(prev => ({ ...prev, isWholesaler: false }));
                    setMode("register");
                  }}
                  className="w-full flex items-center justify-center px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-colors cursor-pointer border-2 border-gray-300 hover:border-gray-400"
                >
                  <User className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Cliente Regular</div>
                    <div className="text-sm text-gray-600">Compra productos para consumo personal</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsWholesalerSelected(true);
                    setRegisterData(prev => ({ ...prev, isWholesaler: true }));
                    setMode("register");
                  }}
                  className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white rounded-xl font-semibold transition-colors cursor-pointer"
                >
                  <User className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Mayorista</div>
                    <div className="text-sm text-yellow-100">Compra productos para revender con precios especiales</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("options")}
                  className="w-full mt-4 font-medium text-sm transition-colors cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  ← Volver
                </button>
              </div>
            )}

            {(mode === "login" || mode === "register" || mode === "guest") && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Back button */}
                <button
                  type="button"
                  onClick={() => {
                    if (mode === "register") {
                      setMode("wholesaler");
                    } else {
                      setMode("options");
                    }
                  }}
                  className="font-medium text-sm transition-colors cursor-pointer"
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
                            // Validar en tiempo real
                            const error = validateField("name", e.target.value);
                            setValidationErrors(prev => ({
                              ...prev,
                              name: error
                            }));
                          } else {
                            setGuestData({
                              ...guestData,
                              name: e.target.value,
                            });
                          }
                        }}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-500 text-gray-900 ${
                          validationErrors.name
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    {validationErrors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors.name}
                      </p>
                    )}
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
                          // Validar en tiempo real
                          const error = validateField("email", e.target.value);
                          setValidationErrors(prev => ({
                            ...prev,
                            email: error
                          }));
                        } else {
                          setGuestData({ ...guestData, email: e.target.value });
                        }
                      }}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-500 text-gray-900 ${
                        validationErrors.email
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="tu@email.com"
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.email}
                    </p>
                  )}
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
                            // Validar contraseña en tiempo real
                            const passwordErrors = validatePassword(e.target.value);
                            const error = passwordErrors.length > 0 ? passwordErrors[0] : "";
                            setValidationErrors(prev => ({
                              ...prev,
                              password: error
                            }));
                          }
                        }}
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-500 text-gray-900 ${
                          validationErrors.password
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
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
                    {validationErrors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors.password}
                      </p>
                    )}
                    {mode === "register" && registerData.password && (
                      <div className="mt-2">
                        <div className="text-xs text-gray-600 mb-1">
                          Requisitos de contraseña:
                        </div>
                        <div className="space-y-1 text-xs">
                          <div
                            className={`flex items-center ${
                              registerData.password.length >= 8
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                          >
                            <span className="mr-1">
                              {registerData.password.length >= 8 ? "✓" : "○"}
                            </span>
                            Al menos 8 caracteres
                          </div>
                          <div
                            className={`flex items-center ${
                              /[A-Z]/.test(registerData.password)
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                          >
                            <span className="mr-1">
                              {/[A-Z]/.test(registerData.password) ? "✓" : "○"}
                            </span>
                            Una letra mayúscula
                          </div>
                          <div
                            className={`flex items-center ${
                              /[a-z]/.test(registerData.password)
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                          >
                            <span className="mr-1">
                              {/[a-z]/.test(registerData.password) ? "✓" : "○"}
                            </span>
                            Una letra minúscula
                          </div>
                          <div
                            className={`flex items-center ${
                              /\d/.test(registerData.password)
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                          >
                            <span className="mr-1">
                              {/\d/.test(registerData.password) ? "✓" : "○"}
                            </span>
                            Un número
                          </div>
                          <div
                            className={`flex items-center ${
                              /[!@#$%^&*(),.?":{}|<>]/.test(
                                registerData.password
                              )
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                          >
                            <span className="mr-1">
                              {/[!@#$%^&*(),.?":{}|<>]/.test(
                                registerData.password
                              )
                                ? "✓"
                                : "○"}
                            </span>
                            Un carácter especial
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Confirm Password field (register only) */}
                {mode === "register" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={registerData.confirmPassword}
                        onChange={(e) => {
                          setRegisterData({
                            ...registerData,
                            confirmPassword: e.target.value,
                          });
                          // Validar confirmación de contraseña en tiempo real
                          let error = "";
                          if (!e.target.value) {
                            error = "Debes confirmar tu contraseña";
                          } else if (registerData.password !== e.target.value) {
                            error = "Las contraseñas no coinciden";
                          }
                          setValidationErrors(prev => ({
                            ...prev,
                            confirmPassword: error
                          }));
                        }}
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-500 text-gray-900 ${
                          validationErrors.confirmPassword
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="Confirma tu contraseña"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {validationErrors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors.confirmPassword}
                      </p>
                    )}
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
                            // Validar en tiempo real
                            const error = validateField("phone", e.target.value);
                            setValidationErrors(prev => ({
                              ...prev,
                              phone: error
                            }));
                          } else {
                            setGuestData({
                              ...guestData,
                              phone: e.target.value,
                            });
                          }
                        }}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-500 text-gray-900 ${
                          validationErrors.phone
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="+57 300 123 4567"
                      />
                    </div>
                    {validationErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors.phone}
                      </p>
                    )}
                  </div>
                )}

                {/* Country field (register only) */}
                {mode === "register" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      País
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        required
                        value={registerData.country}
                        onChange={(e) => {
                          setRegisterData({
                            ...registerData,
                            country: e.target.value,
                          });
                        }}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 ${
                          validationErrors.country
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        aria-label="Seleccionar país"
                      >
                        <option value="Colombia">Colombia</option>
                        <option value="México">México</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Chile">Chile</option>
                        <option value="Perú">Perú</option>
                        <option value="Ecuador">Ecuador</option>
                        <option value="Venezuela">Venezuela</option>
                        <option value="Brasil">Brasil</option>
                        <option value="Estados Unidos">Estados Unidos</option>
                        <option value="España">España</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                    {validationErrors.country && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors.country}
                      </p>
                    )}
                  </div>
                )}

                {/* Date of Birth field (register only) */}
                {mode === "register" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de nacimiento (opcional)
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={registerData.dateOfBirth}
                        onChange={(e) => {
                          setRegisterData({
                            ...registerData,
                            dateOfBirth: e.target.value,
                          });
                          // Validar en tiempo real
                          const error = validateField("dateOfBirth", e.target.value);
                          setValidationErrors(prev => ({
                            ...prev,
                            dateOfBirth: error
                          }));
                        }}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-500 text-gray-900 ${
                          validationErrors.dateOfBirth
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="Selecciona tu fecha de nacimiento"
                      />
                    </div>
                    {validationErrors.dateOfBirth && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors.dateOfBirth}
                      </p>
                    )}
                  </div>
                )}

                {/* Profession field (register only) */}
                {mode === "register" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profesión (opcional)
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={registerData.profession}
                        onChange={(e) => {
                          setRegisterData({
                            ...registerData,
                            profession: e.target.value,
                          });
                          // Validar en tiempo real
                          const error = validateField("profession", e.target.value);
                          setValidationErrors(prev => ({
                            ...prev,
                            profession: error
                          }));
                        }}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-500 text-gray-900 ${
                          validationErrors.profession
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="Ej: Ingeniero, Médico, Estudiante..."
                      />
                    </div>
                    {validationErrors.profession && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors.profession}
                      </p>
                    )}
                  </div>
                )}

                {/* NIT field (register only, when isWholesaler is true) */}
                {mode === "register" && registerData.isWholesaler && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIT <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={registerData.nit}
                        onChange={(e) => {
                          setRegisterData({
                            ...registerData,
                            nit: e.target.value,
                          });
                        }}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-500 text-gray-900 ${
                          validationErrors.nit
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="12345678-9"
                      />
                    </div>
                    {validationErrors.nit && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors.nit}
                      </p>
                    )}
                  </div>
                )}

                {/* Wholesaler info display (register only) */}
                {mode === "register" && (
                  <div className={`rounded-xl p-4 border ${
                    registerData.isWholesaler 
                      ? "bg-yellow-50 border-yellow-200" 
                      : "bg-gray-50 border-gray-200"
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        registerData.isWholesaler 
                          ? "bg-yellow-500 text-white" 
                          : "bg-gray-400 text-white"
                      }`}>
                        <User className="w-4 h-4" />
                      </div>
                      <div className="text-sm">
                        <div className={`font-medium ${
                          registerData.isWholesaler ? "text-yellow-800" : "text-gray-700"
                        }`}>
                          {registerData.isWholesaler ? "Cuenta Mayorista" : "Cuenta Regular"}
                        </div>
                        <p className={`text-xs ${
                          registerData.isWholesaler ? "text-yellow-600" : "text-gray-500"
                        }`}>
                          {registerData.isWholesaler 
                            ? "Acceso a precios especiales para revendedores"
                            : "Compra productos para consumo personal"
                          }
                        </p>
                      </div>
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
                  className="w-full text-white py-3 px-6 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{ backgroundColor: "rgb(181, 142, 49)" }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor =
                        "rgb(160, 120, 23)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor =
                        "rgb(181, 142, 49)";
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

      {/* Modal de éxito */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          handleClose(); // Cerrar el modal principal también
          router.push("/perfil"); // Redirigir al perfil después del registro
        }}
        title="¡Cuenta Creada Exitosamente!"
        message="Bienvenido a Market Club. Tu cuenta ha sido creada correctamente y ya puedes disfrutar de todos nuestros productos y servicios."
        autoClose={true}
        autoCloseDelay={4000}
      />
    </>
  );
}
