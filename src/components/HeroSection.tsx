"use client";

export default function HeroSection() {
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

  return (
    <div className="text-center mb-12">
      {/* Main Hero Content */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Plan Your Perfect Retirement
        </h1>

        <div className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-gray-600 dark:text-gray-300">
          <p className="mb-2">
            Take control of your financial future with our{" "}
            <span className="relative inline-block group cursor-pointer">
              <span className="line-through decoration-red-500 decoration-2 group-hover:decoration-red-600 transition-colors">
                comprehensive
              </span>
              <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-red-500 text-base font-mono rotate-[-2deg] whitespace-nowrap bg-white/80 px-1 rounded-sm border border-red-200 shadow-sm dark:bg-gray-800/80 dark:border-red-400 group-hover:rotate-[-3deg] group-hover:scale-110 transition-all duration-200 opacity-90 group-hover:opacity-100">
                ↗ sort of basic
              </span>
            </span>{" "}
            retirement calculator.
          </p>
          <p>
            Get personalized projections, discover your retirement date, and see
            exactly how much you need to save.
          </p>
        </div>

        {/* Value Proposition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto text-gray-700 dark:text-gray-200">
          <div className="p-6 rounded-xl shadow-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-lg mb-2">Know Your Number</h3>
            <p className="text-sm">
              Find out exactly how much you need to retire comfortably
            </p>
          </div>

          <div className="p-6 rounded-xl shadow-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="font-semibold text-lg mb-2">See Your Growth</h3>
            <p className="text-sm">
              Visualize how your investments will compound over decades
            </p>
          </div>

          <div className="p-6 rounded-xl shadow-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="text-3xl mb-3">⏰</div>
            <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
            <p className="text-sm">
              Get a live countdown to your retirement date
            </p>
          </div>
        </div>
      </div>

      {/* Key Features Overview */}
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
          Everything You Need to Plan Retirement
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-white/80 border border-gray-200 hover:bg-white dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-100">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="p-8 rounded-2xl shadow-lg mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 dark:from-blue-900/50 dark:to-purple-900/50 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Ready to Start Planning?
        </h3>
        <p className="mb-6 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          Fill out the form below to get your personalized retirement
          projections. It takes just 2 minutes and you&apos;ll get instant
          results with interactive charts and detailed analysis.
        </p>

        {/* Benefits Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto text-left text-gray-700 dark:text-gray-200">
          {[
            "✅ Your exact retirement date",
            "✅ Monthly savings target",
            "✅ Interactive growth charts",
            "✅ Smart spending analysis",
          ].map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm font-medium">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
