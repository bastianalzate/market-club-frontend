"use client";

import { Package, BottleWine, ShoppingBag } from "lucide-react";

export default function GiftProcessSteps() {
  return (
    <section className="py-10 bg-white sm:py-16 lg:py-24">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
            ¿Cómo funciona?
          </h2>
          <p className="max-w-lg mx-auto mt-4 text-base leading-relaxed text-gray-600">
            Crea el regalo perfecto de cervezas en solo 3 simples pasos.
            Personaliza tu caja y sorprende a quien más quieras.
          </p>
        </div>

        <div className="relative mt-12 lg:mt-20">
          <div className="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
            <img
              className="w-full"
              src="https://cdn.rareblocks.xyz/collection/celebration/images/steps/2/curved-dotted-line.svg"
              alt=""
            />
          </div>

          <div className="relative grid grid-cols-1 text-center gap-y-12 md:grid-cols-3 gap-x-12">
            <div>
              <div className="flex items-center justify-center w-20 h-20 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M62.75 6.25C59.725 6.25 56.94 7 53.895 8.26C50.95 9.48 47.53 11.275 43.275 13.51L32.935 18.935C27.71 21.675 23.535 23.87 20.3 26.025C16.96 28.26 14.38 30.61 12.505 33.795C10.635 36.97 9.795 40.41 9.39 44.505C9 48.48 9 53.365 9 59.515V60.485C9 66.635 9 71.52 9.39 75.495C9.795 79.595 10.64 83.03 12.505 86.205C14.38 89.39 16.955 91.74 20.305 93.975C23.53 96.13 27.71 98.325 32.935 101.065L43.275 106.49C47.53 108.725 50.95 110.52 53.895 111.74C56.945 113 59.725 113.75 62.75 113.75C65.775 113.75 68.56 113 71.605 111.74C74.55 110.52 77.97 108.725 82.225 106.49L92.565 101.07C97.79 98.325 101.965 96.13 105.195 93.975C108.545 91.74 111.12 89.39 112.995 86.205C114.865 83.03 115.705 79.59 116.11 75.495C116.5 71.52 116.5 66.635 116.5 60.49V59.51C116.5 53.365 116.5 48.48 116.11 44.505C115.705 40.405 114.86 36.97 112.995 33.795C111.12 30.61 108.545 28.26 105.195 26.025C101.97 23.87 97.79 21.675 92.565 18.935L82.225 13.51C77.97 11.275 74.55 9.48 71.605 8.26C68.555 7 65.775 6.25 62.75 6.25ZM46.6 20.23C51.05 17.895 54.17 16.265 56.76 15.195C59.28 14.15 61.055 13.75 62.75 13.75C64.45 13.75 66.22 14.15 68.74 15.195C71.33 16.265 74.445 17.895 78.895 20.23L88.895 25.48C94.345 28.335 98.17 30.35 101.035 32.26C102.445 33.205 103.55 34.08 104.45 34.96L87.795 43.285L45.295 20.915L46.6 20.23ZM37.475 25.02L36.605 25.48C31.155 28.335 27.33 30.35 24.47 32.26C23.2506 33.0524 22.1073 33.9563 21.055 34.96L62.75 55.81L79.535 47.41L38.505 25.82C38.1202 25.6115 37.7723 25.3412 37.475 25.02ZM17.44 41.535C17.19 42.605 16.995 43.82 16.855 45.235C16.505 48.805 16.5 53.32 16.5 59.705V60.29C16.5 66.68 16.5 71.195 16.855 74.76C17.2 78.245 17.855 80.5 18.97 82.4C20.08 84.285 21.685 85.88 24.47 87.74C27.33 89.65 31.155 91.665 36.605 94.52L46.605 99.77C51.055 102.105 54.17 103.735 56.76 104.805C57.5733 105.142 58.32 105.417 59 105.63V62.315L17.44 41.535ZM66.5 105.625C67.18 105.415 67.9267 105.142 68.74 104.805C71.33 103.735 74.445 102.105 78.895 99.77L88.895 94.52C94.345 91.66 98.17 89.65 101.035 87.74C103.815 85.88 105.42 84.285 106.535 82.4C107.65 80.5 108.3 78.25 108.645 74.76C108.995 71.195 109 66.68 109 60.295V59.71C109 53.32 109 48.805 108.645 45.24C108.527 43.9957 108.332 42.7599 108.06 41.54L91.5 49.815V65C91.5 65.9946 91.1049 66.9484 90.4017 67.6516C89.6984 68.3549 88.7446 68.75 87.75 68.75C86.7554 68.75 85.8016 68.3549 85.0983 67.6516C84.3951 66.9484 84 65.9946 84 65V53.57L66.5 62.32V105.625Z"
                    fill="black"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">
                Seleccioná la caja que más te guste.
              </h3>
              <p className="mt-4 text-base text-gray-600">
                Elige entre nuestras cajas especiales diseñadas para diferentes
                ocasiones y gustos.
              </p>
            </div>

            <div>
              <div
                className="flex items-center justify-center w-20 h-20 mx-auto rounded-full shadow"
                style={{ backgroundColor: "#B58E31" }}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 116 116"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M107.944 19.1853L93.4445 4.68525C92.7643 4.00506 91.8417 3.62292 90.8798 3.62292C89.9178 3.62292 88.9953 4.00506 88.3151 4.68525C87.6349 5.36545 87.2528 6.288 87.2528 7.24994C87.2528 8.21188 87.6349 9.13443 88.3151 9.81463L88.9857 10.4807L63.9868 29.231L46.6684 32.6974C45.9671 32.8379 45.3227 33.1814 44.8151 33.6853L7.05166 71.4396C5.01236 73.4791 3.8667 76.2451 3.8667 79.1292C3.8667 82.0133 5.01236 84.7793 7.05166 86.8187L25.811 105.578C27.8505 107.617 30.6165 108.763 33.5006 108.763C36.3847 108.763 39.1507 107.617 41.1901 105.578L78.9445 67.8282C79.4494 67.3215 79.7931 66.6766 79.9323 65.9749L83.3987 48.6565L102.149 23.6576L102.815 24.3282C103.152 24.665 103.552 24.9322 103.992 25.1145C104.432 25.2967 104.903 25.3906 105.38 25.3906C105.856 25.3906 106.328 25.2967 106.768 25.1145C107.208 24.9322 107.608 24.665 107.944 24.3282C108.281 23.9914 108.548 23.5916 108.731 23.1515C108.913 22.7115 109.007 22.2398 109.007 21.7635C109.007 21.2872 108.913 20.8156 108.731 20.3755C108.548 19.9355 108.281 19.5356 107.944 19.1988V19.1853ZM40.1298 48.6248L64.0049 72.4999L43.7548 92.7501L19.8796 68.8749L40.1298 48.6248ZM33.5006 101.5C33.0249 101.501 32.5538 101.408 32.1143 101.226C31.6749 101.044 31.2759 100.777 30.9404 100.44L12.1901 81.6893C11.5108 81.0096 11.1292 80.0879 11.1292 79.1269C11.1292 78.1659 11.5108 77.2442 12.1901 76.5645L14.7548 73.9998L38.6299 97.8749L36.0517 100.44C35.3746 101.116 34.4576 101.497 33.5006 101.5ZM77.1048 44.9499C76.7795 45.3822 76.5564 45.8826 76.4523 46.4135L73.0403 63.4646L69.1298 67.3751L45.2546 43.4999L49.1651 39.5895L66.2162 36.1774C66.7471 36.0733 67.2475 35.8502 67.6798 35.5249L94.1649 15.6599L96.9698 18.4648L77.1048 44.9499Z"
                    fill="white"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">
                Elegí las cervezas que quieras.
              </h3>
              <p className="mt-4 text-base text-gray-600">
                Personaliza tu regalo seleccionando las cervezas que más te
                gusten de nuestro catálogo.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-center w-20 h-20 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M87.5 42.5C87.5 25.9325 75.1875 12.5 60 12.5C44.8125 12.5 32.5 25.9325 32.5 42.5M12.5 42.5H107.5L97 107.5H23L12.5 42.5Z"
                    stroke="black"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M42.5 70C45.2614 70 47.5 67.7614 47.5 65C47.5 62.2386 45.2614 60 42.5 60C39.7386 60 37.5 62.2386 37.5 65C37.5 67.7614 39.7386 70 42.5 70Z"
                    fill="black"
                  />
                  <path
                    d="M45 82.5C45 82.5 50 90 60 90C70 90 75 82.5 75 82.5"
                    stroke="black"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M77.5 70C80.2614 70 82.5 67.7614 82.5 65C82.5 62.2386 80.2614 60 77.5 60C74.7386 60 72.5 62.2386 72.5 65C72.5 67.7614 74.7386 70 77.5 70Z"
                    fill="black"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">
                Agregá la caja al carrito.
              </h3>
              <p className="mt-4 text-base text-gray-600">
                Finaliza tu pedido agregando la caja personalizada a tu carrito
                de compras.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
