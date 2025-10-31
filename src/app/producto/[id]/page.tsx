"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCartContext } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { ShoppingCart, ChevronDown } from "lucide-react";
import LazyImage from "@/components/shared/LazyImage";
import Toast from "@/components/shared/Toast";
import { API_CONFIG } from "@/config/api";
import { getBeerStyleLabel } from "@/constants/beerStyles";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  sale_price: string | null;
  sku: string;
  image: string | null;
  image_url: string | null;
  gallery: string[] | null;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  category_id: number;
  product_type_id: number;
  attributes: any;
  packaging_type?: string | null;
  volume_ml?: string | null;
  product_specific_data: {
    alcohol_content?: string | number;
    beer_style?: string;
    brewery?: string;
    country_of_origin?: string;
    volume_ml?: string;
    packaging_type?: string;
  } | null;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  is_favorite?: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const { addToCart, isInCart, getProductQuantity } = useCartContext();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Ocultar la flecha cuando el usuario hace scroll
  useEffect(() => {
    const handleScroll = () => {
      // Si el usuario hace scroll más de 100px, ocultar la flecha
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Usar la configuración de API existente
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/products/${params.id}`
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("❌ API Error:", response.status, errorData);
          throw new Error(errorData.error || "Producto no encontrado");
        }
        const data = await response.json();
        console.log("🔍 Product data from API:", data);
        console.log(
          "📦 Stock quantity:",
          data.stock_quantity,
          "Type:",
          typeof data.stock_quantity
        );

        // Normalizar el stock quantity para manejar diferentes tipos de datos
        const stockQuantity =
          typeof data.stock_quantity === "string"
            ? parseInt(data.stock_quantity)
            : data.stock_quantity || 0;

        console.log("📦 Normalized stock:", stockQuantity);
        console.log("📦 Is in stock:", stockQuantity > 0);
        console.log("📦 Is active:", data.is_active);

        // Actualizar el stock quantity en los datos
        data.stock_quantity = stockQuantity;

        // Verificar que el producto esté activo
        if (!data.is_active) {
          throw new Error("Producto no disponible");
        }

        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        showError("Error", "No se pudo cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, showError]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (product.stock_quantity <= 0) {
      showError(
        "Producto agotado",
        "Este producto no está disponible en este momento."
      );
      return;
    }

    setAddingToCart(true);
    try {
      const result = await addToCart({
        productId: product.id,
        quantity: 1,
      });

      if (result.success) {
        showSuccess(
          "¡Producto agregado! 🍺",
          `"${product.name}" se agregó al carrito exitosamente.`
        );
      } else {
        showError(
          "Error al agregar producto",
          result.message || "No se pudo agregar el producto al carrito"
        );
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showError(
        "Error al agregar producto",
        "Ocurrió un error inesperado. Intenta nuevamente."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = (price: string | number) => {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numericPrice);
  };

  const getProductImages = () => {
    if (!product) return [];
    const images = [];

    // Usar la configuración de API existente
    const baseUrl = API_CONFIG.BASE_URL.replace("/api", "");

    // Usar image_url si está disponible, sino usar image
    const mainImage = product.image_url || product.image;
    if (mainImage) {
      // Si la imagen no tiene http, agregar la URL base
      const imageUrl = mainImage.startsWith("http")
        ? mainImage
        : `${baseUrl}${mainImage.startsWith("/") ? "" : "/"}${mainImage}`;
      images.push(imageUrl);
    }

    // Agregar imágenes de la galería
    if (product.gallery && Array.isArray(product.gallery)) {
      product.gallery.forEach((galleryImage) => {
        const galleryUrl = galleryImage.startsWith("http")
          ? galleryImage
          : `${baseUrl}${
              galleryImage.startsWith("/") ? "" : "/"
            }${galleryImage}`;
        images.push(galleryUrl);
      });
    }

    console.log("🖼️ Product images:", images);
    console.log("🖼️ Base URL:", baseUrl);
    return images;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div
          className="text-gray-900 text-xl"
          style={{ fontFamily: "var(--font-lato)" }}
        >
          Cargando producto...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div
            className="text-gray-900 text-xl mb-4"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Producto no encontrado
          </div>
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 transition-colors"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  const images = getProductImages();
  const isInCartProduct = isInCart(product.id);
  const quantityInCart = getProductQuantity(product.id);

  return (
    <>
      <section className="py-10 bg-white sm:py-16 lg:py-20">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="relative bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-10 xl:gap-x-20">
              {/* Imagen del producto - Lado izquierdo */}
              <div className="relative lg:col-span-5 min-h-[500px] sm:min-h-[600px] lg:min-h-[700px]">
                <div className="w-full h-full flex items-center justify-center">
                  <LazyImage
                    src={images.length > 0 ? images[selectedImage] : null}
                    alt={product.name}
                    className="object-contain w-full h-full max-w-md sm:max-w-lg lg:max-w-xl sm:rounded-md"
                  />
                </div>

                {images.length > 1 && (
                  <div className="absolute -translate-x-1/2 left-1/2 bottom-6">
                    <div className="flex items-center justify-center space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`w-2.5 h-2.5 rounded-full transition-colors ${
                            index === selectedImage ? "bg-white" : "bg-white/40"
                          }`}
                          aria-label={`Ver imagen ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contenido del producto - Lado derecho */}
              <div className="px-4 pb-8 lg:col-span-7 xl:pr-16">
                <nav className="flex">
                  <ol role="list" className="flex items-center space-x-1">
                    <li>
                      <div className="-m-1">
                        <button
                          onClick={() => router.push("/")}
                          className="p-1 text-sm font-medium text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:text-gray-900 focus:ring-gray-900 hover:text-gray-700"
                          style={{ fontFamily: "var(--font-lato)" }}
                        >
                          Inicio
                        </button>
                      </div>
                    </li>

                    <li>
                      <div className="flex items-center">
                        <span className="flex-shrink-0 text-gray-300"> - </span>
                        <div className="-m-1">
                          <button
                            onClick={() => router.push("/tienda")}
                            className="p-1 ml-1 text-sm font-medium text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:text-gray-900 focus:ring-gray-900 hover:text-gray-700"
                            style={{ fontFamily: "var(--font-lato)" }}
                          >
                            Productos
                          </button>
                        </div>
                      </div>
                    </li>

                    <li>
                      <div className="flex items-center">
                        <span className="flex-shrink-0 text-gray-300"> - </span>
                        <div className="-m-1">
                          <span
                            className="p-1 ml-1 text-sm font-medium text-gray-400 rounded-md"
                            aria-current="page"
                            style={{ fontFamily: "var(--font-lato)" }}
                          >
                            {product.name}
                          </span>
                        </div>
                      </div>
                    </li>
                  </ol>
                </nav>

                <h1
                  className="mt-8 text-3xl font-bold text-gray-900 sm:text-4xl"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  {product.name}
                </h1>

                <h2
                  className="mt-10 text-base font-bold text-gray-900"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  Características:
                </h2>
                <ul
                  className="mt-4 space-y-3 text-base font-medium text-gray-600 list-disc list-inside"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  <li>
                    Estilo:{" "}
                    {(() => {
                      const beerStyleValue =
                        product.product_specific_data?.beer_style;
                      if (beerStyleValue) {
                        return getBeerStyleLabel(beerStyleValue);
                      }
                      return product.category.name;
                    })()}
                  </li>
                  <li>
                    Contenido de alcohol:{" "}
                    {product.product_specific_data?.alcohol_content || "N/A"}%
                  </li>
                  <li>
                    País de origen:{" "}
                    {product.product_specific_data?.country_of_origin ||
                      "Importada"}
                  </li>
                  <li>Categoría: {product.category.name}</li>
                </ul>

                <div className="inline-grid grid-cols-2 gap-4 mt-10 sm:gap-0">
                  <div className="rounded-lg bg-gray-50 sm:rounded-r-none">
                    <div className="px-5 py-4">
                      <p
                        className="text-xs font-medium tracking-widest text-gray-500 uppercase"
                        style={{ fontFamily: "var(--font-lato)" }}
                      >
                        Presentación
                      </p>
                      <div className="relative mt-1">
                        <span
                          className="block w-full py-1 pl-0 pr-8 font-medium text-gray-900"
                          style={{ fontFamily: "var(--font-lato)" }}
                        >
                          {(() => {
                            const packagingType =
                              product.product_specific_data?.packaging_type ||
                              product.packaging_type ||
                              "Botella";
                            const volume =
                              product.product_specific_data?.volume_ml ||
                              product.volume_ml ||
                              "500";
                            const capitalizedType =
                              packagingType.charAt(0).toUpperCase() +
                              packagingType.slice(1).toLowerCase();
                            return `${capitalizedType} ${volume}ml`;
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 sm:rounded-l-none sm:rounded-r-lg sm:flex sm:items-center sm:justify-center">
                    <div className="py-2 sm:px-5 sm:py-4">
                      {product.sale_price &&
                      parseFloat(product.sale_price) <
                        parseFloat(product.price) ? (
                        <div className="text-center">
                          <p
                            className="text-lg text-gray-500 line-through"
                            style={{ fontFamily: "var(--font-lato)" }}
                          >
                            {formatPrice(product.price)}
                          </p>
                          <p
                            className="text-3xl font-bold text-gray-900"
                            style={{ fontFamily: "var(--font-lato)" }}
                          >
                            {formatPrice(product.sale_price)}
                          </p>
                        </div>
                      ) : (
                        <p
                          className="text-3xl font-bold text-gray-900"
                          style={{ fontFamily: "var(--font-lato)" }}
                        >
                          {formatPrice(product.price)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-8 sm:flex sm:items-center sm:space-x-5">
                  {!(isAuthenticated && user?.is_wholesaler) && (
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={addingToCart || product.stock_quantity <= 0}
                      className="
                        items-center
                        justify-center
                        w-full
                        px-12
                        py-3
                        text-base
                        font-bold
                        leading-7
                        text-center text-white
                        transition-all
                        duration-200
                        bg-gray-900
                        border border-transparent
                        rounded-md
                        inline-flex
                        sm:w-auto
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900
                        hover:bg-gray-700
                        disabled:opacity-50 disabled:cursor-not-allowed
                      "
                      style={{ fontFamily: "var(--font-lato)" }}
                    >
                      {addingToCart
                        ? "Agregando..."
                        : product.stock_quantity <= 0
                        ? "Agotado"
                        : isInCartProduct
                        ? `En carrito (${quantityInCart})`
                        : "Añadir al carrito"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Flecha animada para indicar scroll hacia la descripción - Centrada en la pantalla */}
          {product.description && showScrollIndicator && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10 transition-opacity duration-300">
              <div className="flex flex-col items-center">
                <p
                  className="text-sm text-gray-500 mb-2"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  Desplázate para ver más
                </p>
                <ChevronDown className="w-6 h-6 text-gray-400 animate-bounce" />
              </div>
            </div>
          )}

          {/* Descripción del producto - Abajo, después del grid */}
          {product.description && (
            <div className="mt-12 pt-8 border-t border-gray-200 max-w-4xl mx-auto">
              <div
                className="text-base font-normal leading-7 text-gray-700 [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_li]:my-1 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold [&_h4]:font-bold [&_h1]:my-4 [&_h2]:my-4 [&_h3]:my-4 [&_h4]:my-4 [&_h1]:text-gray-900 [&_h2]:text-gray-900 [&_h3]:text-gray-900 [&_h4]:text-gray-900"
                style={{ fontFamily: "var(--font-lato)" }}
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}
        </div>
      </section>

      {/* Toast de notificaciones */}
      <Toast
        isVisible={toast.isVisible}
        onClose={hideToast}
        title={toast.title}
        message={toast.message}
        type={toast.type}
      />
    </>
  );
}
