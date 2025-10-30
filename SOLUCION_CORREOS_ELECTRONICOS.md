# 📧 Solución al Problema de Envío de Correos Electrónicos

## 🔍 Problema Identificado

Los correos electrónicos de confirmación de pedido **no se estaban enviando** después de que un cliente completara una compra exitosamente, a pesar de que antes sí funcionaban.

## 🕵️ Causa Raíz

El problema tenía **DOS causas principales**:

### Problema 1: Variables de entorno incorrectas en el webhook

El webhook de Wompi (`src/app/api/webhooks/wompi/route.ts`) estaba intentando conectarse al backend usando variables de entorno incorrectas:

- Usaba: `process.env.API_URL` ❌ (no definida)
- Usaba: `process.env.API_SECRET_KEY` ❌ (no definida)
- Debía usar: `process.env.NEXT_PUBLIC_API_URL` ✅

### Problema 2: Faltaba llamar al endpoint de "Procesar Pago" (CRÍTICO)

Según el backend, **el email se envía automáticamente cuando se llama al endpoint `/api/payments/process`**. El frontend estaba:

1. ✅ Creando la orden
2. ✅ Abriendo el widget de Wompi
3. ✅ Wompi aprobaba el pago
4. ❌ **NUNCA llamaba a `/api/payments/process`** → Sin email
5. Solo verificaba el estado de la orden (GET) pero no procesaba el pago (POST)

## ⚙️ ¿Por Qué Pasó Esto?

El webhook es un **API Route de Next.js** que se ejecuta en el servidor. En la refactorización del flujo de pagos, se cambió la forma en que se manejaba la confirmación de órdenes:

**Antes:**

- Widget redirigía a `/checkout/success`
- La página llamaba a `confirmOrder()`
- Pero `confirmOrder()` estaba simulado (mock) ❌

**Ahora:**

- Widget usa callback (sin redirección)
- El webhook de Wompi confirma la orden automáticamente ✅
- PERO el webhook no podía conectarse al backend por variables incorrectas ❌

## ✅ Solución Implementada

### Cambio 1: Llamar al endpoint `/api/payments/process` cuando Wompi aprueba el pago (CRÍTICO)

**Archivo:** `src/components/checkout/PaymentStep.tsx`

Agregamos una llamada al endpoint `/api/payments/process` en el callback del widget de Wompi cuando el pago es APPROVED:

```typescript
checkout.open(async (result: any) => {
  if (result && result.transaction) {
    const status = result.transaction.status;
    const transactionId = result.transaction.id;

    if (status === "APPROVED") {
      // CRÍTICO: Llamar al endpoint que envía los emails
      const token =
        localStorage.getItem("auth_token") || localStorage.getItem("token");

      const processResponse = await fetch(`${API_URL}/payments/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({
          order_id: orderId,
          payment_method_type: "CARD", // o 'PSE', 'NEQUI', etc
          payment_token: transactionId,
        }),
      });

      const processData = await processResponse.json();

      if (processResponse.ok && processData.data.status === "APPROVED") {
        // ✅ Email enviado automáticamente por el backend
        showSuccess("Pago exitoso", "Recibirás un email de confirmación");
        onSuccess();
      }
    }
  }
});
```

**¿Por qué este cambio es crítico?**

- El backend envía el email automáticamente cuando se llama a `/api/payments/process` con `status === 'APPROVED'`
- Sin esta llamada, el backend nunca sabe que debe enviar el email
- El webhook de Wompi es un respaldo, pero la confirmación inmediata viene de esta llamada

### Cambio 2: Corregir variables de entorno en el webhook

**Archivo:** `src/app/api/webhooks/wompi/route.ts`

Se actualizaron **3 funciones** para usar la variable de entorno correcta:

#### 1. `confirmOrder()` - Confirmar órdenes regulares

```typescript
// ❌ ANTES
const response = await fetch(
  `${process.env.API_URL}/orders/confirm-by-reference`,
  {
    headers: {
      Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
    },
  }
);

// ✅ AHORA
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const response = await fetch(`${API_URL}/orders/confirm-by-reference`, {
  headers: {
    "Content-Type": "application/json",
  },
});
```

#### 2. `confirmSubscription()` - Confirmar suscripciones

```typescript
// ❌ ANTES
const response = await fetch(
  `${process.env.API_URL}/subscriptions/confirm-by-reference`,
  {
    headers: {
      Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
    },
  }
);

// ✅ AHORA
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const response = await fetch(`${API_URL}/subscriptions/confirm-by-reference`, {
  headers: {
    "Content-Type": "application/json",
  },
});
```

#### 3. `markPaymentAsFailed()` - Marcar pagos fallidos

```typescript
// ❌ ANTES
const response = await fetch(`${process.env.API_URL}/payments/mark-failed`, {
  headers: {
    Authorization: `Bearer ${process.env.API_SECRET_KEY}`,
  },
});

