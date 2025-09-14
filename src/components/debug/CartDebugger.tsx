"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { CartService } from "@/services/cartService";
import { getOrCreateSessionId } from "@/config/api";

export default function CartDebugger() {
  const { cart, itemsCount, loading, error, addToCart } = useCart();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string>("N/A");

  // Cargar session ID solo en el cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSessionId = localStorage.getItem("session_id");
      setSessionId(
        storedSessionId ? storedSessionId.substring(0, 20) + "..." : "N/A"
      );
    }
  }, []);

  const testCartAPI = async () => {
    try {
      console.log("🧪 Testing Cart API...");

      // Test 1: Get Session ID
      const sessionId = getOrCreateSessionId();
      console.log("🧪 Session ID:", sessionId);

      // Test 2: Get Cart
      const cartResponse = await CartService.getCart();
      console.log("🧪 Cart Response:", cartResponse);

      setDebugInfo({
        sessionId,
        cartResponse,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("🧪 Cart API Test Error:", error);
      setDebugInfo({
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const testAddProduct = async () => {
    try {
      console.log("🧪 Testing Add Product...");

      // Agregar producto ID 1 (debería existir en la base de datos)
      const result = await addToCart({ productId: 1, quantity: 1 });
      console.log("🧪 Add Product Result:", result);

      setDebugInfo((prev) => ({
        ...prev,
        addProductResult: result,
        addProductTimestamp: new Date().toISOString(),
      }));
    } catch (error) {
      console.error("🧪 Add Product Error:", error);
    }
  };

  if (process.env.NODE_ENV !== "development") {
    return null; // Solo mostrar en desarrollo
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50">
      <h3 className="font-bold text-lg mb-2">🛒 Cart Debugger</h3>

      <div className="space-y-2 text-sm">
        <div>
          <strong>Session ID:</strong> {sessionId}
        </div>
        <div>
          <strong>Items Count:</strong> {itemsCount}
        </div>
        <div>
          <strong>Loading:</strong> {loading ? "Yes" : "No"}
        </div>
        <div>
          <strong>Error:</strong> {error || "None"}
        </div>
        <div>
          <strong>Cart ID:</strong> {cart?.id || "None"}
        </div>
      </div>

      <div className="mt-3 space-x-2">
        <button
          onClick={testCartAPI}
          className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
        >
          Test Cart API
        </button>
        <button
          onClick={testAddProduct}
          className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
        >
          Test Add Product
        </button>
      </div>

      {debugInfo && (
        <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
          <strong>Debug Info:</strong>
          <pre className="mt-1 overflow-auto max-h-32">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
