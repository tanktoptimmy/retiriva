"use client";

import { useState, useEffect, useCallback } from "react";
import RetirementFormProgressive from "./RetirementFormProgressive";
import RetirementResults from "./RetirementResults";
import RetirementChart from "./RetirementChart";
import CoffeeVsInvestmentAnalysis from "./CoffeeVsInvestmentAnalysis";
import ProjectionsTable from "./ProjectionsTable";
import LoadingMessage from "./ui/LoadingMessage";
import ErrorMessage from "./ui/ErrorMessage";
import {
  calculateSimpleRetirement,
  compareCoffeeVsInvestment,
  SimpleRetirementInput,
  SimpleRetirementResult,
  CoffeeVsInvestmentComparison,
} from "@/utils/retirementEngine";

// Helper functions for localStorage access
const STORAGE_KEY = 'retirement-calculator-data';

const loadFromStorage = (): SimpleRetirementInput | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    // Convert string back to date
    if (data.dateOfBirth) {
      data.dateOfBirth = new Date(data.dateOfBirth);
    }
    return data;
  } catch (error) {
    console.warn('Could not load from localStorage:', error);
    return null;
  }
};

export default function RetirementCalculator() {
  const [results, setResults] = useState<SimpleRetirementResult | null>(null);
  const [coffeeComparison, setCoffeeComparison] = useState<CoffeeVsInvestmentComparison | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCalculatedOnce, setHasCalculatedOnce] = useState(false);
  const [justCalculated, setJustCalculated] = useState(false);

  // Auto-calculate on mount if saved data exists - but delay to avoid race condition with form loading
  useEffect(() => {
    // Use a small delay to ensure the form has finished loading and updating localStorage
    const timer = setTimeout(() => {
      const savedData = loadFromStorage();
      if (savedData) {
        // Automatically calculate results from saved data
        try {
        // Apply the same data processing that the form hook does
        const processedData: SimpleRetirementInput = {
          ...savedData,
          currentSavings: savedData.currentSavings ?? 50000,
          monthlySavings: savedData.monthlySavings ?? 800,
          savingsStopAge: savedData.savingsStopAge ?? 65,
          deathAge: savedData.deathAge ?? 85,
          desiredAnnualIncome: savedData.desiredAnnualIncome ?? 35000,
          inflationRate: savedData.inflationRate ?? 2.5,
          expectedReturn: savedData.expectedReturn ?? 5.0,
          statePensionAge: savedData.statePensionAge ?? 67,
          statePensionPercentage: savedData.statePensionPercentage ?? 100,
          dailyExpenseAmount: savedData.dailyExpenseAmount ?? 0, // Use ?? instead of || to preserve 0 values
          workingDaysPerWeek: savedData.workingDaysPerWeek ?? 5,
          vacationDaysPerYear: savedData.vacationDaysPerYear ?? 0,
          adjustSavingsForInflation: savedData.adjustSavingsForInflation ?? true,
        };
        
        const result = calculateSimpleRetirement(processedData);
        const comparison = compareCoffeeVsInvestment(processedData);
        
        setResults(result);
        setCoffeeComparison(comparison);
        setHasCalculatedOnce(true);
        } catch (err) {
          console.error("Auto-calculation error:", err);
          // Don't set error state for auto-calculation failures
          // User can still manually submit the form
        }
      }
    }, 1000); // Wait 1 second for form to stabilize
    
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (formData: SimpleRetirementInput) => {
    try {
      setLoading(true);
      setError(null);
      setJustCalculated(false);

      // Add a brief delay to make the calculation feel more substantial
      // and give time for the loading animation to be visible
      await new Promise(resolve => setTimeout(resolve, 800));

      const result = calculateSimpleRetirement(formData);
      const comparison = compareCoffeeVsInvestment(formData);
      
      setResults(result);
      setCoffeeComparison(comparison);
      setHasCalculatedOnce(true);
      setJustCalculated(true);
      
      // Clear the "just calculated" state after a few seconds
      setTimeout(() => setJustCalculated(false), 3000);
      
    } catch (err) {
      console.error("Calculation error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegionChange = useCallback(() => {
    // Clear results when region changes so button becomes "Calculate" instead of "Re-calculate"
    setResults(null);
    setCoffeeComparison(null);
    setHasCalculatedOnce(false);
  }, []);



  return (
    <div className="space-y-8">
      <RetirementFormProgressive 
        onSubmit={handleSubmit} 
        hasCalculatedOnce={hasCalculatedOnce}
        onRegionChange={handleRegionChange}
        loading={loading}
      />

      {loading && (
        <LoadingMessage message="Calculating your retirement projections..." />
      )}

      {error && (
        <ErrorMessage error={error} />
      )}

      {/* Success notification */}
      {justCalculated && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800 animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                ✨ Calculation completed successfully!
              </p>
              <p className="text-xs text-green-600 dark:text-green-300">
                Your retirement projections have been updated below.
              </p>
            </div>
          </div>
        </div>
      )}

      {results && (
        <>
          <RetirementResults results={results} />

          {coffeeComparison && (
            <CoffeeVsInvestmentAnalysis comparison={coffeeComparison} />
          )}

          <RetirementChart results={results} />
          <ProjectionsTable result={results} />
        </>
      )}
    </div>
  );
}
