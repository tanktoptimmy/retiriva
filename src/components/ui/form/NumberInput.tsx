import React from "react";
import { Input } from "./Input";

interface NumberInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  helperText?: string;
  className?: string;
}

export const NumberInput = ({
  label,
  value,
  onChange,
  placeholder,
  helperText,
  className,
}: NumberInputProps) => {
  return (
    <div className={`flex flex-col ${className || ""}`}>
      <label className="mb-1 font-medium">{label}</label>
      <Input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        
      />
      {helperText && (
        <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};
