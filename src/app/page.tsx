"use client";

import { useState, useEffect } from "react";
import RetirementCalculator from "@/components/RetirementCalculator";
import RetirementCountdown from "@/components/RetirementCountdown";
import HeroSectionSimplified from "@/components/HeroSectionSimplified";
import OnboardingModal from "@/components/OnboardingModal";
import AffiliateRecommendations from "@/components/AffiliateRecommendations";
import AffiliateBanner from "@/components/AffiliateBanner";
// Helper constants
const ONBOARDING_KEY = "retirement-calculator-onboarding-seen";

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
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true); // Start as true to avoid flash

  // Load onboarding status on mount
  useEffect(() => {
    setIsClient(true);
    
    // Check if user has seen onboarding before
    const hasSeenBefore = localStorage.getItem(ONBOARDING_KEY);
    if (!hasSeenBefore) {
      setHasSeenOnboarding(false);
      setShowOnboarding(true);
    } else {
      setHasSeenOnboarding(true);
    }
  }, []);
  
  // Handle updates from the calculator
  const handleCalculatorUpdate = (retirementDate: Date | null, retirementAge: number | null) => {
    if (retirementDate && retirementAge !== null) {
      setSavedRetirementData({
        retirementDate,
        retirementAge,
      });
    } else {
      setSavedRetirementData(null);
    }
  };
  
  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem(ONBOARDING_KEY, "true");
    setHasSeenOnboarding(true);
  };
  
  const handleShowOnboarding = () => {
    setShowOnboarding(true);
  };

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

      {/* Simplified Hero Section */}
      <HeroSectionSimplified onLearnMoreClick={handleShowOnboarding} />

      {/* Retirement Calculator - Now more prominent */}
      <RetirementCalculator onResultsUpdate={handleCalculatorUpdate} />
      
      {/* Compact affiliate banner after calculator */}
      <AffiliateBanner 
        variant="compact"
        product={{
          name: "High-Yield Savings Account",
          description: "Build your emergency fund with 4.5% APY. FDIC insured, no minimums.",
          cta: "Open Account",
          url: "https://example-bank.com/savings/ref=retiriva",
          badge: "4.5% APY"
        }}
      />
      
      <Disclaimer />
      
      {/* Featured affiliate recommendation */}
      <div className="mt-12">
        <AffiliateBanner 
          variant="featured"
          product={{
            name: "Start Investing Today",
            description: "Commission-free stock trades and low-cost index funds. Perfect for building your retirement portfolio.",
            cta: "Get Started Free",
            url: "https://example-investment-platform.com/ref=retiriva",
            badge: "Most Popular"
          }}
        />
      </div>
      
      {/* Full affiliate recommendations section */}
      <div className="mt-16 mb-12">
        <AffiliateRecommendations maxItems={6} />
      </div>
      
      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={handleCloseOnboarding}
        isFirstVisit={!hasSeenOnboarding}
      />
    </div>
  );
}
