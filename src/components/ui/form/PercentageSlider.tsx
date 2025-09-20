import React from "react";
import { Input } from "./Input";

interface PercentageSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  getDisplayValue: (fieldName: string, value: number) => string;
  fieldName: string;
  min?: number;
  max?: number;
  step?: number;
  helperText?: string;
  minLabel?: string;
  maxLabel?: string;
}

export const PercentageSlider = ({
  label,
  value,
  onChange,
  getDisplayValue,
  fieldName,
  min = 0,
  max = 100,
  step = 5,
  helperText,
  minLabel,
  maxLabel,
}: PercentageSliderProps) => {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium">
        {label}: {value}%
      </label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-grow min-w-0 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
        />
        <div className="flex items-center gap-1 flex-shrink-0 w-24">
          <Input
            type="text"
            value={getDisplayValue(fieldName, value)}
            className="text-sm"
            placeholder={max.toString()}
            onChange={(e) => {
              const numValue = Number(e.target.value);
              if (!isNaN(numValue)) {
                onChange(Math.max(min, Math.min(max, numValue)));
              }
            }}
            
          />
          <span className="text-sm">%</span>
        </div>
      </div>
      {(minLabel || maxLabel) && (
        <div className="flex justify-between text-xs mt-1 text-gray-500 dark:text-gray-400">
          <span>{minLabel || `${min}%`}</span>
          <span>{maxLabel || `${max}%`}</span>
        </div>
      )}
      {helperText && (
        <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};
