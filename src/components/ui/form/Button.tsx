import React from "react";

interface ButtonProps {
  className?: string;
  children?: React.ReactNode;
  type?: "submit" | "button";
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  loading?: boolean;
}

export const Button = ({
  className,
  children,
  variant = "primary",
  disabled = false,
  loading = false,
  ...props
}: ButtonProps) => {
  const baseClasses = "px-4 py-2 font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2";
  
  const getVariantClasses = () => {
    if (disabled || loading) {
      return "bg-gray-400 text-gray-200 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400";
    }
    
    return variant === "primary"
      ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
      : "bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 dark:border-gray-600";
  };

  const LoadingSpinner = () => (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
  );

  return (
    <button
      className={`${baseClasses} ${getVariantClasses()} ${className || ""}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </button>
  );
};
