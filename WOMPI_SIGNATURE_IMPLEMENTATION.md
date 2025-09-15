# 🔐 Implementación de Firma de Integridad Wompi

## 📋 Resumen del Flujo

El frontend ya está configurado para implementar el flujo completo de firma de integridad con Wompi. Solo necesitas implementar el endpoint en el backend.

## 🚀 Flujo Completo Implementado

### 1. **Frontend → Backend**

```javascript
// El frontend llama a este endpoint cuando el usuario hace clic en "Pagar"
POST / api / payments / wompi / generate - signature;
```

**Datos enviados:**

```json
{
  "order_id": "23"
}
```

**Nota:** El frontend solo envía el `order_id`. El backend genera automáticamente:

- La referencia única
- El monto en centavos
- La moneda
- La firma de integridad
- La clave pública

### 2. **Backend → Frontend**

```json
{
  "success": true,
  "data": {
    "reference": "ORDER_23_1757947824_8331",
    "amount": 1535500,
    "currency": "COP",
    "signature": {
      "integrity": "fd91d49a922acea57be8e662b58648c805176b8b50095296633cd8316c499ce4"
    },
    "public_key": "pub_test_6j4AFOkyelP8Sb8HsS9u9l7aagAaRak4"
  }
}
```

### 3. **Frontend → Wompi Widget**

```javascript
// ✅ CORRECTO - Usar EXACTAMENTE los datos del backend
const { reference, amount, currency, signature, public_key } = response.data;

const widgetConfig = {
  currency: currency, // ← Del backend
  amountInCents: amount, // ← Del backend (ya en centavos)
  reference: reference, // ← Del backend
  publicKey: public_key, // ← Del backend
  redirectUrl: "http://localhost:3000/checkout/success?order_id=23",
  signature: signature, // ← Del backend (formato {integrity: 'firma'})
  customerData: {
    email: "usuario@ejemplo.com",
    fullName: "Juan Pérez",
    phoneNumber: "3001234567",
    phoneNumberPrefix: "+57",
    legalId: "123456789",
    legalIdType: "CC",
  },
};
```

## 🔧 Implementación del Backend

### Endpoint Requerido

```php
// routes/api.php
Route::post('/payments/wompi/generate-signature', [WompiController::class, 'generateSignature']);
```

### Controlador

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class WompiController extends Controller
{
    public function generateSignature(Request $request)
    {
        try {
            // Validar datos de entrada
            $request->validate([
                'order_id' => 'required|string'
            ]);

            // Obtener datos del request
            $orderId = $request->order_id;

            // Obtener datos de la orden desde la base de datos
            $order = Order::findOrFail($orderId);

            // Generar datos para la firma
            $reference = 'ORDER_' . $orderId . '_' . time() . '_' . rand(1000, 9999);
            $amount = $order->total_amount; // Monto en pesos
            $currency = 'COP';

            // Generar la firma de integridad
            $signature = $this->generateWompiSignature([
                'order_id' => $orderId,
                'amount' => $amount,
                'currency' => $currency,
                'reference' => $reference,
                'customer_email' => $customerEmail,
                'customer_name' => $customerName,
                'customer_phone' => $customerPhone
            ]);

            Log::info('Wompi signature generated', [
                'order_id' => $orderId,
                'amount' => $amount,
                'reference' => $reference,
                'signature' => $signature
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'reference' => $reference,
                    'amount' => $amount * 100, // Convertir a centavos
                    'currency' => $currency,
                    'signature' => [
                        'integrity' => $signature
                    ],
                    'public_key' => env('WOMPI_PUBLIC_KEY')
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error generating Wompi signature', [
                'error' => $e->getMessage(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error generando la firma de integridad',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function generateWompiSignature($data)
    {
        // Clave secreta de integridad de Wompi (debe estar en .env)
        $integritySecret = env('WOMPI_INTEGRITY_SECRET', 'your_integrity_secret_here');

        // IMPORTANTE: El orden debe ser exactamente: reference + amountInCents + currency + integritySecret
        // Según la documentación oficial de Wompi
        $reference = $data['reference'];
        $amountInCents = $data['amount'] * 100; // Convertir a centavos
        $currency = $data['currency'];

        // Crear el string para firmar (orden específico de Wompi)
        $stringToSign = $reference . $amountInCents . $currency . $integritySecret;

        // Generar la firma SHA256
        $signature = hash('sha256', $stringToSign);

        // Log para debugging (remover en producción)
        Log::info('Wompi signature generation debug', [
            'reference' => $reference,
            'amountInCents' => $amountInCents,
            'currency' => $currency,
            'stringToSign' => $stringToSign,
            'signature' => $signature
        ]);

        return $signature;
    }
}
```

### Variables de Entorno

```env
# .env
WOMPI_PUBLIC_KEY=pub_test_6j4AFOkyelP8Sb8HsS9u9l7aagAaRak4
WOMPI_INTEGRITY_SECRET=your_integrity_secret_here
```

## ✅ Ventajas de esta Implementación

### 🔒 **Seguridad**

- La firma se genera en el backend
- La clave secreta nunca se expone al frontend
- Validación completa de datos

### 🚀 **Simplicidad**

- El frontend solo usa la firma generada
- Un solo endpoint para generar la firma
- Flujo claro y mantenible

### 🔧 **Flexibilidad**

- Puedes cambiar la lógica de firma sin tocar el frontend
- Fácil de debuggear y mantener
- Escalable para futuras mejoras

## 🧪 Testing

### 1. **Probar el Endpoint**

```bash
curl -X POST http://localhost:8000/api/payments/wompi/generate-signature \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "24"
  }'
```

### 2. **Test de Firma Completo**

He creado un archivo de test completo en `public/wompi-signature-test.html` que te permite:

1. **Generar firma desde el backend**
2. **Verificar la firma manualmente**
3. **Probar el widget con la firma generada**

**Para usar el test:**

1. Abre `http://localhost:3000/wompi-signature-test.html` en tu navegador
2. Haz clic en "Generar Firma desde Backend"
3. Haz clic en "Verificar Firma Manual" para ver si la firma es correcta
4. Haz clic en "Test con Wompi Widget" para probar el widget

### 2. **Respuesta Esperada**

```json
{
  "success": true,
  "data": {
    "signature": "a1b2c3d4e5f6..."
  }
}
```

### 3. **Probar el Flujo Completo**

1. Agregar productos al carrito
2. Ir al checkout
3. Llenar datos de envío
4. Hacer clic en "Pagar"
5. Verificar que el widget se abre sin errores de firma

## 🎯 Próximos Pasos

1. **Implementar el endpoint** en el backend
2. **Configurar las variables de entorno** con las claves de Wompi
3. **Probar el flujo completo** de pago
4. **Verificar que no hay errores** de firma de integridad

## 📚 Documentación de Wompi

- [Widget Checkout Web](https://docs.wompi.co/docs/colombia/widget-checkout-web/)
- [Firma de Integridad](https://docs.wompi.co/docs/colombia/widget-checkout-web/#firma-de-integridad)
- [Parámetros del Widget](https://docs.wompi.co/docs/colombia/widget-checkout-web/#parametros-del-widget)

---

**¡El frontend está listo! Solo necesitas implementar el endpoint en el backend para que funcione completamente.** 🚀
