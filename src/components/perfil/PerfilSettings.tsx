"use client";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  Shield,
  CreditCard,
  Save,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile, useUserSettings } from "@/hooks/useUserProfile";
import { useNotification } from "@/hooks/useNotification";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/shared/Toast";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isGuest: boolean;
}

interface PerfilSettingsProps {
  user: User;
}

export default function PerfilSettings({ user }: PerfilSettingsProps) {
  const { logout } = useAuth();
  const { showSuccess, showError } = useNotification();
  const {
    toast,
    showSuccess: showToastSuccess,
    showError: showToastError,
    hideToast,
  } = useToast();
  const {
    profile,
    updateProfile,
    changePassword,
    loading: profileLoading,
    error: profileError,
  } = useUserProfile();
  const { settings, updateSettings } = useUserSettings();

  const [activeSection, setActiveSection] = useState<"profile" | "security">(
    "profile"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados del formulario de perfil
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Colombia",
    },
  });

  // Estados del formulario de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Estados de notificaciones
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    order_updates: true,
    promotions: true,
    newsletter: false,
  });

  // Estados de facturación
  const [billingData, setBillingData] = useState({
    cardNumber: "**** **** **** 1234",
    expiryDate: "12/25",
    cardholderName: "",
    billingAddress: "",
  });

  // Cargar datos del perfil cuando se monta el componente
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: {
          street: profile.address?.street || "",
          city: profile.address?.city || "",
          state: profile.address?.state || "",
          postal_code: profile.address?.postal_code || "",
          country: profile.address?.country || "Colombia",
        },
      });
      setBillingData((prev) => ({
        ...prev,
        cardholderName: profile.name || "",
      }));
    } else if (user) {
      // Fallback: usar datos del usuario prop si el perfil del hook está vacío
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: {
          street: "",
          city: "",
          state: "",
          postal_code: "",
          country: "Colombia",
        },
      });
    }
  }, [profile, user]);

  // Cargar configuraciones de notificaciones
  useEffect(() => {
    if (settings) {
      setNotificationSettings(settings.notification_settings);
    }
  }, [settings]);

  // Función para detectar si hay cambios en el perfil
  const hasProfileChanges = () => {
    if (!profile && !user) return false;

    const originalData = profile || user;
    return (
      profileData.name !== (originalData.name || "") ||
      profileData.phone !== (originalData.phone || "")
    );
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      // Solo enviar los campos que acepta el backend
      const dataToSend = {
        name: profileData.name,
        phone: profileData.phone,
      };

      const result = await updateProfile(dataToSend);

      if (result.success) {
        // Mostrar toast de éxito
        showToastSuccess(
          "¡Perfil actualizado! 👤",
          "Tu información personal se ha guardado exitosamente"
        );

        // También mostrar notificación
        showSuccess(
          "Perfil actualizado",
          "Tu información se ha actualizado correctamente"
        );
      } else {
        // Mostrar toast de error
        showToastError(
          "Error al actualizar",
          result.message || "No se pudo actualizar tu perfil"
        );

        showError("Error", result.message || "Error al actualizar el perfil");
      }
    } catch (error) {
      // Mostrar toast de error
      showToastError(
        "Error de conexión",
        "Verifica tu conexión e intenta nuevamente"
      );

      showError("Error", "Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    // Validaciones del frontend
    if (!passwordData.currentPassword) {
      showError("Error", "Debes ingresar tu contraseña actual");
      return;
    }

    if (!passwordData.newPassword) {
      showError("Error", "Debes ingresar una nueva contraseña");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showError(
        "Error",
        "La nueva contraseña debe tener al menos 8 caracteres"
      );
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);
      const result = await changePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        new_password_confirmation: passwordData.confirmPassword,
      });

      if (result.success) {
        // Mostrar toast de éxito
        showToastSuccess(
          "¡Contraseña actualizada! 🔐",
          "Tu contraseña se ha cambiado exitosamente"
        );

        // También mostrar notificación
        showSuccess(
          "Contraseña cambiada",
          "Tu contraseña se ha actualizado correctamente"
        );

        // Limpiar formulario
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        // Manejar errores específicos del backend
        let errorMessage = "Error al cambiar la contraseña";

        if (result.errors) {
          const errors = result.errors;

          if (
            errors.new_password &&
            errors.new_password.includes(
              "The new password field must be at least 8 characters."
            )
          ) {
            errorMessage =
              "La nueva contraseña debe tener al menos 8 caracteres";
          } else if (
            errors.new_password_confirmation &&
            errors.new_password_confirmation.includes(
              "The new password confirmation field must be at least 8 characters."
            )
          ) {
            errorMessage =
              "La confirmación de contraseña debe tener al menos 8 caracteres";
          } else if (errors.current_password) {
            errorMessage = "La contraseña actual es incorrecta";
          } else if (
            errors.new_password_confirmation &&
            errors.new_password_confirmation.includes(
              "The new password confirmation does not match."
            )
          ) {
            errorMessage = "Las contraseñas no coinciden";
          } else {
            // Mostrar el primer error disponible
            const firstError = Object.values(errors)[0];
            if (Array.isArray(firstError) && firstError.length > 0) {
              errorMessage = firstError[0];
            }
          }
        } else if (result.message) {
          errorMessage = result.message;
        }

        showError("Error", errorMessage);
      }
    } catch (error) {
      showError("Error", "Error de conexión. Intenta nuevamente");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setLoading(true);
      const result = await updateSettings({
        notification_settings: notificationSettings,
      });

      if (result.success) {
        showSuccess(
          "Configuraciones guardadas",
          "Tus preferencias se han guardado correctamente"
        );
      } else {
        showError(
          "Error",
          result.message || "Error al guardar las configuraciones"
        );
      }
    } catch (error) {
      showError("Error", "Error al guardar las configuraciones");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBilling = () => {
    // Aquí se guardarían los datos de facturación
    console.log("Guardando facturación:", billingData);
    showSuccess(
      "Información guardada",
      "Los datos de facturación se han guardado"
    );
  };

  const sections = [
    { id: "profile" as const, label: "Perfil", icon: User },
    { id: "security" as const, label: "Seguridad", icon: Lock },
    // { id: "notifications" as const, label: "Notificaciones", icon: Bell },
    // { id: "billing" as const, label: "Facturación", icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600">
            Gestiona tu información personal y preferencias
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navegación lateral */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                      isActive
                        ? "bg-yellow-50 border border-yellow-200 text-yellow-900"
                        : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? "text-yellow-600" : "text-gray-400"
                      }`}
                    />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Sección de Perfil */}
            {activeSection === "profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Información Personal
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        El email no se puede modificar
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Indicador de cambios pendientes */}
                {hasProfileChanges() && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                      Tienes cambios sin guardar
                    </p>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading || !hasProfileChanges()}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Guardar cambios
                  </button>
                </div>
              </div>
            )}

            {/* Sección de Seguridad */}
            {activeSection === "security" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Cambiar Contraseña
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña actual
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nueva contraseña
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${
                            passwordData.newPassword.length > 0 &&
                            passwordData.newPassword.length < 8
                              ? "border-red-300 bg-red-50"
                              : passwordData.newPassword.length >= 8
                              ? "border-green-300 bg-green-50"
                              : "border-gray-300"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="mt-1">
                        <p
                          className={`text-xs ${
                            passwordData.newPassword.length > 0 &&
                            passwordData.newPassword.length < 8
                              ? "text-red-600"
                              : passwordData.newPassword.length >= 8
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          Mínimo 8 caracteres
                          {passwordData.newPassword.length > 0 && (
                            <span className="ml-2">
                              ({passwordData.newPassword.length}/8)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar nueva contraseña
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${
                            passwordData.confirmPassword.length > 0 &&
                            passwordData.newPassword !==
                              passwordData.confirmPassword
                              ? "border-red-300 bg-red-50"
                              : passwordData.confirmPassword.length > 0 &&
                                passwordData.newPassword ===
                                  passwordData.confirmPassword
                              ? "border-green-300 bg-green-50"
                              : "border-gray-300"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {passwordData.confirmPassword.length > 0 && (
                        <div className="mt-1">
                          <p
                            className={`text-xs ${
                              passwordData.newPassword !==
                              passwordData.confirmPassword
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {passwordData.newPassword !==
                            passwordData.confirmPassword
                              ? "Las contraseñas no coinciden"
                              : "Las contraseñas coinciden"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Indicador de validación */}
                {(!passwordData.currentPassword ||
                  !passwordData.newPassword ||
                  !passwordData.confirmPassword ||
                  passwordData.newPassword.length < 8 ||
                  passwordData.newPassword !==
                    passwordData.confirmPassword) && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-2 font-medium">
                      Para cambiar tu contraseña, completa los siguientes
                      requisitos:
                    </p>
                    <ul className="space-y-1 text-xs">
                      <li
                        className={`flex items-center gap-2 ${
                          passwordData.currentPassword
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            passwordData.currentPassword
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></span>
                        Ingresa tu contraseña actual
                      </li>
                      <li
                        className={`flex items-center gap-2 ${
                          passwordData.newPassword &&
                          passwordData.newPassword.length >= 8
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            passwordData.newPassword &&
                            passwordData.newPassword.length >= 8
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></span>
                        Nueva contraseña de al menos 8 caracteres
                      </li>
                      <li
                        className={`flex items-center gap-2 ${
                          passwordData.confirmPassword &&
                          passwordData.newPassword ===
                            passwordData.confirmPassword
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            passwordData.confirmPassword &&
                            passwordData.newPassword ===
                              passwordData.confirmPassword
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></span>
                        Confirma que las contraseñas coincidan
                      </li>
                    </ul>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={handleChangePassword}
                    disabled={
                      loading ||
                      !passwordData.currentPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword ||
                      passwordData.newPassword.length < 8 ||
                      passwordData.newPassword !== passwordData.confirmPassword
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    Cambiar contraseña
                  </button>
                </div>
              </div>
            )}

            {/* Sección de Notificaciones - OCULTA */}
            {false && activeSection === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Preferencias de Notificación
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          Notificaciones por email
                        </h3>
                        <p className="text-sm text-gray-500">
                          Recibe actualizaciones importantes por correo
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.email_notifications}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              email_notifications: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          Actualizaciones de pedidos
                        </h3>
                        <p className="text-sm text-gray-500">
                          Notificaciones sobre el estado de tus pedidos
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.order_updates}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              order_updates: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          Promociones y ofertas
                        </h3>
                        <p className="text-sm text-gray-500">
                          Recibe ofertas especiales y descuentos
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.promotions}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              promotions: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          Newsletter
                        </h3>
                        <p className="text-sm text-gray-500">
                          Recibe nuestro boletín con novedades
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.newsletter}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              newsletter: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotifications}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                    Guardar preferencias
                  </button>
                </div>
              </div>
            )}

            {/* Sección de Facturación - OCULTA */}
            {false && activeSection === "billing" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Información de Facturación
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de tarjeta
                      </label>
                      <input
                        type="text"
                        value={billingData.cardNumber}
                        onChange={(e) =>
                          setBillingData({
                            ...billingData,
                            cardNumber: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de vencimiento
                      </label>
                      <input
                        type="text"
                        value={billingData.expiryDate}
                        onChange={(e) =>
                          setBillingData({
                            ...billingData,
                            expiryDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del titular
                      </label>
                      <input
                        type="text"
                        value={billingData.cardholderName}
                        onChange={(e) =>
                          setBillingData({
                            ...billingData,
                            cardholderName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección de facturación
                      </label>
                      <input
                        type="text"
                        value={billingData.billingAddress}
                        onChange={(e) =>
                          setBillingData({
                            ...billingData,
                            billingAddress: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveBilling}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Guardar información
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast para notificaciones */}
      <Toast
        isVisible={toast.isVisible}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={hideToast}
      />
    </div>
  );
}
