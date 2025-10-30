# 🚨 URGENTE: Corrección del Monto en Wompi

## ❌ PROBLEMA ACTUAL

El widget de Wompi está mostrando **$31,420 COP** cuando debería mostrar **$18,000 COP**.

### Causa del problema:

El backend está **recalculando el total** basándose en la orden guardada en la base de datos (con impuestos y envío) en lugar de **usar el monto que envía el frontend**.

## ✅ SOLUCIÓN REQUERIDA

El endpoint `/api/payments/wompi/create-widget` debe **usar directamente el monto que envía el frontend**, NO recalcularlo.

---

## 📋 Cambios Requeridos en el Backend

### Endpoint: `POST /api/payments/wompi/create-widget`

#### ❌ CÓDIGO INCORRECTO (LO QUE PROBABLEMENTE TIENES AHORA):

```php
public function createWidget(Request $request)
{
    $orderId = $request->input('order_id');
    $order = Order::find($orderId);

    // ❌ ERROR: Recalcula el total basándose en la orden
    $amount = $order->total_amount; // ← ESTO ESTÁ MAL
    // o
    $amount = $order->subtotal + $order->tax_amount + $order->shipping_amount; // ← ESTO TAMBIÉN ESTÁ MAL

    $amountInCents = round($amount * 100);

    // ... resto del código
}
```

#### ✅ CÓDIGO CORRECTO (LO QUE DEBE SER):

```php
public function createWidget(Request $request)
{
    $orderId = $request->input('order_id');

    // ✅ CORRECTO: Usa el monto que envía el frontend
    $amount = $request->input('amount'); // ← USAR ESTE VALOR DIRECTAMENTE

    // Validar que el monto sea válido
    if (!$amount || $amount <= 0) {
        return response()->json([
            'success' => false,
            'message' => 'Amount inválido'
        ], 400);
    }

    // Convertir a centavos (Wompi requiere el monto en centavos)
    $amountInCents = round($amount * 100);

    // Generar referencia única
    $reference = 'ORDER_' . $orderId . '_' . time() . '_' . rand(1000, 9999);

    // Buscar la orden y guardar la referencia
    $order = Order::find($orderId);
    if ($order) {
        $order->update(['payment_reference' => $reference]);
    }

    // Generar firma de integridad con el monto CORRECTO
    $signature = $this->generateWompiSignature($reference, $amountInCents);

    // Log para debug
    \Log::info('Creating Wompi widget', [
        'order_id' => $orderId,
        'amount_received_from_frontend' => $amount,
        'amount_in_cents' => $amountInCents,
        'reference' => $reference
    ]);

    return response()->json([
        'success' => true,
        'data' => [
            'reference' => $reference,
            'amount' => $amountInCents, // ← EN CENTAVOS
            'currency' => 'COP',
            'integrity_signature' => $signature,
            'publicKey' => env('WOMPI_PUBLIC_KEY'),
            'redirect_url' => $request->input('redirect_url')
        ]
    ]);
}
```

---

## 🔍 Cómo Verificar que Funciona

### 1. Revisar el Request del Frontend

El frontend está enviando:

```json
{
  "order_id": 8,
  "amount": 18000,  ← Este es el valor CORRECTO
  "currency": "COP",
  "redirect_url": "http://localhost:3000/checkout/success?order_id=8",
  "customer_email": "usuario@ejemplo.com",
  "customer_name": "Juan Pérez",
  "customer_phone": "3001234567"
}
```

### 2. Revisar el Response del Backend

El backend debe devolver:

```json
{
  "success": true,
  "data": {
    "reference": "ORDER_8_1234567890_1234",
    "amount": 1800000,  ← 18000 * 100 = 1,800,000 centavos
    "currency": "COP",
    "integrity_signature": "abc123...",
    "publicKey": "pub_test_...",
    "redirect_url": "http://localhost:3000/checkout/success?order_id=8"
  }
}
```

### 3. Verificar en los Logs

Agregar estos logs en el backend para debug:

```php
\Log::info('Wompi Widget Request', [
    'order_id' => $request->input('order_id'),
    'amount_from_frontend' => $request->input('amount'),
    'amount_in_cents' => $amountInCents,
    'order_total_in_db' => $order?->total_amount,
    'using_amount_from' => 'FRONTEND' // ← Debe decir 'FRONTEND'
]);
```

---

## 🎯 Ejemplo Completo de Método Correcto

