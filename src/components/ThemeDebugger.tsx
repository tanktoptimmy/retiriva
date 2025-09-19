"use client";

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeDebugger() {
  const { theme, resolvedTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [htmlClasses, setHtmlClasses] = useState('');
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const updateClasses = () => {
        setHtmlClasses(document.documentElement.className);
      };
      
      updateClasses();
      
      // Watch for class changes
      const observer = new MutationObserver(updateClasses);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
      
      return () => observer.disconnect();
    }
  }, [mounted]);

  if (!mounted) {
    return <div>Loading theme debug...</div>;
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-red-500 text-white text-xs rounded shadow-lg z-50 max-w-xs">
      <div>Theme: {theme}</div>
      <div>Resolved: {resolvedTheme}</div>
      <div>System: {systemTheme}</div>
      <div>Mounted: {mounted.toString()}</div>
      <div>HTML classes: &apos;{htmlClasses}&apos;</div>
    </div>
  );
}
