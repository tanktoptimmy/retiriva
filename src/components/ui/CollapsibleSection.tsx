"use client";

import { useState } from "react";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: string;
  description?: string;
}

export default function CollapsibleSection({ 
  title, 
  children, 
  defaultOpen = false, 
  icon,
  description 
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border transition-all duration-200 border-gray-200 bg-gray-50/50 dark:border-gray-600 dark:bg-gray-800/50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left transition-colors hover:bg-gray-100/50 text-gray-900 dark:hover:bg-gray-700/50 dark:text-gray-100"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-xl">{icon}</span>}
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className={`transform transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`}>
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            className="text-gray-500 dark:text-gray-400"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </button>
      
      <div className={`transition-all duration-200 overflow-hidden ${
        isOpen ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600">
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
