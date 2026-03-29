"use client";

import { useState } from "react";
import Link from "next/link";

interface CityRow {
  ALT_GEO_CODE: string | number;
  GEO_NAME: string;
  slug: string;
  POP_2021: number;
  POP_CHANGE_PCT: number;
  POP_AVG_AGE: number;
  HH_INCOME_MEDIAN_AFTER_TAX: number;
  LABOUR_EMPLOYMENT_RATE: number;
}

type SortKey = "name" | "pop" | "growth" | "age" | "income" | "employment";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string; hideClass?: string }[] = [
  { key: "name", label: "Location" },
  { key: "pop", label: "Population (2021)" },
  { key: "growth", label: "Growth", hideClass: "hidden sm:table-cell" },
  { key: "age", label: "Avg Age", hideClass: "hidden md:table-cell" },
  { key: "income", label: "Median Income", hideClass: "hidden lg:table-cell" },
  { key: "employment", label: "Employment Rate", hideClass: "hidden lg:table-cell" },
];

function getValue(city: CityRow, key: SortKey): number | string {
  switch (key) {
    case "name": return city.GEO_NAME.split(",")[0].toLowerCase();
    case "pop": return city.POP_2021 ?? 0;
    case "growth": return city.POP_CHANGE_PCT ?? 0;
    case "age": return city.POP_AVG_AGE ?? 0;
    case "income": return city.HH_INCOME_MEDIAN_AFTER_TAX ?? 0;
    case "employment": return city.LABOUR_EMPLOYMENT_RATE ?? 0;
  }
}

export default function SortableLocationTable({
  cities,
  provinceName,
}: {
  cities: CityRow[];
  provinceName: string;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("pop");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  };

  const sorted = [...cities].sort((a, b) => {
    const va = getValue(a, sortKey);
    const vb = getValue(b, sortKey);
    if (typeof va === "string" && typeof vb === "string") {
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    }
    return sortDir === "asc"
      ? (va as number) - (vb as number)
      : (vb as number) - (va as number);
  });

  const arrow = (key: SortKey) => {
    if (sortKey !== key) return <span className="ml-1 opacity-0 group-hover/th:opacity-40">↕</span>;
    return <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-primary font-manrope text-headline-sm mb-4 accent-bar pl-6">
          Cities &amp; Towns in {provinceName}
        </h2>
        <p className="text-on_surface-variant font-inter text-sm mb-10 max-w-2xl">
          All {cities.length.toLocaleString()} census subdivisions in {provinceName}, sorted
          by {COLUMNS.find((c) => c.key === sortKey)?.label.toLowerCase() ?? "population"}.
          Click any column header to re-sort.
        </p>

        <div className="overflow-x-auto rounded-xl border border-outline-variant/20 shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30">
                <th className="px-4 py-3 font-manrope font-bold text-xs text-on_surface-variant uppercase tracking-wider w-12">
                  #
                </th>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={`group/th px-4 py-3 font-manrope font-bold text-xs text-on_surface-variant uppercase tracking-wider cursor-pointer select-none hover:text-primary transition-colors ${
                      col.key !== "name" ? "text-right" : ""
                    } ${col.hideClass ?? ""}`}
                  >
                    {col.label}
                    {arrow(col.key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((city, index) => {
                const cityName = city.GEO_NAME.split(",")[0];
                const growthPct = city.POP_CHANGE_PCT;
                return (
                  <tr
                    key={city.ALT_GEO_CODE}
                    className={`border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors ${
                      index % 2 === 0
                        ? "bg-surface-container-lowest"
                        : "bg-background"
                    }`}
                  >
                    <td className="px-4 py-3 font-inter text-xs text-on_surface-variant">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/location/${city.slug}`}
                        className="font-manrope font-bold text-sm text-primary hover:text-tertiary transition-colors underline-offset-2 hover:underline"
                      >
                        {cityName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-inter font-bold text-sm text-right">
                      {city.POP_2021?.toLocaleString() || "—"}
                    </td>
                    <td className="px-4 py-3 font-inter font-bold text-sm text-right hidden sm:table-cell">
                      {growthPct != null ? (
                        <span
                          className={
                            growthPct > 0
                              ? "text-green-600"
                              : growthPct < 0
                              ? "text-red-500"
                              : ""
                          }
                        >
                          {growthPct > 0 ? "+" : ""}
                          {growthPct.toFixed(1)}%
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 font-inter text-sm text-right hidden md:table-cell">
                      {city.POP_AVG_AGE?.toFixed(1) || "—"}
                    </td>
                    <td className="px-4 py-3 font-inter text-sm text-right hidden lg:table-cell">
                      {city.HH_INCOME_MEDIAN_AFTER_TAX
                        ? `$${(city.HH_INCOME_MEDIAN_AFTER_TAX / 1000).toFixed(0)}k`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 font-inter text-sm text-right hidden lg:table-cell">
                      {city.LABOUR_EMPLOYMENT_RATE
                        ? `${city.LABOUR_EMPLOYMENT_RATE.toFixed(1)}%`
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
