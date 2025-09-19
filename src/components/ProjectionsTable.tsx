import { SimpleRetirementResult, getRegionalConfig } from "@/utils/retirementEngine";
import { formatCurrency } from "@/utils/formatCurrency";

interface ProjectionsTableProps {
  result: SimpleRetirementResult;
}

export default function ProjectionsTable({ result }: ProjectionsTableProps) {
  const regionalConfig = getRegionalConfig(result.formData.region);
  const currencySymbol = regionalConfig.currency;
  
  return (
    <div className="p-6 rounded-md shadow overflow-x-auto bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">
      <h3 className="text-lg font-semibold mb-2">Year-by-Year Projection</h3>

      {/* Legend for row meanings */}
      <div className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
        <h4 className="text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Row Legend:</h4>
        <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-gray-800 dark:text-gray-200">
          <div className="flex items-center gap-2">
            <span className="inline-block w-5 h-5 rounded border-2 bg-blue-100 border-blue-300/50 dark:bg-blue-600/70 dark:border-blue-400" />
            <span className="font-medium">💰 Saving years</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-5 h-5 rounded border-2 bg-green-100 border-green-300/50 dark:bg-green-600/70 dark:border-green-400" />
            <span className="font-medium">🎯 Retirement start</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-5 h-5 rounded border-2 bg-yellow-100 border-yellow-300/50 dark:bg-yellow-600/70 dark:border-yellow-400" />
            <span className="font-medium">🏠 Retirement years</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-5 h-5 rounded border-2 bg-gray-100 border-gray-300/50 dark:bg-gray-600/70 dark:border-gray-400" />
            <span className="font-medium">📈 Growth only</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-5 h-5 rounded border-2 bg-red-100 border-red-300/50 dark:bg-red-600/70 dark:border-red-400" />
            <span className="font-medium">⚠️ Fund depleted</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto max-h-96 border rounded-lg -mx-2 sm:mx-0 border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
            <tr className="border-b border-gray-300 dark:border-gray-700">
              <th className="p-3 text-left font-semibold min-w-[80px]">Age</th>
              <th className="p-3 text-left font-semibold min-w-[80px]">Year</th>
              <th className="p-3 text-left font-semibold min-w-[120px]">Start Balance</th>
              <th className="p-3 text-left font-semibold min-w-[120px]">Contributions</th>
              <th className="p-3 text-left font-semibold min-w-[100px]">Growth</th>
              <th className="p-3 text-left font-semibold min-w-[120px]">State Pension</th>
              <th className="p-3 text-left font-semibold min-w-[120px]">Withdrawals</th>
              <th className="p-3 text-left font-semibold min-w-[120px]">Total Income</th>
              <th className="p-3 text-left font-semibold min-w-[120px]">End Balance</th>
            </tr>
          </thead>
        <tbody>
          {result.projections.map((proj, idx) => {
            const isRetirementStart = proj.age === result.canRetireAt;
            const isZeroBalance = proj.endBalance <= 0;
            const isRetirement = proj.withdrawals > 0;
            const isSaving = proj.contributions > 0;
            const isGrowthOnly = !isRetirement && !isSaving && !isZeroBalance && idx !== 0;

            // Determine row styling based on state
            let rowClass = "border-b transition-colors border-gray-200 dark:border-gray-700 ";
            if (isZeroBalance) {
              rowClass += "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-100";
            } else if (isRetirementStart) {
              rowClass += "bg-green-100 text-green-900 font-medium dark:bg-green-900/30 dark:text-green-100";
            } else if (isRetirement) {
              rowClass += "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-100";
            } else if (isSaving) {
              rowClass += "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100";
            } else if (isGrowthOnly) {
              rowClass += "bg-gray-100 text-gray-900 dark:bg-gray-900/30 dark:text-gray-100";
            } else {
              rowClass += "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100";
            }

            return (
              <tr key={idx} className={rowClass}>
                <td className="p-2 font-medium">
                  <div className="flex items-center gap-2">
                    {isZeroBalance && <span className="text-red-600 dark:text-red-400">⚠️</span>}
                    {isRetirementStart && <span className="text-green-600 dark:text-green-400">🎯</span>}
                    {isRetirement && !isRetirementStart && <span className="text-yellow-600 dark:text-yellow-400">🏠</span>}
                    {isSaving && <span className="text-blue-600 dark:text-blue-400">💰</span>}
                    {isGrowthOnly && <span className="text-gray-500 dark:text-gray-400">📈</span>}
                    <span>{proj.age}</span>
                    {idx === 0 && <span className="text-xs px-1 rounded bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200">NOW</span>}
                  </div>
                </td>
                <td className="p-2">{proj.year}</td>
                <td className="p-2">{currencySymbol}{formatCurrency(proj.startBalance)}</td>
                <td className="p-2">{currencySymbol}{formatCurrency(proj.contributions)}</td>
                <td className="p-2">{currencySymbol}{formatCurrency(proj.growth)}</td>
                <td className="p-2">
                  {proj.statePensionIncome > 0
                    ? `${currencySymbol}${formatCurrency(proj.statePensionIncome)}`
                    : "-"}
                </td>
                <td className="p-2">{currencySymbol}{formatCurrency(proj.withdrawals)}</td>
                <td className="p-2">
                  {currencySymbol}{formatCurrency(proj.withdrawals + proj.statePensionIncome)}
                </td>
                <td className="p-2">{currencySymbol}{formatCurrency(proj.endBalance)}</td>
              </tr>
            );
          })}
        </tbody>
        </table>
        
       
      </div>
 {/* Footer showing fund status */}
        <div className="border-t px-4 py-3 text-center text-sm border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50">
          {result.runOutDate ? (
            <div className="flex items-center justify-center gap-2 text-orange-800 dark:text-orange-200">
              <span>⚠️</span>
              <span>
                Fund estimated to be depleted on{" "}
                <strong suppressHydrationWarning>
                  {result.runOutDate.toDateString()}
                </strong>
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-green-800 dark:text-green-200">
              <span>✅</span>
              <span>
                <strong>Fund never runs out</strong> - You have sustainable retirement income throughout your lifetime
              </span>
            </div>
          )}
        </div>
    </div>
  );
}

