import React, { useEffect } from "react";
import { Controller, Control } from "react-hook-form";
import { SimpleRetirementInput, getRegionalConfig } from "@/utils/retirementEngine";
import { calculateStatePensionAge } from "@/utils/statePension";
import { PercentageSlider } from "../ui/form/PercentageSlider";
import { Input } from "../ui/form/Input";
import Tooltip from "../ui/Tooltip";
import CollapsibleSection from "../ui/CollapsibleSection";

interface StatePensionSectionProps {
  control: Control<SimpleRetirementInput>;
  formValues: SimpleRetirementInput;
  getDisplayValue: (fieldName: string, value: number | undefined) => string;
  handleNumberInput: (fieldName: string, onChange: (value: number) => void, defaultValue?: number, min?: number, max?: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  isClient: boolean;
}

export const StatePensionSection = ({
  control,
  formValues,
  getDisplayValue,
  handleNumberInput,
  isClient,
}: StatePensionSectionProps) => {
  
  useEffect(() => {
  }, []);
  

  return (
    <CollapsibleSection
      title="State Pension"
      icon="🏛️"
      description="Your government pension information"
      
      defaultOpen={true}
    >
      {/* State Pension Age - Display Only */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <label className="font-medium">
            Your {getRegionalConfig(formValues.region || "UK").pensionName} Age
          </label>
          <Tooltip
            content={
              formValues.region === "UK"
                ? "Calculated automatically based on your date of birth using current UK government rules. The state pension provides a foundation income in retirement."
                : "Social Security eligibility age based on US federal rules. Social Security provides a foundation income in retirement."
            }
            
          >
            <span className="text-sm cursor-help text-blue-600 dark:text-blue-400">
              ℹ️
            </span>
          </Tooltip>
        </div>
        {(() => {
          const currentRegionConfig = getRegionalConfig(formValues.region || "UK");

          // For UK, calculate based on date of birth. For US, use regional default.
          let calculatedInfo = null;
          if (formValues.dateOfBirth && isClient && formValues.region === "UK") {
            try {
              calculatedInfo = calculateStatePensionAge(
                formValues.dateOfBirth
              );
            } catch (error) {
              console.warn(
                "Could not calculate pension info for display:",
                error
              );
            }
          }

          if (calculatedInfo && formValues.region === "UK") {
            const percentage = formValues.statePensionPercentage ?? 100;
            const calculatedAmount = Math.round((currentRegionConfig.statePensionAmount * percentage) / 100);
            
            return (
              <>
                <div
                  className="px-3 py-2 border rounded-md transition-colors border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {Math.round(calculatedInfo.pensionAge)} years old
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {currentRegionConfig.currency}
                      {calculatedAmount.toLocaleString()}
                      /year
                    </span>
                  </div>
                </div>
                <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                  Eligible from:{" "}
                  {calculatedInfo.pensionDate.toLocaleDateString()}
                </div>
                <div className="text-xs mt-1 text-blue-600 dark:text-blue-400">
                  ℹ️ Based on current UK government rules for your birth date
                </div>
              </>
            );
          } else if (formValues.region === "US") {
            // For US users, show the user's actual Social Security amount
            const userSocialSecurityAmount = formValues.statePensionAnnual || currentRegionConfig.statePensionAmount;
            
            return (
              <>
                <div className="px-3 py-2 border rounded-md transition-colors border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      Age {currentRegionConfig.statePensionAge}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {currentRegionConfig.currency}
                      {userSocialSecurityAmount.toLocaleString()}
                      /year
                    </span>
                  </div>
                </div>
                <div className="text-xs mt-1 text-blue-600 dark:text-blue-400">
                  ℹ️ Full retirement age varies by birth year: 65-67. Using age {currentRegionConfig.statePensionAge} as default.
                </div>
              </>
            );
          } else {
            return (
              <div className="px-3 py-2 border rounded-md transition-colors border-gray-300 bg-gray-50 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">
                {formValues.region === "UK"
                  ? "Enter your date of birth to see your state pension age"
                  : `${currentRegionConfig.pensionName} eligibility at age ${currentRegionConfig.statePensionAge}`}
              </div>
            );
          }
        })()}
      </div>

      {/* State Pension Percentage - Only show for UK */}
      {formValues.region === "UK" && (
        <Controller
          name="statePensionPercentage"
          control={control}
          render={({ field }) => (
            <PercentageSlider
              label="Expected State Pension"
              value={field.value ?? 100}
              onChange={field.onChange}
              getDisplayValue={getDisplayValue}
              fieldName="statePensionPercentage"
              min={0}
              max={100}
              step={5}
              
              helperText="You need 35 years of National Insurance contributions for the full pension. Check gov.uk for your current forecast."
              minLabel="0% (No pension)"
              maxLabel="100% (Full pension)"
            />
          )}
        />
      )}
      
      {/* Social Security Amount - Only show for US */}
      {formValues.region === "US" && (
        <Controller
          name="statePensionAnnual"
          control={control}
          render={({ field }) => {
            const currentRegionConfig = getRegionalConfig(
              formValues.region || "US"
            );
            
            return (
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <label className="font-medium">
                    Expected Annual Social Security ({currentRegionConfig.currency})
                  </label>
                  <Tooltip
                    content={
                      <div>
                        <div className="mb-2">
                          Your estimated annual Social Security benefits. This varies based on your earnings history and retirement age.
                        </div>
                        <div className="text-xs">
                          <div className="mb-1">Typical ranges (2024):</div>
                          <div>• $12,000-18,000: Lower earners</div>
                          <div>• $18,000-30,000: Average earners</div>
                          <div>• $30,000-48,000: Higher earners</div>
                          <div className="mt-2">
                            Check your estimate at ssa.gov/myaccount
                          </div>
                        </div>
                      </div>
                    }
                    
                  >
                    <span className="text-sm cursor-help text-blue-600 dark:text-blue-400">
                      ℹ️
                    </span>
                  </Tooltip>
                </div>
                <Input
                  type="text"
                  value={getDisplayValue(
                    "statePensionAnnual",
                    field.value ?? 24000
                  )}
                  placeholder="24000"
                  onChange={handleNumberInput(
                    "statePensionAnnual",
                    field.onChange,
                    24000,
                    0,
                    100000
                  )}
                  
                />
                <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                  Visit ssa.gov/myaccount for your personalized estimate
                </p>
              </div>
            );
          }}
        />
      )}
    </CollapsibleSection>
  );
};
