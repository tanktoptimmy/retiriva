"use client";

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <span className="text-xs opacity-60 hidden sm:inline">Loading...</span>
        <button
          className="px-2 py-1 sm:px-3 rounded-lg transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md bg-gray-500 text-white hover:bg-gray-600 border border-gray-400 hover:border-gray-500"
          disabled
        >
          ☾
          <span className="hidden sm:inline ml-1"> Dark</span>
        </button>
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
      <span className="text-xs opacity-60 hidden sm:inline">
        {isDark ? 'Dark Mode' : 'Light Mode'}
      </span>
      <button
        onClick={toggleTheme}
        className={`px-2 py-1 sm:px-3 rounded-lg transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md ${
          isDark 
            ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600' 
            : 'bg-gray-500 text-white hover:bg-gray-600 border border-gray-400 hover:border-gray-500'
        }`}
      >
        {isDark ? "☀" : "☾"}
        <span className="hidden sm:inline ml-1">
          {isDark ? " Light" : " Dark"}
        </span>
      </button>
    </div>
  );
}
