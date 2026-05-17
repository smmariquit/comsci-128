"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * useAutoSave — Persists form state to localStorage with debouncing.
 *
 * Features:
 * - Restores saved state on mount (survives page refresh)
 * - Debounced save (500ms) to avoid excessive writes
 * - `clearSaved()` to clean up after successful submission
 * - `hasSavedData` flag to show "Draft restored" indicator
 * - SSR-safe (only accesses localStorage on client)
 *
 * @param key   Unique key for this form (e.g., "casa-apply-{dormId}")
 * @param initialValues   Default form values
 * @returns [values, setValues, clearSaved, hasSavedData]
 *
 * @example
 * ```tsx
 * const [formData, setFormData, clearSaved, hasSavedData] = useAutoSave(
 *   `casa-apply-${dormId}`,
 *   { roomType: "", moveOutDate: "", fileName: "" }
 * );
 *
 * // On successful submit:
 * clearSaved();
 * ```
 */
export function useAutoSave<T extends Record<string, unknown>>(
  key: string,
  initialValues: T
): [T, (updater: T | ((prev: T) => T)) => void, () => void, boolean] {
  const [hasSavedData, setHasSavedData] = useState(false);
  const isInitializedRef = useRef(false);

  // Initialize state — restore from localStorage if available
  const [values, setValuesInternal] = useState<T>(() => {
    // SSR guard
    if (typeof window === "undefined") return initialValues;

    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate that the saved data has the same shape
        const keys = Object.keys(initialValues);
        const isValid = keys.every((k) => k in parsed);
        if (isValid) {
          return parsed as T;
        }
      }
    } catch {
      // If parse fails, use defaults
    }
    return initialValues;
  });

  // Check if we restored saved data on mount
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setHasSavedData(true);
      }
    } catch {
      // ignore
    }
  }, [key]);

  // Debounced save to localStorage
  useEffect(() => {
    // Don't save on initial render if nothing changed from initial values
    const timer = setTimeout(() => {
      if (typeof window === "undefined") return;

      try {
        // Only save if values differ from initial
        const isDifferent = Object.keys(initialValues).some(
          (k) => values[k] !== initialValues[k]
        );

        if (isDifferent) {
          localStorage.setItem(key, JSON.stringify(values));
          setHasSavedData(true);
        }
      } catch {
        // Storage full or unavailable — silently fail
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [values, key, initialValues]);

  // Setter that accepts value or updater function
  const setValues = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setValuesInternal(updater);
    },
    []
  );

  // Clear saved data (call after successful submit)
  const clearSaved = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    setHasSavedData(false);
  }, [key]);

  return [values, setValues, clearSaved, hasSavedData];
}
