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
 * @returns [values, setValues, clearSaved, hasSavedData, saveState]
 *
 * @example
 * ```tsx
 * const [formData, setFormData, clearSaved, hasSavedData, saveState] = useAutoSave(
 *   `casa-apply-${dormId}`,
 *   { roomType: "", moveOutDate: "", fileName: "" }
 * );
 *
 * // On successful submit:
 * clearSaved();
 * ```
 */
type SaveState = "idle" | "saving" | "saved";
type InitialState<T> = {
  values: T;
  hasSavedData: boolean;
  savedRaw: string | null;
  initialRaw: string | null;
};

export function useAutoSave<T extends Record<string, unknown>>(
  key: string,
  initialValues: T
): [
  T,
  (updater: T | ((prev: T) => T)) => void,
  () => void,
  boolean,
  SaveState
] {
  const getInitialState = (): InitialState<T> => {
    let initialRaw: string | null = null;
    try {
      initialRaw = JSON.stringify(initialValues);
    } catch {
      initialRaw = null;
    }

    if (typeof window === "undefined") {
      return {
        values: initialValues,
        hasSavedData: false,
        savedRaw: null,
        initialRaw,
      };
    }

    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate that the saved data has the same shape
        const keys = Object.keys(initialValues);
        const isValid = keys.every((k) => k in parsed);
        if (isValid) {
          return {
            values: parsed as T,
            hasSavedData: true,
            savedRaw: saved,
            initialRaw,
          };
        }
      }
    } catch {
      // If parse fails, use defaults
    }

    return {
      values: initialValues,
      hasSavedData: false,
      savedRaw: null,
      initialRaw,
    };
  };

  const initialState = useRef(getInitialState());

  // Initialize state — restore from localStorage if available
  const [values, setValuesInternal] = useState<T>(initialState.current.values);
  const [hasSavedData, setHasSavedData] = useState(
    initialState.current.hasSavedData
  );
  const [saveState, setSaveState] = useState<SaveState>(
    initialState.current.hasSavedData ? "saved" : "idle"
  );
  const lastSavedRef = useRef<string | null>(initialState.current.savedRaw);
  const initialSerializedRef = useRef<string | null>(
    initialState.current.initialRaw
  );

  // Debounced save to localStorage
  useEffect(() => {
    // Don't save on initial render if nothing changed from initial values
    if (typeof window === "undefined") return;

    let serialized: string;
    try {
      serialized = JSON.stringify(values);
    } catch {
      setSaveState("idle");
      return;
    }

    if (
      initialSerializedRef.current &&
      serialized === initialSerializedRef.current
    ) {
      if (lastSavedRef.current !== null) {
        try {
          localStorage.removeItem(key);
        } catch {
          // ignore
        }
        lastSavedRef.current = null;
      }
      if (hasSavedData) {
        setHasSavedData(false);
      }
      setSaveState("idle");
      return;
    }

    // Only save when current values differ from last saved snapshot
    if (lastSavedRef.current === serialized) {
      setSaveState(hasSavedData ? "saved" : "idle");
      return;
    }

    setSaveState("saving");

    const timer = setTimeout(() => {
      try {
        localStorage.setItem(key, serialized);
        lastSavedRef.current = serialized;
        setHasSavedData(true);
        setSaveState("saved");
      } catch {
        setSaveState("idle");
        // Storage full or unavailable — silently fail
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [values, key, hasSavedData]);

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
    lastSavedRef.current = null;
    setHasSavedData(false);
    setSaveState("idle");
  }, [key]);

  return [values, setValues, clearSaved, hasSavedData, saveState];
}
