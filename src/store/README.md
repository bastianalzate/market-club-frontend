# Redux Store - Market Club

Este directorio contiene toda la configuración de Redux Toolkit para el manejo del estado global de la aplicación.

## 📁 Estructura

```
src/store/
├── index.ts              # Configuración principal del store
├── hooks.ts              # Hooks tipados para Redux
├── slices/
│   ├── cartSlice.ts      # Estado y acciones del carrito
│   └── authSlice.ts      # Estado y acciones de autenticación
└── README.md             # Esta documentación
```

## 🛒 Cart Slice

### Estado

- `items`: Array de productos en el carrito
- `isOpen`: Estado del drawer del carrito
- `isLoading`: Estado de carga
- `error`: Mensajes de error

### Acciones Principales

- `addToCart(product, quantity)`: Agregar producto al carrito
- `updateQuantity(itemId, quantity)`: Actualizar cantidad
- `removeFromCart(itemId)`: Remover producto
- `clearCart()`: Limpiar carrito completo
- `openCart()` / `closeCart()`: Controlar visibilidad

### Selectores

- `selectTotalItems`: Total de items en el carrito
- `selectSubtotal`: Subtotal calculado
- `selectIsInCart(productId)`: Verificar si producto está en carrito
- `selectProductQuantity(productId)`: Cantidad de un producto específico

## 🔐 Auth Slice

### Estado

- `user`: Información del usuario
- `isAuthenticated`: Estado de autenticación
- `isLoading`: Estado de carga
- `error`: Mensajes de error
- `loginModalOpen`: Estado del modal de login

### Acciones Principales

- `login(email, password)`: Iniciar sesión
- `register(userData)`: Crear cuenta
- `guestCheckout(guestData)`: Checkout como invitado
- `logout()`: Cerrar sesión
- `openLoginModal()` / `closeLoginModal()`: Controlar modal

## 💾 Persistencia

### Configuración

- **Cart**: Solo persiste los `items` del carrito
- **Auth**: Persiste `user` e `isAuthenticated`
- **Storage**: localStorage del navegador

### Ventajas

- ✅ Carrito persiste entre sesiones
- ✅ Usuario logueado se mantiene
- ✅ No se pierde información al recargar
- ✅ Funciona offline

## 🎯 Hooks Personalizados

### useCart()

```typescript
const {
  items, // Productos en el carrito
  isOpen, // Estado del drawer
  totalItems, // Total de items
  subtotal, // Subtotal calculado
  addToCart, // Agregar producto
  removeFromCart, // Remover producto
  openCart, // Abrir carrito
  closeCart, // Cerrar carrito
} = useCart();
```

### useAuth()

```typescript
const {
  user, // Usuario actual
  isAuthenticated, // Estado de auth
  isLoginModalOpen, // Estado del modal
  login, // Función de login
  register, // Función de registro
  logout, // Función de logout
} = useAuth();
```

## 🚀 Uso en Componentes

### Ejemplo: Agregar al Carrito

```typescript
import { useCart } from "@/hooks/useCart";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return <button onClick={handleAddToCart}>Agregar al Carrito</button>;
}
```

### Ejemplo: Mostrar Contador

```typescript
import { useCart } from "@/hooks/useCart";

function CartIcon() {
  const { totalItems, openCart } = useCart();

  return <button onClick={openCart}>Carrito ({totalItems})</button>;
}
```

## 🔧 DevTools

Redux DevTools está habilitado en desarrollo para:

- Ver el estado actual
- Time-travel debugging
- Inspeccionar acciones
- Monitorear cambios de estado

## 📱 Características

- ✅ **TypeScript**: Completamente tipado
- ✅ **Persistencia**: localStorage automático
- ✅ **DevTools**: Debugging avanzado
- ✅ **Performance**: Optimizado con RTK
- ✅ **Escalable**: Fácil agregar nuevos slices
- ✅ **Testing**: Fácil de testear

## 🎨 Beneficios vs Estado Local

### Antes (useState)

- ❌ Estado se pierde al recargar
- ❌ No sincroniza entre componentes
- ❌ Difícil de debuggear
- ❌ No persistencia

### Ahora (Redux Toolkit)

- ✅ Estado persistente
- ✅ Sincronización global
- ✅ DevTools para debugging
- ✅ Persistencia automática
- ✅ Mejor performance
- ✅ Escalabilidad
