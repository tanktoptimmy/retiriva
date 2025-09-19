import React, { useEffect } from "react";
import { Controller, Control } from "react-hook-form";
import { SimpleRetirementInput, getRegionalConfig } from "@/utils/retirementEngine";
import { Input } from "../ui/form/Input";
import Tooltip from "../ui/Tooltip";
import CollapsibleSection from "../ui/CollapsibleSection";

interface InvestmentAssumptionsSectionProps {
  control: Control<SimpleRetirementInput>;
  formValues: SimpleRetirementInput;
  getDisplayValue: (fieldName: string, value: number | undefined) => string;
  handleNumberInput: (fieldName: string, onChange: (value: number) => void, defaultValue?: number, min?: number, max?: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InvestmentAssumptionsSection = ({
  control,
  formValues,
  getDisplayValue,
  handleNumberInput,
}: InvestmentAssumptionsSectionProps) => {
  
  useEffect(() => {
  }, []);
  

  return (
    <CollapsibleSection
      title="Investment Assumptions"
      icon="📈"
      description="Expected returns and inflation rates for calculations"
      
      defaultOpen={true}
    >
      {/* Inflation Rate */}
      <Controller
        name="inflationRate"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <label className="font-medium">
                Expected Inflation Rate (%)
              </label>
              <Tooltip
                content="The Bank of England targets 2% inflation. Over the past 20 years, UK inflation has averaged around 2-3%. This affects how much your money will be worth in the future."
                
              >
                <span className="text-sm cursor-help text-blue-600 dark:text-blue-400">
                  ℹ️
                </span>
              </Tooltip>
            </div>
            <Input
              type="text"
              value={getDisplayValue("inflationRate", field.value)}
              placeholder="e.g. 2.5"
              onChange={handleNumberInput(
                "inflationRate",
                field.onChange,
                2.5,
                0,
                10
              )}
              
            />
            <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
              UK historical average: 2-3%
            </p>
          </div>
        )}
      />

      {/* Expected Return */}
      <Controller
        name="expectedReturn"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <label className="font-medium">
                Expected Investment Return (Max 25%)
              </label>
              <Tooltip
                content={
                  <div>
                    <div className="mb-2">
                      Annual return you expect from your investments after
                      fees.
                    </div>
                    <div className="text-xs">
                      <div className="mb-1">Rough guidelines:</div>
                      <div>• 3-4%: Conservative (bonds, cash)</div>
                      <div>• 5-7%: Balanced (mixed portfolio)</div>
                      <div>• 7-9%: Growth (mostly stocks)</div>
                      <div className="mt-2">
                        Past performance doesn&apos;t guarantee future
                        results!
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
              value={getDisplayValue("expectedReturn", field.value)}
              placeholder="e.g. 5.0"
              onChange={handleNumberInput(
                "expectedReturn",
                field.onChange,
                5.0,
                0,
                25
              )}
              
            />
            <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
              5-7% is common for balanced portfolios
            </p>
          </div>
        )}
      />

      {/* Inflation Adjustment for Savings */}
      <div className="md:col-span-2">
        <Controller
          name="adjustSavingsForInflation"
          control={control}
          render={({ field }) => {
            const currentRegionConfig = getRegionalConfig(formValues.region || 'UK');
            
            return (
              <div className="flex flex-col">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="adjustSavingsForInflation"
                    checked={field.value ?? true}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border transition-colors border-gray-300 bg-white text-blue-600 focus:ring-blue-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="adjustSavingsForInflation"
                        className="cursor-pointer font-medium"
                      >
                        Increase savings by inflation rate
                      </label>
                      <Tooltip
                        content="If checked, your monthly savings will increase each year by the inflation rate to maintain purchasing power. If unchecked, your savings stay the same amount each month, which loses purchasing power over time."
                        
                      >
                        <span className="text-sm cursor-help text-blue-600 dark:text-blue-400">
                          ℹ️
                        </span>
                      </Tooltip>
                    </div>
                    <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                      {field.value
                        ? `Your ${currentRegionConfig.currency}${
                            formValues.monthlySavings || 800
                          }/month will grow with inflation (recommended)`
                        : `Your ${currentRegionConfig.currency}${
                            formValues.monthlySavings || 800
                          }/month stays fixed (loses purchasing power over time)`}
                    </p>
                  </div>
                </div>
              </div>
            );
          }}
        />
      </div>
    </CollapsibleSection>
  );
};
