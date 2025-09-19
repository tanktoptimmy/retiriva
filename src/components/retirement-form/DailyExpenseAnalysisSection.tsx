import React from "react";
import { Controller, Control } from "react-hook-form";
import { SimpleRetirementInput, getRegionalConfig } from "@/utils/retirementEngine";
import { Input } from "../ui/form/Input";
import CollapsibleSection from "../ui/CollapsibleSection";

interface DailyExpenseAnalysisSectionProps {
  control: Control<SimpleRetirementInput>;
  formValues: SimpleRetirementInput;
  getDisplayValue: (fieldName: string, value: number | undefined) => string;
  handleNumberInput: (fieldName: string, onChange: (value: number) => void, defaultValue?: number, min?: number, max?: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DailyExpenseAnalysisSection = ({
  control,
  formValues,
  getDisplayValue,
  handleNumberInput,
}: DailyExpenseAnalysisSectionProps) => {
  return (
    <CollapsibleSection
      title="Daily Expense Impact Analysis"
      icon="☕"
      description="See how redirecting daily expenses could accelerate your retirement"
      
      defaultOpen={true}
    >
      <div className="md:col-span-2">
        <div className="p-4 rounded-lg border-2 border-dashed transition-colors border-orange-300 bg-orange-50 dark:border-orange-600/50 dark:bg-orange-900/10">
          <p className="text-sm mb-4 text-orange-700 dark:text-orange-300">
            See how redirecting daily expenses like coffee into investments
            could change your retirement date!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Daily Expense Amount */}
            <Controller
              name="dailyExpenseAmount"
              control={control}
              render={({ field }) => {
                const currentRegionConfig = getRegionalConfig(
                  formValues.region || "UK"
                );

                return (
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-orange-800 dark:text-orange-200">
                      Daily Expense Amount ({currentRegionConfig.currency})
                    </label>
                    <Input
                      type="text"
                      value={getDisplayValue(
                        "dailyExpenseAmount",
                        field.value || 0
                      )}
                      placeholder="e.g. 3.50"
                      onChange={handleNumberInput(
                        "dailyExpenseAmount",
                        field.onChange,
                        0,
                        0,
                        50
                      )}
                      
                    />
                    <p className="text-xs mt-1 text-orange-600 dark:text-orange-400">
                      Coffee: {currentRegionConfig.currency}3.50 | Lunch: {currentRegionConfig.currency}8.50
                    </p>
                  </div>
                );
              }}
            />

            {/* Working Days Per Week */}
            <Controller
              name="workingDaysPerWeek"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium text-orange-800 dark:text-orange-200">
                    Working Days/Week
                  </label>
                  <Input
                    type="text"
                    value={getDisplayValue(
                      "workingDaysPerWeek",
                      field.value || 5
                    )}
                    placeholder="5"
                    onChange={handleNumberInput(
                      "workingDaysPerWeek",
                      field.onChange,
                      5,
                      1,
                      7
                    )}
                    
                  />
                  <div className="flex gap-1 mt-1">
                    {[5, 6, 7].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => field.onChange(days)}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          (field.value || 5) === days
                            ? "bg-orange-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
                        }`}
                      >
                        {days}d
                      </button>
                    ))}
                  </div>
                </div>
              )}
            />

            {/* Vacation Days Per Year */}
            <Controller
              name="vacationDaysPerYear"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium text-orange-800 dark:text-orange-200">
                    Vacation Days/Year
                  </label>
                  <Input
                    type="text"
                    value={getDisplayValue(
                      "vacationDaysPerYear",
                      field.value || 0
                    )}
                    placeholder="0"
                    onChange={handleNumberInput(
                      "vacationDaysPerYear",
                      field.onChange,
                      0,
                      0,
                      365
                    )}
                    
                  />
                  <div className="flex gap-1 mt-1">
                    {[0, 20, 25, 30].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => field.onChange(days)}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          (field.value || 0) === days
                            ? "bg-orange-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
                        }`}
                      >
                        {days}d
                      </button>
                    ))}
                  </div>
                </div>
              )}
            />
          </div>

          {/* Show calculated impact */}
          {(() => {
            const dailyAmount = formValues.dailyExpenseAmount || 0;
            const workingDays = formValues.workingDaysPerWeek || 5;
            const vacationDays = formValues.vacationDaysPerYear || 0;
            const baseAnnualExpenseDays = workingDays * 52;
            const actualAnnualExpenseDays = Math.max(
              0,
              baseAnnualExpenseDays - vacationDays
            );
            const weeklyAmount = dailyAmount * workingDays;
            const monthlyAmount =
              (dailyAmount * actualAnnualExpenseDays) / 12;
            const annualAmount = dailyAmount * actualAnnualExpenseDays;
            const currentRegionConfig = getRegionalConfig(formValues.region || 'UK');

            if (dailyAmount > 0) {
              return (
                <div className="mt-4 p-3 rounded-md bg-orange-100 dark:bg-orange-800/30">
                  <h4 className="text-sm font-medium mb-2 text-orange-800 dark:text-orange-200">
                    Investment Impact:
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-orange-700 dark:text-orange-300">
                    <div>
                      <div className="font-semibold">
                        {currentRegionConfig.currency}{dailyAmount.toFixed(2)}/day
                      </div>
                      <div className="opacity-75">Daily expense</div>
                    </div>
                    <div>
                      <div className="font-semibold">
                        {currentRegionConfig.currency}{weeklyAmount.toFixed(0)}/week
                      </div>
                      <div className="opacity-75">Weekly total</div>
                    </div>
                    <div>
                      <div className="font-semibold">
                        {currentRegionConfig.currency}{monthlyAmount.toFixed(0)}/month
                      </div>
                      <div className="opacity-75">Monthly average</div>
                    </div>
                    <div>
                      <div className="font-semibold">
                        {currentRegionConfig.currency}{annualAmount.toFixed(0)}/year
                      </div>
                      <div className="opacity-75">Annual total</div>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>
      </div>
    </CollapsibleSection>
  );
};
