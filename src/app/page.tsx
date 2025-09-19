"use client";

import { useState, useEffect } from "react";
import RetirementCalculator from "@/components/RetirementCalculator";
import RetirementCountdown from "@/components/RetirementCountdown";
import HeroSection from "@/components/HeroSection";
import {
  calculateSimpleRetirement,
  SimpleRetirementInput,
} from "@/utils/retirementEngine";

// Helper functions for localStorage access
const STORAGE_KEY = "retirement-calculator-data";

const loadFromStorage = (): SimpleRetirementInput | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored);
    // Convert string back to date
    if (data.dateOfBirth) {
      data.dateOfBirth = new Date(data.dateOfBirth);
    }
    return data;
  } catch (error) {
    console.warn("Could not load from localStorage:", error);
    return null;
  }
};

function Disclaimer() {
  return (
    <div className="p-4 rounded-xl shadow text-sm mt-6 bg-yellow-50 dark:bg-yellow-900/20">
      <p className="text-yellow-800 mb-4 dark:text-yellow-200">
        ⚠️ <strong>Disclaimer:</strong> This calculator is for educational
        purposes only. The projections are based on assumptions about returns,
        inflation, and pension amounts which may not reflect reality. It does
        not account for tax, fees, policy changes, or unexpected expenses. This
        is <strong>not financial advice</strong>. Always consult a qualified
        financial adviser before making retirement decisions.
      </p>
      <p className="text-yellow-800 dark:text-yellow-200">
        💡 <strong>Affiliate Disclosure:</strong> Some links on this website are
        referral or affiliate links. This means we may earn a commission if you
        sign up or make a purchase through these links, at no extra cost to you.
        These partnerships help support the site.
      </p>
    </div>
  );
}

export default function HomePage() {
  const [savedRetirementData, setSavedRetirementData] = useState<{
    retirementDate: Date;
    retirementAge: number;
  } | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Load saved retirement data on mount
  useEffect(() => {
    setIsClient(true);
    const savedData = loadFromStorage();
    if (savedData) {
      try {
        const result = calculateSimpleRetirement(savedData);
        if (result.retirementDate && result.canRetireAt !== null) {
          setSavedRetirementData({
            retirementDate: result.retirementDate,
            retirementAge: result.canRetireAt,
          });
        }
      } catch (error) {
        console.warn(
          "Could not calculate retirement data for countdown:",
          error
        );
      }
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Show countdown at the very top if we have saved data */}
      {isClient && savedRetirementData && (
        <div className="mb-8">
          <RetirementCountdown
            retirementDate={savedRetirementData.retirementDate}
            retirementAge={savedRetirementData.retirementAge}
          />
        </div>
      )}

      {/* Enhanced Hero Section */}
      <HeroSection />

      <RetirementCalculator />
      <Disclaimer />
    </div>
  );
}
