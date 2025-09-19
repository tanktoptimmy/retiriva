import React, { useEffect } from "react";
import { Controller, Control } from "react-hook-form";
import { SimpleRetirementInput } from "@/utils/retirementEngine";
import { AgeSelector } from "../ui/form/AgeSelector";
import Tooltip from "../ui/Tooltip";
import CollapsibleSection from "../ui/CollapsibleSection";

interface LifePlanningSectionProps {
  control: Control<SimpleRetirementInput>;
  formValues: SimpleRetirementInput;
  getDisplayValue: (fieldName: string, value: number | undefined) => string;
  calculateCurrentAge: (dateOfBirth: Date) => number;
  setEmptyFields: React.Dispatch<React.SetStateAction<Set<string>>>;
  setRawInputValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const LifePlanningSection = ({
  control,
  formValues,
  getDisplayValue,
  calculateCurrentAge,
  setEmptyFields,
  setRawInputValues,
}: LifePlanningSectionProps) => {
  
  const handleRawInputChange = (fieldName: string, inputValue: string) => {
    // Handle special clear command
    if (inputValue === "__CLEAR__") {
      setRawInputValues((prev) => {
        const newValues = { ...prev };
        delete newValues[fieldName];
        return newValues;
      });
      setEmptyFields((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fieldName);
        return newSet;
      });
      return;
    }
    
    setRawInputValues((prev) => ({ ...prev, [fieldName]: inputValue }));
    
    if (inputValue === "") {
      setEmptyFields((prev) => new Set(prev).add(fieldName));
    } else {
      setEmptyFields((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fieldName);
        return newSet;
      });
    }
  };
  
  useEffect(() => {
  }, []);
  

  return (
    <CollapsibleSection
      title="Life Planning"
      icon="🎯"
      description="When you'll stop saving and how long you'll need the money"
      
      defaultOpen={true}
    >
      {/* Savings Stop Age */}
      <Controller
        name="savingsStopAge"
        control={control}
        render={({ field }) => {
          const currentAge = formValues.dateOfBirth
            ? calculateCurrentAge(formValues.dateOfBirth)
            : 34;
          const presets = [currentAge, 60, 65, 67, 70]
            .filter(
              (age, index, arr) => arr.indexOf(age) === index && age >= 50
            )
            .sort((a, b) => a - b);

          return (
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <label className="font-medium">Stop Saving at Age</label>
                <Tooltip
                  content="The age when you plan to stop contributing to your pension. This is often your retirement age, but can be earlier if you plan to live off your savings before accessing pensions."
                  
                >
                  <span className="text-sm cursor-help text-blue-600 dark:text-blue-400">
                    ℹ️
                  </span>
                </Tooltip>
              </div>
              <AgeSelector
                label=""
                value={field.value}
                onChange={(age) => {
                  setEmptyFields(prev => {
                    const newSet = new Set(prev);
                    newSet.delete('savingsStopAge');
                    return newSet;
                  });
                  field.onChange(age);
                }}
                getDisplayValue={getDisplayValue}
                fieldName="savingsStopAge"
                placeholder="65"
                min={50}
                max={80}
                presets={presets.map((age) => age === currentAge ? currentAge : age)}
                onInputChange={handleRawInputChange}
              />
            </div>
          );
        }}
      />

      {/* Death Age */}
      <Controller
        name="deathAge"
        control={control}
        render={({ field }) => {
          const presets = [75, 80, 85, 90, 95];

          return (
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <label className="font-medium">Expected Death Age</label>
                <Tooltip
                  content="Used to calculate how long your money needs to last. UK life expectancy is around 81-85, but many people plan for longer to be safe. This is just for calculations - we hope you live much longer!"
                  
                >
                  <span className="text-sm cursor-help text-blue-600 dark:text-blue-400">
                    ℹ️
                  </span>
                </Tooltip>
              </div>
              <AgeSelector
                label=""
                value={field.value}
                onChange={(age) => {
                  setEmptyFields(prev => {
                    const newSet = new Set(prev);
                    newSet.delete('deathAge');
                    return newSet;
                  });
                  field.onChange(age);
                }}
                getDisplayValue={getDisplayValue}
                fieldName="deathAge"
                placeholder="85"
                min={70}
                max={100}
                presets={presets}
                onInputChange={handleRawInputChange}
              />
            </div>
          );
        }}
      />
    </CollapsibleSection>
  );
};
