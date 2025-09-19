import { useCallback } from "react";
import { SimpleRetirementInput } from "@/utils/retirementEngine";

const STORAGE_KEY = "retirement-calculator-data";

export const useLocalStorage = () => {
  const saveToStorage = useCallback((data: SimpleRetirementInput) => {
    try {
      const storageData = {
        ...data,
        dateOfBirth: data.dateOfBirth.toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
    } catch (error) {
      console.warn("Could not save to localStorage:", error);
    }
  }, []);

  const loadFromStorage = useCallback((): Partial<SimpleRetirementInput> | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const data = JSON.parse(stored);
      if (data.dateOfBirth) {
        data.dateOfBirth = new Date(data.dateOfBirth);
      }
      return data;
    } catch (error) {
      console.warn("Could not load from localStorage:", error);
      return null;
    }
  }, []);

  return {
    saveToStorage,
    loadFromStorage,
  };
};
