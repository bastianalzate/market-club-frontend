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
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

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
  const [activeSection, setActiveSection] = useState<
    "profile" | "security" | "notifications" | "billing"
  >("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados del formulario
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: "",
    city: "",
    country: "Colombia",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotions: true,
    newsletter: false,
  });

  const [billingData, setBillingData] = useState({
    cardNumber: "**** **** **** 1234",
    expiryDate: "12/25",
    cardholderName: user.name,
    billingAddress: "",
  });

  const handleSaveProfile = () => {
    // Aquí se enviaría la información al backend
    console.log("Guardando perfil:", profileData);
  };

  const handleChangePassword = () => {
    // Aquí se enviaría la nueva contraseña al backend
    console.log("Cambiando contraseña");
  };

  const handleSaveNotifications = () => {
    // Aquí se guardarían las preferencias de notificación
    console.log("Guardando notificaciones:", notificationSettings);
  };

  const handleSaveBilling = () => {
    // Aquí se guardarían los datos de facturación
    console.log("Guardando facturación:", billingData);
  };

  const sections = [
    { id: "profile" as const, label: "Perfil", icon: User },
    { id: "security" as const, label: "Seguridad", icon: Lock },
    { id: "notifications" as const, label: "Notificaciones", icon: Bell },
    { id: "billing" as const, label: "Facturación", icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      {/* Navegación de secciones */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeSection === section.id
                    ? "bg-yellow-100 text-yellow-900 border border-yellow-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido de la sección activa */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {activeSection === "profile" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Información Personal
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={profileData.country}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        country: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent text-gray-900 placeholder-gray-500"
                  >
                    <option value="Colombia">Colombia</option>
                    <option value="México">México</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Chile">Chile</option>
                    <option value="Perú">Perú</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    value={profileData.address}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                    placeholder="Calle 123 #45-67, Medellín"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                style={{ backgroundColor: "rgb(180, 140, 43)" }}
              >
                <Save className="w-4 h-4" />
                Guardar cambios
              </button>
            </div>
          </div>
        )}

        {activeSection === "security" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Seguridad</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña actual
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
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
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent text-gray-900 placeholder-gray-500"
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar nueva contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleChangePassword}
                className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                style={{ backgroundColor: "rgb(180, 140, 43)" }}
              >
                <Shield className="w-4 h-4" />
                Cambiar contraseña
              </button>
            </div>
          </div>
        )}

        {activeSection === "notifications" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Preferencias de Notificación
            </h3>

            <div className="space-y-4">
              {Object.entries(notificationSettings).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {key === "emailNotifications" &&
                        "Notificaciones por email"}
                      {key === "smsNotifications" && "Notificaciones por SMS"}
                      {key === "orderUpdates" && "Actualizaciones de pedidos"}
                      {key === "promotions" && "Promociones y ofertas"}
                      {key === "newsletter" && "Boletín informativo"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {key === "emailNotifications" &&
                        "Recibe notificaciones importantes por correo electrónico"}
                      {key === "smsNotifications" &&
                        "Recibe alertas por mensaje de texto"}
                      {key === "orderUpdates" &&
                        "Notificaciones sobre el estado de tus pedidos"}
                      {key === "promotions" &&
                        "Ofertas especiales y descuentos"}
                      {key === "newsletter" &&
                        "Novedades y contenido exclusivo"}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          [key]: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveNotifications}
                className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                style={{ backgroundColor: "rgb(180, 140, 43)" }}
              >
                <Bell className="w-4 h-4" />
                Guardar preferencias
              </button>
            </div>
          </div>
        )}

        {activeSection === "billing" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Información de Facturación
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de tarjeta
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={billingData.cardNumber}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de vencimiento
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={billingData.expiryDate}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del titular
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={billingData.cardholderName}
                    onChange={(e) =>
                      setBillingData({
                        ...billingData,
                        cardholderName: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de facturación
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    value={billingData.billingAddress}
                    onChange={(e) =>
                      setBillingData({
                        ...billingData,
                        billingAddress: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-600 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                    placeholder="Dirección para facturación"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveBilling}
                className="flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                style={{ backgroundColor: "rgb(180, 140, 43)" }}
              >
                <CreditCard className="w-4 h-4" />
                Guardar información
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
