"use client";

import { useState, useRef, useEffect } from "react";

export default function ProductSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lastMoveTime, setLastMoveTime] = useState(0);
  const [lastMoveX, setLastMoveX] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const products = [
    {
      id: 1,
      name: "PAULANER WEISSBIER",
      image: "/images/cervezas/bottella-06.png",
      volume: "BOTELLA 500ML",
      price: "$17.000",
    },
    {
      id: 2,
      name: "ERDINGER",
      image: "/images/cervezas/bottella-07.png",
      volume: "BOTELLA 330ML",
      price: "$19.000",
    },
    {
      id: 3,
      name: "LIEFMANS FRUITESSE",
      image: "/images/cervezas/bottella-08.png",
      volume: "BOTELLA 250ML",
      price: "$23.000",
    },
  ];

  // Duplicar productos para scroll infinito
  const infiniteProducts = [...products, ...products, ...products];

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  const getCardsPerView = () => {
    if (typeof window === "undefined") return 3;
    const width = window.innerWidth;
    if (width < 640) return 1; // sm: 1 tarjeta
    if (width < 768) return 2; // md: 2 tarjetas
    if (width < 1280) return 3; // lg: 3 tarjetas (hasta 1280px)
    return 4; // xl: 4 tarjetas (1280px+)
  };

  const nextSlide = () => {
    if (sliderRef.current) {
      const containerWidth = sliderRef.current.clientWidth;
      const cardsPerView = getCardsPerView();
      const cardWidth = containerWidth / cardsPerView;
      const currentScrollLeft = sliderRef.current.scrollLeft;
      const currentIndex = Math.round(currentScrollLeft / cardWidth);
      const nextIndex = (currentIndex + 1) % products.length;

      sliderRef.current.scrollTo({
        left: nextIndex * cardWidth,
        behavior: "smooth",
      });

      setCurrentSlide(nextIndex);
    }
  };

  const prevSlide = () => {
    if (sliderRef.current) {
      const containerWidth = sliderRef.current.clientWidth;
      const cardsPerView = getCardsPerView();
      const cardWidth = containerWidth / cardsPerView;
      const currentScrollLeft = sliderRef.current.scrollLeft;
      const currentIndex = Math.round(currentScrollLeft / cardWidth);
      const prevIndex = (currentIndex - 1 + products.length) % products.length;

      sliderRef.current.scrollTo({
        left: prevIndex * cardWidth,
        behavior: "smooth",
      });

      setCurrentSlide(prevIndex);
    }
  };

  // Funciones de arrastre del mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  const handleMouseUp = () => {
    if (!isDragging || !sliderRef.current) return;

    setIsDragging(false);

    // Scroll suave al soltar el mouse
    const containerWidth = sliderRef.current.clientWidth;
    const cardsPerView = getCardsPerView();
    const cardWidth = containerWidth / cardsPerView;
    const currentScrollLeft = sliderRef.current.scrollLeft;
    const targetIndex = Math.round(currentScrollLeft / cardWidth);

    sliderRef.current.scrollTo({
      left: targetIndex * cardWidth,
      behavior: "smooth",
    });

    setCurrentSlide(targetIndex % products.length);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();

    const currentX = e.pageX - (sliderRef.current.offsetLeft || 0);
    const diffX = currentX - startX;
    const newScrollLeft = scrollLeft - diffX * 1.5;

    // Aplicar el scroll directamente para movimiento fluido
    sliderRef.current.scrollLeft = newScrollLeft;
  };

  return (
    <section className="py-12 bg-black sm:py-16 lg:py-20">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        {/* Header con título y botón */}
        <div className="flex items-center justify-center lg:justify-between mb-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Nuevos lanzamientos
          </h2>

          <div className="hidden lg:flex">
            <a
              href="/tienda"
              title=""
              className="inline-flex items-center justify-center p-1 -m-1 text-sm font-bold text-gray-300 transition-all duration-200 rounded-md focus:text-white focus:ring-white focus:ring-2 focus:ring-offset-2 focus:outline-none hover:text-white"
            >
              Ver todas las cervezas
              <svg
                className="w-5 h-5 ml-2 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Carrusel de productos */}
        <div className="relative px-4 lg:px-16">
          {" "}
          {/* Responsive padding: no margin on small screens, margin on large screens */}
          <div
            ref={sliderRef}
            className="flex overflow-x-auto snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitScrollbar: { display: "none" },
              scrollSnapType: "x mandatory",
            }}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {infiniteProducts.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="w-full sm:w-1/2 md:w-1/3 xl:w-1/4 flex-shrink-0 px-2 snap-start"
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
                  {/* Sección superior - Imagen de la botella */}
                  <div className="relative bg-white min-h-[220px] overflow-hidden pt-4">
                    <img
                      className="w-full h-full object-cover"
                      src={product.image}
                      alt={product.name}
                    />
                  </div>

                  {/* Sección inferior - Información del producto */}
                  <div className="bg-white p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <h3
                        className="text-gray-900 uppercase tracking-wide"
                        style={{
                          fontFamily: "var(--font-oswald)",
                          fontSize: "24px",
                          marginBottom: "-8px",
                          fontWeight: "700",
                        }}
                      >
                        {product.name}
                      </h3>
                      <p
                        className="text-gray-900 mb-2 uppercase tracking-wide"
                        style={{
                          fontFamily: "var(--font-oswald)",
                          fontSize: "24px",
                          fontWeight: "300",
                        }}
                      >
                        {product.volume}
                      </p>
                    </div>
                    <div className="mt-2">
                      <p
                        className="text-gray-900 uppercase tracking-wide"
                        style={{
                          fontFamily: "var(--font-plus-jakarta-sans)",
                          fontSize: "24px",
                        }}
                      >
                        {product.price}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Botones de navegación */}
          <button
            onClick={prevSlide}
            className="hidden lg:block absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors z-10"
            aria-label="Anterior"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors z-10"
            aria-label="Siguiente"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Indicadores de paginación */}
        <div className="flex justify-center items-center mt-12 space-x-3">
          {Array.from({ length: products.length }, (_, index) => (
            <button
              key={index}
              onClick={() => {
                if (sliderRef.current) {
                  const containerWidth = sliderRef.current.clientWidth;
                  const cardsPerView = getCardsPerView();
                  const cardWidth = containerWidth / cardsPerView;

                  sliderRef.current.scrollTo({
                    left: index * cardWidth,
                    behavior: "smooth",
                  });

                  setCurrentSlide(index);
                }
              }}
              className={`rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "border-gray-400 bg-transparent"
                  : "border-white bg-transparent"
              }`}
              style={{
                width: "37.67px",
                height: "37.67px",
                borderWidth: "5px",
              }}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
