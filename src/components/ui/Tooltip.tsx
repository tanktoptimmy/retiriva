"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Don't show tooltip if content is empty
  const hasContent = content && (typeof content === 'string' ? content.trim().length > 0 : true);

  const handleMouseEnter = () => {
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    
    // Show tooltip immediately if already visible, or with slight delay
    if (isVisible) {
      return;
    }
    
    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 200); // 200ms delay before showing
  };
  
  const handleMouseLeave = () => {
    // Clear any pending show timeout
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    
    // Hide with a small delay to prevent flickering
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100); // 100ms delay before hiding
  };

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const tooltipWidth = 320;
      const tooltipHeight = 100; // Approximate height
      
      // Position tooltip above the trigger, centered horizontally
      let left = rect.left + rect.width / 2 - tooltipWidth / 2;
      let top = rect.top - tooltipHeight - 8;
      
      // Adjust if tooltip would go off screen
      if (left < 8) left = 8;
      if (left + tooltipWidth > window.innerWidth - 8) {
        left = window.innerWidth - tooltipWidth - 8;
      }
      if (top < 8) {
        // If no room above, show below
        top = rect.bottom + 8;
      }
      
      setTooltipStyle({
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        zIndex: 9999,
      });
    }
  }, [isVisible]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Don't render anything if there's no content
  if (!hasContent) {
    return null;
  }
  
  const tooltipContent = isVisible ? (
    <div
      className="px-4 py-3 text-sm rounded-lg shadow-xl border w-80 bg-white text-gray-900 border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
      style={tooltipStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {content}
    </div>
  ) : null;
  
  return (
    <>
      <div 
        ref={triggerRef}
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="cursor-help">
          {children}
        </div>
      </div>
      
      {typeof document !== 'undefined' && tooltipContent && 
        createPortal(tooltipContent, document.body)
      }
    </>
  );
}
