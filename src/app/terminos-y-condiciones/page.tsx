import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Market Club",
  description:
    "Términos y Condiciones Generales de Uso y Compra de Market Club - Tienda de cervezas importadas en Colombia",
};

export default function TerminosYCondicionesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Términos y Condiciones
          </h1>
          <p
            className="text-gray-600 text-lg"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Generales de Uso y Compra
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-12">
          {/* Info Box */}
          <div className="bg-amber-50 border-l-4 border-amber-600 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-amber-600"
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
                  className="text-sm text-amber-800"
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
                1. ACEPTACIÓN DE LOS TÉRMINOS
              </h2>
              <p
                className="text-gray-700 leading-relaxed"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Al acceder, navegar o realizar una compra en este sitio web (en
                adelante, el "Sitio"), el usuario (en adelante, el "Usuario" o
                "Cliente") declara haber leído, entendido y aceptado plenamente
                estos Términos y Condiciones Generales de Uso y Compra (en
                adelante, los "Términos"). La aceptación se entenderá otorgada
                al momento de realizar un pedido, crear una cuenta o continuar
                navegando en el Sitio. Si no está de acuerdo, deberá abstenerse
                de usarlo.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                2. OBJETO
              </h2>
              <p
                className="text-gray-700 leading-relaxed"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Estos Términos regulan el acceso, uso y las transacciones
                comerciales realizadas a través del Sitio, que ofrece al público
                cervezas importadas y productos afines. El Sitio opera conforme
                a la Ley 1480 de 2011 (Estatuto del Consumidor), la Ley 527 de
                1999 (Comercio Electrónico), la Ley 1581 de 2012 (Protección de
                Datos Personales) y demás normas aplicables del ordenamiento
                colombiano.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                3. INFORMACIÓN DE PRODUCTOS Y PRECIOS
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Todos los precios están expresados en pesos colombianos (COP)
                  e incluyen impuestos, conforme al artículo 26 de la Ley 1480
                  de 2011.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Las imágenes y descripciones de los productos son
                  referenciales y pueden variar sin previo aviso.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  La disponibilidad de los productos está sujeta a inventario y
                  procesos de importación.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  La empresa se reserva el derecho de modificar precios,
                  descontinuar productos o rechazar pedidos en caso de errores
                  de inventario o precio.
                </li>
              </ul>
            </section>

            {/* Section 4 - Important Warning */}
            <section className="bg-red-50 border-l-4 border-red-600 p-6">
              <h2
                className="text-2xl font-bold text-red-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                4. REQUISITO DE EDAD Y CONSUMO RESPONSABLE
              </h2>
              <div className="space-y-3 text-gray-800">
                <p style={{ fontFamily: "var(--font-lato)" }}>
                  La venta y consumo de bebidas alcohólicas está prohibida a
                  menores de 18 años, conforme al Artículo 33 de la Ley 124 de
                  1994 y el Artículo 1 del Decreto 120 de 2010.
                </p>
                <p style={{ fontFamily: "var(--font-lato)" }}>
                  Al acceder al Sitio o realizar una compra, el Usuario declara
                  y garantiza que tiene al menos 18 años de edad.
                </p>
                <p style={{ fontFamily: "var(--font-lato)" }}>
                  El Sitio podrá solicitar mecanismos de verificación de edad
                  (por ejemplo, validación documental, autodeclaración, o
                  pasarela de pago con cédula).
                </p>
                <p style={{ fontFamily: "var(--font-lato)" }}>
                  La empresa no se hace responsable por información falsa o
                  inexacta proporcionada por el Usuario para eludir la
                  restricción de edad.
                </p>
                <p style={{ fontFamily: "var(--font-lato)" }}>
                  Se promueve un consumo responsable y moderado de bebidas
                  alcohólicas. La empresa rechaza el consumo excesivo y
                  desaconseja el manejo de vehículos bajo efectos del alcohol.
                </p>
                <div className="bg-red-100 p-4 mt-4 rounded">
                  <p
                    className="font-bold text-red-900"
                    style={{ fontFamily: "var(--font-lato)" }}
                  >
                    Advertencia legal:
                  </p>
                  <p
                    className="text-red-800 mt-2"
                    style={{ fontFamily: "var(--font-lato)" }}
                  >
                    "El exceso de alcohol es perjudicial para la salud. Ley 30
                    de 1986. Prohíbese el expendio de bebidas embriagantes a
                    menores de edad (Ley 124 de 1994)."
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                5. REGISTRO Y CUENTA DE USUARIO
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Para realizar compras, el Usuario podrá crear una cuenta en el
                  Sitio, proporcionando información veraz, actual y completa.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  El Usuario es responsable de mantener la confidencialidad de
                  su contraseña y la actividad asociada a su cuenta.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Cualquier uso fraudulento, inadecuado o ilícito será causa de
                  suspensión o eliminación de la cuenta.
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                6. PROCESO DE COMPRA Y PAGO
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  El Usuario selecciona los productos, los añade al carrito y
                  sigue el proceso de pago indicado.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Al confirmar el pedido, el Usuario acepta las condiciones de
                  venta, precio y entrega.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  El contrato de compraventa se perfecciona una vez el Sitio
                  confirme la aceptación del pedido mediante correo electrónico
                  o mensaje en la plataforma.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Los pagos se procesan mediante Wompi pasarela segura
                  certificada.
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                7. ENTREGA Y ENVÍO
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Los productos serán entregados en la dirección indicada por el
                  Usuario.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Los tiempos de entrega pueden variar según ciudad,
                  disponibilidad y procesos aduaneros.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Los gastos de envío se informarán antes de confirmar la
                  compra.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  En caso de imposibilidad de entrega por causas atribuibles al
                  Usuario (dirección incorrecta, ausencia), el envío podrá
                  reprogramarse con cargo adicional.
                </li>
              </ul>
            </section>

            {/* Section 8 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                8. DERECHO DE RETRACTO, DEVOLUCIONES Y GARANTÍAS
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Conforme al artículo 47 de la Ley 1480 de 2011, el consumidor
                  podrá ejercer su derecho de retracto dentro de los cinco (5)
                  días hábiles siguientes a la entrega.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  <strong>Excepción:</strong> el derecho de retracto no aplica a
                  productos perecederos ni bebidas alcohólicas, conforme al
                  numeral d) del artículo 47 ibídem.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Solo se aceptarán devoluciones por productos defectuosos, mal
                  empacados o diferentes al solicitado, siempre que se notifique
                  dentro de las 48 horas posteriores a la recepción.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  En caso de reclamaciones, la empresa podrá requerir evidencia
                  fotográfica y número de pedido para verificación.
                </li>
              </ul>
            </section>

            {/* Section 9 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                9. PROPIEDAD INTELECTUAL
              </h2>
              <p
                className="text-gray-700 leading-relaxed"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Todo el contenido del Sitio —logos, textos, imágenes, diseño,
                código fuente y demás elementos— es propiedad de la empresa o
                sus licenciantes. Su uso no autorizado está prohibido bajo las
                leyes colombianas e internacionales.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                10. PROTECCIÓN DE DATOS PERSONALES
              </h2>
              <p
                className="text-gray-700 leading-relaxed"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                El tratamiento de datos personales se regirá por la Política de
                Privacidad disponible en el Sitio, en cumplimiento de la Ley
                1581 de 2012 y el Decreto 1377 de 2013. El Usuario autoriza
                expresamente el uso de sus datos para la gestión de pedidos,
                atención al cliente y envío de información comercial, sin
                perjuicio de ejercer sus derechos de acceso, rectificación,
                cancelación o supresión (ARCO).
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                11. RESPONSABILIDAD Y LIMITACIÓN DE GARANTÍAS
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  El Sitio funciona bajo un modelo de comercio electrónico
                  seguro; sin embargo, la empresa no garantiza la ausencia total
                  de errores, virus o interrupciones técnicas.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  La empresa no será responsable por pérdidas indirectas, lucro
                  cesante o daños derivados del uso del Sitio o del producto
                  fuera de su propósito legítimo.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  La empresa cumple con todas las normas sanitarias, de
                  importación y comercialización aplicables a bebidas
                  alcohólicas en Colombia.
                </li>
              </ul>
            </section>

            {/* Section 12 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                12. CONDUCTAS PROHIBIDAS
              </h2>
              <p
                className="text-gray-700 leading-relaxed mb-3"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                El Usuario se abstendrá de:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Realizar compras en nombre de terceros sin su consentimiento.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Manipular precios, vulnerar seguridad, o usar el Sitio con
                  fines ilícitos.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Distribuir contenido difamatorio, ofensivo o violento.
                </li>
              </ul>
              <p
                className="text-gray-700 leading-relaxed mt-3"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                El incumplimiento de estas normas podrá generar la suspensión
                inmediata de la cuenta y acciones legales.
              </p>
            </section>

            {/* Section 13 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                13. JURISDICCIÓN Y LEY APLICABLE
              </h2>
              <p
                className="text-gray-700 leading-relaxed"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Estos Términos se rigen por las leyes de la República de
                Colombia. Cualquier controversia será resuelta por los juzgados
                civiles del circuito de Medellín, renunciando las partes a
                cualquier otro fuero o jurisdicción.
              </p>
            </section>

            {/* Section 14 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                14. MODIFICACIONES
              </h2>
              <p
                className="text-gray-700 leading-relaxed"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                La empresa podrá modificar estos Términos en cualquier momento.
                Las versiones actualizadas se publicarán en el Sitio con su
                fecha de vigencia. El uso posterior implica la aceptación de las
                nuevas condiciones.
              </p>
            </section>

            {/* Section 15 - Contact Info */}
            <section className="bg-amber-50 p-6 rounded-lg">
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                15. CONTACTO Y ATENCIÓN AL CLIENTE
              </h2>
              <p
                className="text-gray-700 leading-relaxed mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Para consultas, quejas o reclamos, puede comunicarse a:
              </p>
              <div className="space-y-2 text-gray-800">
                <p style={{ fontFamily: "var(--font-lato)" }}>
                  <strong>Correo:</strong>{" "}
                  <a
                    href="mailto:info@marketclub.com.co"
                    className="text-amber-600 hover:text-amber-700 underline"
                  >
                    info@marketclub.com.co
                  </a>
                </p>
                <p style={{ fontFamily: "var(--font-lato)" }}>
                  <strong>Contacto:</strong>{" "}
                  <a
                    href="tel:+573160530019"
                    className="text-amber-600 hover:text-amber-700 underline"
                  >
                    +57 3160530019
                  </a>
                </p>
                <p style={{ fontFamily: "var(--font-lato)" }}>
                  <strong>Dirección:</strong> Cl. 43 #74-61 Local 3. Laureles -
                  Estadio. Medellín, Antioquia.
                </p>
              </div>
            </section>

            {/* Section 16 - Final Warning */}
            <section className="bg-red-50 border-l-4 border-red-600 p-6">
              <h2
                className="text-2xl font-bold text-red-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                16. AVISO FINAL SOBRE BEBIDAS ALCOHÓLICAS
              </h2>
              <p
                className="text-gray-800 leading-relaxed"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Este Sitio promueve el consumo responsable de alcohol. No se
                venden bebidas alcohólicas a menores de edad.{" "}
                <strong>
                  "El exceso de alcohol es perjudicial para la salud"
                </strong>{" "}
                — Ley 30 de 1986 y Ley 124 de 1994. El Usuario acepta estas
                condiciones al ingresar y comprar en este sitio web.
              </p>
            </section>
          </div>

          {/* Footer note */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <p
              className="text-sm text-gray-500 text-center"
              style={{ fontFamily: "var(--font-lato)" }}
            >
              Última actualización: {new Date().toLocaleDateString("es-CO")}
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
