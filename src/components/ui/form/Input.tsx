import React from "react";

interface InputProps {
  className?: string;
  type?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = ({ className, ...props }: InputProps) => (
  <input
    className={`w-full px-3 py-2 border rounded-md transition-colors bg-white text-gray-900 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${
      props.type === "date"
        ? "[color-scheme:light] dark:[color-scheme:dark]"
        : ""
    } ${className || ""}`}
    {...props}
  />
);
