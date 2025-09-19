"use client";

import { useEffect } from "react";

export default function WompiScript() {
  useEffect(() => {
    // Solo cargar el script en el cliente
    if (typeof window !== "undefined") {
      // Verificar si el script ya existe
      const existingScript = document.querySelector('script[src="https://checkout.wompi.co/widget.js"]');
      
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://checkout.wompi.co/widget.js";
        script.async = true;
        script.onload = () => {
          console.log("Wompi script loaded successfully");
        };
        script.onerror = () => {
          console.error("Error loading Wompi script");
        };
        
        document.head.appendChild(script);
      }
    }
  }, []);

  return null;
}

