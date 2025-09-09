# Carrito de Compras

Este módulo contiene todos los componentes y hooks necesarios para manejar el carrito de compras en la aplicación.

## Componentes

### CartDrawer

Componente principal que muestra el carrito de compras como un drawer lateral.

**Props:**

- `isOpen: boolean` - Controla si el drawer está abierto
- `onClose: () => void` - Función para cerrar el drawer
- `items: CartItem[]` - Array de items en el carrito
- `onUpdateQuantity: (itemId: string, quantity: number) => void` - Función para actualizar la cantidad
- `onRemoveItem: (itemId: string) => void` - Función para remover un item
- `onCheckout: () => void` - Función para proceder al checkout

### AddToCartButton

Botón reutilizable para agregar productos al carrito.

**Props:**

- `product: Product` - Producto a agregar
- `quantity?: number` - Cantidad a agregar (default: 1)
- `className?: string` - Clases CSS adicionales
- `children?: React.ReactNode` - Contenido personalizado del botón

## Hooks

### useCart

Hook personalizado que maneja todo el estado del carrito.

**Retorna:**

- `items: CartItem[]` - Items en el carrito
- `isOpen: boolean` - Estado del drawer
- `totalItems: number` - Total de items en el carrito
- `subtotal: number` - Subtotal del carrito
- `addToCart: (product: Product, quantity?: number) => void` - Agregar producto
- `updateQuantity: (itemId: string, quantity: number) => void` - Actualizar cantidad
- `removeFromCart: (itemId: string) => void` - Remover producto
- `clearCart: () => void` - Limpiar carrito
- `openCart: () => void` - Abrir drawer
- `closeCart: () => void` - Cerrar drawer
- `checkout: () => void` - Proceder al checkout

## Tipos

### CartItem

```typescript
interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: Date;
}
```

### CartState

```typescript
interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}
```

## Uso

### 1. En el Header

El Header ya está configurado para usar el carrito. Solo necesitas importar el hook:

```typescript
import { useCart } from "@/features/cart/hooks/useCart";

const { openCart, totalItems } = useCart();
```

### 2. Agregar productos al carrito

```typescript
import AddToCartButton from "@/features/cart/components/AddToCartButton";

<AddToCartButton product={product} />;
```

### 3. Usar el hook directamente

```typescript
import { useCart } from "@/features/cart/hooks/useCart";

const { addToCart, items, isOpen } = useCart();

// Agregar producto
addToCart(product, 2);

// Verificar si hay items
if (items.length > 0) {
  console.log("Carrito tiene items");
}
```

## Características

- ✅ Diseño responsive
- ✅ Animaciones suaves
- ✅ Contador de items en el icono del carrito
- ✅ Formateo de precios
- ✅ Manejo de estado persistente
- ✅ Botón de eliminar items
- ✅ Cálculo automático de totales
- ✅ Integración con tipos existentes

## Estilos

El componente usa Tailwind CSS y sigue el diseño proporcionado:

- Fondo gris semi-transparente
- Drawer lateral con ancho responsivo
- Lista de productos con divisores
- Botones de acción estilizados
- Resumen de compra en el footer
