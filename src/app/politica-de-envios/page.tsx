import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Envíos | Market Club",
  description:
    "Política de Envíos de Market Club - Condiciones, plazos y procedimientos para la entrega de productos adquiridos en línea",
};

export default function PoliticaDeEnviosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Política de Envíos
          </h1>
          <p
            className="text-gray-600 text-lg"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Condiciones, plazos y procedimientos de entrega
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
                  <br />
                  <strong>Correo electrónico:</strong>{" "}
                  <a
                    href="mailto:info@marketclub.com.co"
                    className="underline hover:text-blue-900"
                  >
                    info@marketclub.com.co
                  </a>
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
                condiciones, plazos y procedimientos aplicables al envío y
                entrega de productos adquiridos en línea a través del sitio web{" "}
                <a
                  href="https://marketclub.com.co"
                  className="text-blue-600 hover:underline"
                >
                  https://marketclub.com.co
                </a>
                . Aplica a todas las compras realizadas dentro del territorio
                nacional de la República de Colombia.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                2. COBERTURA Y TIEMPOS DE ENTREGA
              </h2>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3
                    className="text-lg font-semibold text-gray-900 mb-2"
                    style={{ fontFamily: "var(--font-lato)" }}
                  >
                    Envíos en Medellín y Área Metropolitana:
                  </h3>
                  <p
                    className="text-gray-700"
                    style={{ fontFamily: "var(--font-lato)" }}
                  >
                    Los pedidos se entregarán en un plazo de 1 a 3 días hábiles
                    contados a partir de la confirmación del pago.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3
                    className="text-lg font-semibold text-gray-900 mb-2"
                    style={{ fontFamily: "var(--font-lato)" }}
                  >
                    Envíos al resto de Colombia:
                  </h3>
                  <p
                    className="text-gray-700"
                    style={{ fontFamily: "var(--font-lato)" }}
                  >
                    Los pedidos se entregarán en un plazo de 3 a 5 días hábiles,
                    dependiendo de la ciudad de destino y las condiciones
                    logísticas del transportador.
                  </p>
                </div>
                <p
                  className="text-gray-700 leading-relaxed"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  <strong>Nota:</strong> Los tiempos de entrega pueden variar
                  por causas de fuerza mayor, restricciones de transporte,
                  eventos climáticos, disponibilidad del producto o períodos de
                  alta demanda.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-indigo-50 p-6 rounded-lg">
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                3. CONFIRMACIÓN Y DESPACHO DE PEDIDOS
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Los pedidos serán procesados una vez se haya confirmado el
                  pago exitoso mediante las pasarelas de pago habilitadas en el
                  sitio web.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  El cliente recibirá un correo electrónico o mensaje de texto
                  con la confirmación del pedido y número de guía una vez el
                  producto sea despachado.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Market Club realiza sus envíos mediante transportadoras
                  certificadas que garantizan la trazabilidad y seguridad del
                  paquete.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                4. COSTOS DE ENVÍO
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  El costo del envío será informado antes de finalizar la
                  compra, y dependerá del destino, peso y volumen del pedido.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  En ocasiones, Market Club podrá ofrecer promociones de envío
                  gratuito o tarifas planas dentro de determinadas zonas o
                  montos mínimos de compra.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  En caso de devoluciones atribuibles al cliente (dirección
                  incorrecta, ausencia, rechazo del paquete), el nuevo envío
                  correrá por cuenta del comprador.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                5. DIRECCIÓN DE ENTREGA Y RESPONSABILIDAD DEL CLIENTE
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  El cliente debe proporcionar una dirección exacta y
                  verificable, así como un número de contacto activo.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Cualquier error u omisión en la información que impida la
                  entrega será responsabilidad exclusiva del cliente.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Si el cliente no se encuentra en el momento de la entrega, el
                  transportador podrá realizar hasta dos intentos adicionales o
                  dejar el paquete en el punto autorizado más cercano,
                  notificando al destinatario.
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                6. RECEPCIÓN DE PRODUCTOS
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  En el momento de la entrega, el cliente o persona autorizada
                  debe verificar el estado del paquete y sus sellos antes de
                  firmar la guía de recepción.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Si se evidencian daños, apertura, humedad o pérdida parcial
                  del contenido, el cliente debe rechazar la entrega y
                  reportarlo de inmediato al correo{" "}
                  <a
                    href="mailto:info@marketclub.com.co"
                    className="text-blue-600 hover:underline"
                  >
                    info@marketclub.com.co
                  </a>{" "}
                  adjuntando fotos del empaque y guía.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Una vez firmada la guía de transporte sin observaciones, se
                  entenderá que el pedido fue recibido a satisfacción.
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                7. ZONAS SIN COBERTURA
              </h2>
              <p
                className="text-gray-700 leading-relaxed mb-3"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Market Club S.A.S. realiza envíos a la mayoría de las ciudades y
                municipios del territorio nacional. Sin embargo, puede haber
                zonas con restricciones logísticas o de transporte donde no se
                garantice la entrega. En dichos casos, el cliente será
                notificado y podrá:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Cambiar la dirección de entrega
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Solicitar la devolución total del dinero
                </li>
              </ul>
            </section>

            {/* Section 8 - Warning */}
            <section className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg">
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                8. CONDICIONES ESPECIALES PARA BEBIDAS ALCOHÓLICAS
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Las entregas se realizarán exclusivamente a personas mayores
                  de 18 años, quienes deberán presentar documento de identidad
                  vigente al recibir el pedido.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  No se entregarán pedidos de bebidas alcohólicas a menores de
                  edad ni a personas que no acrediten su mayoría de edad.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  El cliente acepta esta condición como parte del cumplimiento
                  de la Ley 124 de 1994 y la Ley 30 de 1986.
                </li>
              </ul>
              <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
                <p
                  className="text-sm font-semibold text-yellow-900"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  "El exceso de alcohol es perjudicial para la salud. Prohíbese
                  el expendio de bebidas embriagantes a menores de edad."
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                9. RETRASOS Y EVENTOS DE FUERZA MAYOR
              </h2>
              <p
                className="text-gray-700 leading-relaxed mb-3"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Market Club S.A.S. no será responsable por retrasos derivados de
                causas ajenas a su control, tales como:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Paros de transporte, cierres viales o restricciones de
                  movilidad
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Condiciones climáticas extremas o desastres naturales
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Eventos de orden público, festividades o congestión logística
                  nacional
                </li>
              </ul>
              <p
                className="text-gray-700 leading-relaxed mt-3"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                En tales casos, el cliente será notificado y se le informará el
                nuevo plazo estimado de entrega.
              </p>
            </section>

            {/* Section 10 - Contact */}
            <section className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg">
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                10. CONTACTO Y SERVICIO AL CLIENTE
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
