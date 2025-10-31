# 🔄 Flujo Actual de Checkout y Pagos (Frontend)

## 📋 Resumen Ejecutivo

El frontend está llamando a `/api/payments/process` cuando Wompi aprueba el pago, pero **los emails NO se están enviando**. Este documento describe el flujo exacto para que el backend pueda diagnosticar dónde está el problema.

---

## 🛒 PASO 1: Crear la Orden

**Endpoint:** `POST /api/checkout/create-order`

**Ubicación en el código:** `src/components/checkout/CheckoutFlow.tsx` línea ~249

**Request:**

```json
{
  "shipping_address": {
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@ejemplo.com",
    "phone": "3001234567",
    "address": "Calle 123",
    "city": "Bogotá",
    "state": "Cundinamarca",
    "postal_code": "110111",
    "country": "Colombia"
  },
  "billing_address": null,
  "notes": ""
}
```

**Response esperada:**

```json
{
  "success": true,
  "data": {
    "order": {
      "id": 123,                    // ← Este es el order_id
      "order_number": "ORD-123",
      "status": "pending",
      "payment_status": "pending",
      "total_amount": 150000,
      "items": [...]
    }
  }
}
```

**Estado después de este paso:**

- ✅ Orden creada en la base de datos
- ✅ Estado: `pending`
- ✅ Payment status: `pending`
- ❌ Email NO se envía aquí

---

## 💳 PASO 2: Crear Widget de Wompi

**Endpoint:** `POST /api/payments/wompi/create-widget`

**Ubicación en el código:** `src/components/checkout/PaymentStep.tsx` línea ~188

**Request:**

```json
{
  "order_id": 123,
  "amount": 150000,
  "redirect_url": "https://frontend.com/checkout/success?order_id=123",
  "customer_email": "juan@ejemplo.com",
  "customer_name": "Juan Pérez",
  "customer_phone": "3001234567"
}
```

**Response esperada:**

```json
{
  "success": true,
  "data": {
    "reference": "ORDER_123_1234567890_9999", // ← Reference guardada en la orden
    "amount": 15000000, // En centavos
    "currency": "COP",
    "integrity_signature": "abc123...",
    "publicKey": "pub_test_xxx"
  }
}
```

**Estado después de este paso:**

- ✅ `payment_reference` guardada en la orden
- ✅ Widget de Wompi listo para abrirse
- ❌ Email NO se envía aquí

---

## 🎯 PASO 3: Usuario Paga en Wompi

**Lo que sucede:**

1. Se abre el widget de Wompi
2. Usuario ingresa datos de tarjeta
3. Usuario confirma el pago
4. Wompi procesa la transacción
5. Wompi retorna resultado al callback del widget

**Resultado del callback:**

```javascript
{
  transaction: {
    id: "12345-6789-ABCD",           // ← transaction_id de Wompi
    status: "APPROVED",               // ← Status del pago
    amount_in_cents: 15000000,
    currency: "COP",
    reference: "ORDER_123_1234567890_9999",
    payment_method: {
      type: "CARD"
    }
  }
}
```

---

## ✅ PASO 4: El Frontend NO hace nada - Espera al Webhook

**IMPORTANTE:** El frontend **NO llama** a ningún endpoint aquí.

**¿Por qué?**

- El endpoint `/api/payments/process` es para **INICIAR** pagos, no para confirmar
- Wompi automáticamente envía un **webhook** al backend cuando el pago es aprobado
- El **webhook** es el que envía el email automáticamente

**Lo que hace el frontend:**

```javascript
// Simplemente avanza al paso 4 y espera
console.log("✅ Payment approved by Wompi!");
console.log("🔔 Wompi will send webhook to backend automatically");
console.log("📧 Backend will send confirmation email via webhook");
onSuccess(); // Avanza al paso de confirmación
```

**PASO 4 REAL: Webhook de Wompi (automático)**

**Endpoint que Wompi llama:** `POST https://tu-frontend.com/api/webhooks/wompi`

**Headers:**

