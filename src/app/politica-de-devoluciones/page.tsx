import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Devoluciones | Market Club",
  description:
    "Política de Devoluciones, Cambios y Garantías de Market Club - Cumplimos con la Ley 1480 de 2011",
};

export default function PoliticaDeDevolucionesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Política de Devoluciones
          </h1>
          <p
            className="text-gray-600 text-lg"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Cambios y Garantías
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-12">
          {/* Info Box */}
          <div className="bg-gray-50 border-l-4 border-gray-600 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-gray-600"
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
                  className="text-sm text-gray-700"
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
                Esta política se fundamenta en la Ley 1480 de 2011 (Estatuto del
                Consumidor) y en las normas aplicables al comercio electrónico
                en Colombia.
              </p>
            </section>

            {/* Section 2 - Important Warning */}
            <section className="bg-red-50 border-l-4 border-red-600 p-6">
              <h2
                className="text-2xl font-bold text-red-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                2. PRODUCTOS EXCLUIDOS DE DEVOLUCIÓN
              </h2>
              <div className="space-y-3 text-gray-800">
                <p style={{ fontFamily: "var(--font-lato)" }}>
                  Por su naturaleza, las bebidas alcohólicas y productos
                  perecederos{" "}
                  <strong>no están sujetos al derecho de retracto</strong>{" "}
                  conforme al numeral d) del artículo 47 de la Ley 1480 de 2011.
                </p>
                <p style={{ fontFamily: "var(--font-lato)" }}>
                  Por razones sanitarias y de control de calidad,{" "}
                  <strong>
                    no se aceptan devoluciones de botellas abiertas,
                    manipuladas, deterioradas o sin su sello original.
                  </strong>
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                3. DERECHO DE RETRACTO (CUANDO APLICA)
              </h2>
              <p
                className="text-gray-700 leading-relaxed mb-3"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                El consumidor podrá ejercer su derecho de retracto dentro de los{" "}
                <strong>cinco (5) días hábiles</strong> siguientes a la entrega,
                siempre que el producto:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  No sea perecedero ni bebida alcohólica.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  No haya sido abierto, usado ni alterado.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Se conserve en su empaque original y en perfectas condiciones.
                </li>
              </ul>
              <p
                className="text-gray-700 leading-relaxed"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                La solicitud deberá enviarse al correo{" "}
                <a
                  href="mailto:info@marketclub.com.co"
                  className="text-blue-600 hover:text-blue-700 underline font-semibold"
                >
                  info@marketclub.com.co
                </a>{" "}
                indicando número de pedido, nombre y motivo. El reembolso se
                procesará dentro de los 30 días calendario posteriores a la
                aceptación del retracto, descontando costos logísticos si
                aplica.
              </p>
            </section>

            {/* Section 4 */}
            <section className="bg-amber-50 p-6 rounded-lg">
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                4. CAMBIOS POR PRODUCTO ERRÓNEO O DEFECTUOSO
              </h2>
              <p
                className="text-gray-700 leading-relaxed mb-3"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                En caso de recibir un producto:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  <strong>
                    Erróneo, con daño visible o diferente al solicitado
                  </strong>
                  , el cliente podrá solicitar cambio o devolución dentro de las{" "}
                  <strong>48 horas</strong> siguientes a la entrega, adjuntando
                  fotografías y número de pedido.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Market Club asumirá los costos de recogida y envío de
                  reposición cuando el error sea atribuible a la empresa.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                5. GARANTÍA LEGAL
              </h2>
              <p
                className="text-gray-700 leading-relaxed"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Los productos cuentan con garantía legal por defectos de
                fabricación o deterioro no atribuible al consumidor, conforme al
                artículo 7 de la Ley 1480 de 2011. La reclamación deberá
                presentarse por escrito a{" "}
                <a
                  href="mailto:info@marketclub.com.co"
                  className="text-blue-600 hover:text-blue-700 underline font-semibold"
                >
                  info@marketclub.com.co
                </a>
                , adjuntando factura y evidencia fotográfica.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                6. CONDICIONES DE REEMBOLSO
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Los reembolsos se realizarán preferiblemente al mismo método
                  de pago utilizado por el cliente.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  En caso de pagos con tarjeta, el tiempo de reversión dependerá
                  de la entidad financiera emisora.
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="bg-yellow-50 border-l-4 border-yellow-600 p-6">
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                7. EXCEPCIONES Y CASOS NO CUBIERTOS
              </h2>
              <p
                className="text-gray-700 leading-relaxed mb-3"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                No se aceptarán devoluciones ni reclamos en los siguientes
                casos:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Daños ocasionados por transporte no autorizado, manipulación
                  inadecuada o almacenamiento incorrecto por parte del cliente.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Compras realizadas fuera del sitio web oficial.
                </li>
                <li style={{ fontFamily: "var(--font-lato)" }}>
                  Productos adquiridos en promoción o liquidación, salvo defecto
                  de fabricación comprobado.
                </li>
              </ul>
            </section>

            {/* Section 8 - Contact Info */}
            <section className="bg-blue-50 p-6 rounded-lg">
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                8. CONTACTO PARA RECLAMACIONES
              </h2>
              <div className="space-y-2 text-gray-800">
                <p style={{ fontFamily: "var(--font-lato)" }}>
                  <strong>Correo:</strong>{" "}
                  <a
                    href="mailto:info@marketclub.com.co"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    info@marketclub.com.co
                  </a>
                </p>
                <p style={{ fontFamily: "var(--font-lato)" }}>
                  <strong>Contacto:</strong>{" "}
                  <a
                    href="tel:+573160530019"
                    className="text-blue-600 hover:text-blue-700 underline"
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

          {/* Important Note */}
          <div className="mt-8 bg-gray-100 p-6 rounded-lg">
            <h3
              className="text-lg font-semibold text-gray-900 mb-3"
              style={{ fontFamily: "var(--font-lato)" }}
            >
              Importante
            </h3>
            <p
              className="text-gray-700 mb-4"
              style={{ fontFamily: "var(--font-lato)" }}
            >
              Para cualquier solicitud de devolución, cambio o reclamo de
              garantía, es necesario conservar la factura de compra y
              contactarnos dentro de los plazos establecidos.
            </p>
            <p
              className="text-gray-700"
              style={{ fontFamily: "var(--font-lato)" }}
            >
              Nuestro equipo está disponible para resolver cualquier inquietud y
              garantizar tu satisfacción.
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

