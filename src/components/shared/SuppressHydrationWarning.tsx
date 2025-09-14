"use client";

import { useEffect } from "react";

export default function SuppressHydrationWarning() {
  useEffect(() => {
    // Suprimir errores de hidratación específicos del navegador
    const originalError = console.error;
    console.error = (...args) => {
      // Filtrar errores de hidratación relacionados con extensiones del navegador
      if (
        typeof args[0] === "string" &&
        (args[0].includes("cz-shortcut-listen") ||
          args[0].includes("hydration") ||
          args[0].includes("server rendered HTML"))
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return null;
}
