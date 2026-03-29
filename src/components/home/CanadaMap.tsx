"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { useRouter } from "next/navigation";
import { CITY_COORDINATES } from "@/lib/city-coordinates";

const geoUrl = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/canada.geojson";

// Top 15 cities by 2021 population
const TOP_15 = new Set([
  "Toronto", "Montréal", "Montreal", "Calgary", "Ottawa", "Edmonton",
  "Winnipeg", "Vancouver", "Mississauga", "Brampton", "Hamilton",
  "Surrey", "Québec", "Quebec City", "Halifax",
]);

// Cities whose labels are hidden by default (shown on hover) due to geographic density
const HIDE_LABEL = new Set([
  "Brampton", "Mississauga", "Hamilton", "Surrey",
]);

// Label offsets — only need entries for the 11 always-visible cities
const LABEL_OFFSETS: Record<string, { dx: number; dy: number; align: "start" | "end" | "middle" }> = {
  "Toronto":     { dx: 14,  dy: 5,   align: "start" },
  "Montréal":    { dx: 14,  dy: 14,  align: "start" },
  "Montreal":    { dx: 14,  dy: 14,  align: "start" },
  "Calgary":     { dx: 14,  dy: 5,   align: "start" },
  "Ottawa":      { dx: -14, dy: -4,  align: "end" },
  "Edmonton":    { dx: 14,  dy: -8,  align: "start" },
  "Winnipeg":    { dx: 0,   dy: 20,  align: "middle" },
  "Vancouver":   { dx: 14,  dy: 5,   align: "start" },
  "Québec":      { dx: 14,  dy: -8,  align: "start" },
  "Quebec City": { dx: 14,  dy: -8,  align: "start" },
  "Halifax":     { dx: 14,  dy: 5,   align: "start" },
  // Hover-only cities still need offsets for when they appear
  "Mississauga": { dx: -14, dy: 5,   align: "end" },
  "Brampton":    { dx: -14, dy: -10, align: "end" },
  "Hamilton":    { dx: -14, dy: 14,  align: "end" },
  "Surrey":      { dx: 14,  dy: 14,  align: "start" },
};

export default function CanadaMap({ cities }: { cities: any[] }) {
  const [activeCity, setActiveCity] = useState<any | null>(null);
  const router = useRouter();

  // Filter to only the top 15
  const filteredCities = cities.filter((city) => {
    const cleanName = city.GEO_NAME.split(",")[0];
    return TOP_15.has(cleanName);
  });

  return (
    <div className="w-full h-full bg-surface-container-low overflow-hidden group flex flex-col md:flex-row">
      {/* Map Content - Left Aligned */}
      <div className="flex-1 relative min-h-[400px]">
        <ComposableMap
          projection="geoAzimuthalEqualArea"
          projectionConfig={{
            rotate: [96, -60, 0],
            center: [5, 2],
            scale: 750,
          }}
          className="w-full h-full absolute inset-0"
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#e2e6f2"
                  stroke="#c7cce0"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "#d0d5e8" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {filteredCities.map((city) => {
            const cleanName = city.GEO_NAME.split(",")[0];
            const coords = CITY_COORDINATES[cleanName];
            if (!coords) return null;

            const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
            const labelConfig = LABEL_OFFSETS[cleanName] || { dx: 0, dy: 18, align: "middle" };
            const isActive = activeCity?.GEO_NAME === city.GEO_NAME;
            const showLabel = !HIDE_LABEL.has(cleanName) || isActive;

            return (
              <Marker key={city.GEO_NAME} coordinates={coords}>
                <circle
                  r={isActive ? 8 : 5}
                  className={`${isActive ? "fill-tertiary" : "fill-primary"} stroke-white cursor-pointer transition-all duration-200`}
                  strokeWidth={2}
                  onMouseEnter={() => setActiveCity(city)}
                  onMouseLeave={() => setActiveCity(null)}
                  onClick={() => router.push(`/location/${slug}`)}
                />
                {showLabel && (
                  <text
                    x={labelConfig.dx}
                    y={labelConfig.dy}
                    textAnchor={labelConfig.align}
                    className={`font-inter text-[11px] font-bold pointer-events-none select-none drop-shadow-sm ${isActive ? "fill-tertiary" : "fill-on_surface-variant"}`}
                  >
                    {cleanName}
                  </text>
                )}
              </Marker>
            );
          })}
        </ComposableMap>
      </div>

      {/* Hover Details Panel - Right */}
      <div className="w-full md:w-[320px] lg:w-[380px] bg-surface-dim/30 backdrop-blur-sm border-l border-outline-variant/20 flex flex-col justify-center p-8 transition-all shrink-0">
        {activeCity ? (
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xl border border-outline-variant/30">
            <div className="mb-4 bg-primary text-white text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded inline-block">
              City Profile
            </div>
            <h4 className="text-primary font-manrope font-extrabold text-2xl mb-1 tracking-tight">
              {activeCity.GEO_NAME.split(",")[0]}
            </h4>
            <div className="w-12 h-1 bg-tertiary mb-6 rounded-full" />

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                <span className="font-bold text-on_surface-variant text-xs uppercase tracking-wider">Population</span>
                <span className="text-primary font-black text-lg">{(activeCity.POP_2021).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                <span className="font-bold text-on_surface-variant text-xs uppercase tracking-wider">Avg Age</span>
                <span className="text-primary font-black text-lg">{activeCity.POP_AVG_AGE} <span className="text-xs text-on_surface-variant font-medium">yrs</span></span>
              </div>
              {activeCity.HH_INCOME_MEDIAN_AFTER_TAX && (
                <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                  <span className="font-bold text-on_surface-variant text-xs uppercase tracking-wider">Median Income</span>
                  <span className="text-primary font-black text-lg">${(activeCity.HH_INCOME_MEDIAN_AFTER_TAX / 1000).toFixed(0)}<span className="text-xs text-on_surface-variant font-medium">k</span></span>
                </div>
              )}
            </div>

            <button
              onClick={() => router.push(`/location/${activeCity.GEO_NAME.split(",")[0].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`)}
              className="mt-6 w-full py-3 bg-primary hover:bg-tertiary text-white font-bold rounded-xl transition-colors text-sm tracking-wide shadow-md"
            >
              View Full Dataset
            </button>
          </div>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-outline-variant/30 rounded-2xl bg-surface-container/20 text-center text-on_surface-variant">
            <svg className="w-12 h-12 mb-4 opacity-40 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-manrope font-bold text-lg mb-2 text-primary">Interactive Atlas</h3>
            <p className="text-sm">Hover over any marked city on the map to explore top-level census demographics.</p>
          </div>
        )}
      </div>
    </div>
  );
}
