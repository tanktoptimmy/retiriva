"use client";

import { useState, useEffect } from "react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFirstVisit?: boolean;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const features = [
    {
      icon: "📊",
      title: "Personalized Projections",
      description:
        "Get accurate retirement projections based on your age, income, and savings goals",
    },
    {
      icon: "📅",
      title: "Retirement Date Calculator",
      description:
        "Discover your exact retirement date and how much you'll need to save each month",
    },
    {
      icon: "📈",
      title: "Investment Growth Tracking",
      description:
        "Visualize how your investments will compound over time with our interactive chart",
    },
    {
      icon: "☕",
      title: "Smart Spending Insights",
      description:
        "See how small daily expenses impact your long-term wealth building potential",
    },
    {
      icon: "🎯",
      title: "Goal-Based Planning",
      description:
        "Set your target retirement age and lifestyle, then get a clear path to achieve it",
    },
    {
      icon: "💡",
      title: "Expert Assumptions",
      description:
        "Built-in market assumptions and pension projections based on historical data",
    },
  ];

  const steps = [
    {
      title: "Welcome to Your Retirement Planner",
      content: (
        <div className="text-center">
          <div className="text-6xl mb-6">🎯</div>
          <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
            Take control of your financial future with our retirement calculator. 
            Get personalized projections in just 2 minutes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold mb-1">Know Your Number</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Find out exactly how much you need to retire comfortably
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="text-2xl mb-2">📈</div>
              <h3 className="font-semibold mb-1">See Your Growth</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Visualize how your investments will compound over decades
              </p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div className="text-2xl mb-2">⏰</div>
              <h3 className="font-semibold mb-1">Track Progress</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Get a live countdown to your retirement date
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Everything You Need to Plan Retirement",
      content: (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-4 rounded-lg shadow-sm bg-white/80 border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700"
              >
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-base mb-2 text-gray-800 dark:text-gray-100">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Get Your Results Instantly",
      content: (
        <div className="text-center">
          <div className="text-6xl mb-6">✨</div>
          <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
            Once you fill out the calculator, you&apos;ll receive:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            {[
              "✅ Your exact retirement date",
              "✅ Monthly savings target",
              "✅ Interactive growth charts",
              "✅ Smart spending analysis",
              "✅ Detailed year-by-year projections",
              "✅ Coffee vs investment insights",
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <span className="font-medium text-gray-700 dark:text-gray-200">{benefit}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Quick Start:</strong> The calculator remembers your data, so you can refine your inputs and see updated results instantly.
            </p>
          </div>
        </div>
      ),
    },
  ];

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const nextStep = () => setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 h-[80vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {steps[currentStep].title}
            </h2>
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep 
                      ? "bg-blue-500" 
                      : index < currentStep 
                        ? "bg-green-500" 
                        : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {steps[currentStep].content}
        </div>

        {/* Footer - Fixed */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="flex gap-2">
            {currentStep < steps.length - 1 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Start Calculating
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
