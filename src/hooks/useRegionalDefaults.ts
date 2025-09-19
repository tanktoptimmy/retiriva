import { useEffect, useRef } from "react";
import { UseFormSetValue } from "react-hook-form";
import { 
  SimpleRetirementInput, 
  Region, 
  getRegionalConfig 
} from "@/utils/retirementEngine";

interface UseRegionalDefaultsProps {
  formValues: SimpleRetirementInput;
  setValue: UseFormSetValue<SimpleRetirementInput>;
  emptyFields: Set<string>;
  isClient: boolean;
  storedData?: Partial<SimpleRetirementInput> | null;
  onRegionChange?: () => void;
}

export const useRegionalDefaults = ({
  formValues,
  setValue,
  emptyFields,
  isClient,
  storedData,
  onRegionChange
}: UseRegionalDefaultsProps) => {
  const previousRegionRef = useRef<Region | null>(null);

  useEffect(() => {
    if (formValues.region && isClient) {
      const currentRegion = formValues.region;
      const previousRegion = previousRegionRef.current || storedData?.region || "UK";
      
      // Only update if region actually changed
      if (currentRegion !== previousRegion) {
        const currentRegionConfig = getRegionalConfig(currentRegion);
        const oldRegionConfig = getRegionalConfig(previousRegion);

        // Update inflation rate if it matches the old regional default
        if (
          !emptyFields.has("inflationRate") &&
          formValues.inflationRate === oldRegionConfig.inflationRate
        ) {
          setValue("inflationRate", currentRegionConfig.inflationRate);
        }

        // Update expected return if it matches the old regional default
        if (
          !emptyFields.has("expectedReturn") &&
          formValues.expectedReturn === oldRegionConfig.expectedReturn
        ) {
          setValue("expectedReturn", currentRegionConfig.expectedReturn);
        }

        // Update state pension age if it matches the old regional default
        if (
          !emptyFields.has("statePensionAge") &&
          formValues.statePensionAge === oldRegionConfig.statePensionAge
        ) {
          setValue("statePensionAge", currentRegionConfig.statePensionAge);
        }

        // Update desired annual income if it matches the old regional default
        if (
          !emptyFields.has("desiredAnnualIncome") &&
          formValues.desiredAnnualIncome === oldRegionConfig.desiredAnnualIncome
        ) {
          setValue(
            "desiredAnnualIncome",
            currentRegionConfig.desiredAnnualIncome
          );
        }

        // Update state pension annual amount
        setValue("statePensionAnnual", currentRegionConfig.statePensionAmount);
        
        // Notify parent component to reset calculations
        if (onRegionChange) {
          onRegionChange();
        }
        
        // Update the previous region reference
        previousRegionRef.current = currentRegion;
      }
    }
  }, [
    formValues.region,
    formValues.inflationRate,
    formValues.expectedReturn,
    formValues.statePensionAge,
    formValues.desiredAnnualIncome,
    emptyFields,
    isClient,
    setValue,
    storedData?.region,
    onRegionChange
  ]);
};
