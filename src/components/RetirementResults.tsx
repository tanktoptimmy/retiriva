"use client";

import { SimpleRetirementResult, getRegionalConfig } from "@/utils/retirementEngine";
import { formatCurrencyWithSymbol } from "@/utils/formatCurrency";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface RetirementResultsProps {
  results: SimpleRetirementResult;
}

export default function RetirementResults({ results }: RetirementResultsProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Use resolved theme to determine dark mode, fallback to false during SSR
  const darkMode = mounted && resolvedTheme === 'dark';
  const canRetire = results.canRetireAt !== null;
  const regionalConfig = getRegionalConfig(results.formData.region);
  
  return (
    <div className={`p-6 rounded-xl shadow-lg transition-colors ${
      darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-100'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          canRetire 
            ? (darkMode ? 'bg-green-800/30 text-green-400' : 'bg-green-100 text-green-600')
            : (darkMode ? 'bg-red-800/30 text-red-400' : 'bg-red-100 text-red-600')
        }`}>
          <span className="text-2xl">{canRetire ? '🎯' : '⚠️'}</span>
        </div>
        <div>
          <h3 className={`text-xl font-bold ${
            darkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Your Retirement Plan
          </h3>
          <p className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {canRetire ? 'Based on your current savings plan' : 'Adjustments needed'}
          </p>
        </div>
      </div>

      {canRetire ? (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-lg border ${
              darkMode ? 'bg-blue-800/20 border-blue-700/50' : 'bg-blue-50 border-blue-200'
            }`}>
              <div className={`text-sm font-medium mb-1 ${
                darkMode ? 'text-blue-300' : 'text-blue-700'
              }`}>
                Retirement Age
              </div>
              <div className={`text-2xl font-bold ${
                darkMode ? 'text-blue-200' : 'text-blue-800'
              }`}>
                {results.canRetireAt}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg border ${
              darkMode ? 'bg-purple-800/20 border-purple-700/50' : 'bg-purple-50 border-purple-200'
            }`}>
              <div className={`text-sm font-medium mb-1 ${
                darkMode ? 'text-purple-300' : 'text-purple-700'
              }`}>
                Retirement Date
              </div>
              <div className={`text-sm font-bold ${
                darkMode ? 'text-purple-200' : 'text-purple-800'
              }`} suppressHydrationWarning>
                {results.retirementDate?.toLocaleDateString('en-GB', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg border ${
              darkMode ? 'bg-green-800/20 border-green-700/50' : 'bg-green-50 border-green-200'
            }`}>
              <div className={`text-sm font-medium mb-1 ${
                darkMode ? 'text-green-300' : 'text-green-700'
              }`}>
                Total Savings
              </div>
              <div className={`text-lg font-bold ${
                darkMode ? 'text-green-200' : 'text-green-800'
              }`}>
                {formatCurrencyWithSymbol(results.totalSavingsAtRetirement, regionalConfig.currency)}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg border ${
              darkMode ? 'bg-indigo-800/20 border-indigo-700/50' : 'bg-indigo-50 border-indigo-200'
            }`}>
              <div className={`text-sm font-medium mb-1 ${
                darkMode ? 'text-indigo-300' : 'text-indigo-700'
              }`}>
                Years in Retirement
              </div>
              <div className={`text-2xl font-bold ${
                darkMode ? 'text-indigo-200' : 'text-indigo-800'
              }`}>
                {results.yearsOfRetirement}
              </div>
            </div>
          </div>

          {/* Celebrate successful spend-down planning */}
          {results.runOutDate && (
            <div className={`p-4 rounded-lg border-l-4 ${
              darkMode ? 'bg-green-900/20 border-green-500 text-green-200' : 'bg-green-50 border-green-400 text-green-800'
            }`}>
              <div className="flex items-start gap-3">
                <span className="text-xl">🎉</span>
                <div>
                  <p className="font-semibold mb-1">Perfect Spend-Down Plan!</p>
                  <p className="text-sm">
                    Your funds are projected to run out on{' '}
                    <strong suppressHydrationWarning>
                      {results.runOutDate.toLocaleDateString('en-GB', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </strong>
                    {' '}based on your expected lifespan of {results.formData.deathAge} years. 
                    This means you&apos;ll be able to maximize your retirement lifestyle by spending your money 
                    when you can enjoy it most, rather than leaving it unused.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success message if no run out date */}
          {!results.runOutDate && (
            <div className={`p-4 rounded-lg border-l-4 ${
              darkMode ? 'bg-green-900/20 border-green-500 text-green-200' : 'bg-green-50 border-green-400 text-green-800'
            }`}>
              <div className="flex items-start gap-3">
                <span className="text-xl">✅</span>
                <div>
                  <p className="font-semibold mb-1">Financial Security Achieved</p>
                  <p className="text-sm">
                    Your savings are projected to last throughout retirement based on your expected lifespan.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Unable to retire scenario */
        <div className={`p-6 rounded-lg border-2 border-dashed ${
          darkMode ? 'border-red-600/50 bg-red-900/10 text-red-200' : 'border-red-300 bg-red-50 text-red-800'
        }`}>
          <div className="text-center">
            <div className="text-4xl mb-4">🚨</div>
            <h4 className="font-semibold text-lg mb-2">Retirement Goal Not Achievable</h4>
            <p className="mb-4">
              Based on your current savings plan, you won&apos;t be able to retire before your expected death age.
            </p>
            
            <div className={`text-sm p-3 rounded-md ${
              darkMode ? 'bg-red-800/20' : 'bg-white/50'
            }`}>
              <p className="font-medium mb-2">💡 Consider these options:</p>
              <ul className="text-left space-y-1 max-w-md mx-auto">
                <li>• Increase monthly savings</li>
                <li>• Reduce desired retirement income</li>
                <li>• Work longer (increase savings stop age)</li>
                <li>• Optimize investment returns</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
