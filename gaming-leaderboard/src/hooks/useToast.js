import { useState, useRef, useEffect, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState({ text: '', type: 'info', visible: false });
  const timerRef = useRef(null);

  // Cleanup timer on unmount (T9)
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const dismissToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showToast = useCallback((text, type = 'info') => {
    // Clear any existing timer
    if (timerRef.current) clearTimeout(timerRef.current);

    setToast({ text, type, visible: true });

    timerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
      timerRef.current = null;
    }, 5000);
  }, []);

  return { toast, showToast, dismissToast };
}
