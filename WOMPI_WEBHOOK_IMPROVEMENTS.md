# 🔧 Mejoras del Webhook de Wompi

## 📋 Problema Identificado

El webhook de Wompi no puede encontrar las órdenes porque:

1. La referencia se genera en el frontend pero no se guarda en la BD antes del pago
2. El webhook solo busca por `payment_reference` pero debería buscar por `transaction_id` O `reference`

## ✅ Soluciones Implementadas

### 1. **Webhook Mejorado** (`src/app/api/webhooks/wompi/route.ts`)

El webhook ahora:

- ✅ Busca por `reference` PRIMERO
- ✅ Si no encuentra, busca por `transaction_id`
- ✅ Si ninguno funciona, usa el endpoint original
- ✅ Logging detallado para debugging
- ✅ Manejo de errores robusto

### 2. **Nuevos Endpoints Requeridos en el Backend**

El webhook ahora intenta estos endpoints en orden:

#### Para Órdenes:

```
POST /api/orders/confirm-by-reference
POST /api/orders/confirm-by-transaction
POST /api/orders/confirm (original)
```

#### Para Suscripciones:

```
POST /api/subscriptions/confirm-by-reference
POST /api/subscriptions/confirm-by-transaction
POST /api/subscriptions/confirm (original)
```

### 3. **Implementación en el Backend**

#### Endpoint: `POST /api/orders/confirm-by-reference`

```php
public function confirmByReference(Request $request)
{
    $reference = $request->input('reference');
    $transactionId = $request->input('transaction_id');

    // Buscar orden por payment_reference
    $order = Order::where('payment_reference', $reference)->first();

    if (!$order) {
        // Si no existe, buscar por transaction_id en la tabla de pagos
        $payment = Payment::where('transaction_id', $transactionId)->first();
        if ($payment) {
            $order = $payment->order;
        }
    }

    if (!$order) {
        return response()->json(['error' => 'Order not found'], 404);
    }

    // Confirmar la orden
    $order->update([
        'status' => 'paid',
        'payment_status' => 'completed',
        'transaction_id' => $transactionId,
        'paid_at' => now()
    ]);

    return response()->json(['success' => true, 'order_id' => $order->id]);
}
```

#### Endpoint: `POST /api/orders/confirm-by-transaction`

```php
public function confirmByTransaction(Request $request)
{
    $transactionId = $request->input('transaction_id');
    $reference = $request->input('reference');

    // Buscar orden por transaction_id en la tabla de pagos
    $payment = Payment::where('transaction_id', $transactionId)->first();

    if (!$payment) {
        // Si no existe, buscar por reference
        $order = Order::where('payment_reference', $reference)->first();
        if ($order) {
            // Crear registro de pago
            Payment::create([
                'order_id' => $order->id,
                'transaction_id' => $transactionId,
                'amount' => $order->total,
                'status' => 'completed'
            ]);
        }
    } else {
        $order = $payment->order;
    }

    if (!$order) {
        return response()->json(['error' => 'Order not found'], 404);
    }

    // Confirmar la orden
    $order->update([
        'status' => 'paid',
        'payment_status' => 'completed',
        'transaction_id' => $transactionId,
        'paid_at' => now()
    ]);

    return response()->json(['success' => true, 'order_id' => $order->id]);
}
```

### 4. **Logging Detallado**

El webhook ahora registra:

- ✅ Timestamp del webhook
- ✅ Headers importantes (signature, user-agent, content-type)
- ✅ Payload completo del webhook
- ✅ Cada paso del proceso de confirmación
- ✅ Errores detallados con códigos de estado

### 5. **Flujo de Debugging**

Cuando ocurra un webhook, verás logs como:

```
🔔 Wompi webhook received
🕐 Timestamp: 2024-01-15T10:30:00.000Z
📦 Webhook payload: {...}
🔐 Webhook signature: abc123...
🎯 Processing event: transaction.updated
🔄 Processing transaction update...
✅ Payment approved: 1117801-1760915754-41295, reference: ORDER_6_1760915740_4495
🔍 Confirming order with transaction_id: 1117801-1760915754-41295, reference: ORDER_6_1760915740_4495
🔍 Step 1: Searching order by reference: ORDER_6_1760915740_4495
✅ Order confirmed by reference: ORDER_6_1760915740_4495
```

## 🚀 Próximos Pasos

1. **Implementar los nuevos endpoints en el backend**
2. **Desplegar el webhook mejorado**
3. **Probar con un pago real**
4. **Monitorear los logs para verificar el funcionamiento**

## 🔍 Para Debugging

Si el webhook sigue fallando, revisa los logs para ver:

- ¿En qué paso falla?
- ¿Qué error específico devuelve el backend?
- ¿La referencia se está guardando correctamente?

Con estos logs detallados, podrás identificar exactamente dónde está el problema.
