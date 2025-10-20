# 🔍 Verificación del Flujo de Wompi

## ✅ Cambios Implementados

### 1. **Frontend Corregido:**

- ✅ `PaymentStep.tsx` ahora llama a `PaymentService.createWompiWidget()`
- ✅ `SubscriptionPaymentModal.tsx` ahora llama a `PaymentService.createWompiSubscriptionWidget()`
- ✅ Ambos usan los datos del backend para crear el widget

### 2. **Endpoint que se llama:**

```javascript
POST ${API_CONFIG.BASE_URL}/payments/wompi/create-widget

// Donde API_CONFIG.BASE_URL = process.env.NEXT_PUBLIC_API_URL
```

## 🔍 Para Verificar que Funciona

### **PASO 1: Verificar la URL del API**

Ve a tu archivo `.env.local` y confirma que tienes:

```bash
NEXT_PUBLIC_API_URL=https://admin-dev.marketclub.com.co/api
```

### **PASO 2: Usar la Página de Debug**

1. **Despliega el frontend**
2. **Ve a:** `https://market-club-frontend.vercel.app/debug-wompi`
3. **Ingresa un Order ID** (ej: 8)
4. **Haz clic en "Probar Endpoint"**

Esto te mostrará:

- ✅ Si el endpoint responde correctamente
- ✅ Qué campos devuelve el backend
- ✅ Si los campos coinciden con lo que busca el código

### **PASO 3: Verificar el Formato de la Respuesta**

El backend debe devolver:

```json
{
  "success": true,
  "data": {
    "reference": "ORDER_8_1760919421_9483",
    "amount": 1535500,
    "currency": "COP",
    "publicKey": "pub_test_...",
    "redirectUrl": "...",
    "integrity_signature": "...",
    "customerData": {...},
    "shippingAddress": {...}
  }
}
```

### **PASO 4: Problema Potencial - Nombres de Campos**

El código del frontend busca estos campos:

```javascript
const { reference, amount, currency, signature, public_key } =
  widgetResponse.data;
```

Pero el backend puede estar devolviendo:

- `publicKey` en lugar de `public_key`
- `integrity_signature` en lugar de `signature`

## 🔧 Si los Nombres No Coinciden

Si el debug muestra que el backend devuelve nombres diferentes, necesitamos ajustar el código del frontend.

### **Opción A: El backend devuelve `publicKey` e `integrity_signature`**

Cambia en `PaymentStep.tsx` (línea ~218):

```javascript
// ANTES:
const { reference, amount, currency, signature, public_key } =
  widgetResponse.data;

// DESPUÉS:
const { reference, amount, currency, integrity_signature, publicKey } =
  widgetResponse.data;

// Y luego:
const widgetConfig = {
  currency: currency,
  amountInCents: amount,
  reference: reference,
  publicKey: publicKey, // ← Cambiar aquí
  signature: {
    integrity: integrity_signature, // ← Y aquí
  },
  // ...
};
```

### **Opción B: Mantener compatibilidad con ambos formatos**

```javascript
const {
  reference,
  amount,
  currency,
  signature,
  integrity_signature,
  public_key,
  publicKey,
} = widgetResponse.data;

const finalPublicKey = publicKey || public_key;
const finalSignature =
  signature ||
  (integrity_signature ? { integrity: integrity_signature } : null);

const widgetConfig = {
  currency: currency,
  amountInCents: amount,
  reference: reference,
  publicKey: finalPublicKey,
  signature: finalSignature,
  // ...
};
```

## 🎯 Checklist de Verificación

- [ ] La variable `NEXT_PUBLIC_API_URL` está configurada correctamente
- [ ] El endpoint `/api/payments/wompi/create-widget` existe en el backend
- [ ] El endpoint devuelve la estructura de datos correcta
- [ ] Los nombres de los campos coinciden entre backend y frontend
- [ ] La `payment_reference` se guarda en la orden (verificar en BD)
- [ ] El widget se abre correctamente
- [ ] El pago se procesa
- [ ] El webhook encuentra la orden por `payment_reference`

## 📝 Logs para Verificar

Cuando pruebes un pago, deberías ver estos logs en consola:

```
🎯 Creating Wompi widget for order: 8
🎯 Widget request body: {...}
🔐 Getting auth headers, token found: true
🎯 Widget response: 200
🎯 Widget data: {...}
🔍 Full widget response: {...}
✅ Using backend data: {...}
🎯 Widget config with signature: {...}
🔧 Creating WidgetCheckout instance...
✅ WidgetCheckout instance created
🚀 Opening widget...
```

## ⚠️ Si Sigue Sin Funcionar

Verifica en el backend (Laravel):

1. El endpoint `/api/payments/wompi/create-widget` existe
2. La línea que guarda la referencia se ejecuta:
   ```php
   $order->update(['payment_reference' => $reference]);
   ```
3. La columna `payment_reference` existe en la tabla `orders`
4. El backend devuelve todos los campos necesarios

## 🚀 Siguiente Paso

**Despliega el frontend y prueba la página de debug:**

```
https://market-club-frontend.vercel.app/debug-wompi
```

Esto te dirá EXACTAMENTE qué está devolviendo el backend y si necesitamos ajustar el código del frontend.
