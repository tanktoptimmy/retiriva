import React from "react";
import { Input } from "./Input";

interface AgeSelectorProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  getDisplayValue: (fieldName: string, value: number) => string;
  fieldName: string;
  placeholder?: string;
  min: number;
  max: number;
  presets: number[];
  helperText?: string;
  onInputChange?: (fieldName: string, inputValue: string) => void;
}

export const AgeSelector = ({
  label,
  value,
  onChange,
  getDisplayValue,
  fieldName,
  placeholder,
  min,
  max,
  presets,
  helperText,
  onInputChange,
}: AgeSelectorProps) => {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium">{label}</label>
      <div className="flex gap-2 mb-2">
        <Input
          type="text"
          value={getDisplayValue(fieldName, value)}
          className="flex-1"
          placeholder={placeholder}
          onChange={(e) => {
            const inputValue = e.target.value;
            
            // Update raw input tracking if handler provided
            if (onInputChange) {
              onInputChange(fieldName, inputValue);
            }
            
            // Handle numeric conversion and validation
            if (inputValue === "") {
              // Allow empty input
              return;
            }
            
            const numValue = Number(inputValue);
            if (!isNaN(numValue) && inputValue.trim() !== "") {
              const constrainedValue = Math.max(min, Math.min(max, numValue));
              onChange(constrainedValue);
            }
          }}
        />
        <button
          type="button"
          onClick={() => {
            // Remove raw input tracking so the new value shows from the actual form value
            if (onInputChange) {
              onInputChange(fieldName, "__CLEAR__");
            }
            onChange(Math.max(min, value - 1));
          }}
          className="px-3 py-2 text-sm font-medium rounded border transition-all duration-200 flex-shrink-0 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:text-gray-100"
        >
          -1
        </button>
        <button
          type="button"
          onClick={() => {
            // Remove raw input tracking so the new value shows from the actual form value
            if (onInputChange) {
              onInputChange(fieldName, "__CLEAR__");
            }
            onChange(Math.min(max, value + 1));
          }}
          className="px-3 py-2 text-sm font-medium rounded border transition-all duration-200 flex-shrink-0 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:text-gray-100"
        >
          +1
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        {presets.map((age) => (
          <button
            key={age}
            type="button"
            onClick={() => {
              // Remove raw input tracking so the new value shows from the actual form value
              if (onInputChange) {
                onInputChange(fieldName, "__CLEAR__");
              }
              onChange(age);
            }}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              value === age
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
            }`}
          >
            {age}
          </button>
        ))}
      </div>
      {helperText && (
        <p className="text-xs mt-1 text-blue-600 dark:text-blue-400">
          {helperText}
        </p>
      )}
    </div>
  );
};
