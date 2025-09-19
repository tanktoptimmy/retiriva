"use client";

interface HeroSectionSimplifiedProps {
  onLearnMoreClick: () => void;
}

export default function HeroSectionSimplified({ onLearnMoreClick }: HeroSectionSimplifiedProps) {
  return (
    <div className="text-center mb-8">
      {/* Main Hero Content */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Plan Your Perfect Retirement
        </h1>

        <div className="text-lg md:text-xl mb-6 max-w-2xl mx-auto leading-relaxed text-gray-600 dark:text-gray-300">
          <p className="mb-2">
            Take control of your financial future with our{" "}
            <span className="relative inline-block group cursor-pointer">
              <span className="line-through decoration-red-500 decoration-2 group-hover:decoration-red-600 transition-colors">
                comprehensive
              </span>
              <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-red-500 text-sm font-mono rotate-[-2deg] whitespace-nowrap bg-white/80 px-1 rounded-sm border border-red-200 shadow-sm dark:bg-gray-800/80 dark:border-red-400 group-hover:rotate-[-3deg] group-hover:scale-110 transition-all duration-200 opacity-90 group-hover:opacity-100">
                ↗ sort of basic
              </span>
            </span>{" "}
            retirement calculator.
          </p>
          <p>
            Get personalized projections and discover your retirement date in just 2 minutes.
          </p>
        </div>

        {/* Quick Benefits */}
        <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✅</span>
            <span>Your exact retirement date</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✅</span>
            <span>Monthly savings target</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✅</span>
            <span>Interactive growth charts</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            onClick={onLearnMoreClick}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
          >
            Learn More About Features
          </button>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            or scroll down to start calculating →
          </div>
        </div>
      </div>
    </div>
  );
}
