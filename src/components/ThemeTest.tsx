"use client";

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeTest() {
  const { theme, resolvedTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [htmlClass, setHtmlClass] = useState('');
  
  useEffect(() => {
    setMounted(true);
    
    const updateHtmlClass = () => {
      setHtmlClass(document.documentElement.className || '(empty)');
    };
    
    updateHtmlClass();
    
    // Watch for class changes on html element
    const observer = new MutationObserver(updateHtmlClass);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);
  
  if (!mounted) return <div>Loading theme test...</div>;
  
  return (
    <div className="fixed top-4 left-4 p-4 rounded-lg shadow-lg z-50 max-w-sm bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-600">
      <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">Theme Debug</h3>
      <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
        <div>Theme: <code>{theme}</code></div>
        <div>Resolved: <code>{resolvedTheme}</code></div>
        <div>System: <code>{systemTheme}</code></div>
        <div>HTML class: <code>&apos;{htmlClass}&apos;</code></div>
        <div className="mt-2 p-2 rounded bg-gray-100 dark:bg-gray-700">
          <div>This box should be:</div>
          <div>• Light mode: light gray background</div>
          <div>• Dark mode: dark gray background</div>
        </div>
        <div className="mt-2 p-2 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          This should be blue in both modes
        </div>
      </div>
    </div>
  );
}
