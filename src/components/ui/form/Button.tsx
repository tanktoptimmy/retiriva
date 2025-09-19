import React from "react";

interface ButtonProps {
  className?: string;
  children?: React.ReactNode;
  type?: "submit" | "button";
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export const Button = ({
  className,
  children,
  variant = "primary",
  ...props
}: ButtonProps) => {
  const baseClasses = "px-4 py-2 font-medium rounded-md transition-colors";
  const variantClasses =
    variant === "primary"
      ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600"
      : "bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 dark:border-gray-600";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
};
