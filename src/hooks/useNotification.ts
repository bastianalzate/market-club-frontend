"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface NotificationState {
  isVisible: boolean;
  title: string;
  message: string;
  type: "success" | "error" | "info";
}

export function useNotification() {
  const [notification, setNotification] = useState<NotificationState>({
    isVisible: false,
    title: "",
    message: "",
    type: "success",
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showNotification = useCallback(
    (title: string, message: string, type: "success" | "error" | "info" = "success") => {
      // Limpiar timeout anterior si existe
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      setNotification({
        isVisible: true,
        title,
        message,
        type,
      });

      // Auto-dismiss después de 4 segundos
      timeoutRef.current = setTimeout(() => {
        setNotification((prev) => ({
          ...prev,
          isVisible: false,
        }));
      }, 4000);
    },
    []
  );

  const hideNotification = useCallback(() => {
    // Limpiar timeout si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setNotification((prev) => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  const showSuccess = useCallback(
    (title: string, message: string) => {
      showNotification(title, message, "success");
    },
    [showNotification]
  );

  const showError = useCallback(
    (title: string, message: string) => {
      showNotification(title, message, "error");
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (title: string, message: string) => {
      showNotification(title, message, "info");
    },
    [showNotification]
  );

  // Limpiar timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showInfo,
  };
}
