"use client";

interface AffiliateBannerProps {
  variant?: "compact" | "featured";
  product?: {
    name: string;
    description: string;
    cta: string;
    url: string;
    badge?: string;
  };
}

// Default placeholder product
const defaultProduct = {
  name: "Recommended Investment Platform",
  description: "Start building your retirement portfolio with commission-free trades and low-cost index funds.",
  cta: "Get Started",
  url: "https://example-investment-platform.com/ref=retiriva",
  badge: "Popular Choice"
};

export default function AffiliateBanner({ 
  variant = "compact", 
  product = defaultProduct 
}: AffiliateBannerProps) {
  const handleClick = () => {
    console.log(`Affiliate banner click: ${product.name}`);
    window.open(product.url, '_blank', 'noopener,noreferrer');
  };

  if (variant === "compact") {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 my-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                💡 Recommended
              </span>
              {product.badge && (
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded-full font-medium">
                  {product.badge}
                </span>
              )}
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
              {product.name}
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-xs mt-1 line-clamp-2">
              {product.description}
            </p>
          </div>
          <button
            onClick={handleClick}
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
          >
            {product.cta}
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Affiliate partnership - supports this site at no cost to you
        </p>
      </div>
    );
  }

  // Featured variant
  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-6 my-8 shadow-lg">
      <div className="text-center">
        <div className="flex justify-center items-center gap-2 mb-3">
          <span className="text-blue-600 text-2xl">🚀</span>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
            Recommended Tool
          </span>
          {product.badge && (
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs rounded-full font-medium">
              {product.badge}
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
          {product.description}
        </p>
        
        <button
          onClick={handleClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
        >
          {product.cta}
        </button>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          Affiliate partnership - we may earn a commission at no cost to you
        </p>
      </div>
    </div>
  );
}
