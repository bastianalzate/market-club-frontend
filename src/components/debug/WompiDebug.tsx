"use client";

import { useState } from "react";
import { PaymentService } from "@/services/paymentService";

export default function WompiDebug() {
  const [orderId, setOrderId] = useState("8");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testEndpoint = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      console.log("🔍 Testing create-widget endpoint...");
      console.log("🔍 Order ID:", orderId);

      const result = await PaymentService.createWompiWidget(
        orderId,
        1535500, // Amount en centavos
        `${window.location.origin}/checkout/success?order_id=${orderId}`,
        {
          email: "test@ejemplo.com",
          name: "Usuario Test",
          phone: "3001234567",
        }
      );

      console.log("✅ Response received:", result);
      setResponse(result);
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">🔍 Wompi Endpoint Debugger</h1>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Order ID:</label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="8"
          />
        </div>

        <button
          onClick={testEndpoint}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Probando..." : "Probar Endpoint"}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-red-800 font-bold mb-2">❌ Error:</h3>
            <pre className="text-sm text-red-600 whitespace-pre-wrap">
              {error}
            </pre>
          </div>
        )}

        {response && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-green-800 font-bold mb-2">
                ✅ Response Completa:
              </h3>
              <pre className="text-xs bg-white p-3 rounded overflow-auto max-h-96">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>

            {response.data && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-blue-800 font-bold mb-2">
                  📦 Campos en response.data:
                </h3>
                <ul className="space-y-2 text-sm">
                  {Object.keys(response.data).map((key) => (
                    <li key={key} className="flex items-start gap-2">
                      <span className="font-mono bg-white px-2 py-1 rounded">
                        {key}:
                      </span>
                      <span className="text-gray-600">
                        {typeof response.data[key] === "object"
                          ? JSON.stringify(response.data[key])
                          : String(response.data[key])}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-yellow-800 font-bold mb-2">
                ⚠️ Campos que busca el código actual:
              </h3>
              <ul className="space-y-1 text-sm">
                <li>
                  ✓ reference:{" "}
                  {response.data?.reference ? "✅ Existe" : "❌ No existe"}
                </li>
                <li>
                  ✓ amount:{" "}
                  {response.data?.amount ? "✅ Existe" : "❌ No existe"}
                </li>
                <li>
                  ✓ currency:{" "}
                  {response.data?.currency ? "✅ Existe" : "❌ No existe"}
                </li>
                <li>
                  ✓ signature:{" "}
                  {response.data?.signature ? "✅ Existe" : "❌ No existe"}
                </li>
                <li>
                  ✓ public_key:{" "}
                  {response.data?.public_key ? "✅ Existe" : "❌ No existe"}
                </li>
                <li>
                  ✓ publicKey:{" "}
                  {response.data?.publicKey ? "✅ Existe" : "❌ No existe"}
                </li>
                <li>
                  ✓ integrity_signature:{" "}
                  {response.data?.integrity_signature
                    ? "✅ Existe"
                    : "❌ No existe"}
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