// ✅ AHORA
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const response = await fetch(`${API_URL}/payments/mark-failed`, {
  headers: {
    "Content-Type": "application/json",
  },
});
```

### Mejoras Adicionales

1. **Logging detallado**: Se agregaron logs para ver qué URL está usando el webhook
2. **Manejo de errores mejorado**: Ahora se logean todos los errores de cada intento
3. **Múltiples estrategias de confirmación**: El webhook intenta 3 endpoints diferentes:
   - `/orders/confirm-by-reference` (recomendado)
   - `/orders/confirm-by-transaction`
   - `/orders/confirm` (fallback)

## 🔄 Flujo Completo de Pago (Actualizado)

```
1. Usuario hace clic en "Pagar con Wompi"
   ↓
2. Frontend llama a /payments/wompi/create-widget
   ↓
3. Backend guarda payment_reference en la orden
   ↓
4. Se abre el widget de Wompi con los datos del backend
   ↓
5. Usuario completa el pago
   ↓
6. Wompi procesa la transacción (APPROVED/DECLINED/PENDING)
   ↓
7. Widget cierra y ejecuta callback
   ↓
8. [CRÍTICO] Frontend llama a /payments/process con:
   - order_id
   - payment_method_type
   - payment_token (transaction_id)
   ↓
9. Backend procesa el pago y envía email automáticamente 📧
   ↓
10. Frontend avanza al paso 4 mostrando mensaje de éxito
    ↓
11. Frontend verifica el estado con el backend (con reintentos)
    ↓
12. Se muestra el resumen completo al usuario

FLUJO PARALELO (Webhook de Wompi como respaldo):
5b. Wompi envía webhook al frontend (/api/webhooks/wompi)
    ↓
6b. Webhook confirma la orden en el backend (respaldo)
    ↓
7b. Backend actualiza estado si aún no estaba actualizado
```

## 📝 Notas Importantes

### Variables de Entorno en Next.js

- **`NEXT_PUBLIC_*`**: Disponibles en cliente Y servidor
- **Variables sin prefijo**: Solo disponibles en servidor

El webhook se ejecuta en el servidor, por lo que puede acceder a ambas. Sin embargo, para consistencia con el resto del código, se usa `NEXT_PUBLIC_API_URL`.

### Verificación del Flujo Completo

Para verificar que todo está funcionando correctamente:

#### 1. **Logs en la consola del navegador** (Paso más importante):

```bash
🎉 Widget closed with result: {...}
📊 Transaction status: APPROVED
🆔 Transaction ID: xxx-xxx-xxx
✅ Payment approved, processing payment in backend...
📨 Calling /payments/process to trigger email...
📊 Payment data to send: {
  order_id: 123,
  payment_method_type: 'CARD',
  payment_token: 'xxx-xxx-xxx'
}
✅ Payment process response: {
  success: true,
  data: { status: 'APPROVED', ... }
}
```

#### 2. **Logs del servidor Next.js** (Webhook como respaldo):

```bash
🔔 Wompi webhook received
🕐 Timestamp: 2024-01-15T10:30:00.000Z
📦 Webhook payload: { event: 'transaction.updated', data: {...} }
🔄 Processing transaction update...
✅ Payment approved: xxx-xxx-xxx, reference: ORDER_123
🛒 Processing order payment for reference: ORDER_123
🔗 Using API URL: https://api.ejemplo.com/api
✅ Order confirmed by reference: ORDER_123
```

#### 3. **Verificar en el backend Laravel** que:

- Se recibe la llamada a `/api/payments/process`
- El pago se procesa con status `APPROVED`
- Se envía el email de confirmación
- Revisar `storage/logs/laravel.log` para mensajes como:
  - "Order confirmation email sent"
  - "Processing payment for order"

#### 4. **Verificar el email**:

- Revisar la bandeja de entrada del cliente
- Si no llega, verificar:
  - Configuración de Brevo en el backend
  - Email de remitente verificado en Brevo
  - No hay errores en los logs de Laravel

## 🎯 Resultado

Ahora, cuando un usuario completa un pago exitoso:

✅ **Flujo Principal:**

1. Widget de Wompi se cierra con status APPROVED
2. Frontend llama inmediatamente a `/api/payments/process`
3. Backend procesa el pago y **envía el email automáticamente** 📧
4. Frontend muestra mensaje de éxito al usuario

✅ **Flujo de Respaldo (Webhook):**

1. Wompi envía webhook al frontend
2. Webhook se conecta correctamente al backend (con variables correctas)
3. Backend confirma la orden si aún no estaba confirmada
4. Sistema robusto con doble verificación

## 🔧 Configuración Requerida

Asegúrate de que la variable de entorno esté configurada:

```env
NEXT_PUBLIC_API_URL=https://tu-backend.com/api
```

O en desarrollo:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 🚀 Próximos Pasos (Opcionales)

Para mejorar aún más el sistema:

1. **Implementar verificación de firma del webhook** (seguridad)
2. **Agregar retry logic** si la confirmación falla temporalmente
3. **Monitorear webhooks** con un servicio de logging
4. **Agregar alertas** si los webhooks fallan repetidamente

---

**Fecha de actualización:** 30 de Octubre, 2025  
**Autor:** Claude (Asistente de IA)
