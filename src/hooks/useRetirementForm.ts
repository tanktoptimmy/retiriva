import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { 
  SimpleRetirementInput, 
  Region, 
  createDefaultRetirementInput 
} from "@/utils/retirementEngine";
import { calculateStatePensionAge } from "@/utils/statePension";
import { useLocalStorage } from "./useLocalStorage";
import { useRegionalDefaults } from "./useRegionalDefaults";

interface UseRetirementFormProps {
  onSubmit: (data: SimpleRetirementInput) => void;
  onRegionChange?: () => void;
}

export const useRetirementForm = ({ onSubmit, onRegionChange }: UseRetirementFormProps) => {
  const { saveToStorage, loadFromStorage } = useLocalStorage();
  
  // State
  const [isClient, setIsClient] = useState(false);
  const [storedData, setStoredData] = useState<Partial<SimpleRetirementInput> | null>(null);
  const [emptyFields, setEmptyFields] = useState<Set<string>>(new Set());
  const [rawInputValues, setRawInputValues] = useState<Record<string, string>>({});

  // Default values
  const defaultDateOfBirth = new Date(1990, 0, 1);

  const getDefaultValues = (): SimpleRetirementInput => {
    const baseRegion: Region = storedData?.region || "UK";
    const defaults = createDefaultRetirementInput(baseRegion, defaultDateOfBirth);

    // Override with form-specific defaults
    const formDefaults: SimpleRetirementInput = {
      ...defaults,
      currentSavings: 50000,
      monthlySavings: 800,
      desiredAnnualIncome: 35000,
      dailyExpenseAmount: 0,
      workingDaysPerWeek: 5,
      vacationDaysPerYear: 0,
    };

    return storedData ? { ...formDefaults, ...storedData } : formDefaults;
  };

  // Form setup
  const formMethods = useForm<SimpleRetirementInput>({
    defaultValues: getDefaultValues(),
  });

  const { control, handleSubmit, watch, setValue } = formMethods;
  const formValues = watch();

  // Load data from localStorage after component mounts
  useEffect(() => {
    setIsClient(true);
    const stored = loadFromStorage();
    if (stored) {
      setStoredData(stored);
      Object.entries(stored).forEach(([key, value]) => {
        if (key !== "dateOfBirth") {
          setValue(key as keyof SimpleRetirementInput, value);
        } else if (value instanceof Date) {
          setValue("dateOfBirth", value);
        }
      });
    }
  }, [setValue, loadFromStorage]);

  // Handle regional defaults
  useRegionalDefaults({
    formValues,
    setValue,
    emptyFields,
    isClient,
    storedData,
    onRegionChange
  });

  // Auto-calculate state pension age
  useEffect(() => {
    if (formValues.dateOfBirth && isClient) {
      try {
        const pensionInfo = calculateStatePensionAge(formValues.dateOfBirth);
        const roundedPensionAge = Math.round(pensionInfo.pensionAge);

        if (roundedPensionAge !== formValues.statePensionAge) {
          setValue("statePensionAge", roundedPensionAge);
        }
      } catch (error) {
        console.warn("Could not calculate state pension age:", error);
      }
    }
  }, [formValues.dateOfBirth, isClient, setValue, formValues.statePensionAge]);

  // Save form values to localStorage
  useEffect(() => {
    if (formValues.dateOfBirth) {
      const currentFormData: SimpleRetirementInput = {
        ...formValues,
        currentSavings: formValues.currentSavings ?? 50000,
        monthlySavings: formValues.monthlySavings ?? 800,
        savingsStopAge: formValues.savingsStopAge ?? 65,
        deathAge: formValues.deathAge ?? 85,
        desiredAnnualIncome: formValues.desiredAnnualIncome ?? 35000,
        inflationRate: formValues.inflationRate ?? 2.5,
        expectedReturn: formValues.expectedReturn ?? 5.0,
        statePensionAge: formValues.statePensionAge ?? 67,
        statePensionPercentage: formValues.statePensionPercentage ?? 100,
        dailyExpenseAmount: formValues.dailyExpenseAmount || 0,
        workingDaysPerWeek: formValues.workingDaysPerWeek || 5,
        vacationDaysPerYear: formValues.vacationDaysPerYear || 0,
        adjustSavingsForInflation: formValues.adjustSavingsForInflation ?? true,
      };

      saveToStorage(currentFormData);
    }
  }, [formValues, saveToStorage]);

  // Helper functions for number inputs
  const handleNumberInput = (
    fieldName: string,
    onChange: (value: number) => void,
    defaultValue: number = 0,
    min?: number,
    max?: number
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      setRawInputValues((prev) => ({ ...prev, [fieldName]: inputValue }));

      if (inputValue === "") {
        setEmptyFields((prev) => new Set(prev).add(fieldName));
        onChange(defaultValue);
        return;
      }

      setEmptyFields((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fieldName);
        return newSet;
      });

      const numericValue = Number(inputValue);

      if (!isNaN(numericValue) && inputValue.trim() !== "") {
        let constrainedValue = numericValue;
        if (min !== undefined && numericValue < min) {
          constrainedValue = min;
        }
        if (max !== undefined && numericValue > max) {
          constrainedValue = max;
        }
        onChange(constrainedValue);
      }
    };
  };

  const getDisplayValue = (fieldName: string, value: number | undefined) => {
    if (rawInputValues[fieldName] !== undefined) {
      return rawInputValues[fieldName];
    }

    if (emptyFields.has(fieldName)) {
      return "";
    }

    if (value === undefined || value === null) {
      return "";
    }
    return value.toString();
  };

  const calculateCurrentAge = (dateOfBirth: Date): number => {
    if (!isClient) return 34;
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDifference = today.getMonth() - dateOfBirth.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < dateOfBirth.getDate())
    ) {
      return age - 1;
    }
    return age;
  };

  const handleFormSubmit = (data: SimpleRetirementInput) => {
    saveToStorage(data);
    onSubmit(data);
  };

  return {
    // Form methods
    control,
    handleSubmit: handleSubmit(handleFormSubmit),
    formValues,
    setValue,
    
    // State
    isClient,
    emptyFields,
    setEmptyFields,
    setRawInputValues,
    
    // Utility functions
    handleNumberInput,
    getDisplayValue,
    calculateCurrentAge,
    
    // Constants
    defaultDateOfBirth,
  };
};
