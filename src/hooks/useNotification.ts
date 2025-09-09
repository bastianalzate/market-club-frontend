"use client";

import { useState, useCallback } from "react";

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

  const showNotification = useCallback(
    (title: string, message: string, type: "success" | "error" | "info" = "success") => {
      setNotification({
        isVisible: true,
        title,
        message,
        type,
      });
    },
    []
  );

  const hideNotification = useCallback(() => {
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

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showInfo,
  };
}
