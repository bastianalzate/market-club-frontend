"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { constants } from "@/config/constants";
import MarketClubBanner from "@/components/home/MarketClubBanner";

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    profession: "",
    message: "",
    acceptPrivacy: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Estados específicos para validaciones de los nuevos campos
  const [dateOfBirthTouched, setDateOfBirthTouched] = useState(false);
  const [professionTouched, setProfessionTouched] = useState(false);
  
  // Estados para controlar las validaciones
  const [dateOfBirthError, setDateOfBirthError] = useState("");
  const [professionError, setProfessionError] = useState("");

  const [countryCode, setCountryCode] = useState("COP");

  // useEffect para ejecutar validaciones cuando cambien las variables
  React.useEffect(() => {
    if (dateOfBirthTouched) {
      validateDateOfBirth();
    }
  }, [formData.dateOfBirth, dateOfBirthTouched]);

  React.useEffect(() => {
    if (professionTouched) {
      validateProfession();
    }
  }, [formData.profession, professionTouched]);

  // Funciones simples para validar solo las variables
  const validateDateOfBirth = () => {
    if (!dateOfBirthTouched) return;
    
    if (!formData.dateOfBirth) {
      const errorMsg = "La fecha de nacimiento es requerida";
      setDateOfBirthError(errorMsg);
      setErrors(prev => ({ ...prev, dateOfBirth: errorMsg }));
      return;
    }
    
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    if (isNaN(birthDate.getTime())) {
      const errorMsg = "La fecha de nacimiento debe ser una fecha válida";
      setDateOfBirthError(errorMsg);
      setErrors(prev => ({ ...prev, dateOfBirth: errorMsg }));
    } else if (birthDate >= today) {
      const errorMsg = "La fecha de nacimiento debe ser anterior a hoy";
      setDateOfBirthError(errorMsg);
      setErrors(prev => ({ ...prev, dateOfBirth: errorMsg }));
    } else {
      setDateOfBirthError("");
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.dateOfBirth;
        return newErrors;
      });
    }
  };

  const validateProfession = () => {
    if (!professionTouched) return;
    
    if (!formData.profession.trim()) {
      const errorMsg = "La profesión es requerida";
      setProfessionError(errorMsg);
      setErrors(prev => ({ ...prev, profession: errorMsg }));
      return;
    }
    
    if (formData.profession.trim().length > 255) {
      const errorMsg = "La profesión no puede exceder 255 caracteres";
      setProfessionError(errorMsg);
      setErrors(prev => ({ ...prev, profession: errorMsg }));
    } else {
      setProfessionError("");
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.profession;
        return newErrors;
      });
    }
  };

  // Función de validación
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validar primer nombre
    if (!formData.firstName.trim()) {
      newErrors.firstName = "El primer nombre es requerido";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "El primer nombre debe tener al menos 2 caracteres";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.firstName.trim())) {
      newErrors.firstName = "El primer nombre solo puede contener letras";
    }

    // Validar apellidos
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Los apellidos son requeridos";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Los apellidos deben tener al menos 2 caracteres";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.lastName.trim())) {
      newErrors.lastName = "Los apellidos solo pueden contener letras";
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Por favor ingresa un email válido";
    }

    // Validar teléfono
    if (!formData.phone.trim()) {
      newErrors.phone = "El número de teléfono es requerido";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone.trim())) {
      newErrors.phone = "El número de teléfono contiene caracteres inválidos";
    } else if (formData.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "El número de teléfono debe tener al menos 10 dígitos";
    }

    // Validar fecha de nacimiento
    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = "La fecha de nacimiento es requerida";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      if (isNaN(birthDate.getTime())) {
        newErrors.dateOfBirth = "La fecha de nacimiento debe ser una fecha válida";
      } else if (birthDate >= today) {
        newErrors.dateOfBirth = "La fecha de nacimiento debe ser anterior a hoy";
      }
    }

    // Validar profesión
    if (!formData.profession.trim()) {
      newErrors.profession = "La profesión es requerida";
    } else if (formData.profession.trim().length > 255) {
      newErrors.profession = "La profesión no puede exceder 255 caracteres";
    }

    // Validar mensaje
    if (!formData.message.trim()) {
      newErrors.message = "El mensaje es requerido";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "El mensaje debe tener al menos 10 caracteres";
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = "El mensaje no puede exceder 1000 caracteres";
    }

    // Validar política de privacidad
    if (!formData.acceptPrivacy) {
      newErrors.acceptPrivacy = "Debes aceptar la política de privacidad";
    }

    return newErrors;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    
    // Actualizar el estado
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Marcar campos como tocados
    if (name === "dateOfBirth") {
      setDateOfBirthTouched(true);
    }
    if (name === "profession") {
      setProfessionTouched(true);
    }
    
    // Para otros campos, usar la validación normal
    if (name !== "dateOfBirth" && name !== "profession") {
      validateField(name, newValue);
    }
  };

  // Función para manejar cuando el usuario sale del campo
  const handleBlur = (fieldName: string) => {
    if (fieldName === "dateOfBirth") {
      setDateOfBirthTouched(true);
    }
    if (fieldName === "profession") {
      setProfessionTouched(true);
    }
  };

  // Función para validar un campo específico en tiempo real
  const validateField = (fieldName: string, value: any) => {
    const newErrors = { ...errors };

    // Limpiar errores previos del campo
    delete newErrors[fieldName];

    switch (fieldName) {
      case "firstName":
        if (!value.trim()) {
          newErrors.firstName = "El primer nombre es requerido";
        } else if (value.trim().length < 2) {
          newErrors.firstName =
            "El primer nombre debe tener al menos 2 caracteres";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())) {
          newErrors.firstName = "El primer nombre solo puede contener letras";
        } else {
          delete newErrors.firstName;
        }
        break;

      case "lastName":
        if (!value.trim()) {
          newErrors.lastName = "Los apellidos son requeridos";
        } else if (value.trim().length < 2) {
          newErrors.lastName =
            "Los apellidos deben tener al menos 2 caracteres";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())) {
          newErrors.lastName = "Los apellidos solo pueden contener letras";
        } else {
          delete newErrors.lastName;
        }
        break;

      case "email":
        if (!value.trim()) {
          newErrors.email = "El email es requerido";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          newErrors.email = "Por favor ingresa un email válido";
        } else {
          delete newErrors.email;
        }
        break;

      case "phone":
        if (!value.trim()) {
          newErrors.phone = "El número de teléfono es requerido";
        } else if (!/^[\d\s\-\+\(\)]+$/.test(value.trim())) {
          newErrors.phone =
            "El número de teléfono contiene caracteres inválidos";
        } else if (value.replace(/\D/g, "").length < 10) {
          newErrors.phone =
            "El número de teléfono debe tener al menos 10 dígitos";
        } else {
          delete newErrors.phone;
        }
        break;

      // Los casos dateOfBirth y profession se manejan con sus propias funciones
      case "dateOfBirth":
      case "profession":
        // No hacer nada aquí, se manejan con validateDateOfBirth() y validateProfession()
        break;

      case "message":
        if (!value.trim()) {
          newErrors.message = "El mensaje es requerido";
        } else if (value.trim().length < 10) {
          newErrors.message = "El mensaje debe tener al menos 10 caracteres";
        } else if (value.trim().length > 1000) {
          newErrors.message = "El mensaje no puede exceder 1000 caracteres";
        } else {
          delete newErrors.message;
        }
        break;

      case "acceptPrivacy":
        if (!value) {
          newErrors.acceptPrivacy = "Debes aceptar la política de privacidad";
        } else {
          delete newErrors.acceptPrivacy;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Marcar todos los campos como tocados para activar validaciones
    setDateOfBirthTouched(true);
    setProfessionTouched(true);

    // Validar formulario completo
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Si no hay errores, proceder con el envío
    submitForm();
  };

  const submitForm = async () => {

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Enviar formulario al endpoint real
      const response = await fetch(`${constants.api_url}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          date_of_birth: formData.dateOfBirth || null,
          profession: formData.profession.trim() || null,
          message: formData.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al enviar el mensaje");
      }

      if (data.success) {
        console.log("Formulario enviado exitosamente:", data);
        setSubmitStatus("success");
        setSuccessMessage(
          data.message ||
            "¡Mensaje enviado correctamente! Te contactaremos pronto."
        );

        // Limpiar formulario después del envío exitoso
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          dateOfBirth: "",
          profession: "",
          message: "",
          acceptPrivacy: false,
        });
        setErrors({});
        setDateOfBirthError("");
        setProfessionError("");
        setDateOfBirthTouched(false);
        setProfessionTouched(false);
      } else {
        throw new Error(data.message || "Error al procesar el mensaje");
      }
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      setSubmitStatus("error");
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "Error al enviar el mensaje. Intenta nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        input::placeholder,
        textarea::placeholder {
          color: #667085 !important;
        }
        input,
        textarea {
          color: #667085 !important;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Formulario de Contacto */}
          <div className="space-y-8 lg:pr-8">

            <div>
              <h1
                className="text-black mb-4"
                style={{
                  fontFamily: "var(--font-oswald)",
                  fontWeight: 700,
                  fontSize: "64px",
                }}
              >
                ¿Tienes dudas? Contáctanos
              </h1>
              <p
                className="text-gray-600"
                style={{
                  fontFamily: "var(--font-text)",
                  fontWeight: 400,
                  fontSize: "20px",
                  color: "#667085",
                }}
              >
                ¡Nos encantaría escucharte! Escríbenos y te daremos la respuesta que necesitas de inmediato.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-gray-700 mb-2"
                    style={{
                      fontFamily: "var(--font-text)",
                      fontWeight: 500,
                      fontSize: "20px",
                    }}
                  >
                    Primer nombre
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Escribe tu nombre"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-200 ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{
                      fontFamily: "var(--font-text)",
                      fontWeight: 400,
                      fontSize: "16px",
                    }}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-gray-700 mb-2"
                    style={{
                      fontFamily: "var(--font-text)",
                      fontWeight: 500,
                      fontSize: "20px",
                    }}
                  >
                    Apellidos
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Escribe tu apellido"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-200 ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{
                      fontFamily: "var(--font-text)",
                      fontWeight: 400,
                      fontSize: "16px",
                    }}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 mb-2"
                  style={{
                    fontFamily: "var(--font-text)",
                    fontWeight: 500,
                    fontSize: "20px",
                  }}
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="info@marketclub.com.co"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-200 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  style={{
                    fontFamily: "var(--font-text)",
                    fontWeight: 400,
                    fontSize: "16px",
                  }}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-gray-700 mb-2"
                  style={{
                    fontFamily: "var(--font-text)",
                    fontWeight: 500,
                    fontSize: "20px",
                  }}
                >
                  Número celular
                </label>
                <div className="flex">
                  <div className="relative">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      aria-label="Código de país"
                      className="px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none appearance-none bg-white pr-8"
                      style={{
                        fontFamily: "var(--font-text)",
                        fontWeight: 400,
                        fontSize: "16px",
                        color: "#667085",
                      }}
                    >
                      <option value="COP">COP</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+57 (300) 000-0000"
                    className={`flex-1 px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-200 ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{
                      fontFamily: "var(--font-text)",
                      fontWeight: 400,
                      fontSize: "16px",
                    }}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Fecha de Nacimiento y Profesión */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="block text-gray-700 mb-2"
                    style={{
                      fontFamily: "var(--font-text)",
                      fontWeight: 500,
                      fontSize: "20px",
                    }}
                  >
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("dateOfBirth")}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-200 ${
                      dateOfBirthError || errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{
                      fontFamily: "var(--font-text)",
                      fontWeight: 400,
                      fontSize: "16px",
                    }}
                  />
                  {(dateOfBirthError || errors.dateOfBirth) && (
                    <p className="mt-1 text-sm text-red-600">
                      {dateOfBirthError || errors.dateOfBirth}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="profession"
                    className="block text-gray-700 mb-2"
                    style={{
                      fontFamily: "var(--font-text)",
                      fontWeight: 500,
                      fontSize: "20px",
                    }}
                  >
                    Profesión
                  </label>
                  <input
                    type="text"
                    id="profession"
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("profession")}
                    placeholder="Ej: Ingeniero, Médico, Estudiante..."
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-200 ${
                      professionError || errors.profession ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{
                      fontFamily: "var(--font-text)",
                      fontWeight: 400,
                      fontSize: "16px",
                    }}
                  />
                  {(professionError || errors.profession) && (
                    <p className="mt-1 text-sm text-red-600">
                      {professionError || errors.profession}
                    </p>
                  )}
                </div>
              </div>

              {/* Mensaje */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-gray-700 mb-2"
                  style={{
                    fontFamily: "var(--font-text)",
                    fontWeight: 500,
                    fontSize: "20px",
                  }}
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-200 resize-none ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Escribe tu mensaje aquí..."
                  style={{
                    fontFamily: "var(--font-text)",
                    fontWeight: 400,
                    fontSize: "16px",
                  }}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                )}
                <div className="text-right text-sm text-gray-500 mt-1">
                  {formData.message.length}/1000 caracteres
                </div>
              </div>

              {/* Checkbox de privacidad */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="acceptPrivacy"
                  name="acceptPrivacy"
                  checked={formData.acceptPrivacy}
                  onChange={handleInputChange}
                  className={`mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded ${
                    errors.acceptPrivacy ? "border-red-500" : ""
                  }`}
                />
                <label
                  htmlFor="acceptPrivacy"
                  className="ml-3 text-sm text-gray-700"
                >
                  Acepta nuestras{" "}
                  <a
                    href="#"
                    className="text-yellow-600 hover:text-yellow-700 underline"
                  >
                    política de privacidad
                  </a>
                  .
                </label>
              </div>
              {errors.acceptPrivacy && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.acceptPrivacy}
                </p>
              )}

              {/* Mensajes de estado */}
              {submitStatus === "success" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-center">{successMessage}</p>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-center">
                    {errors.submit ||
                      "Hubo un error al enviar el mensaje. Por favor intenta nuevamente."}
                  </p>
                </div>
              )}

              {errors.submit && submitStatus !== "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-center">{errors.submit}</p>
                </div>
              )}

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-semibold py-4 px-6 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 outline-none ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "text-white cursor-pointer"
                }`}
                style={{
                  backgroundColor: isSubmitting
                    ? undefined
                    : "rgb(180, 140, 43)",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = "rgb(160, 120, 23)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = "rgb(180, 140, 43)";
                  }
                }}
              >
                {isSubmitting ? "Enviando..." : "Enviar mensaje"}
              </button>
            </form>
          </div>

          {/* Imagen */}
          <div className="relative lg:sticky lg:top-8">
            {/* Imagen para móviles */}
            <div className="lg:hidden mb-8">
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/images/contact/contacto-banner.png"
                  alt="Personas brindando con cervezas"
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
            
            {/* Imagen para desktop */}
            <div className="hidden lg:block">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100">
              <Image
                src="/images/contact/contacto-banner.png"
                alt="Personas brindando con cervezas"
                width={500}
                height={600}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                priority
              />
              {/* Overlay sutil para mejorar el contraste */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Horarios y Ubicación - Fondo completo */}
      <div className="mt-16 bg-black w-full">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Mapa de Google Maps */}
            <div className="bg-black overflow-hidden h-full">
              <div className="h-full min-h-[600px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.176863748393!2d-75.59309892503105!3d6.264343093733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4429531b4d6d5d%3A0x7d8c2d6f8e0b6b3c!2sCl.%2043%20%2374-61%2C%20Laureles%20-%20Estadio%2C%20Medell%C3%ADn%2C%20Laureles%2C%20Medell%C3%ADn%2C%20Antioquia%2C%20Colombia!5e0!3m2!1ses!2sco!4v1728599999999"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación Market Club - Cl. 43 #74-61 Local 3, Laureles"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>

            {/* Horarios de Atención */}
            <div className="text-white flex items-center px-16 py-12">
              <div>
                <h2
                  className="text-white mb-10"
                  style={{
                    fontFamily: "var(--font-oswald)",
                    fontWeight: "bold",
                    fontSize: "64px",
                  }}
                >
                  Encuentranos en: 
                </h2>
                <div>
                <p
                    className="text-white"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontSize: "24px",
                      lineHeight: "1.2",
                      margin: 0,
                    }}
                  >
                    Dirección: Cl. 43 #74-61 Local 3, <br /> Laureles - Estadio, Medellín, Laureles, Medellín, Antioquia. 
                  </p>
                  <p
                    className="text-white !mt-4"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontSize: "24px",
                      lineHeight: "1.2",
                      margin: 0,
                    }}
                  >
                    Lunes a Sábado de 9:00 a.m. a 10:00 p.m.
                  </p>
                  <p
                    className="text-white"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontSize: "24px",
                      lineHeight: "1.2",
                      margin: 0,
                    }}
                  >
                    Domingos y Festivos de 11:00 a.m. a 9:00 p.m.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner de Market Club */}
      <MarketClubBanner backgroundColor="#B58E31" textColor="#FFFFFF" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"></div>
    </div>
  );
}
