import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Compra Online | Market Club",
  description:
    "Política de Compra Online con Recogida en Tienda Física de Market Club - Términos y condiciones para compras en línea",
};

export default function PoliticaDeCompraOnlinePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Política de Compra Online
          </h1>
          <p
            className="text-gray-600 text-lg"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Compra Online con Recogida en Tienda Física
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
                1. OBJETO
              </h2>
              <p
                className="text-gray-700 leading-relaxed"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                La presente política tiene como finalidad establecer las
                condiciones aplicables a las compras realizadas a través del
                sitio web{" "}
                <a
                  href="https://marketclub.com.co"
                  className="text-blue-600 hover:underline"
                >
                  https://marketclub.com.co
                </a>{" "}
                bajo la modalidad "Compra Online con Recogida en Tienda
                Física", la cual permite a los clientes efectuar el pago en
                línea y retirar personalmente los productos en los puntos
                autorizados de Market Club.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                2. MARCO LEGAL
              </h2>
              <p
                className="text-gray-700 leading-relaxed"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Esta política se rige por lo dispuesto en la Ley 1480 de 2011
                (Estatuto del Consumidor), la Ley 527 de 1999 (Comercio
                Electrónico) y demás normas que regulan la protección al
                consumidor, la venta a distancia y la comercialización de
                bebidas alcohólicas en Colombia.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                3. DISPONIBILIDAD DE PRODUCTOS
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Todos los productos disponibles para recogida en tienda están
                  sujetos a inventario en el punto físico seleccionado.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  En caso de agotamiento o indisponibilidad, Market Club S.A.S.
                  notificará al cliente para ofrecer:
                  <ul className="list-circle list-inside ml-6 mt-2 space-y-1">
                    <li>Un producto equivalente o sustituto.</li>
                    <li>Cambio de punto de recogida.</li>
                    <li>Reembolso total del valor pagado.</li>
                  </ul>
                </li>
              </ul>
            </section>

            {/* Section 4 - Highlighted */}
            <section className="bg-indigo-50 p-6 rounded-lg">
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                4. PROCESO DE COMPRA Y CONFIRMACIÓN
              </h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  El cliente realiza su compra en línea y selecciona la opción
                  "Recoger en tienda" durante el proceso de pago.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Tras finalizar el pago, el cliente recibirá un correo
                  electrónico de confirmación con el número de pedido y los
                  datos de la tienda seleccionada.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Una vez el pedido esté listo, Market Club notificará por
                  correo o mensaje de texto que el producto se encuentra
                  disponible para recogida.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  El cliente debe presentarse en el punto indicado con:
                  <ul className="list-circle list-inside ml-6 mt-2 space-y-1">
                    <li>Documento de identidad original.</li>
                    <li>Número de pedido o comprobante de pago.</li>
                  </ul>
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Si el retiro lo realiza un tercero, se requerirá autorización
                  escrita del titular de la compra junto con copias de los
                  documentos de identidad del comprador y del autorizado.
                </li>
              </ol>
            </section>

            {/* Section 5 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                5. PLAZOS Y CONDICIONES DE RECOGIDA
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  El cliente cuenta con un plazo máximo de cinco (5) días
                  hábiles desde la notificación de disponibilidad para retirar
                  su pedido.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Si el pedido no es reclamado dentro del plazo, Market Club
                  podrá:
                  <ul className="list-circle list-inside ml-6 mt-2 space-y-1">
                    <li>Cancelar la compra.</li>
                    <li>
                      Reintegrar el valor pagado al mismo medio de pago,
                      descontando costos administrativos o de manejo si aplica.
                    </li>
                  </ul>
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  El horario de atención y entrega corresponderá al del punto
                  físico seleccionado y será informado al momento de la
                  confirmación del pedido.
                </li>
              </ul>
            </section>

            {/* Section 6 - Warning */}
            <section className="bg-yellow-50 border-l-4 border-yellow-600 p-6">
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                6. VERIFICACIÓN DE EDAD Y CONSUMO RESPONSABLE
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Conforme a la Ley 124 de 1994 y la Ley 30 de 1986, está
                  prohibido el expendio de bebidas alcohólicas a menores de 18
                  años.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Al recoger el pedido, el cliente deberá acreditar su mayoría
                  de edad mediante documento oficial de identidad.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Market Club S.A.S. promueve el consumo responsable y recuerda
                  que el exceso de alcohol es perjudicial para la salud.
                </li>
              </ul>
              <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
                <p
                  className="text-sm font-semibold text-yellow-900"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  "Prohíbese el expendio de bebidas embriagantes a menores de
                  edad." — Ley 124 de 1994
                  <br />
                  "El exceso de alcohol es perjudicial para la salud." — Ley 30
                  de 1986
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                7. CAMBIOS, DEVOLUCIONES Y GARANTÍAS
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Los productos retirados en tienda se rigen por la Política de
                  Devoluciones y Garantías disponible en el sitio web.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  No se aceptan devoluciones de bebidas alcohólicas abiertas,
                  manipuladas o sin su sello original.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Si el producto presenta defectos de calidad o no corresponde
                  al solicitado, el cliente podrá reportarlo dentro de las 48
                  horas posteriores a la recogida, enviando evidencia
                  fotográfica a{" "}
                  <a
                    href="mailto:info@marketclub.com.co"
                    className="text-blue-600 hover:underline"
                  >
                    info@marketclub.com.co
                  </a>
                  .
                </li>
              </ul>
            </section>

            {/* Section 8 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                8. REEMBOLSOS
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  En los casos en que proceda un reembolso, este se efectuará
                  al mismo método de pago utilizado por el cliente, dentro de
                  los 30 días calendario siguientes a la aceptación de la
                  solicitud.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Si el pago fue efectuado con tarjeta de crédito, los tiempos
                  de reversión dependerán de la entidad bancaria emisora.
                </li>
              </ul>
            </section>

            {/* Section 9 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                9. RESPONSABILIDAD
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Market Club S.A.S. no se hace responsable por demoras
                  ocasionadas por causas de fuerza mayor, errores en la
                  información suministrada por el cliente o no comparecencia
                  dentro del plazo establecido.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Una vez el pedido sea entregado al cliente o autorizado, se
                  entenderá completada la transacción.
                </li>
              </ul>
            </section>

            {/* Section 10 - Contact */}
            <section className="bg-green-50 border-l-4 border-green-600 p-6">
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                10. CONTACTO
              </h2>
              <p
                className="text-gray-700 leading-relaxed mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Para dudas, cambios o reclamaciones relacionadas con esta
                modalidad:
              </p>
              <div className="space-y-2">
                <p
                  className="text-gray-800"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  <strong>Correo:</strong>{" "}
                  <a
                    href="mailto:info@marketclub.com.co"
                    className="text-green-600 hover:text-green-700 underline"
                  >
                    info@marketclub.com.co
                  </a>
                </p>
                <p
                  className="text-gray-800"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  <strong>Contacto:</strong>{" "}
                  <a
                    href="tel:+573160530019"
                    className="text-green-600 hover:text-green-700 underline"
                  >
                    +57 3160530019
                  </a>
                </p>
                <p
                  className="text-gray-800"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  <strong>Dirección:</strong> Cl. 43 #74-61 Local 3. Laureles -
                  Estadio. Medellín, Antioquia.
                </p>
              </div>
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

