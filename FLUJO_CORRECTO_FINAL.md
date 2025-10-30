# ✅ FLUJO CORRECTO - Checkout con Wompi (ACTUALIZADO)

## 🎯 Resumen del Cambio

**ANTES (Incorrecto):**

- Frontend llamaba a `/api/payments/process` después del pago ❌
- Este endpoint es para INICIAR pagos, no confirmar

**AHORA (Correcto):**

- Frontend NO llama a nada después del pago ✅
- Wompi envía webhook automáticamente al backend ✅
- El webhook envía el email ✅

---

## 📋 Flujo Paso a Paso

### PASO 1: Crear Orden

```http
POST /api/checkout/create-order

Request:
{
  "shipping_address": {...},
  "billing_address": {...}
}

Response:
{
  "success": true,
  "data": {
    "order": {
      "id": 123,
      "status": "pending",
      "payment_status": "pending"
    }
  }
}
```

✅ Orden creada con ID: 123

---

### PASO 2: Crear Widget de Wompi

```http
POST /api/payments/wompi/create-widget

Request:
{
  "order_id": 123,
  "amount": 150000,
  "customer_email": "cliente@ejemplo.com",
  "customer_name": "Juan Pérez"
}

Response:
{
  "success": true,
  "data": {
    "reference": "ORDER_123_1234567890_9999",
    "amount": 15000000,
    "currency": "COP",
    "integrity_signature": "abc123...",
    "publicKey": "pub_test_xxx"
  }
}
```

✅ Backend guarda la `reference` en la orden
✅ Frontend abre widget con estos datos

---

### PASO 3: Usuario Paga en Wompi

**Widget de Wompi se abre**

- Usuario ingresa datos de tarjeta
- Wompi procesa el pago
- Wompi retorna resultado al callback

**Callback del widget:**

```javascript
{
  transaction: {
    id: "12345-6789-ABCD",
    status: "APPROVED",
    reference: "ORDER_123_1234567890_9999"
  }
}
```

**Lo que hace el frontend:**

```javascript
if (status === "APPROVED") {
  console.log("✅ Payment approved by Wompi!");
  console.log("🔔 Wompi will send webhook to backend automatically");
  console.log("📧 Backend will send confirmation email via webhook");

  // NO llama a ningún endpoint
  // Solo avanza al paso 4 y espera
  onSuccess();
}
```

✅ Pago aprobado
✅ Frontend avanza a confirmación
❌ Frontend **NO** llama a `/api/payments/process`

---

### PASO 4: Wompi Envía Webhook (AUTOMÁTICO)

**Wompi automáticamente envía:**

```http
POST https://tu-frontend.com/api/webhooks/wompi

Headers:
{
  "Content-Type": "application/json",
  "x-wompi-signature": "firma-de-seguridad"
}

Body:
{
  "event": "transaction.updated",
  "data": {
    "transaction": {
      "id": "12345-6789-ABCD",
      "status": "APPROVED",
      "reference": "ORDER_123_1234567890_9999",
      "amount_in_cents": 15000000
    }
  }
}
```

**El webhook del frontend (`src/app/api/webhooks/wompi/route.ts`):**

1. Recibe la notificación de Wompi
2. Extrae la `reference`
3. Llama al backend para confirmar:

```http
POST /api/orders/confirm-by-reference

{
  "reference": "ORDER_123_1234567890_9999",
  "transaction_id": "12345-6789-ABCD"
}
```

**El backend al recibir `/api/orders/confirm-by-reference`:**

1. ✅ Busca la orden por la `reference`
2. ✅ Actualiza `payment_status` a `"paid"`
3. ✅ Guarda el `transaction_id`
4. ✅ Carga las relaciones de la orden (items, productos, etc.)
5. 📧 **ENVÍA EL EMAIL DE CONFIRMACIÓN**
6. ✅ Retorna respuesta exitosa

```json
{
  "success": true,
  "message": "Order confirmed and email sent",
  "data": {
    "order_id": 123,
    "payment_status": "paid",
    "email_sent": true
  }
}
```

✅ Orden confirmada
✅ Email enviado 📧
✅ Cliente recibe confirmación

---

### PASO 5: Frontend Verifica Estado (Polling)

Mientras todo lo anterior pasa, el frontend verifica el estado de la orden:

```http
GET /api/user/orders/123
o
POST /api/payments/check-status
{
  "order_id": 123
}
```

**Hace 5 intentos con 2 segundos de espera entre cada uno**

**Cuando el webhook ya procesó la orden, retorna:**

```json
{
  "success": true,
  "data": {
    "id": 123,
    "payment_status": "paid", // ← Ya actualizado por el webhook
    "status": "processing"
  }
}
```

✅ Frontend ve que `payment_status === "paid"`
✅ Muestra mensaje de éxito al usuario

---

## 📊 Diagrama Visual del Flujo

