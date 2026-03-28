"use client";

import { useState } from "react";
import { LocationData } from "@/lib/data-utils";
import { formatNumber, formatPercent, formatCurrency, cn } from "@/lib/utils";

interface ComparisonInterfaceProps {
  locations: LocationData[];
}

export default function ComparisonInterface({ locations }: ComparisonInterfaceProps) {
  const [geoLevel, setGeoLevel] = useState<string>("Province");
  const [locA, setLocA] = useState<LocationData | null>(null);
  const [locB, setLocB] = useState<LocationData | null>(null);

  const filteredLocations = locations.filter((loc) => loc.GEO_LEVEL === geoLevel);
  const geoLevels = Array.from(new Set(locations.map((loc) => loc.GEO_LEVEL)));

  const handleGeoLevelChange = (level: string) => {
    setGeoLevel(level);
    setLocA(null);
    setLocB(null);
  };

  const renderDataRow = (label: string, valueA: string | number, valueB: string | number, higherIsBetter = true) => {
    const cleanA = typeof valueA === 'string' ? parseFloat(valueA.replace(/[^0-9.-]+/g, "")) : valueA;
    const cleanB = typeof valueB === 'string' ? parseFloat(valueB.replace(/[^0-9.-]+/g, "")) : valueB;
    
    const isAHigher = cleanA > cleanB;
    const isBHigher = cleanB > cleanA;
    
    return (
      <div className="grid grid-cols-2 py-4 border-b border-outline-variant/5">
        <div className="flex flex-col gap-1">
          <span className="text-on_surface-variant font-inter text-[10px] uppercase tracking-widest">{label}</span>
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-manrope text-xl font-bold",
              isAHigher ? (higherIsBetter ? "text-primary" : "text-tertiary") : ""
            )}>
              {valueA}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-end text-right">
          <span className="text-on_surface-variant font-inter text-[10px] uppercase tracking-widest">{label}</span>
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-manrope text-xl font-bold",
              isBHigher ? (higherIsBetter ? "text-primary" : "text-tertiary") : ""
            )}>
              {valueB}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Selector Interface */}
      <div className="glass p-8 rounded-md shadow-ambient border border-outline-variant/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-primary font-manrope font-bold text-xs uppercase tracking-widest">Select Level</label>
            <select 
              className="bg-surface-container-low p-3 rounded-md border-none ring-1 ring-outline-variant/20 focus:ring-primary/40 font-inter text-sm outline-none"
              value={geoLevel}
              onChange={(e) => handleGeoLevelChange(e.target.value)}
            >
              {geoLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-primary font-manrope font-bold text-xs uppercase tracking-widest">Location A</label>
            <select 
              className="bg-surface-container-low p-3 rounded-md border-none ring-1 ring-outline-variant/20 focus:ring-primary/40 font-inter text-sm outline-none"
              value={locA?.ALT_GEO_CODE || ""}
              onChange={(e) => setLocA(filteredLocations.find(l => String(l.ALT_GEO_CODE) === e.target.value) || null)}
            >
              <option value="">Select Location...</option>
              {filteredLocations.map((loc) => (
                <option key={loc.ALT_GEO_CODE} value={loc.ALT_GEO_CODE}>{loc.GEO_NAME}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-primary font-manrope font-bold text-xs uppercase tracking-widest">Location B</label>
            <select 
              className="bg-surface-container-low p-3 rounded-md border-none ring-1 ring-outline-variant/20 focus:ring-primary/40 font-inter text-sm outline-none"
              value={locB?.ALT_GEO_CODE || ""}
              onChange={(e) => setLocB(filteredLocations.find(l => String(l.ALT_GEO_CODE) === e.target.value) || null)}
            >
              <option value="">Select Location...</option>
              {filteredLocations.map((loc) => (
                <option key={loc.ALT_GEO_CODE} value={loc.ALT_GEO_CODE}>{loc.GEO_NAME}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Results */}
      {locA && locB ? (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-end border-b-2 border-primary/20 pb-4">
            <div className="flex flex-col">
              <span className="text-on_surface-variant font-inter text-[10px] uppercase font-bold tracking-widest">Primary Context</span>
              <h2 className="text-primary font-manrope text-3xl font-bold">{locA.GEO_NAME}</h2>
            </div>
            <div className="text-center bg-surface-container-low px-4 py-1 rounded-full text-primary font-manrope font-bold text-xs uppercase tracking-widest">VS</div>
            <div className="flex flex-col items-end text-right">
              <span className="text-on_surface-variant font-inter text-[10px] uppercase font-bold tracking-widest">Secondary Context</span>
              <h2 className="text-primary font-manrope text-3xl font-bold">{locB.GEO_NAME}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32">
            <div>
              <h3 className="text-primary font-manrope font-bold text-lg mb-6 accent-bar pl-6 uppercase tracking-wider text-[10px]">Vital Metrics</h3>
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-tertiary mb-3 uppercase tracking-wider">Demographics</h4>
                {renderDataRow("Total Population", formatNumber(locA.POP_2021), formatNumber(locB.POP_2021))}
                {renderDataRow("Average Age", locA.POP_AVG_AGE, locB.POP_AVG_AGE, false)}
                {renderDataRow("Population Growth", formatPercent(locA.POP_CHANGE_PCT), formatPercent(locB.POP_CHANGE_PCT))}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-tertiary mb-3 uppercase tracking-wider">Economic Strength</h4>
                {renderDataRow("Median Income (HH)", formatCurrency(locA.HH_INCOME_MEDIAN_AFTER_TAX), formatCurrency(locB.HH_INCOME_MEDIAN_AFTER_TAX))}
                {renderDataRow("Avg Income (HH)", formatCurrency(locA.HH_INCOME_AVG_AFTER_TAX), formatCurrency(locB.HH_INCOME_AVG_AFTER_TAX))}
              </div>
              {renderDataRow("Income Rank", `#${locA.RANK_HH_INCOME}`, `#${locB.RANK_HH_INCOME}`, false)}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center bg-surface-container-low rounded-md border border-dashed border-outline-variant/40">
          <p className="text-on_surface-variant font-inter font-medium">Please select two locations above to visualize side-by-side data.</p>
        </div>
      )}
    </div>
  );
}
