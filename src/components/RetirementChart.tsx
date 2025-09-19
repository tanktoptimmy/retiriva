"use client";

import { useMemo, useEffect, useState } from "react";
import { SimpleRetirementResult, getRegionalConfig } from "@/utils/retirementEngine";
import { formatCurrency } from "@/utils/formatCurrency";
import { useTheme } from "next-themes";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface RetirementChartProps {
  results: SimpleRetirementResult;
}

export default function RetirementChart({ results }: RetirementChartProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Use resolved theme to determine dark mode, fallback to false during SSR
  const darkMode = mounted && resolvedTheme === 'dark';
  const regionalConfig = getRegionalConfig(results.formData.region);
  const currencySymbol = regionalConfig.currency;
  
  const chartData = useMemo(() => {
    if (!results) return [];
    return results.projections.map((p) => ({
      year: p.year,
      balance: Math.max(0, p.endBalance),
      withdrawals: p.withdrawals,
      statePension: p.statePensionIncome,
    }));
  }, [results]);

  if (!results || chartData.length === 0) return null;

  return (
    <div className="w-full h-80 mt-6 p-4 rounded-md shadow transition-colors bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Balance & Income Over Time</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <XAxis 
            dataKey="year" 
            tick={{ 
              fill: darkMode ? '#e5e7eb' : '#374151',
              fontSize: 11
            }}
            axisLine={{ stroke: darkMode ? '#6b7280' : '#9ca3af' }}
          />
          <YAxis 
            tickFormatter={(val) => `${currencySymbol}${(val / 1000).toFixed(0)}k`}
            tick={{ 
              fill: darkMode ? '#e5e7eb' : '#374151',
              fontSize: 11
            }}
            axisLine={{ stroke: darkMode ? '#6b7280' : '#9ca3af' }}
            width={60}
          />
          <Tooltip 
            formatter={(value: number) => `${currencySymbol}${formatCurrency(value)}`}
            contentStyle={{
              backgroundColor: darkMode ? '#374151' : '#ffffff',
              border: `1px solid ${darkMode ? '#6b7280' : '#d1d5db'}`,
              borderRadius: '6px',
              color: darkMode ? '#e5e7eb' : '#374151'
            }}
          />
          <Legend 
            wrapperStyle={{ 
              color: darkMode ? '#e5e7eb' : '#374151',
              paddingTop: '10px',
              paddingBottom: '5px',
              fontSize: '12px'
            }}
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            iconType="line"
            height={45}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#4ade80"
            name="Balance"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="withdrawals"
            stroke="#f87171"
            name="Outgoing"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="statePension"
            stroke="#60a5fa"
            name="Pension"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
