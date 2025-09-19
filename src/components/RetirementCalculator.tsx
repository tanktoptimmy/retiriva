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

  // Auto-calculate on mount if saved data exists
  useEffect(() => {
    const savedData = loadFromStorage();
    if (savedData) {
      // Automatically calculate results from saved data
      try {
        const result = calculateSimpleRetirement(savedData);
        const comparison = compareCoffeeVsInvestment(savedData);
        
        setResults(result);
        setCoffeeComparison(comparison);
        setHasCalculatedOnce(true);
      } catch (err) {
        console.error("Auto-calculation error:", err);
        // Don't set error state for auto-calculation failures
        // User can still manually submit the form
      }
    }
  }, []);

  const handleSubmit = (formData: SimpleRetirementInput) => {
    try {
      setLoading(true);
      setError(null);

      const result = calculateSimpleRetirement(formData);
      const comparison = compareCoffeeVsInvestment(formData);
      
      // Debug logging for coffee comparison
      console.log('=== COFFEE COMPARISON DEBUG ===');
      console.log('dailyExpenseAmount:', formData.dailyExpenseAmount);
      console.log('workingDaysPerWeek:', formData.workingDaysPerWeek);
      console.log('vacationDaysPerYear:', formData.vacationDaysPerYear);
      console.log('Coffee comparison result:', comparison);
      console.log('===============================');
      
      setResults(result);
      setCoffeeComparison(comparison);
      setHasCalculatedOnce(true);
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
      />

      {loading && (
        <LoadingMessage message="Calculating your retirement projections..." />
      )}

      {error && (
        <ErrorMessage error={error} />
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
