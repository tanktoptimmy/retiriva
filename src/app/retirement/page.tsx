"use client";

import RetirementCalculator from "@/components/RetirementCalculator";

export default function RetirementPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Retirement Countdown Calculator</h1>
      
      {/* Theme test elements */}
      <div className="mb-4 p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg">
        <p className="text-gray-900 dark:text-gray-100">This element should switch between light/dark themes</p>
        <div className="mt-2 p-2 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded">
          Test background color change
        </div>
        <button 
          onClick={() => {
            if (document.documentElement.classList.contains('dark')) {
              document.documentElement.classList.remove('dark');
            } else {
              document.documentElement.classList.add('dark');
            }
          }}
          className="mt-2 px-3 py-1 bg-gray-500 text-white rounded text-sm"
        >
          Manual Dark Toggle
        </button>
      </div>
      
      <RetirementCalculator />
    </div>
  );
}
