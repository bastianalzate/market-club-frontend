"use client";

import {
  X,
  Package,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { useState, useEffect } from "react";
import { constants } from "@/config/constants";
import { getAuthHeaders } from "@/utils/authHeaders";

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  gift_data?: {
    name: string;
    description: string;
    box: {
      id: string;
      name: string;
      price: number;
      description: string;
      maxBeers: number;
      dimensions: string;
      deliveryTime: string;
    };
    beers: {
      id: number;
      name: string;
      brand: string;
      price: number;
      volume: string;
      category: string;
      nationality: string;
      image?: string;
    }[];
    totalPrice: number;
  };
}

interface OrderDetails {
  id: string;
  order_number: string;
  status: "Pendiente" | "Procesando" | "En camino" | "Entregado" | "Cancelado";
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  created_at: string;
  updated_at: string;
  shipping_address: {
    first_name: string;
    last_name: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
  };
  tracking_number?: string;
  estimated_delivery?: string;
  items: OrderItem[];
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: OrderDetails | null;
  loading: boolean;
}

export default function OrderDetailsModal({
  isOpen,
  onClose,
  orderDetails,
  loading,
}: OrderDetailsModalProps) {
  const [beerImages, setBeerImages] = useState<Record<number, string>>({});
  // Helper function para obtener la URL de imagen del producto
  const getProductImageUrl = (imageUrl?: string, productName?: string) => {
    // Si es un regalo personalizado, usar imagen de regalo
    if (
      productName &&
      productName.toLowerCase().includes("regalo personaliz")
    ) {
      return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSI4IiBmaWxsPSIjQjU4RTMxIi8+PHJlY3QgeD0iMyIgeT0iOCIgd2lkdGg9IjE4IiBoZWlnaHQ9IjQiIHJ4PSIxIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xMiA4djEzIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xOSAxMnY3YTIgMiAwIDAgMS0yIDJIN2EyIDIgMCAwIDEtMi0ydi03IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik03LjUgOGEyLjUgMi41IDAgMCAxIDAtNUE0LjggOCAwIDAgMSAxMiA4YTQuOCA4IDAgMCAxIDQuNS01IDIuNSAyLjUgMCAwIDEgMCA1IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPgo=";
    }

    if (!imageUrl) {
      return "/images/cervezas/bottella-01.png"; // Imagen por defecto
    }

    // Si la imagen ya incluye la URL completa, usarla tal como está
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    // Si es una ruta relativa, construir la URL completa
    const baseUrl = constants.api_url.replace("/api", "");

    if (imageUrl.startsWith("/storage/") || imageUrl.startsWith("storage/")) {
      const cleanPath = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
      return `${baseUrl}/${cleanPath}`;
    }

    // Para rutas que empiezan con uploads/, usar directamente
    if (imageUrl.startsWith("uploads/")) {
      return `${baseUrl}/${imageUrl}`;
    }

    // Para otras rutas, asumir que van en storage/
    return `${baseUrl}/storage/${imageUrl}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Entregado":
        return "bg-green-100 text-green-800";
      case "En camino":
        return "bg-yellow-100 text-yellow-800";
      case "Procesando":
        return "bg-blue-100 text-blue-800";
      case "Pendiente":
        return "bg-gray-100 text-gray-800";
      case "Cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Entregado":
        return <CheckCircle className="w-4 h-4" />;
      case "En camino":
        return <Truck className="w-4 h-4" />;
      case "Procesando":
        return <Package className="w-4 h-4" />;
      case "Pendiente":
        return <Clock className="w-4 h-4" />;
      case "Cancelado":
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Helper function para verificar si un item es un regalo
  const isGiftItem = (item: OrderItem) => {
    return (
      item.gift_data ||
      item.product_name.toLowerCase().includes("regalo personaliz")
    );
  };

  // Función para cargar información real de las cervezas
  const loadBeerImages = async (beerIds: number[]) => {
    console.log(`🍺 Loading images for beer IDs:`, beerIds);
    try {
      const promises = beerIds.map(async (beerId) => {
        const response = await fetch(
          `${constants.api_url}/products/${beerId}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );
        if (response.ok) {
          const product = await response.json();
          console.log(`🍺 API response for beer ${beerId}:`, product);

          if (product && (product.image_url || product.image)) {
            // Priorizar image_url si existe (ya viene completa), sino usar image
            const imageUrl =
              product.image_url ||
              (() => {
                const baseUrl = constants.api_url.replace("/api", "");
                return product.image.startsWith("http")
                  ? product.image
                  : `${baseUrl}/${product.image}`;
              })();

            console.log(`🍺 Using image URL for beer ${beerId}:`, imageUrl);
            return { id: beerId, imageUrl };
          } else {
            console.log(
              `🍺 No image found for beer ${beerId}, product:`,
              product
            );
          }
        } else {
          console.error(
            `🍺 API error for beer ${beerId}:`,
            response.status,
            response.statusText
          );
        }
        return { id: beerId, imageUrl: "/images/cervezas/bottella-01.png" };
      });

      const results = await Promise.all(promises);
      const imageMap: Record<number, string> = {};
      results.forEach(({ id, imageUrl }) => {
        imageMap[id] = imageUrl;
      });
      setBeerImages(imageMap);
    } catch (error) {
      console.error("Error loading beer images:", error);
    }
  };

  // Helper function para obtener imagen de cerveza individual
  const getBeerImageUrl = (beer: any) => {
    // Primero intentar usar la imagen cargada dinámicamente
    if (beerImages[beer.id]) {
      return beerImages[beer.id];
    }

    // Fallback a la imagen del beer si existe
    if (beer.image) {
      // Si la imagen ya incluye la URL completa, usarla tal como está
      if (beer.image.startsWith("http")) {
        return beer.image;
      }
      // Si es una ruta relativa, construir la URL completa
      const baseUrl = constants.api_url.replace("/api", "");
      return `${baseUrl}/${beer.image}`;
    }
    return "/images/cervezas/bottella-01.png";
  };

  // Cargar imágenes de cervezas cuando se abra el modal con un regalo
  useEffect(() => {
    if (isOpen && orderDetails) {
      const giftItems = orderDetails.items.filter(isGiftItem);
      const beerIds: number[] = [];

      giftItems.forEach((item) => {
        if (item.gift_data?.beers) {
          item.gift_data.beers.forEach((beer) => {
            if (!beerImages[beer.id]) {
              beerIds.push(beer.id);
            }
          });
        }
      });

      if (beerIds.length > 0) {
        loadBeerImages(beerIds);
      }
    }
  }, [isOpen, orderDetails]);

  // Cerrar modal con ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay con mejor opacidad */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      ></div>

      {/* Modal con animación */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
          {/* Header con gradiente */}
          <div className="sticky top-0 bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200/50 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Detalles del Pedido
                  </h2>
                  {orderDetails && (
                    <p className="text-sm text-gray-600 mt-1 font-medium">
                      Pedido #{orderDetails.order_number}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-white/50 rounded-xl transition-all duration-200 hover:shadow-md"
              >
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
          </div>

          {/* Content con scroll suave */}
          <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-200 border-t-yellow-600 mb-4"></div>
                <p className="text-gray-600 font-medium">
                  Cargando detalles del pedido...
                </p>
              </div>
            ) : orderDetails ? (
              <div className="space-y-8">
                {/* Estado y Información General */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100/50 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      Estado del Pedido
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(
                            orderDetails.status
                          )}`}
                        >
                          {getStatusIcon(orderDetails.status)}
                          {orderDetails.status}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Realizado: {formatDate(orderDetails.created_at)}
                          </span>
                        </div>
                        {orderDetails.tracking_number && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Truck className="w-4 h-4" />
                            <span>
                              Tracking: {orderDetails.tracking_number}
                            </span>
                          </div>
                        )}
                        {orderDetails.estimated_delivery && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Package className="w-4 h-4" />
                            <span>
                              Entrega estimada:{" "}
                              {formatDate(orderDetails.estimated_delivery)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100/50 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-green-600" />
                      </div>
                      Resumen de Pago
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium text-gray-900">
                          {formatPrice(orderDetails.subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Envío:</span>
                        <span className="font-medium text-gray-900">
                          {formatPrice(orderDetails.shipping_amount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Impuestos:</span>
                        <span className="font-medium text-gray-900">
                          {formatPrice(orderDetails.tax_amount)}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold text-gray-900">
                            Total:
                          </span>
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(orderDetails.total_amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dirección de Envío */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100/50 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-purple-600" />
                    </div>
                    Dirección de Envío
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {orderDetails.shipping_address.first_name}{" "}
                          {orderDetails.shipping_address.last_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {orderDetails.shipping_address.phone}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1 text-gray-700">
                      <p>{orderDetails.shipping_address.address_line_1}</p>
                      {orderDetails.shipping_address.address_line_2 && (
                        <p>{orderDetails.shipping_address.address_line_2}</p>
                      )}
                      <p>
                        {orderDetails.shipping_address.city},{" "}
                        {orderDetails.shipping_address.state}
                      </p>
                      <p>
                        {orderDetails.shipping_address.postal_code},{" "}
                        {orderDetails.shipping_address.country}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Productos */}
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-100/50 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-orange-600" />
                    </div>
                    Productos ({orderDetails.items.length})
                  </h3>
                  <div className="space-y-4">
                    {orderDetails.items.map((item) => (
                      <div key={item.id}>
                        {/* Producto principal (regalo o producto normal) */}
                        <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-5 flex items-center space-x-4 hover:shadow-md transition-all duration-200">
                          <img
                            src={getProductImageUrl(
                              item.product_image,
                              item.product_name
                            )}
                            alt={item.product_name}
                            className="w-16 h-16 rounded-lg object-cover shadow-sm flex-shrink-0"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/images/cervezas/bottella-01.png";
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-semibold text-gray-900 truncate">
                              {item.product_name}
                            </h4>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <span>Cantidad: {item.quantity}</span>
                              <span>
                                Precio unitario: {formatPrice(item.unit_price)}
                              </span>
                            </div>
                            {/* Información adicional para regalos */}
                            {isGiftItem(item) && item.gift_data && (
                              <div className="mt-2 text-sm text-gray-600">
                                <span className="font-medium">
                                  {item.gift_data.box.name}
                                </span>
                                {" • "}
                                <span>{item.gift_data.box.dimensions}</span>
                                {" • "}
                                <span>
                                  {item.gift_data.beers.length} cervezas
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              {formatPrice(item.total_price)}
                            </p>
                          </div>
                        </div>

                        {/* Mostrar cervezas individuales si es un regalo */}
                        {isGiftItem(item) &&
                          item.gift_data &&
                          item.gift_data.beers && (
                            <div className="mt-3 ml-6 space-y-2">
                              <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Package className="w-4 h-4 text-orange-500" />
                                Cervezas incluidas:
                              </h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {item.gift_data.beers.map((beer, index) => (
                                  <div
                                    key={`${item.id}-beer-${index}`}
                                    className="flex items-center space-x-3 p-3 bg-orange-50/50 rounded-lg border border-orange-100/50"
                                  >
                                    <img
                                      src={getBeerImageUrl(beer)}
                                      alt={beer.name}
                                      className="w-8 h-8 rounded-lg object-cover shadow-sm flex-shrink-0"
                                      onError={(e) => {
                                        const target =
                                          e.target as HTMLImageElement;
                                        target.src =
                                          "/images/cervezas/bottella-01.png";
                                      }}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {beer.name}
                                      </p>
                                      <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <span>{beer.brand}</span>
                                        {beer.volume && (
                                          <>
                                            <span>•</span>
                                            <span>{beer.volume}</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-semibold text-gray-700">
                                        {formatPrice(beer.price)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se pudo cargar el pedido
                </h3>
                <p className="text-gray-500">
                  Hubo un error al cargar los detalles del pedido.
                </p>
              </div>
            )}
          </div>

          {/* Footer mejorado */}
          <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200/50 px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <p className="font-medium">¿Necesitas ayuda?</p>
                <p className="text-xs">
                  Contáctanos si tienes alguna pregunta sobre tu pedido
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-8 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Cerrar
                </button>
                {orderDetails?.status === "Entregado" && (
                  <button className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md">
                    Descargar Factura
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