```
┌─────────────┐        ┌─────────────┐        ┌─────────────┐
│  FRONTEND   │        │   BACKEND   │        │    WOMPI    │
└──────┬──────┘        └──────┬──────┘        └──────┬──────┘
       │                      │                       │
       │ 1. POST /checkout    │                       │
       │    /create-order     │                       │
       ├─────────────────────>│                       │
       │                      │                       │
       │<─ Orden ID: 123 ─────┤                       │
       │                      │                       │
       │ 2. POST /payments/   │                       │
       │    wompi/create-     │                       │
       │    widget            │                       │
       ├─────────────────────>│                       │
       │                      │                       │
       │                      │ Guarda reference      │
       │                      │ en la orden           │
       │                      │                       │
       │<─ reference, ────────┤                       │
       │   signature          │                       │
       │                      │                       │
       │ 3. Abrir widget      │                       │
       ├──────────────────────┼──────────────────────>│
       │                      │                       │
       │                      │ Usuario paga          │
       │                      │                       │
       │<─ APPROVED ──────────┼───────────────────────┤
       │                      │                       │
       │ ¡NO HACE NADA!       │                       │
       │ Solo avanza          │                       │
       │                      │                       │
       │                      │ 4. Wompi envía webhook│
       │                      │<──────────────────────┤
       │                      │                       │
       │ 5. Webhook llama     │                       │
       │    al backend        │                       │
       ├─────────────────────>│                       │
       │ POST /orders/        │                       │
       │ confirm-by-reference │                       │
       │                      │                       │
       │                      │ ✅ Actualiza orden    │
       │                      │ 📧 ENVÍA EMAIL        │
       │                      │                       │
       │<─ Success ───────────┤                       │
       │                      │                       │
       │ 6. GET /orders/123   │                       │
       │    (polling)         │                       │
       ├─────────────────────>│                       │
       │                      │                       │
       │<─ payment_status:────┤                       │
       │   "paid"             │                       │
       │                      │                       │
       │ ✅ Muestra éxito     │                       │
       │                      │                       │
```

---

## 🔍 Cómo Verificar que Funciona

### 1. Logs del Frontend (Consola)

```
✅ Payment approved by Wompi!
🔔 Wompi will send webhook to backend automatically
📧 Backend will send confirmation email via webhook
🆔 Transaction ID: 12345-6789-ABCD
📦 Order ID: 123
```

Si ves estos logs = el frontend está funcionando correctamente ✅

### 2. Logs del Webhook (Servidor Next.js)

```
🔔 Wompi webhook received
📦 Webhook payload: { event: 'transaction.updated', ... }
🔄 Processing transaction update...
✅ Payment approved: 12345-6789-ABCD, reference: ORDER_123_...
🛒 Processing order payment for reference: ORDER_123_...
🔗 Using API URL: https://api.backend.com/api
✅ Order confirmed by reference: ORDER_123_...
```

Si ves estos logs = el webhook está funcionando correctamente ✅

### 3. Logs del Backend (Laravel)

```
[INFO] Webhook received: /api/orders/confirm-by-reference
[INFO] Order found: 123
[INFO] Updating payment status to: paid
[INFO] Sending confirmation email to: cliente@ejemplo.com
[INFO] Email sent successfully via Brevo
```

Si ves estos logs = el backend está enviando emails correctamente ✅

### 4. Email Recibido

Cliente recibe email con:

- ✅ Número de orden
- ✅ Productos comprados
- ✅ Total pagado
- ✅ Dirección de envío

---

## ⚠️ Problemas Comunes

### Problema 1: El webhook no se ejecuta

**Causa:** Wompi no puede llegar al webhook del frontend  
**Solución:** Verificar que la URL del webhook esté pública (no localhost)

### Problema 2: El webhook se ejecuta pero el backend no recibe la llamada

**Causa:** Variables de entorno incorrectas en el webhook  
**Solución:** ✅ YA CORREGIDO - Ahora usa `NEXT_PUBLIC_API_URL`

### Problema 3: El backend recibe la llamada pero no envía email

**Causa:**

- Brevo no configurado
- Email de remitente no verificado
- Error en el template

**Solución:**

- ✅ YA CORREGIDO - Templates actualizados
- ✅ YA CORREGIDO - Webhook carga relaciones
- Verificar configuración de Brevo en `.env`

### Problema 4: Frontend muestra "failed" aunque el pago fue exitoso

**Causa:** El polling consulta antes de que el webhook actualice  
**Solución:** ✅ YA IMPLEMENTADO - Sistema de reintentos (5 intentos x 2 segundos)

---

## ✅ Checklist de Verificación

Para que los emails funcionen, verificar:

### Frontend:

- [x] NO llama a `/api/payments/process` después del pago
- [x] Webhook está configurado en `src/app/api/webhooks/wompi/route.ts`
- [x] Webhook usa `NEXT_PUBLIC_API_URL` correctamente
- [x] Sistema de polling con reintentos implementado

### Backend:

- [ ] Endpoint `/api/orders/confirm-by-reference` existe
- [ ] Endpoint carga las relaciones de la orden (items, productos, etc.)
- [ ] Endpoint actualiza `payment_status` a `"paid"`
- [ ] Endpoint envía email después de actualizar la orden
- [ ] Brevo está configurado en `.env`
- [ ] Email de remitente está verificado en Brevo
- [ ] Templates de email están corregidos (validación null)

### Wompi:

- [ ] Webhook URL configurada en el dashboard de Wompi
- [ ] URL del webhook es accesible públicamente
- [ ] Webhook está recibiendo notificaciones de Wompi

---

## 🎯 Próximos Pasos

1. **Hacer una compra de prueba**
2. **Revisar los logs** en el orden:
   - Frontend (consola del navegador)
   - Webhook (servidor Next.js)
   - Backend (Laravel logs)
3. **Verificar que el email llegue**
4. **Si no llega el email, revisar los logs del backend** para ver qué error específico ocurre

---

**Última actualización:** 30 de Octubre, 2025  
**Estado:** Flujo correcto implementado - Esperando prueba del backend
