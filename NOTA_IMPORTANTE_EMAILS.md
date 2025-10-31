# ⚠️ NOTA IMPORTANTE: Tipo de Email a Enviar

## 📧 Tipos de Emails

El sistema tiene DOS tipos de emails diferentes:

### 1. Email de Confirmación de Orden ❌ NO ENVIAR

- **Cuándo:** Cuando se crea la orden
- **Mensaje:** "Tu orden #123 ha sido creada"
- **Estado:** La orden existe pero aún no está pagada
- **Decisión:** **NO ENVIAR ESTE EMAIL**

### 2. Email de Confirmación de Pago ✅ ENVIAR ESTE

- **Cuándo:** Cuando el pago es aprobado por Wompi
- **Mensaje:** "Tu pago ha sido aprobado/procesado exitosamente"
- **Estado:** El pago fue procesado, la orden está pagada
- **Decisión:** **SÍ ENVIAR ESTE EMAIL**

---

## 🎯 Configuración Requerida en el Backend

### Endpoint: `/api/orders/confirm-by-reference`

Este endpoint se llama cuando el webhook de Wompi confirma el pago.

**Lo que debe hacer:**

```php
public function confirmByReference(Request $request)
{
    $reference = $request->input('reference');
    $transactionId = $request->input('transaction_id');

    // 1. Buscar la orden por la referencia
    $order = Order::where('payment_reference', $reference)
                  ->with(['items', 'items.product', 'shippingAddress'])
                  ->first();

    if (!$order) {
        return response()->json([
            'success' => false,
            'message' => 'Order not found'
        ], 404);
    }

    // 2. Actualizar el estado del pago
    $order->payment_status = 'paid';
    $order->transaction_id = $transactionId;
    $order->payment_date = now();
    $order->save();

    // 3. ENVIAR EMAIL DE CONFIRMACIÓN DE PAGO (NO de orden)
    try {
        // ✅ CORRECTO: Email de confirmación de PAGO
        Mail::to($order->customer_email)->send(
            new PaymentConfirmationMail($order)
        );

        // ❌ INCORRECTO: NO usar OrderConfirmationMail
        // Mail::to($order->customer_email)->send(
        //     new OrderConfirmationMail($order)
        // );

        Log::info('Payment confirmation email sent', [
            'order_id' => $order->id,
            'email' => $order->customer_email
        ]);
    } catch (\Exception $e) {
        Log::error('Failed to send payment confirmation email', [
            'order_id' => $order->id,
            'error' => $e->getMessage()
        ]);
    }

    return response()->json([
        'success' => true,
        'message' => 'Order confirmed and payment email sent',
        'data' => [
            'order_id' => $order->id,
            'payment_status' => $order->payment_status,
            'email_sent' => true
        ]
    ]);
}
```

---

## 📋 Checklist para el Backend

### Verificar:

- [ ] Existe la clase `PaymentConfirmationMail` (o similar)
- [ ] NO se usa `OrderConfirmationMail` en el webhook
- [ ] El template del email dice algo sobre "pago aprobado/procesado"
- [ ] El email NO se envía cuando se crea la orden (POST /checkout/create-order)
- [ ] El email SÍ se envía cuando el webhook confirma el pago

### Templates Recomendados:

**Email de Confirmación de Pago:**

```
Asunto: ✅ Pago Aprobado - Pedido #123

Hola Juan,

¡Tu pago ha sido aprobado exitosamente!

Detalles de la transacción:
- Número de pedido: #123
- Total pagado: $150,000 COP
- Método de pago: Tarjeta de crédito
- ID de transacción: 12345-6789-ABCD

Productos:
- [Lista de productos]

Dirección de envío:
- [Dirección]

Tu pedido será procesado y enviado pronto.

Gracias por tu compra,
Market Club
```

---

## 🔄 Flujo Actualizado

```
1. Usuario crea orden
   → Estado: pending
   → Payment status: pending
   ❌ NO enviar email aquí

2. Usuario paga en Wompi
   → Wompi aprueba el pago

3. Wompi envía webhook
   → Webhook llama a /orders/confirm-by-reference

4. Backend actualiza orden
   → Payment status: paid
   ✅ ENVIAR EMAIL DE CONFIRMACIÓN DE PAGO aquí

5. Usuario recibe email
   → "Tu pago ha sido aprobado"
```

---

## 💡 Recomendaciones Adicionales

### Opción 1: Usar Mailable diferente

Crear un Mailable específico para pagos:

```bash
php artisan make:mail PaymentConfirmationMail
```

### Opción 2: Usar el mismo Mailable con parámetro

Si ya existe `OrderConfirmationMail`, pasarle un parámetro:

```php
Mail::to($order->customer_email)->send(
    new OrderConfirmationMail($order, $type = 'payment')
);
```

Y en el Mailable:

```php
public function build()
{
    if ($this->type === 'payment') {
        return $this->subject('Pago Aprobado')
                    ->view('emails.payment-confirmation');
    }

    return $this->subject('Orden Creada')
                ->view('emails.order-confirmation');
}
```

### Opción 3: Flag en la base de datos

Agregar columna `send_order_email` = false en la tabla orders

---

## 🎯 Resumen

**ANTES (Incorrecto):**

- Endpoint confirmaba la orden
- Enviaba "Email de Confirmación de Orden"
- Usuario recibe: "Tu orden ha sido creada"

**AHORA (Correcto):**

- Endpoint confirma el PAGO
- Envía "Email de Confirmación de Pago"
- Usuario recibe: "Tu pago ha sido aprobado"

---

**Fecha:** 30 de Octubre, 2025  
**Aclaración:** Solo enviar email de PAGO, no de ORDEN

