import React from "react";
import { Controller, Control } from "react-hook-form";
import { SimpleRetirementInput, getRegionalConfig } from "@/utils/retirementEngine";
import { RegionSelector } from "../ui/form/RegionSelector";
import { Input } from "../ui/form/Input";
import Tooltip from "../ui/Tooltip";

interface EssentialFieldsSectionProps {
  control: Control<SimpleRetirementInput>;
  formValues: SimpleRetirementInput;
  getDisplayValue: (fieldName: string, value: number | undefined) => string;
  handleNumberInput: (fieldName: string, onChange: (value: number) => void, defaultValue?: number, min?: number, max?: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultDateOfBirth: Date;
}

export const EssentialFieldsSection = ({
  control,
  formValues,
  getDisplayValue,
  handleNumberInput,
  defaultDateOfBirth,
}: EssentialFieldsSectionProps) => {
  return (
    <div className="space-y-8 sm:space-y-6">
      {/* Region Selection */}
      <Controller
        name="region"
        control={control}
        render={({ field }) => (
          <RegionSelector
            value={field.value}
            onChange={field.onChange}
            
          />
        )}
      />

      {/* Date of Birth */}
      <Controller
        name="dateOfBirth"
        control={control}
        render={({ field }) => {
          const decades = [];
          for (let decade = 1940; decade <= 2000; decade += 10) {
            decades.push(decade);
          }

          return (
            <div className="flex flex-col p-3 sm:p-4 rounded-lg bg-white/60 sm:bg-transparent border border-gray-100 sm:border-transparent dark:bg-gray-800/30 sm:dark:bg-transparent dark:border-gray-700 sm:dark:border-transparent">
              <div className="flex items-center gap-2 mb-1">
                <label className="font-medium">Date of Birth</label>
                <Tooltip
                  content="We use this to calculate your state pension age and retirement timeline"
                  
                >
                  <span className="text-sm cursor-help text-blue-600 dark:text-blue-400">
                    ℹ️
                  </span>
                </Tooltip>
              </div>
              <Input
                type="date"
                value={
                  field.value ? field.value.toISOString().split("T")[0] : ""
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const date = e.target.value
                    ? new Date(e.target.value)
                    : defaultDateOfBirth;
                  field.onChange(date);
                }}
                className="mb-2"
                
              />
              <div className="text-xs mb-1 text-gray-600 dark:text-gray-400">
                Quick decade select:
              </div>
              <div className="flex flex-wrap gap-1">
                {decades.map((decade) => {
                  const currentFieldYear = field.value?.getFullYear() || 1990;
                  const isActive =
                    currentFieldYear >= decade &&
                    currentFieldYear < decade + 10;

                  return (
                    <button
                      key={decade}
                      type="button"
                      onClick={() => {
                        const middleYear = decade + 5;
                        const newDate = new Date(middleYear, 0, 1);
                        field.onChange(newDate);
                      }}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
                      }`}
                    >
                      {decade}s
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }}
      />

      {/* Current Savings */}
      <Controller
        name="currentSavings"
        control={control}
        render={({ field }) => {
          const currentRegionConfig = getRegionalConfig(
            formValues.region || "UK"
          );

          return (
            <div className="flex flex-col p-3 sm:p-4 rounded-lg bg-white/60 sm:bg-transparent border border-gray-100 sm:border-transparent dark:bg-gray-800/30 sm:dark:bg-transparent dark:border-gray-700 sm:dark:border-transparent">
              <div className="flex items-center gap-2 mb-1">
                <label className="font-medium">
                  Current{" "}
                  {formValues.region === "US" ? "401(k)/IRA" : "Pension Pot"} (
                  {currentRegionConfig.currency})
                </label>
                <Tooltip
                  content="The total amount you have saved for retirement right now. This includes workplace pensions, SIPPs, ISAs, and other retirement savings."
                  
                >
                  <span className="text-sm cursor-help text-blue-600 dark:text-blue-400">
                    ℹ️
                  </span>
                </Tooltip>
              </div>
              <Input
                type="text"
                value={getDisplayValue("currentSavings", field.value)}
                placeholder="e.g. 50000"
                onChange={handleNumberInput(
                  "currentSavings",
                  field.onChange,
                  0,
                  0
                )}
                
              />
              <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                Enter 0 if you&apos;re starting from scratch
              </p>
            </div>
          );
        }}
      />

      {/* Monthly Savings */}
      <Controller
        name="monthlySavings"
        control={control}
        render={({ field }) => {
          const currentRegionConfig = getRegionalConfig(
            formValues.region || "UK"
          );

          return (
            <div className="flex flex-col p-3 sm:p-4 rounded-lg bg-white/60 sm:bg-transparent border border-gray-100 sm:border-transparent dark:bg-gray-800/30 sm:dark:bg-transparent dark:border-gray-700 sm:dark:border-transparent">
              <div className="flex items-center gap-2 mb-1">
                <label className="font-medium">
                  Monthly Savings ({currentRegionConfig.currency})
                </label>
                <Tooltip
                  content="How much you plan to save each month for retirement. This includes workplace pension contributions, personal contributions, and any employer matching."
                  
                >
                  <span className="text-sm cursor-help text-blue-600 dark:text-blue-400">
                    ℹ️
                  </span>
                </Tooltip>
              </div>
              <Input
                type="text"
                value={getDisplayValue("monthlySavings", field.value)}
                placeholder="e.g. 800"
                onChange={handleNumberInput(
                  "monthlySavings",
                  field.onChange,
                  0,
                  0
                )}
                
              />
              <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                Include both your contributions and employer matching
              </p>
            </div>
          );
        }}
      />

      {/* Desired Annual Income */}
      <Controller
        name="desiredAnnualIncome"
        control={control}
        render={({ field }) => {
          const currentRegionConfig = getRegionalConfig(
            formValues.region || "UK"
          );

          return (
            <div className="flex flex-col p-3 sm:p-4 rounded-lg bg-white/60 sm:bg-transparent border border-gray-100 sm:border-transparent dark:bg-gray-800/30 sm:dark:bg-transparent dark:border-gray-700 sm:dark:border-transparent">
              <div className="flex items-center gap-2 mb-1">
                <label className="font-medium">
                  Desired Annual Income in Retirement (
                  {currentRegionConfig.currency})
                </label>
                <Tooltip
                  content={
                    <div>
                      <div className="mb-2">
                        How much you want to live on each year in retirement, in
                        today&apos;s purchasing power.
                      </div>
                      <div className="text-xs">
                        <div className="mb-1">Rough guidelines:</div>
                        {formValues.region === "US" ? (
                          <>
                            <div>
                              • $30,000-50,000: Basic comfortable retirement
                            </div>
                            <div>
                              • $50,000-75,000: Moderate lifestyle with some
                              luxuries
                            </div>
                            <div>
                              • $75,000+: Comfortable retirement with travel and
                              hobbies
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              • £20,000-30,000: Basic comfortable retirement
                            </div>
                            <div>
                              • £30,000-45,000: Moderate lifestyle with some
                              luxuries
                            </div>
                            <div>
                              • £45,000+: Comfortable retirement with travel and
                              hobbies
                            </div>
                          </>
                        )}
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
                value={getDisplayValue("desiredAnnualIncome", field.value)}
                placeholder="e.g. 35000"
                onChange={handleNumberInput(
                  "desiredAnnualIncome",
                  field.onChange,
                  0,
                  0
                )}
                
              />
              <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                In today&apos;s purchasing power - will be adjusted for
                inflation
              </p>
            </div>
          );
        }}
      />
    </div>
  );
};
