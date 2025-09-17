"use client";

import { useEffect } from "react";

export default function SuppressHydrationWarning() {
  useEffect(() => {
    // Suprimir errores de hidratación específicos del navegador
    const originalError = console.error;
    const originalWarn = console.warn;
    
    // Lista de patrones a filtrar
    const hydrationErrorPatterns = [
      "cz-shortcut-listen",
      "cz-shortcut-listset", 
      "cz-shortcut",
      "hydration",
      "server rendered HTML",
      "A tree hydrated but some attributes of the server rendered HTML didn't match the client",
      "Hydration failed because the initial UI does not match",
      "There was an error while hydrating",
      "Warning: Extra attributes from the server",
      "Warning: Prop",
      "did not match. Server:",
      "Client:",
      "at body",
      "at html"
    ];

    // Función para verificar si un mensaje debe ser filtrado
    const shouldSuppressMessage = (message: string) => {
      return hydrationErrorPatterns.some(pattern => 
        message.toLowerCase().includes(pattern.toLowerCase())
      );
    };

    console.error = (...args) => {
      // Filtrar errores de hidratación
      if (
        typeof args[0] === "string" && 
        shouldSuppressMessage(args[0])
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      // También filtrar warnings de hidratación
      if (
        typeof args[0] === "string" && 
        shouldSuppressMessage(args[0])
      ) {
        return;
      }
      originalWarn.apply(console, args);
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  return null;
}
