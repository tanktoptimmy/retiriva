"use client";

import React, { useEffect } from "react";
import { SimpleRetirementInput } from "@/utils/retirementEngine";
import { useRetirementForm } from "@/hooks/useRetirementForm";
import { EssentialFieldsSection } from "./retirement-form/EssentialFieldsSection";
import { LifePlanningSection } from "./retirement-form/LifePlanningSection";
import { InvestmentAssumptionsSection } from "./retirement-form/InvestmentAssumptionsSection";
import { StatePensionSection } from "./retirement-form/StatePensionSection";
import { DailyExpenseAnalysisSection } from "./retirement-form/DailyExpenseAnalysisSection";
import { Button } from "./ui/form/Button";


interface RetirementFormProgressiveProps {
  onSubmit: (data: SimpleRetirementInput) => void;
  hasCalculatedOnce?: boolean;
  onRegionChange?: () => void;
  loading?: boolean;
}


export default function RetirementFormProgressive({
  onSubmit,
  hasCalculatedOnce,
  onRegionChange,
  loading = false,
}: RetirementFormProgressiveProps) {
  
  useEffect(() => {
  }, []);
  
  // Use the custom form hook
  const {
    control,
    handleSubmit,
    formValues,
    isClient,
    setEmptyFields,
    setRawInputValues,
    handleNumberInput,
    getDisplayValue,
    calculateCurrentAge,
    defaultDateOfBirth,
    hasFormChanged,
  } = useRetirementForm({ onSubmit, onRegionChange, hasCalculatedOnce });

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="rounded-lg shadow-lg transition-colors bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Retirement Calculator
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Plan your retirement with our comprehensive calculator. All sections are organized below - you can collapse any you don&apos;t need.
            </p>
          </div>

          <div className="space-y-6">
            {/* Essential Fields */}
            <div className="p-4 rounded-lg bg-white border border-gray-100 dark:bg-gray-800/50 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">
                Essential Information
              </h3>
              <EssentialFieldsSection
                control={control}
                formValues={formValues}
                getDisplayValue={getDisplayValue}
                handleNumberInput={handleNumberInput}
                defaultDateOfBirth={defaultDateOfBirth}
              />
            </div>

            {/* Life Planning Section */}
            <LifePlanningSection
              control={control}
              formValues={formValues}
              getDisplayValue={getDisplayValue}
              calculateCurrentAge={calculateCurrentAge}
              setEmptyFields={setEmptyFields}
              setRawInputValues={setRawInputValues}
            />

            {/* Investment Assumptions */}
            <InvestmentAssumptionsSection
              control={control}
              formValues={formValues}
              getDisplayValue={getDisplayValue}
              handleNumberInput={handleNumberInput}
            />

            {/* State Pension */}
            <StatePensionSection
              control={control}
              formValues={formValues}
              getDisplayValue={getDisplayValue}
              handleNumberInput={handleNumberInput}
              isClient={isClient}
            />

            {/* Daily Expense Analysis */}
            <DailyExpenseAnalysisSection
              control={control}
              formValues={formValues}
              getDisplayValue={getDisplayValue}
              handleNumberInput={handleNumberInput}
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ✓ Your values are automatically saved
              </p>
              {hasCalculatedOnce && !hasFormChanged && !loading && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  No changes detected
                </p>
              )}
              {hasCalculatedOnce && hasFormChanged && !loading && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  ✓ Changes detected
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full py-3 text-lg"
              loading={loading}
              disabled={hasCalculatedOnce && !hasFormChanged}
            >
              {loading
                ? "Calculating..."
                : hasCalculatedOnce
                ? hasFormChanged
                  ? "🔄 Re-calculate"
                  : "✓ Up to date"
                : "🚀 Calculate My Retirement"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
