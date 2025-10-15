"use client";

import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Mail, Phone } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "¿Cómo funciona Market Club?",
    answer: "Market Club es tu espacio para descubrir y disfrutar las mejores cervezas del mundo. Ofrecemos suscripciones mensuales con selecciones curadas de cervezas artesanales e importadas, además de un catálogo completo para compras individuales.",
    category: "General"
  },
  {
    id: "2",
    question: "¿Qué tipos de suscripciones ofrecen?",
    answer: "Tenemos tres planes: Curioso Cervecero (3 cervezas, $150.000/mes), Coleccionista Cervecero (5 cervezas, $200.000/mes) y Maestro Cervecero (3 cervezas premium, $200.000/mes). Cada plan incluye cervezas seleccionadas y ocasionalmente licores especiales.",
    category: "Suscripciones"
  },
  {
    id: "3",
    question: "¿Puedo cancelar mi suscripción en cualquier momento?",
    answer: "Sí, puedes cancelar tu suscripción cuando quieras sin penalizaciones. Solo necesitas contactarnos y procesaremos la cancelación para el siguiente período de facturación.",
    category: "Suscripciones"
  },
  {
    id: "4",
    question: "¿Hacen envíos a toda Colombia?",
    answer: "Sí, realizamos envíos a todas las ciudades principales de Colombia. Los tiempos de entrega varían según la ubicación, generalmente entre 2-5 días hábiles.",
    category: "Envíos"
  },
  {
    id: "5",
    question: "¿Cuáles son los costos de envío?",
    answer: "Los costos de envío varían según la ubicación y el peso del pedido. Para suscriptores del Club de Socios, ofrecemos envíos gratuitos en pedidos superiores a $100.000.",
    category: "Envíos"
  },
  {
    id: "6",
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), PSE, y pagos a través de Wompi. También ofrecemos la opción de pago contra entrega en algunas ciudades.",
    category: "Pagos"
  },
  {
    id: "7",
    question: "¿Puedo personalizar mi caja mensual?",
    answer: "Con el plan Maestro Cervecero y servicios VIP, ofrecemos personalización de tu caja mensual según tus preferencias. También puedes contactarnos para solicitar cervezas específicas.",
    category: "Suscripciones"
  },
  {
    id: "8",
    question: "¿Qué pasa si no me gusta una cerveza?",
    answer: "Entendemos que los gustos son personales. Si no estás satisfecho con alguna selección, contáctanos y haremos nuestro mejor esfuerzo para ajustar futuras entregas a tus preferencias.",
    category: "General"
  },
  {
    id: "9",
    question: "¿Ofrecen cervezas sin alcohol?",
    answer: "Sí, tenemos una selección de cervezas sin alcohol y bajas en alcohol. Puedes especificar esta preferencia al suscribirte o contactarnos para incluir estas opciones en tu caja.",
    category: "Productos"
  },
  {
    id: "10",
    question: "¿Cómo puedo contactar soporte al cliente?",
    answer: "Puedes contactarnos a través de WhatsApp, email (hola@marketclub.com), o completando el formulario de contacto en nuestra página. Nuestro equipo está disponible de lunes a viernes de 9 AM a 6 PM.",
    category: "Soporte"
  },
  {
    id: "11",
    question: "¿Tienen programa de referidos?",
    answer: "Sí, tenemos un programa de referidos donde puedes ganar descuentos por cada amigo que se suscriba usando tu código de referido. Los detalles se envían por email al suscribirte.",
    category: "General"
  },
  {
    id: "12",
    question: "¿Puedo pausar mi suscripción temporalmente?",
    answer: "Sí, puedes pausar tu suscripción por hasta 3 meses. Durante la pausa, no se realizarán cargos y podrás reactivar cuando desees.",
    category: "Suscripciones"
  }
];

const categories = ["Todos", "General", "Suscripciones", "Envíos", "Pagos", "Productos", "Soporte"];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === "Todos" || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-yellow-50 to-yellow-100 py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500 rounded-full mb-8 shadow-lg">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <h1 
              className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-oswald)', fontWeight: 700 }}
            >
              Preguntas Frecuentes
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Encuentra respuestas a las preguntas más comunes sobre Market Club
            </p>
            <div className="w-32 h-1 bg-yellow-500 mx-auto rounded-full mt-8"></div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar preguntas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pl-14 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                />
                <HelpCircle className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-yellow-500 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-yellow-50 border border-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No se encontraron resultados
                </h3>
                <p className="text-gray-600">
                  Intenta con otros términos de búsqueda o selecciona una categoría diferente.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <div
                    key={faq.id}
                    className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full px-6 py-6 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-inset rounded-2xl"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {faq.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 pr-4">
                          {faq.question}
                        </h3>
                      </div>
                      <div className="flex-shrink-0">
                        {openItems.includes(faq.id) ? (
                          <ChevronUp className="w-6 h-6 text-yellow-500" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </button>
                    
                    {openItems.includes(faq.id) && (
                      <div className="px-6 pb-6">
                        <div className="border-t border-gray-100 pt-4">
                          <p className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: 'var(--font-oswald)', fontWeight: 700 }}
            >
              ¿No encontraste lo que buscabas?
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Nuestro equipo está aquí para ayudarte. Contáctanos y te responderemos lo antes posible.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* WhatsApp */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6">
                  <MessageCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">WhatsApp</h3>
                <p className="text-gray-600 mb-4">Respuesta rápida y directa</p>
                <a
                  href="https://wa.me/573001234567"
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  Chatear ahora
                </a>
              </div>

              {/* Email */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-2xl mb-6">
                  <Mail className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Email</h3>
                <p className="text-gray-600 mb-4">hola@marketclub.com</p>
                <a
                  href="mailto:hola@marketclub.com"
                  className="inline-flex items-center justify-center px-6 py-3 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                >
                  Enviar email
                </a>
              </div>

              {/* Teléfono */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
                  <Phone className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Teléfono</h3>
                <p className="text-gray-600 mb-4">Lunes a Viernes 9AM-6PM</p>
                <a
                  href="tel:+573001234567"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Llamar ahora
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