```javascript
{
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Authorization": "Bearer [token-si-usuario-esta-autenticado]"
}
```

**Request Body:**

```json
{
  "order_id": 123, // ID de la orden del PASO 1
  "payment_method_type": "CARD", // Tipo: CARD, PSE, NEQUI, etc.
  "payment_token": "12345-6789-ABCD" // Transaction ID de Wompi
}
```

**Logs del frontend al hacer esta llamada:**

```
✅ Payment approved, processing payment in backend...
📨 Calling /payments/process to trigger email...
📊 Payment data to send: {
  order_id: 123,
  payment_method_type: "CARD",
  payment_token: "12345-6789-ABCD",
  transaction: {...}
}
```

**Response esperada del backend:**

```json
{
  "success": true,
  "data": {
    "status": "APPROVED",
    "order_id": 123,
    "transaction_id": "12345-6789-ABCD",
    "amount": 150000,
    "payment_status": "paid"
  }
}
```

**¿QUÉ DEBERÍA HACER EL BACKEND EN ESTE PASO?**

1. ✅ Recibir la llamada a `/api/payments/process`
2. ✅ Buscar la orden por `order_id: 123`
3. ✅ Actualizar el estado de la orden a `paid`
4. ✅ Guardar el `transaction_id` de Wompi
5. 📧 **ENVIAR EL EMAIL DE CONFIRMACIÓN** ← Esto NO está pasando
6. ✅ Retornar respuesta exitosa

---

## 🔄 PASO 5: Verificación del Estado (Polling)

**Endpoint:** `GET /api/user/orders/{order_id}` (si autenticado)  
o `POST /api/payments/check-status` (si no autenticado)

**Ubicación en el código:** `src/components/checkout/CheckoutFlow.tsx` línea ~79

**Hace 5 intentos con 2 segundos de espera entre cada uno**

**Request (si no autenticado):**

```json
{
  "order_id": 123
}
```

**Response esperada:**

```json
{
  "success": true,
  "data": {
    "id": 123,
    "order_number": "ORD-123",
    "status": "completed",
    "payment_status": "paid", // ← Debe ser "paid"
    "total_amount": 150000
  }
}
```

---

## 📊 Diagrama del Flujo Completo

```
FRONTEND                           BACKEND                    WOMPI
   |                                  |                         |
   |--1. POST /checkout/create-order->|                         |
   |<------ orden ID: 123 ------------|                         |
   |                                  |                         |
   |--2. POST /payments/wompi/------->|                         |
   |      create-widget               |                         |
   |<-- reference, signature ---------|                         |
   |                                  |                         |
   |--3. Abrir Widget ----------------|------------------------>|
   |                                  |                         |
   |                    Usuario paga en Wompi                   |
   |                                  |                         |
   |<----- Callback: APPROVED --------|-------------------------|
   |                                  |                         |
   |--4. POST /payments/process ----->|                         |
   |    {order_id: 123,               |                         |
   |     payment_token: "xxx",        |                         |
   |     payment_method_type: "CARD"} |                         |
   |                                  |                         |
   |                            [AQUÍ DEBERÍA ENVIAR EMAIL 📧]  |
   |                                  |                         |
   |<-- Success response -------------|                         |
   |                                  |                         |
   |--5. GET /orders/123 ------------>|                         |
   |    (verificar estado)            |                         |
   |<-- payment_status: "paid" -------|                         |
   |                                  |                         |
   | Mostrar "Pedido Completado"      |                         |
```

---

## ❓ Preguntas para el Backend

### 1. ¿Se está recibiendo la llamada a `/api/payments/process`?

- Revisar logs del backend cuando se hace un pago
- Buscar: `POST /api/payments/process`

### 2. ¿Qué parámetros está recibiendo el backend?

```json
{
  "order_id": 123,
  "payment_method_type": "CARD",
  "payment_token": "xxx-xxx-xxx"
}
```

### 3. ¿El backend está actualizando el estado de la orden?

