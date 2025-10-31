import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad | Market Club",
  description:
    "Política de Privacidad y Tratamiento de Datos Personales de Market Club - Cumplimos con la Ley 1581 de 2012",
};

export default function PoliticaDePrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Política de Privacidad
          </h1>
          <p
            className="text-gray-600 text-lg"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Tratamiento de Datos Personales
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-12">
          {/* Info Box */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p
                  className="text-sm text-blue-800"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  <strong>Sitio web:</strong> https://marketclub.com.co
                  <br />
                  <strong>Responsable:</strong> Market Club SAS
                  <br />
                  <strong>NIT:</strong> 901689231
                  <br />
                  <strong>Domicilio:</strong> Medellín, Antioquia, Colombia
                </p>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                1. MARCO LEGAL
              </h2>
              <p
                className="text-gray-700 leading-relaxed"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Esta política cumple con la Ley 1581 de 2012, el Decreto 1377 de
                2013, la Ley 1266 de 2008 y demás normas concordantes sobre
                protección de datos personales en Colombia.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                2. FINALIDAD DEL TRATAMIENTO
              </h2>
              <p
                className="text-gray-700 leading-relaxed mb-3"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Los datos personales recolectados por Market Club se utilizarán
                para las siguientes finalidades:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Registrar, autenticar y gestionar cuentas de usuario en el
                  Sitio.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Procesar pedidos, pagos y entregas de productos.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Gestionar la atención al cliente, solicitudes, quejas y
                  reclamos.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Cumplir obligaciones legales, fiscales y contractuales.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Enviar información comercial, promociones o novedades (previo
                  consentimiento).
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Verificar edad y elegibilidad para compra de bebidas
                  alcohólicas.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Analizar hábitos de consumo y mejorar la experiencia del
                  usuario.
                </li>
              </ul>
            </section>

            {/* Section 3 - Important */}
            <section className="bg-indigo-50 p-6 rounded-lg">
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                3. DATOS PERSONALES RECOLECTADOS
              </h2>

              <div className="space-y-4">
                {/* A. Registro/Login */}
                <div>
                  <h3
                    className="text-lg font-semibold text-gray-900 mb-2"
                    style={{ fontFamily: "var(--font-lato)" }}
                  >
                    A. Formulario de Registro/Login
                  </h3>
                  <p
                    className="text-gray-700"
                    style={{ fontFamily: "var(--font-lato)" }}
                  >
                    Nombre completo · Email · Contraseña · Teléfono · Fecha de
                    nacimiento · Profesión · País (Colombia por defecto) · NIT
                    (solo mayoristas) · Documento de mayorista (archivo).
                  </p>
                </div>

                {/* B. Contacto */}
                <div>
                  <h3
                    className="text-lg font-semibold text-gray-900 mb-2"
                    style={{ fontFamily: "var(--font-lato)" }}
                  >
                    B. Formulario de Contacto
                  </h3>
                  <p
                    className="text-gray-700"
                    style={{ fontFamily: "var(--font-lato)" }}
                  >
                    Primer nombre · Apellidos · Email · Teléfono · Fecha de
                    nacimiento · Profesión · Mensaje · Aceptación de política de
                    privacidad.
                  </p>
                </div>

                {/* C. Checkout */}
                <div>
                  <h3
                    className="text-lg font-semibold text-gray-900 mb-2"
                    style={{ fontFamily: "var(--font-lato)" }}
                  >
                    C. Formulario de Checkout
                  </h3>
                  <p
                    className="text-gray-700"
                    style={{ fontFamily: "var(--font-lato)" }}
                  >
                    Nombre completo · Email · Dirección de envío · Ciudad ·
                    Código postal · Teléfono · Dirección de facturación
                    (opcional) · Método de pago.
                  </p>
                </div>

                {/* D. Perfil */}
                <div>
                  <h3
                    className="text-lg font-semibold text-gray-900 mb-2"
                    style={{ fontFamily: "var(--font-lato)" }}
                  >
                    D. Formulario de Perfil
                  </h3>
                  <p
                    className="text-gray-700"
                    style={{ fontFamily: "var(--font-lato)" }}
                  >
                    Nombre completo · Email · Teléfono · Dirección completa ·
                    Preferencias de notificaciones · Datos de facturación.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                4. TRATAMIENTO Y SEGURIDAD DE LOS DATOS
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Market Club implementa medidas técnicas, administrativas y
                  organizacionales para proteger la confidencialidad, integridad
                  y disponibilidad de la información.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Los datos se almacenan en servidores seguros, con acceso
                  restringido únicamente al personal autorizado.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  No se compartirán datos con terceros sin autorización previa,
                  salvo por exigencia legal o entidades encargadas del
                  procesamiento de pagos y logística.
                </li>
              </ul>
            </section>

            {/* Section 5 - Important */}
            <section className="bg-green-50 border-l-4 border-green-600 p-6">
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                5. DERECHOS DE LOS TITULARES
              </h2>
              <p
                className="text-gray-700 leading-relaxed mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Los usuarios pueden ejercer en cualquier momento los derechos de
                acceso, rectificación, actualización, supresión y revocatoria de
                autorización (ARCO), enviando solicitud al correo:
              </p>
              <div className="bg-white p-4 rounded-lg">
                <p
                  className="text-lg font-semibold text-green-700"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  <a
                    href="mailto:info@marketclub.com.co"
                    className="hover:underline"
                  >
                    info@marketclub.com.co
                  </a>
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                6. AUTORIZACIÓN DEL TITULAR
              </h2>
              <p
                className="text-gray-700 leading-relaxed"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Al registrarse o usar el Sitio, el Usuario declara haber leído y
                aceptado esta política y autoriza expresamente a Market Club
                para tratar sus datos conforme a las finalidades descritas.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                7. CONSERVACIÓN Y SUPRESIÓN DE DATOS
              </h2>
              <p
                className="text-gray-700 leading-relaxed"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Los datos serán conservados mientras sean necesarios para el
                cumplimiento de las finalidades descritas o durante los plazos
                exigidos por ley. Una vez cumplida la finalidad, los datos se
                eliminarán o anonimizarán de manera segura.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                8. TRANSFERENCIA INTERNACIONAL DE DATOS
              </h2>
              <p
                className="text-gray-700 leading-relaxed"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                En caso de que los datos sean almacenados en servidores ubicados
                fuera de Colombia, Market Club garantizará el cumplimiento de
                los estándares de protección equivalentes a los exigidos por la
                legislación colombiana.
              </p>
            </section>

            {/* Section 9 - Warning */}
            <section className="bg-yellow-50 border-l-4 border-yellow-600 p-6">
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                9. MENORES DE EDAD
              </h2>
              <p
                className="text-gray-700 leading-relaxed"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Este Sitio no recolecta ni trata intencionadamente datos
                personales de menores de 18 años, dado que la venta de bebidas
                alcohólicas a menores está prohibida por la Ley 124 de 1994.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                10. ACTUALIZACIÓN DE LA POLÍTICA
              </h2>
              <p
                className="text-gray-700 leading-relaxed"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Market Club podrá modificar esta política en cualquier momento.
                La versión vigente se publicará en el Sitio con su fecha de
                actualización.
              </p>
            </section>
          </div>

          {/* Footer note */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <p
              className="text-sm text-gray-500 text-center"
              style={{ fontFamily: "var(--font-lato)" }}
            >
              <strong>Última actualización:</strong> 30 de Octubre de 2025
            </p>
          </div>

          {/* Contact info */}
          <div className="mt-8 bg-blue-50 p-6 rounded-lg">
            <h3
              className="text-lg font-semibold text-gray-900 mb-3"
              style={{ fontFamily: "var(--font-lato)" }}
            >
              ¿Tienes dudas sobre el tratamiento de tus datos?
            </h3>
            <p
              className="text-gray-700 mb-4"
              style={{ fontFamily: "var(--font-lato)" }}
            >
              Contáctanos para ejercer tus derechos ARCO o resolver cualquier
              inquietud:
            </p>
            <div className="space-y-2">
              <p
                className="text-gray-800"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:info@marketclub.com.co"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  info@marketclub.com.co
                </a>
              </p>
              <p
                className="text-gray-800"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                <strong>Teléfono:</strong>{" "}
                <a
                  href="tel:+573160530019"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  +57 3160530019
                </a>
              </p>
            </div>
          </div>

          {/* Back to home button */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
              style={{ fontFamily: "var(--font-lato)" }}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
