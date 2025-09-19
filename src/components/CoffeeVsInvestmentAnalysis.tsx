"use client";

import { CoffeeVsInvestmentComparison, getRegionalConfig } from "@/utils/retirementEngine";
import { formatCurrencyWithSymbol } from "@/utils/formatCurrency";

interface CoffeeVsInvestmentAnalysisProps {
  comparison: CoffeeVsInvestmentComparison;
}

export default function CoffeeVsInvestmentAnalysis({ 
  comparison
}: CoffeeVsInvestmentAnalysisProps) {
  const regionalConfig = getRegionalConfig(comparison.withCoffee.formData.region);
  
  return (
    <div className="p-6 rounded-xl shadow transition-colors bg-orange-50 dark:bg-orange-900/30">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-orange-800 dark:text-orange-200">
        ☕ Coffee vs Investment Analysis
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* With Coffee Scenario */}
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-700/50">
          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-red-800 dark:text-red-200">
            ☕ With Daily Expenses
          </h4>
          <div className="space-y-2 text-sm text-red-700 dark:text-red-300">
            {comparison.withCoffee.canRetireAt ? (
              <>
                <p><strong>Retirement age:</strong> {comparison.withCoffee.canRetireAt}</p>
                <p><strong>Retirement date:</strong> {comparison.withCoffee.retirementDate?.toDateString()}</p>
                <p><strong>Savings at retirement:</strong> {formatCurrencyWithSymbol(comparison.withCoffee.totalSavingsAtRetirement, regionalConfig.currency)}</p>
              </>
            ) : (
              <p className="font-semibold">⚠️ Cannot retire with current plan</p>
            )}
          </div>
        </div>

        {/* Without Coffee Scenario */}
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-700/50">
          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-green-800 dark:text-green-200">
            💰 Investing Instead
          </h4>
          <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
            {comparison.withoutCoffee.canRetireAt ? (
              <>
                <p><strong>Retirement age:</strong> {comparison.withoutCoffee.canRetireAt}</p>
                <p><strong>Retirement date:</strong> {comparison.withoutCoffee.retirementDate?.toDateString()}</p>
                <p><strong>Savings at retirement:</strong> {formatCurrencyWithSymbol(comparison.withoutCoffee.totalSavingsAtRetirement, regionalConfig.currency)}</p>
              </>
            ) : (
              <p className="font-semibold">⚠️ Cannot retire with current plan</p>
            )}
          </div>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="mt-6 p-4 rounded-lg border-2 border-dashed border-orange-300 bg-white dark:border-orange-400/50 dark:bg-orange-800/10">
        <h4 className="text-lg font-semibold mb-3 text-orange-800 dark:text-orange-200">💡 The Impact of Your Daily Expense</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center text-orange-700 dark:text-orange-300">
            <div className="font-bold text-lg">{formatCurrencyWithSymbol(comparison.impact.annualCoffeeSpending, regionalConfig.currency)}</div>
            <div className="text-sm opacity-75">Annual expense</div>
          </div>
          <div className="text-center text-orange-700 dark:text-orange-300">
            <div className="font-bold text-lg">{comparison.impact.yearsOfCoffeeSpending} years</div>
            <div className="text-sm opacity-75">Until retirement</div>
          </div>
          <div className="text-center text-orange-700 dark:text-orange-300">
            <div className="font-bold text-lg">{formatCurrencyWithSymbol(comparison.impact.totalCoffeeSpendingUntilRetirement, regionalConfig.currency)}</div>
            <div className="text-sm opacity-75">Total expense</div>
          </div>
          <div className="text-center text-orange-700 dark:text-orange-300">
            <div className="font-bold text-lg">{formatCurrencyWithSymbol(comparison.impact.totalSavingsImprovement, regionalConfig.currency)}</div>
            <div className="text-sm opacity-75">Extra savings</div>
          </div>
        </div>

        {/* Detailed Trade-off Analysis */}
        <div className={`p-3 rounded-lg border ${
          comparison.impact.totalSavingsImprovement >= 0
            ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-800/20 dark:text-green-200 dark:border-green-700/50'
            : 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-800/20 dark:text-amber-200 dark:border-amber-700/50'
        }`}>
          <p className="font-semibold flex items-center gap-2 mb-2">
            {comparison.impact.totalSavingsImprovement >= 0 ? '🎯' : '⚖️'}
            <span>{comparison.impact.totalSavingsImprovement >= 0 ? 'Retirement Impact:' : 'Trade-off Analysis:'}</span>
          </p>
          
          {/* Early Retirement Info */}
          {(comparison.impact.retirementAgeImprovement > 0 || comparison.impact.retirementDateImprovement > 0) && (
            <p className="mb-2">
              By investing instead of spending, you could retire{' '}
              {(() => {
                const days = comparison.impact.retirementDateImprovement;
                const years = Math.floor(days / 365);
                const remainingDays = days % 365;
                const months = Math.floor(remainingDays / 30);
                
                if (years > 0 && months > 0) {
                  return <strong>{years} year{years !== 1 ? 's' : ''} and {months} month{months !== 1 ? 's' : ''} earlier</strong>;
                } else if (years > 0) {
                  return <strong>{years} year{years !== 1 ? 's' : ''} earlier</strong>;
                } else if (months > 0) {
                  return <strong>{months} month{months !== 1 ? 's' : ''} earlier</strong>;
                } else {
                  return <strong>{days} days earlier</strong>;
                }
              })()}{' '}
              <span className="text-sm opacity-75">({comparison.impact.retirementDateImprovement} days)</span>
            </p>
          )}
          
          {/* Trade-off Breakdown */}
          <div className="text-sm space-y-1 p-2 rounded bg-white/50 dark:bg-black/20">
            <p className="font-medium mb-1">💰 Financial Trade-off:</p>
            <div className="ml-2 space-y-0.5">
              <p>
                <span className="text-green-600 dark:text-green-400">+ Investment Benefit:</span>{' '}
                Growing {formatCurrencyWithSymbol(comparison.impact.annualCoffeeSpending, regionalConfig.currency)}/year for{' '}
                {comparison.impact.yearsOfCoffeeSpending} years
              </p>
              {comparison.impact.retirementAgeImprovement > 0 && (
                <p>
                  <span className="text-amber-600 dark:text-amber-400">- Growth Opportunity Cost:</span>{' '}
                  {comparison.impact.retirementAgeImprovement.toFixed(1)} fewer years of growth on entire portfolio
                </p>
              )}
              <p className="font-medium pt-1">
                <span className={comparison.impact.totalSavingsImprovement >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  = Net Result: {comparison.impact.totalSavingsImprovement >= 0 ? '+' : ''}{formatCurrencyWithSymbol(comparison.impact.totalSavingsImprovement, regionalConfig.currency)}
                </span>
                {' '}at retirement
              </p>
            </div>
          </div>
          
          {/* Recommendation */}
          {comparison.impact.totalSavingsImprovement < 0 && (
            <div className="mt-2 text-sm p-2 rounded bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
              <p><strong>⚠️ Note:</strong> In this scenario, you&apos;d have less money at retirement by investing the daily expense, despite retiring earlier. This happens because the opportunity cost of fewer growth years on your existing portfolio outweighs the benefit of the additional coffee investments.</p>
            </div>
          )}
          
          {comparison.impact.totalSavingsImprovement >= 0 && comparison.impact.retirementDateImprovement > 0 && (
            <div className="mt-2 text-sm p-2 rounded bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200">
              <p><strong>✅ Win-Win:</strong> You get both earlier retirement AND more money at retirement. The investment benefit outweighs the opportunity cost of fewer growth years.</p>
            </div>
          )}
        </div>

        {comparison.impact.retirementAgeImprovement <= 0 && comparison.impact.totalSavingsImprovement !== 0 && (
          <div className={`p-3 rounded-lg ${
            comparison.impact.totalSavingsImprovement > 0 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-200'
          }`}>
            <p className="font-semibold flex items-center gap-2">
              {comparison.impact.totalSavingsImprovement > 0 ? '📈' : '⚠️'} <span>Analysis:</span>
            </p>
            <p className="mt-1">
              {comparison.impact.totalSavingsImprovement > 0 ? (
                <>While this daily expense doesn&apos;t change your retirement age significantly, investing that money would still give you <strong>{formatCurrencyWithSymbol(comparison.impact.totalSavingsImprovement, regionalConfig.currency)}</strong> more in your retirement fund.</>
              ) : (
                <>This daily expense has a minimal impact on your retirement savings. The difference is <strong>{formatCurrencyWithSymbol(Math.abs(comparison.impact.totalSavingsImprovement), regionalConfig.currency)}</strong>, which suggests your current plan is already well-optimized.</>
              )}
            </p>
          </div>
        )}
        
        {/* Show a different message when the impact is truly negligible */}
        {comparison.impact.retirementAgeImprovement <= 0 && Math.abs(comparison.impact.totalSavingsImprovement) < 100 && (
          <div className="p-3 rounded-lg bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-200">
            <p className="font-semibold flex items-center gap-2">
              ✨ <span>Great News:</span>
            </p>
            <p className="mt-1">
              This daily expense has virtually no impact on your retirement plan. The difference is less than {formatCurrencyWithSymbol(100, regionalConfig.currency)}, so you can enjoy your daily treats guilt-free!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
