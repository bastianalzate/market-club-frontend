# 🔧 Guía de Configuración de Wompi

## 🚨 Problemas Identificados

Basándome en los errores que estás viendo, hay varios problemas de configuración:

### 1. **Clave Pública de Wompi con Formato Inválido**

```
"error": {
    "type": "INPUT_VALIDATION_ERROR",
    "messages": {
        "public_key": [
            "Formato inválido"
        ]
    }
}
```

### 2. **Merchant ID Undefined**

```
@https://api.wompi.co/v1/merchants/undefined
```

### 3. **Ruta de API No Encontrada**

```
"The route api/payments/confirm-order could not be found."
```

## ✅ Soluciones

### Paso 1: Crear archivo `.env.local`

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Wompi Configuration - REEMPLAZA CON TUS VALORES REALES
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_6j4AFOkyelP8Sb8HsS9u9l7aagAaRak4
NEXT_PUBLIC_WOMPI_MERCHANT_ID=tu_merchant_id_real_aqui
NEXT_PUBLIC_WOMPI_PRIVATE_KEY=prv_test_tu_clave_privada_aqui
NEXT_PUBLIC_WOMPI_EVENTS_SECRET=tu_secret_de_eventos_aqui

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ENV=development
```

### Paso 2: Obtener las Claves de Wompi

1. **Ve a tu panel de Wompi**: https://comercios.wompi.co/
2. **Obtén tus claves**:
   - `PUBLIC_KEY`: Clave pública (empieza con `pub_test_` o `pub_prod_`)
   - `MERCHANT_ID`: ID del comercio
   - `PRIVATE_KEY`: Clave privada (empieza con `prv_test_` o `prv_prod_`)
   - `EVENTS_SECRET`: Secret para webhooks

### Paso 3: Verificar Configuración del Backend

Asegúrate de que tu backend tenga implementados estos endpoints:

```php
// routes/api.php
Route::post('/payments/wompi/generate-signature', [WompiController::class, 'generateSignature']);
Route::post('/payments/wompi/create-widget', [WompiController::class, 'createWidget']);
Route::post('/payments/confirm-order', [WompiController::class, 'confirmOrder']);
```

#### Implementación del endpoint `confirmOrder`:

```php
// En tu WompiController
public function confirmOrder(Request $request)
{
    try {
        $request->validate([
            'order_id' => 'required|string',
            'transaction_id' => 'required|string'
        ]);

        $orderId = $request->order_id;
        $transactionId = $request->transaction_id;

        // Aquí implementas la lógica para confirmar la orden
        // Por ejemplo, actualizar el estado de la orden a "paid"
        // y procesar el pago

        return response()->json([
            'success' => true,
            'message' => 'Orden confirmada exitosamente',
            'data' => [
                'order_id' => $orderId,
                'transaction_id' => $transactionId,
                'status' => 'confirmed'
            ]
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error al confirmar la orden: ' . $e->getMessage()
        ], 500);
    }
}
```

**Nota**: He implementado una solución temporal en el frontend que simula la confirmación exitosa hasta que implementes este endpoint en el backend.

### Paso 4: Reiniciar el Servidor

Después de crear el archivo `.env.local`:

```bash
# Detener el servidor (Ctrl+C)
# Luego reiniciar
npm run dev
```

## 🔍 Verificación

Para verificar que la configuración está correcta, abre la consola del navegador y ejecuta:

```javascript
// Verificar configuración de Wompi
console.log("Wompi Config:", {
  publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
  merchantId: process.env.NEXT_PUBLIC_WOMPI_MERCHANT_ID,
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
});
```

## 🚨 Importante

- ❌ **NUNCA** subas el archivo `.env.local` a Git
- ✅ Usa claves de **prueba** (`pub_test_`, `prv_test_`) en desarrollo
- ✅ Usa claves de **producción** (`pub_prod_`, `prv_prod_`) solo en producción
- ✅ El `MERCHANT_ID` debe ser el ID real de tu comercio en Wompi

## 📞 Soporte

Si sigues teniendo problemas:

1. Verifica que las claves de Wompi sean correctas
2. Asegúrate de que el backend esté ejecutándose en `http://localhost:8000`
3. Revisa la consola del navegador para más detalles del error
4. Verifica que todos los endpoints del backend estén implementados
