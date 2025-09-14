import { useState, useCallback } from 'react';

interface ToastState {
  isVisible: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning';
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    title: '',
    message: '',
    type: 'success',
  });

  const showToast = useCallback((
    title: string, 
    message: string, 
    type: 'success' | 'error' | 'warning' = 'success'
  ) => {
    setToast({
      isVisible: true,
      title,
      message,
      type,
    });
  }, []);

  const showSuccess = useCallback((title: string, message: string) => {
    showToast(title, message, 'success');
  }, [showToast]);

  const showError = useCallback((title: string, message: string) => {
    showToast(title, message, 'error');
  }, [showToast]);

  const showWarning = useCallback((title: string, message: string) => {
    showToast(title, message, 'warning');
  }, [showToast]);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  return {
    toast,
    showToast,
    showSuccess,
    showError,
    showWarning,
    hideToast,
  };
};
