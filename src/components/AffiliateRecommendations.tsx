"use client";

import { useState } from "react";

interface AffiliateProduct {
  id: string;
  name: string;
  category: "Investment" | "Banking" | "Education" | "Tools";
  description: string;
  benefits: string[];
  placeholder_url: string;
  actual_url?: string; // You'll replace this with your actual affiliate URLs
  cta: string;
  badge?: string;
  rating?: number;
}

// Placeholder affiliate products - replace with your actual affiliate links
const affiliateProducts: AffiliateProduct[] = [
  {
    id: "investment-platform",
    name: "Investment Platform",
    category: "Investment",
    description: "Low-cost index funds and ETFs to build your retirement portfolio",
    benefits: [
      "0% commission on stock trades",
      "Low expense ratio index funds",
      "Automatic rebalancing",
      "Tax-loss harvesting"
    ],
    placeholder_url: "https://example-investment-platform.com/ref=retiriva",
    cta: "Start Investing",
    badge: "Most Popular",
    rating: 4.8
  },
  {
    id: "high-yield-savings",
    name: "High-Yield Savings Account",
    category: "Banking", 
    description: "Build your emergency fund with competitive interest rates",
    benefits: [
      "4.5% APY (current rate)",
      "No minimum balance",
      "FDIC insured",
      "No monthly fees"
    ],
    placeholder_url: "https://example-bank.com/savings/ref=retiriva",
    cta: "Open Account",
    rating: 4.6
  },
  {
    id: "retirement-course",
    name: "Retirement Planning Course",
    category: "Education",
    description: "Comprehensive guide to retirement planning and wealth building",
    benefits: [
      "Step-by-step retirement roadmap",
      "Investment strategy templates",
      "Tax optimization strategies",
      "Lifetime access + updates"
    ],
    placeholder_url: "https://example-course.com/retirement-mastery/ref=retiriva",
    cta: "Learn More",
    badge: "Editor's Choice"
  },
  {
    id: "budgeting-app",
    name: "Personal Finance App",
    category: "Tools",
    description: "Track spending, set savings goals, and automate your finances",
    benefits: [
      "Automatic expense categorization",
      "Savings goal tracking",
      "Investment portfolio sync",
      "Bill reminder notifications"
    ],
    placeholder_url: "https://example-finance-app.com/signup?ref=retiriva",
    cta: "Try Free",
    rating: 4.4
  },
  {
    id: "robo-advisor",
    name: "Robo-Advisor Service",
    category: "Investment",
    description: "Automated portfolio management with professional oversight", 
    benefits: [
      "Automated rebalancing",
      "Tax-loss harvesting",
      "Goal-based investing",
      "Professional oversight"
    ],
    placeholder_url: "https://example-robo-advisor.com/start?ref=retiriva",
    cta: "Get Started",
    rating: 4.7
  },
  {
    id: "retirement-book",
    name: "Retirement Planning Book",
    category: "Education",
    description: "Bestselling guide to achieving financial independence",
    benefits: [
      "Proven FIRE strategies",
      "Real case studies",
      "Step-by-step action plans",
      "Bonus calculator spreadsheets"
    ],
    placeholder_url: "https://example-bookstore.com/retirement-guide/ref=retiriva",
    cta: "Buy Now"
  }
];

const categoryColors = {
  Investment: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Banking: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300", 
  Education: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Tools: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
};

interface AffiliateRecommendationsProps {
  showTitle?: boolean;
  maxItems?: number;
  categories?: Array<"Investment" | "Banking" | "Education" | "Tools">;
}

export default function AffiliateRecommendations({
  showTitle = true,
  maxItems,
  categories
}: AffiliateRecommendationsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  // Filter products based on props
  let filteredProducts = affiliateProducts;
  
  if (categories && categories.length > 0) {
    filteredProducts = filteredProducts.filter(product => 
      categories.includes(product.category)
    );
  }
  
  if (selectedCategory !== "All") {
    filteredProducts = filteredProducts.filter(product => 
      product.category === selectedCategory
    );
  }
  
  if (maxItems) {
    filteredProducts = filteredProducts.slice(0, maxItems);
  }

  const allCategories = ["All", ...Array.from(new Set(affiliateProducts.map(p => p.category)))];
  
  const handleAffiliateClick = (product: AffiliateProduct) => {
    // In production, you'd track clicks here for analytics
    console.log(`Affiliate click: ${product.name}`);
    
    // Use actual_url if available, otherwise use placeholder_url  
    const url = product.actual_url || product.placeholder_url;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full">
      {showTitle && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Recommended Tools & Resources</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            These are the tools and services we recommend to help you on your retirement planning journey. 
            Some links are affiliate partnerships that help support this site.
          </p>
        </div>
      )}

      {/* Category Filter */}
      {!categories && (
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="p-6">
              {/* Header with badge */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[product.category]}`}>
                    {product.category}
                  </span>
                  {product.badge && (
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-xs font-medium">
                      {product.badge}
                    </span>
                  )}
                </div>
                {product.rating && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-yellow-400 mr-1">★</span>
                    {product.rating}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                {product.description}
              </p>

              {/* Benefits */}
              <ul className="space-y-2 mb-6">
                {product.benefits.slice(0, 3).map((benefit, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                    <span className="text-green-500 mr-2 mt-0.5">✓</span>
                    {benefit}
                  </li>
                ))}
                {product.benefits.length > 3 && (
                  <li className="text-sm text-gray-500 dark:text-gray-400">
                    +{product.benefits.length - 3} more benefits
                  </li>
                )}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleAffiliateClick(product)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                {product.cta}
              </button>

              {/* Affiliate Notice */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Affiliate link - supports this site at no cost to you
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No products found for the selected category.
          </p>
        </div>
      )}
    </div>
  );
}
