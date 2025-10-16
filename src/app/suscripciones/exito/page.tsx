"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SubscriptionSuccessRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la página de suscripciones
    router.replace("/suscripciones");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirigiendo a suscripciones...</p>
      </div>
    </div>
  );
}