```php
<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Crear widget de Wompi para una orden
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createWidget(Request $request)
    {
        try {
            // Validar request
            $validated = $request->validate([
                'order_id' => 'required|integer',
                'amount' => 'required|numeric|min:0',
                'currency' => 'required|string',
                'redirect_url' => 'required|url',
                'customer_email' => 'nullable|email',
                'customer_name' => 'nullable|string',
                'customer_phone' => 'nullable|string'
            ]);

            $orderId = $validated['order_id'];
            $amount = $validated['amount']; // ✅ USAR ESTE VALOR

            // Buscar orden
            $order = Order::find($orderId);
            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Orden no encontrada'
                ], 404);
            }

            // Convertir a centavos
            $amountInCents = round($amount * 100);

            // Generar referencia única
            $reference = 'ORDER_' . $orderId . '_' . time() . '_' . rand(1000, 9999);

            // Guardar referencia en la orden
            $order->update([
                'payment_reference' => $reference
            ]);

            // Generar firma de integridad
            $signature = $this->generateWompiSignature($reference, $amountInCents);

            // Log para verificación
            Log::info('Wompi widget created', [
                'order_id' => $orderId,
                'amount_from_frontend_cop' => $amount,
                'amount_in_cents' => $amountInCents,
                'reference' => $reference,
                'order_total_in_db' => $order->total_amount,
                'difference' => $order->total_amount - $amount
            ]);

            // Respuesta
            return response()->json([
                'success' => true,
                'data' => [
                    'reference' => $reference,
                    'amount' => $amountInCents,
                    'currency' => 'COP',
                    'integrity_signature' => $signature,
                    'publicKey' => env('WOMPI_PUBLIC_KEY'),
                    'redirect_url' => $validated['redirect_url']
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error creating Wompi widget', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al crear widget de Wompi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generar firma de integridad para Wompi
     *
     * @param string $reference
     * @param int $amountInCents
     * @return string
     */
    private function generateWompiSignature(string $reference, int $amountInCents): string
    {
        $integritySecret = env('WOMPI_INTEGRITY_SECRET');
        $currency = 'COP';

        // Formato: reference + amountInCents + currency + integritySecret
        $data = $reference . $amountInCents . $currency . $integritySecret;

        $signature = hash('sha256', $data);

        Log::info('Signature generated', [
            'reference' => $reference,
            'amount_in_cents' => $amountInCents,
            'currency' => $currency,
            'signature' => $signature
        ]);

        return $signature;
    }
}
```

---

## 📝 Resumen de Cambios

### ❌ NO HACER:

- ❌ `$amount = $order->total_amount`
- ❌ `$amount = $order->subtotal + $order->tax_amount + $order->shipping_amount`
- ❌ Recalcular el total basándose en los items de la orden

### ✅ SÍ HACER:

- ✅ `$amount = $request->input('amount')`
- ✅ Usar el valor que envía el frontend directamente
- ✅ Validar que el amount sea mayor a 0
- ✅ Convertir a centavos: `$amountInCents = round($amount * 100)`

---

## 🧪 Testing

### Test 1: Orden Simple ($18,000)

```bash
# Request
POST /api/payments/wompi/create-widget
{
  "order_id": 1,
  "amount": 18000,
  "currency": "COP",
  "redirect_url": "http://localhost:3000/checkout/success?order_id=1"
}

# Expected Response
{
  "success": true,
  "data": {
    "amount": 1800000  # ✅ 18,000 * 100
  }
}
```

### Test 2: Orden con Mayor Valor ($50,000)

```bash
# Request
{
  "order_id": 2,
  "amount": 50000,
  "currency": "COP"
}

# Expected Response
{
  "data": {
    "amount": 5000000  # ✅ 50,000 * 100
  }
}
```

---

## 🔗 Endpoints Relacionados

Asegúrate de que TODOS estos endpoints usen el monto del request:

1. ✅ `/api/payments/wompi/create-widget` - Para órdenes
2. ✅ `/api/payments/wompi/create-subscription-widget` - Para suscripciones
3. ✅ `/api/payments/wompi/generate-signature` - Para firmas (si existe)

---

## 📞 Contacto

Si tienes dudas sobre esta implementación, revisa:

- WOMPI_SIGNATURE_IMPLEMENTATION.md
- WOMPI_FRONTEND_FIX.md
- FLUJO_CORRECTO_FINAL.md
