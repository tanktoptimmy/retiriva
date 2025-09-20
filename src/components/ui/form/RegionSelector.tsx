import React from "react";
import { Region, getRegionalConfig } from "@/utils/retirementEngine";
import Tooltip from "../../ui/Tooltip";

interface RegionSelectorProps {
  value: Region;
  onChange: (region: Region) => void;
}

export const RegionSelector = ({ value, onChange }: RegionSelectorProps) => {
  const currentRegionConfig = getRegionalConfig(value || "UK");

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <label className="font-medium">Region</label>
        <Tooltip
          content="Select your country to get appropriate pension calculations, inflation rates, and currency defaults."
        >
          <span className="text-sm cursor-help text-blue-600 dark:text-blue-400">
            ℹ️
          </span>
        </Tooltip>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange("UK")}
          className={`px-4 py-2 rounded-md border transition-colors flex-1 ${
            (value || "UK") === "UK"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white hover:bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:text-gray-100"
          }`}
        >
          🇬🇧 UK
        </button>
        <button
          type="button"
          onClick={() => onChange("US")}
          className={`px-4 py-2 rounded-md border transition-colors flex-1 ${
            value === "US"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white hover:bg-gray-50 border-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:text-gray-100"
          }`}
        >
          🇺🇸 US
        </button>
      </div>
      <div className="text-xs mt-2 text-gray-600 dark:text-gray-400">
        📊 Using {value || "UK"} regional defaults:{" "}
        {currentRegionConfig.inflationRate}% inflation,{" "}
        {currentRegionConfig.expectedReturn}% returns,{" "}
        {currentRegionConfig.currency}
        {currentRegionConfig.statePensionAmount.toLocaleString()}/year
        state pension
      </div>
    </div>
  );
};
