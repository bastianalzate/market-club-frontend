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
      "at html",
      "className",
      "FONT_CLASSES"
    ];

    // Función para verificar si un mensaje debe ser filtrado
    const shouldSuppressMessage = (message: string) => {
      return hydrationErrorPatterns.some(pattern => 
        message.toLowerCase().includes(pattern.toLowerCase())
      );
    };

    console.error = (...args) => {
      // Filtrar errores de hidratación
      const message = args[0];
      if (typeof message === "string" && shouldSuppressMessage(message)) {
        return;
      }
      
      // También filtrar arrays de errores que contengan mensajes de hidratación
      if (Array.isArray(args) && args.some(arg => 
        typeof arg === "string" && shouldSuppressMessage(arg)
      )) {
        return;
      }
      
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      // También filtrar warnings de hidratación
      const message = args[0];
      if (typeof message === "string" && shouldSuppressMessage(message)) {
        return;
      }
      
      // También filtrar arrays de warnings que contengan mensajes de hidratación
      if (Array.isArray(args) && args.some(arg => 
        typeof arg === "string" && shouldSuppressMessage(arg)
      )) {
        return;
      }
      
      originalWarn.apply(console, args);
    };

    // Suprimir específicamente errores de React Hydration
    const originalOnError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      if (typeof message === "string" && shouldSuppressMessage(message)) {
        return true; // Suprimir el error
      }
      if (originalOnError) {
        return originalOnError(message, source, lineno, colno, error);
      }
      return false;
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      window.onerror = originalOnError;
    };
  }, []);

  return null;
}
