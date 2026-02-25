import { useState, useEffect, useCallback } from "react";

export function useFormPersist<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(`form_${key}`);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`form_${key}`, JSON.stringify(value));
    } catch {
      // silent
    }
  }, [key, value]);

  const clear = useCallback(() => {
    localStorage.removeItem(`form_${key}`);
    setValue(initialValue);
  }, [key, initialValue]);

  return [value, setValue, clear] as const;
}
