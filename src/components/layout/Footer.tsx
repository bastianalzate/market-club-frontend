import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 bg-white sm:pt-16 lg:pt-20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" title="Market Club">
            <Image
              src="/images/logo/logo.png"
              alt="Market Club Logo"
              width={200}
              height={0}
              className="h-auto"
              priority
            />
          </Link>
        </div>

        <div className="grid grid-cols-2 mt-16 sm:grid-cols-3 gap-y-16 lg:grid-cols-6 gap-x-16">
          {/* Company */}
          <div>
            <h6 className="text-sm font-bold tracking-widest text-gray-900 uppercase font-pj">
              Empresa
            </h6>

            <ul className="mt-8 space-y-5">
              <li>
                <Link
                  href="/about"
                  className="inline-flex text-sm font-normal text-gray-900 transition-all duration-300 transform font-pj hover:text-gray-600 hover:translate-x-1"
                >
                  Sobre Nosotros
                </Link>
              </li>

              <li>
                <Link
                  href="/tienda"
                  className="inline-flex text-sm font-normal text-gray-900 transition-all duration-300 transform font-pj hover:text-gray-600 hover:translate-x-1"
                >
                  Productos
                </Link>
              </li>

              <li>
                <Link
                  href="/gifts"
                  className="inline-flex text-sm font-normal text-gray-900 transition-all duration-300 transform font-pj hover:text-gray-600 hover:translate-x-1"
                >
                  Regalos
                </Link>
              </li>

              <li>
                <Link
                  href="/kits"
                  className="inline-flex text-sm font-normal text-gray-900 transition-all duration-300 transform font-pj hover:text-gray-600 hover:translate-x-1"
                >
                  Kits
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h6 className="text-sm font-bold tracking-widest text-gray-900 uppercase font-pj">
              Ayuda
            </h6>

            <ul className="mt-8 space-y-5">
              <li>
                <Link
                  href="/support"
                  className="inline-flex text-sm font-normal text-gray-900 transition-all duration-300 transform font-pj hover:text-gray-600 hover:translate-x-1"
                >
                  Soporte al Cliente
                </Link>
              </li>

              <li>
                <Link
                  href="/shipping"
                  className="inline-flex text-sm font-normal text-gray-900 transition-all duration-300 transform font-pj hover:text-gray-600 hover:translate-x-1"
                >
                  Detalles de Envío
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="inline-flex text-sm font-normal text-gray-900 transition-all duration-300 transform font-pj hover:text-gray-600 hover:translate-x-1"
                >
                  Términos y Condiciones
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="inline-flex text-sm font-normal text-gray-900 transition-all duration-300 transform font-pj hover:text-gray-600 hover:translate-x-1"
                >
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-2 sm:col-span-1">
            <h6 className="text-sm font-bold tracking-widest text-gray-900 uppercase font-pj">
              Recursos
            </h6>

            <ul className="mt-8 space-y-5">
              <li>
                <Link
                  href="/blog"
                  className="inline-flex text-sm font-normal text-gray-900 transition-all duration-300 transform font-pj hover:text-gray-600 hover:translate-x-1"
                >
                  Blog de Cervezas
                </Link>
              </li>

              <li>
                <Link
                  href="/guides"
                  className="inline-flex text-sm font-normal text-gray-900 transition-all duration-300 transform font-pj hover:text-gray-600 hover:translate-x-1"
                >
                  Guías de Cata
                </Link>
              </li>

              <li>
                <Link
                  href="/recipes"
                  className="inline-flex text-sm font-normal text-gray-900 transition-all duration-300 transform font-pj hover:text-gray-600 hover:translate-x-1"
                >
                  Recetas
                </Link>
              </li>

              <li>
                <Link
                  href="/events"
                  className="inline-flex text-sm font-normal text-gray-900 transition-all duration-300 transform font-pj hover:text-gray-600 hover:translate-x-1"
                >
                  Eventos
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter and Contact */}
          <div className="col-span-2 sm:col-span-3 xl:pl-20">
            <h6 className="text-sm font-bold tracking-widest text-gray-900 uppercase font-pj">
              Suscríbete a nuestro newsletter
            </h6>

            <div className="relative mt-8">
              <div className="absolute -inset-2">
                <div
                  className="w-full h-full mx-auto opacity-30 blur-lg filter"
                  style={{
                    background:
                      "linear-gradient(90deg, #44ff9a -0.55%, #44b0ff 22.86%, #8b44ff 48.36%, #ff6644 73.33%, #ebff70 99.34%)",
                  }}
                ></div>
              </div>

              <form action="#" method="POST" className="relative">
                <div className="flex">
                  <div className="flex-1">
                    <input
                      type="email"
                      name=""
                      id=""
                      placeholder="Ingresa tu email"
                      className="block w-full px-4 py-4 text-base text-gray-900 placeholder-gray-600 bg-white border-gray-300 focus:ring-gray-900 focus:border-gray-900 rounded-l-xl font-pj caret-gray-900"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-10 py-4 text-base font-bold text-white transition-all duration-200 bg-gray-900 border border-transparent sm:px-16 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 rounded-r-xl font-pj focus:outline-none"
                  >
                    Unirse
                  </button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 mt-8 gap-y-8 sm:grid-cols-2 sm:gap-x-16">
              <div>
                <h6 className="text-sm font-bold tracking-widest text-gray-900 uppercase font-pj">
                  Llámanos
                </h6>
                <p className="mt-2.5 text-xl font-pj text-gray-900 font-bold">
                  <a href="tel:+573001234567" title="">
                    (300) 123-4567
                  </a>
                </p>
              </div>

              <div>
                <h6 className="text-sm font-bold tracking-widest text-gray-900 uppercase font-pj">
                  Escríbenos
                </h6>
                <p className="mt-2.5 text-xl font-pj text-gray-900 font-bold">
                  <a href="mailto:info@marketclub.com" title="">
                    info@marketclub.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <hr className="mt-16 border-gray-200" />

        {/* Aviso legal */}
        <div
          className="mt-8 flex items-center justify-center"
          style={{ height: "52px" }}
        >
          <p
            className="text-center"
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "100%",
              letterSpacing: "0%",
            }}
          >
            El exceso de alcohol es perjudicial para la salud. Ley 30 de 1986.
            Prohíbase el expendio de bebidas embriagantes a menores de edad y
            mujeres embarazadas. <strong>Ley 124 de 1994.</strong>
          </p>
        </div>

        <div className="mt-8 sm:flex sm:items-center sm:justify-between">
          <ul className="flex items-center justify-start space-x-3 sm:order-2 sm:justify-end">
            <li>
              <a
                href="#"
                target="_blank"
                title=""
                className="inline-flex items-center justify-center w-10 h-10 text-gray-900 transition-all duration-200 rounded-full hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                rel="noopener"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </li>

            <li>
              <a
                href="#"
                target="_blank"
                title=""
                className="inline-flex items-center justify-center w-10 h-10 text-gray-900 transition-all duration-200 rounded-full hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                rel="noopener"
              >
                <Facebook className="w-6 h-6" />
              </a>
            </li>

            <li>
              <a
                href="#"
                target="_blank"
                title=""
                className="inline-flex items-center justify-center w-10 h-10 text-gray-900 transition-all duration-200 rounded-full hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                rel="noopener"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </li>

            <li>
              <a
                href="#"
                target="_blank"
                title=""
                className="inline-flex items-center justify-center w-10 h-10 text-gray-900 transition-all duration-200 rounded-full hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                rel="noopener"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
                  ></path>
                </svg>
              </a>
            </li>
          </ul>

          <p className="mt-8 text-sm font-normal text-gray-600 font-pj sm:order-1 sm:mt-0">
            © Copyright 2024 Market Club, Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
