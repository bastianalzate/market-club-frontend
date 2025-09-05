import Link from "next/link";
import Image from "next/image";
import {
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
      </div>
    </footer>
  );
}
