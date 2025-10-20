# 🔧 Solución Definitiva: Frontend Wompi

## 📋 Problema Identificado

**LA RAÍZ DEL PROBLEMA:** El frontend NO estaba llamando al endpoint `/api/payments/wompi/create-widget` antes de abrir el widget de Wompi. Por eso la `payment_reference` no se guardaba en la orden.

### ¿Qué estaba pasando?

1. ❌ El frontend creaba el widget directamente con JavaScript
2. ❌ El widget generaba una referencia (`ORDER_8_1760919421_9483`)
3. ❌ El usuario pagaba
4. ❌ Wompi enviaba el webhook con esa referencia
5. ❌ El backend buscaba la orden por esa referencia, pero no la encontraba porque nunca se guardó

## ✅ Solución Implementada

### 1. **Frontend Corregido**

#### Para Órdenes (`src/components/checkout/PaymentStep.tsx`):

```javascript
// ANTES: ❌ Creaba el widget directamente
const signatureResponse = await PaymentService.generateSignature(signatureData);

// AHORA: ✅ Llama al endpoint que guarda la referencia
const widgetResponse = await PaymentService.createWompiWidget(
  orderId,
  totalAmount,
  redirectUrl,
  customerData
);
```

#### Para Suscripciones (`src/components/subscriptions/SubscriptionPaymentModal.tsx`):

```javascript
// ANTES: ❌ Usaba generateSubscriptionSignature
const signatureResponse = await PaymentService.generateSubscriptionSignature(
  signatureData
);

// AHORA: ✅ Llama al endpoint que guarda la referencia
const widgetResponse = await PaymentService.createWompiSubscriptionWidget(
  planId,
  totalAmount,
  redirectUrl,
  customerData
);
```

### 2. **Nuevos Métodos en PaymentService**

#### `createWompiWidget()` - Para Órdenes:

```javascript
static async createWompiWidget(orderId, totalAmount, redirectUrl, customerData = {}) {
  const requestBody = {
    order_id: orderId,
    amount: totalAmount,
    currency: 'COP',
    redirect_url: redirectUrl
  };

  const response = await fetch(`${API_CONFIG.BASE_URL}/payments/wompi/create-widget`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(requestBody)
  });

  return response.json();
}
```

#### `createWompiSubscriptionWidget()` - Para Suscripciones:

```javascript
static async createWompiSubscriptionWidget(planId, totalAmount, redirectUrl, customerData = {}) {
  const requestBody = {
    plan_id: planId,
    amount: totalAmount,
    currency: 'COP',
    redirect_url: redirectUrl
  };

  const response = await fetch(`${API_CONFIG.BASE_URL}/payments/wompi/create-subscription-widget`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(requestBody)
  });

  return response.json();
}
```

### 3. **Flujo Corregido**

#### ✅ **NUEVO FLUJO (CORRECTO):**

1. **Frontend** → Llama a `/api/payments/wompi/create-widget`
2. **Backend** → Guarda la `payment_reference` en la orden
3. **Backend** → Devuelve los datos del widget (reference, amount, signature, etc.)
4. **Frontend** → Abre el widget con los datos del backend
5. **Usuario** → Paga
6. **Wompi** → Envía webhook con la referencia
7. **Backend** → Encuentra la orden por la referencia guardada
8. **Backend** → Confirma la orden ✅

## 🚀 Endpoints Requeridos en el Backend

### Para Órdenes:

```
POST /api/payments/wompi/create-widget
```

**Request:**

```json
{
  "order_id": 8,
  "amount": 1535500,
  "currency": "COP",
  "redirect_url": "https://market-club-frontend.vercel.app/checkout/success?order_id=8",
  "customer_email": "usuario@ejemplo.com",
  "customer_name": "Juan Pérez",
  "customer_phone": "3001234567"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "reference": "ORDER_8_1760919421_9483",
    "amount": 1535500,
    "currency": "COP",
    "signature": {
      "integrity": "fd91d49a922acea57be8e662b58648c805176b8b50095296633cd8316c499ce4"
    },
    "public_key": "pub_test_6j4AFOkyelP8Sb8HsS9u9l7aagAaRak4",
    "redirect_url": "https://market-club-frontend.vercel.app/checkout/success?order_id=8"
  }
}
```

### Para Suscripciones:

```
POST /api/payments/wompi/create-subscription-widget
```

**Request:**

```json
{
  "plan_id": "curious_brewer",
  "amount": 50000,
  "currency": "COP",
  "redirect_url": "https://market-club-frontend.vercel.app/club-socios/success",
  "customer_email": "usuario@ejemplo.com",
  "customer_name": "Juan Pérez",
  "customer_phone": "3001234567"
}
```

## 🔧 Implementación en el Backend

### Endpoint: `POST /api/payments/wompi/create-widget`

```php
public function createWidget(Request $request)
{
    $orderId = $request->input('order_id');
    $amount = $request->input('amount');
    $redirectUrl = $request->input('redirect_url');

    // Buscar la orden
    $order = Order::find($orderId);
    if (!$order) {
        return response()->json(['error' => 'Order not found'], 404);
    }

    // Generar referencia única
    $reference = 'ORDER_' . $orderId . '_' . time() . '_' . rand(1000, 9999);

    // GUARDAR LA REFERENCIA EN LA ORDEN (ESTE ES EL PASO CLAVE)
    $order->update(['payment_reference' => $reference]);

    // Generar firma de integridad
    $signature = $this->generateWompiSignature($reference, $amount);

    return response()->json([
        'success' => true,
        'data' => [
            'reference' => $reference,
            'amount' => $amount,
            'currency' => 'COP',
            'signature' => ['integrity' => $signature],
            'public_key' => env('WOMPI_PUBLIC_KEY'),
            'redirect_url' => $redirectUrl
        ]
    ]);
}
```

### Endpoint: `POST /api/payments/wompi/create-subscription-widget`

```php
public function createSubscriptionWidget(Request $request)
{
    $planId = $request->input('plan_id');
    $amount = $request->input('amount');
    $redirectUrl = $request->input('redirect_url');

    // Buscar el plan
    $plan = SubscriptionPlan::where('slug', $planId)->first();
    if (!$plan) {
        return response()->json(['error' => 'Plan not found'], 404);
    }

    // Generar referencia única para suscripción
    $reference = 'SUBSCRIPTION_' . $planId . '_' . time() . '_' . rand(1000, 9999);

    // GUARDAR LA REFERENCIA EN UNA TABLA DE SUSCRIPCIONES PENDIENTES
    // O en el perfil del usuario
    $this->saveSubscriptionReference($reference, $planId, $amount);

    // Generar firma de integridad
    $signature = $this->generateWompiSignature($reference, $amount);

    return response()->json([
        'success' => true,
        'data' => [
            'reference' => $reference,
            'amount' => $amount,
            'currency' => 'COP',
            'signature' => ['integrity' => $signature],
            'public_key' => env('WOMPI_PUBLIC_KEY'),
            'redirect_url' => $redirectUrl
        ]
    ]);
}
```

## 🎯 Resultado Esperado

Con estos cambios:

1. ✅ **La referencia se guarda ANTES del pago**
2. ✅ **El webhook puede encontrar la orden**
3. ✅ **El pago se confirma correctamente**
4. ✅ **El usuario recibe su orden/suscripción**

## 🚀 Próximos Pasos

1. **Implementar los endpoints en el backend**
2. **Desplegar el frontend corregido**
3. **Probar con un pago real**
4. **Monitorear los logs del webhook**

¡Ahora el flujo debería funcionar perfectamente! 🎉