- ¿Cambia `payment_status` de `pending` a `paid`?
- ¿Se guarda el `transaction_id`?

### 4. ¿El backend intenta enviar el email?

- Buscar en logs: "Sending order confirmation email"
- Buscar en logs: "Order confirmation email sent"
- ¿Hay errores relacionados con Brevo?

### 5. ¿Está configurado Brevo correctamente?

- ¿Las credenciales de Brevo están en el `.env`?
- ¿El email de remitente está verificado?
- ¿Hay errores en `storage/logs/laravel.log`?

### 6. ¿El endpoint `/api/payments/process` existe y está funcionando?

- ¿Retorna status 200?
- ¿Retorna `success: true`?
- ¿Qué hace internamente este endpoint?

---

## 🔍 Cómo Verificar el Problema

### En el Frontend (Consola del navegador):

1. Abrir DevTools (F12)
2. Ir a la pestaña "Console"
3. Hacer un pago de prueba
4. Buscar estos logs:

```javascript
✅ Payment approved, processing payment in backend...
📨 Calling /payments/process to trigger email...
📊 Payment data to send: {
  order_id: 123,
  payment_method_type: "CARD",
  payment_token: "xxx-xxx-xxx"
}
✅ Payment process response: {
  success: true,
  data: { status: "APPROVED", ... }
}
```

5. Si aparece el último log, significa que el frontend SÍ está llamando al endpoint correctamente

### En el Backend (Laravel):

1. Revisar `storage/logs/laravel.log`
2. Buscar logs relacionados con:
   - `POST /api/payments/process`
   - "Processing payment for order"
   - "Order confirmation email"
   - Errores de Brevo/email

---

## 🆘 Posibles Problemas

### Problema 1: El endpoint no existe o tiene otra ruta

- **Verificar:** ¿Existe `POST /api/payments/process` en las rutas?
- **Solución:** Confirmar la ruta correcta

### Problema 2: El endpoint no envía emails

- **Verificar:** ¿Qué hace el endpoint internamente?
- **Solución:** El backend debe enviar el email cuando `status === 'APPROVED'`

### Problema 3: Falta autenticación

- **Verificar:** ¿El endpoint requiere autenticación?
- **Estado actual:** El frontend envía el token si existe, pero también funciona sin él
- **Solución:** Clarificar si es requerido o no

### Problema 4: Formato incorrecto de parámetros

- **Verificar:** ¿El backend espera otros parámetros?
- **Estado actual:** Enviamos `order_id`, `payment_method_type`, `payment_token`
- **Solución:** Confirmar qué parámetros exactos espera el backend

### Problema 5: Brevo no configurado

- **Verificar:** Variables de entorno de Brevo
- **Solución:** Configurar correctamente Brevo en el backend

---

## 📝 Ejemplo de Código Backend Esperado

**Endpoint:** `/api/payments/process`

```php
public function process(Request $request)
{
    $orderId = $request->input('order_id');
    $paymentToken = $request->input('payment_token');
    $paymentMethodType = $request->input('payment_method_type');

    // 1. Buscar la orden
    $order = Order::find($orderId);

    // 2. Actualizar el estado
    $order->payment_status = 'paid';
    $order->status = 'processing';
    $order->transaction_id = $paymentToken;
    $order->save();

    // 3. ENVIAR EMAIL (ESTO ES LO CRÍTICO)
    try {
        Mail::to($order->customer_email)->send(
            new OrderConfirmation($order)
        );
        Log::info('Order confirmation email sent', ['order_id' => $orderId]);
    } catch (\Exception $e) {
        Log::error('Failed to send order confirmation email', [
            'order_id' => $orderId,
            'error' => $e->getMessage()
        ]);
    }

    // 4. Retornar respuesta
    return response()->json([
        'success' => true,
        'data' => [
            'status' => 'APPROVED',
            'order_id' => $orderId,
            'payment_status' => 'paid'
        ]
    ]);
}
```

---

**Fecha:** 30 de Octubre, 2025  
**Estado:** Esperando diagnóstico del backend
