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

  const renderDataRow = (
    label: string,
    valueA: string | number | null | undefined,
    valueB: string | number | null | undefined,
    higherIsBetter = true,
    numA?: number | null,
    numB?: number | null
  ) => {
    const displayA = valueA == null || valueA === "" || Number.isNaN(valueA) ? "—" : valueA;
    const displayB = valueB == null || valueB === "" || Number.isNaN(valueB) ? "—" : valueB;

    let cleanA = numA;
    if (cleanA === undefined && valueA != null && displayA !== "—") {
      cleanA = typeof valueA === 'string' ? parseFloat(valueA.replace(/[^0-9.-]+/g, "")) : (valueA as number);
    }
    let cleanB = numB;
    if (cleanB === undefined && valueB != null && displayB !== "—") {
      cleanB = typeof valueB === 'string' ? parseFloat(valueB.replace(/[^0-9.-]+/g, "")) : (valueB as number);
    }

    const isAHigher = cleanA != null && cleanB != null && !Number.isNaN(cleanA) && !Number.isNaN(cleanB) && cleanA > cleanB;
    const isBHigher = cleanA != null && cleanB != null && !Number.isNaN(cleanA) && !Number.isNaN(cleanB) && cleanB > cleanA;

    return (
      <div className="grid grid-cols-2 py-3 border-b border-outline-variant/10">
        <div className="flex flex-col gap-1 pr-4">
          <span className="text-on_surface-variant font-inter text-[10px] uppercase tracking-widest">{label}</span>
          <span className={cn(
            "font-manrope sm:text-lg font-bold truncate",
            isAHigher ? (higherIsBetter ? "text-primary" : "text-tertiary") : "text-on_surface"
          )}>
            {displayA}
          </span>
        </div>
        <div className="flex flex-col gap-1 items-end text-right pl-4 border-l border-outline-variant/10">
          <span className="text-on_surface-variant font-inter text-[10px] uppercase tracking-widest">{label}</span>
          <span className={cn(
            "font-manrope sm:text-lg font-bold truncate",
            isBHigher ? (higherIsBetter ? "text-primary" : "text-tertiary") : "text-on_surface"
          )}>
            {displayB}
          </span>
        </div>
      </div>
    );
  };

  // Helper for computing percentages
  const pct = (part: number | null | undefined, total: number | null | undefined) => {
    if (!part || !total || total === 0) return null;
    return (part / total) * 100;
  };
  const formatPctStr = (val: number | null) => val != null ? `${val.toFixed(1)}%` : "—";
  const formatCombined = (val: number | null | undefined, total: number | null | undefined) => {
    if (val == null) return null;
    const pctVal = pct(val, total);
    return pctVal != null ? `${formatNumber(val)} (${pctVal.toFixed(1)}%)` : formatNumber(val);
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
          <div className="flex justify-between items-end border-b-2 border-primary/20 pb-4 sticky top-16 bg-background/95 backdrop-blur-sm z-10 pt-4">
            <div className="flex flex-col flex-1">
              <span className="text-on_surface-variant font-inter text-[10px] uppercase font-bold tracking-widest">Primary Context</span>
              <h2 className="text-primary font-manrope md:text-3xl text-xl font-bold truncate pr-2">{locA.GEO_NAME.split(",")[0]}</h2>
            </div>
            <div className="text-center bg-surface-container-low px-4 py-1 rounded-full text-primary font-manrope font-bold text-xs uppercase tracking-widest shrink-0">VS</div>
            <div className="flex flex-col items-end text-right flex-1">
              <span className="text-on_surface-variant font-inter text-[10px] uppercase font-bold tracking-widest">Secondary Context</span>
              <h2 className="text-primary font-manrope md:text-3xl text-xl font-bold truncate pl-2">{locB.GEO_NAME.split(",")[0]}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Left Column */}
            <div className="space-y-12">
              <div>
                <h3 className="text-primary font-manrope font-bold text-lg mb-6 accent-bar pl-6 uppercase tracking-wider text-[10px]">Population</h3>
                <div className="card-tonal p-6 rounded-xl border border-outline-variant/10">
                  {renderDataRow("Total Population (2021)", formatNumber(locA.POP_2021), formatNumber(locB.POP_2021), true, locA.POP_2021, locB.POP_2021)}
                  {renderDataRow("Population Growth", formatPctStr(locA.POP_CHANGE_PCT), formatPctStr(locB.POP_CHANGE_PCT), true, locA.POP_CHANGE_PCT, locB.POP_CHANGE_PCT)}
                  {renderDataRow("Growth Rank", locA.RANK_POP_GROWTH ? `#${locA.RANK_POP_GROWTH}` : null, locB.RANK_POP_GROWTH ? `#${locB.RANK_POP_GROWTH}` : null, false, locA.RANK_POP_GROWTH, locB.RANK_POP_GROWTH)}
                  {renderDataRow("Average Age", locA.POP_AVG_AGE, locB.POP_AVG_AGE, false)}
                  {renderDataRow("Median Age", locA.POP_MEDIAN_AGE, locB.POP_MEDIAN_AGE, false)}
                  {renderDataRow("Age Rank", locA.RANK_AVG_AGE ? `#${locA.RANK_AVG_AGE}` : null, locB.RANK_AVG_AGE ? `#${locB.RANK_AVG_AGE}` : null, false, locA.RANK_AVG_AGE, locB.RANK_AVG_AGE)}
                  {renderDataRow("Male %", formatPctStr(locA.POP_MALE_PCT), formatPctStr(locB.POP_MALE_PCT), true, locA.POP_MALE_PCT, locB.POP_MALE_PCT)}
                  {renderDataRow("Female %", formatPctStr(locA.POP_FEMALE_PCT), formatPctStr(locB.POP_FEMALE_PCT), true, locA.POP_FEMALE_PCT, locB.POP_FEMALE_PCT)}
                  {renderDataRow("M:F Ratio", locA.POP_MALE_TO_FEMALE_RATIO?.toFixed(3), locB.POP_MALE_TO_FEMALE_RATIO?.toFixed(3), true, locA.POP_MALE_TO_FEMALE_RATIO, locB.POP_MALE_TO_FEMALE_RATIO)}
                </div>
              </div>

              <div>
                <h3 className="text-primary font-manrope font-bold text-lg mb-6 accent-bar pl-6 uppercase tracking-wider text-[10px]">Households</h3>
                <div className="card-tonal p-6 rounded-xl border border-outline-variant/10">
                  {renderDataRow("Avg Household Size", locA.HH_AVG_SIZE, locB.HH_AVG_SIZE, true)}
                  {renderDataRow("Total Dwellings", formatNumber(locA.TOTAL_PRIVATE_DWELLINGS), formatNumber(locB.TOTAL_PRIVATE_DWELLINGS), true, locA.TOTAL_PRIVATE_DWELLINGS, locB.TOTAL_PRIVATE_DWELLINGS)}
                  {renderDataRow("1 Person %", formatPctStr(pct(locA.HH_SIZE_1_PERSON, locA.HH_SIZE_TOTAL)), formatPctStr(pct(locB.HH_SIZE_1_PERSON, locB.HH_SIZE_TOTAL)), true, pct(locA.HH_SIZE_1_PERSON, locA.HH_SIZE_TOTAL), pct(locB.HH_SIZE_1_PERSON, locB.HH_SIZE_TOTAL))}
                  {renderDataRow("2 Persons %", formatPctStr(pct(locA.HH_SIZE_2_PERSONS, locA.HH_SIZE_TOTAL)), formatPctStr(pct(locB.HH_SIZE_2_PERSONS, locB.HH_SIZE_TOTAL)), true, pct(locA.HH_SIZE_2_PERSONS, locA.HH_SIZE_TOTAL), pct(locB.HH_SIZE_2_PERSONS, locB.HH_SIZE_TOTAL))}
                  {renderDataRow("3+ Persons %", formatPctStr(pct((locA.HH_SIZE_3_PERSONS || 0) + (locA.HH_SIZE_4_PERSONS || 0) + (locA.HH_SIZE_5_PLUS_PERSONS || 0), locA.HH_SIZE_TOTAL)), formatPctStr(pct((locB.HH_SIZE_3_PERSONS || 0) + (locB.HH_SIZE_4_PERSONS || 0) + (locB.HH_SIZE_5_PLUS_PERSONS || 0), locB.HH_SIZE_TOTAL)), true, pct((locA.HH_SIZE_3_PERSONS || 0) + (locA.HH_SIZE_4_PERSONS || 0) + (locA.HH_SIZE_5_PLUS_PERSONS || 0), locA.HH_SIZE_TOTAL), pct((locB.HH_SIZE_3_PERSONS || 0) + (locB.HH_SIZE_4_PERSONS || 0) + (locB.HH_SIZE_5_PLUS_PERSONS || 0), locB.HH_SIZE_TOTAL))}
                  {renderDataRow("Couples w/ Children %", formatPctStr(pct(locA.HH_TYPE_COUPLE_WITH_CHILDREN, locA.HH_TYPE_TOTAL)), formatPctStr(pct(locB.HH_TYPE_COUPLE_WITH_CHILDREN, locB.HH_TYPE_TOTAL)), true, pct(locA.HH_TYPE_COUPLE_WITH_CHILDREN, locA.HH_TYPE_TOTAL), pct(locB.HH_TYPE_COUPLE_WITH_CHILDREN, locB.HH_TYPE_TOTAL))}
                  {renderDataRow("One-parent Families %", formatPctStr(pct(locA.HH_TYPE_ONE_PARENT, locA.HH_TYPE_TOTAL)), formatPctStr(pct(locB.HH_TYPE_ONE_PARENT, locB.HH_TYPE_TOTAL)), true, pct(locA.HH_TYPE_ONE_PARENT, locA.HH_TYPE_TOTAL), pct(locB.HH_TYPE_ONE_PARENT, locB.HH_TYPE_TOTAL))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-12">
              <div>
                <h3 className="text-primary font-manrope font-bold text-lg mb-6 accent-bar pl-6 uppercase tracking-wider text-[10px]">Incomes</h3>
                <div className="card-tonal p-6 rounded-xl border border-outline-variant/10">
                  {renderDataRow("Avg Income (HH)", formatCurrency(locA.HH_INCOME_AVG_AFTER_TAX), formatCurrency(locB.HH_INCOME_AVG_AFTER_TAX), true, locA.HH_INCOME_AVG_AFTER_TAX, locB.HH_INCOME_AVG_AFTER_TAX)}
                  {renderDataRow("Median Income (HH)", formatCurrency(locA.HH_INCOME_MEDIAN_AFTER_TAX), formatCurrency(locB.HH_INCOME_MEDIAN_AFTER_TAX), true, locA.HH_INCOME_MEDIAN_AFTER_TAX, locB.HH_INCOME_MEDIAN_AFTER_TAX)}
                  {renderDataRow("Avg Individual Income", formatCurrency(locA.INCOME_AVG_AFTER_TAX), formatCurrency(locB.INCOME_AVG_AFTER_TAX), true, locA.INCOME_AVG_AFTER_TAX, locB.INCOME_AVG_AFTER_TAX)}
                  {renderDataRow("Median Ind. Income", formatCurrency(locA.INCOME_MEDIAN_AFTER_TAX), formatCurrency(locB.INCOME_MEDIAN_AFTER_TAX), true, locA.INCOME_MEDIAN_AFTER_TAX, locB.INCOME_MEDIAN_AFTER_TAX)}
                  {renderDataRow("Income Rank", locA.RANK_HH_INCOME ? `#${locA.RANK_HH_INCOME}` : null, locB.RANK_HH_INCOME ? `#${locB.RANK_HH_INCOME}` : null, false, locA.RANK_HH_INCOME, locB.RANK_HH_INCOME)}
                  {renderDataRow("Market Income %", formatPctStr(locA.INCOME_COMP_MARKET_PCT), formatPctStr(locB.INCOME_COMP_MARKET_PCT), true, locA.INCOME_COMP_MARKET_PCT, locB.INCOME_COMP_MARKET_PCT)}
                  {renderDataRow("Employment Income %", formatPctStr(locA.INCOME_COMP_EMPLOYMENT_PCT), formatPctStr(locB.INCOME_COMP_EMPLOYMENT_PCT), true, locA.INCOME_COMP_EMPLOYMENT_PCT, locB.INCOME_COMP_EMPLOYMENT_PCT)}
                  {renderDataRow("Govt Transfers %", formatPctStr(locA.INCOME_COMP_GOVT_TRANSFERS_PCT), formatPctStr(locB.INCOME_COMP_GOVT_TRANSFERS_PCT), false, locA.INCOME_COMP_GOVT_TRANSFERS_PCT, locB.INCOME_COMP_GOVT_TRANSFERS_PCT)}
                </div>
              </div>

              <div>
                <h3 className="text-primary font-manrope font-bold text-lg mb-6 accent-bar pl-6 uppercase tracking-wider text-[10px]">Employment</h3>
                <div className="card-tonal p-6 rounded-xl border border-outline-variant/10">
                  {renderDataRow("Employment Rate", formatPctStr(locA.LABOUR_EMPLOYMENT_RATE), formatPctStr(locB.LABOUR_EMPLOYMENT_RATE), true, locA.LABOUR_EMPLOYMENT_RATE, locB.LABOUR_EMPLOYMENT_RATE)}
                  {renderDataRow("Unemployment Rate", formatPctStr(locA.LABOUR_UNEMPLOYMENT_RATE), formatPctStr(locB.LABOUR_UNEMPLOYMENT_RATE), false, locA.LABOUR_UNEMPLOYMENT_RATE, locB.LABOUR_UNEMPLOYMENT_RATE)}
                  {renderDataRow("Total Labour Force", formatNumber(locA.LABOUR_IN_FORCE), formatNumber(locB.LABOUR_IN_FORCE), true, locA.LABOUR_IN_FORCE, locB.LABOUR_IN_FORCE)}
                  {renderDataRow("Overall Low-Income %", formatPctStr(locA.LOW_INCOME_PCT), formatPctStr(locB.LOW_INCOME_PCT), false, locA.LOW_INCOME_PCT, locB.LOW_INCOME_PCT)}
                  {renderDataRow("Child (0-17) Low-Income %", formatPctStr(locA.LOW_INCOME_0_17_PCT), formatPctStr(locB.LOW_INCOME_0_17_PCT), false, locA.LOW_INCOME_0_17_PCT, locB.LOW_INCOME_0_17_PCT)}
                  {renderDataRow("Senior (65+) Low-Income %", formatPctStr(locA.LOW_INCOME_65_PLUS_PCT), formatPctStr(locB.LOW_INCOME_65_PLUS_PCT), false, locA.LOW_INCOME_65_PLUS_PCT, locB.LOW_INCOME_65_PLUS_PCT)}
                </div>
              </div>

              <div>
                <h3 className="text-primary font-manrope font-bold text-lg mb-6 accent-bar pl-6 uppercase tracking-wider text-[10px]">Languages</h3>
                <div className="card-tonal p-6 rounded-xl border border-outline-variant/10">
                  {renderDataRow("English Only", formatCombined(locA.LANG_KNOWLEDGE_EN_ONLY, locA.LANG_KNOWLEDGE_TOTAL), formatCombined(locB.LANG_KNOWLEDGE_EN_ONLY, locB.LANG_KNOWLEDGE_TOTAL), true, pct(locA.LANG_KNOWLEDGE_EN_ONLY, locA.LANG_KNOWLEDGE_TOTAL), pct(locB.LANG_KNOWLEDGE_EN_ONLY, locB.LANG_KNOWLEDGE_TOTAL))}
                  {renderDataRow("French Only", formatCombined(locA.LANG_KNOWLEDGE_FR_ONLY, locA.LANG_KNOWLEDGE_TOTAL), formatCombined(locB.LANG_KNOWLEDGE_FR_ONLY, locB.LANG_KNOWLEDGE_TOTAL), true, pct(locA.LANG_KNOWLEDGE_FR_ONLY, locA.LANG_KNOWLEDGE_TOTAL), pct(locB.LANG_KNOWLEDGE_FR_ONLY, locB.LANG_KNOWLEDGE_TOTAL))}
                  {renderDataRow("English & French", formatCombined(locA.LANG_KNOWLEDGE_EN_AND_FR, locA.LANG_KNOWLEDGE_TOTAL), formatCombined(locB.LANG_KNOWLEDGE_EN_AND_FR, locB.LANG_KNOWLEDGE_TOTAL), true, pct(locA.LANG_KNOWLEDGE_EN_AND_FR, locA.LANG_KNOWLEDGE_TOTAL), pct(locB.LANG_KNOWLEDGE_EN_AND_FR, locB.LANG_KNOWLEDGE_TOTAL))}
                  {renderDataRow("Neither", formatCombined(locA.LANG_KNOWLEDGE_NEITHER, locA.LANG_KNOWLEDGE_TOTAL), formatCombined(locB.LANG_KNOWLEDGE_NEITHER, locB.LANG_KNOWLEDGE_TOTAL), false, pct(locA.LANG_KNOWLEDGE_NEITHER, locA.LANG_KNOWLEDGE_TOTAL), pct(locB.LANG_KNOWLEDGE_NEITHER, locB.LANG_KNOWLEDGE_TOTAL))}
                  <div className="py-2 border-b border-outline-variant/5"></div>
                  {renderDataRow("Mother Tongue EN", formatCombined(locA.MOTHER_TONGUE_EN, locA.MOTHER_TONGUE_TOTAL), formatCombined(locB.MOTHER_TONGUE_EN, locB.MOTHER_TONGUE_TOTAL), true, pct(locA.MOTHER_TONGUE_EN, locA.MOTHER_TONGUE_TOTAL), pct(locB.MOTHER_TONGUE_EN, locB.MOTHER_TONGUE_TOTAL))}
                  {renderDataRow("Mother Tongue FR", formatCombined(locA.MOTHER_TONGUE_FR, locA.MOTHER_TONGUE_TOTAL), formatCombined(locB.MOTHER_TONGUE_FR, locB.MOTHER_TONGUE_TOTAL), true, pct(locA.MOTHER_TONGUE_FR, locA.MOTHER_TONGUE_TOTAL), pct(locB.MOTHER_TONGUE_FR, locB.MOTHER_TONGUE_TOTAL))}
                  {renderDataRow("Non-official", formatCombined(locA.MOTHER_TONGUE_NON_OFFICIAL, locA.MOTHER_TONGUE_TOTAL), formatCombined(locB.MOTHER_TONGUE_NON_OFFICIAL, locB.MOTHER_TONGUE_TOTAL), true, pct(locA.MOTHER_TONGUE_NON_OFFICIAL, locA.MOTHER_TONGUE_TOTAL), pct(locB.MOTHER_TONGUE_NON_OFFICIAL, locB.MOTHER_TONGUE_TOTAL))}
                </div>
              </div>
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
