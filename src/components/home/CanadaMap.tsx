"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { useRouter } from "next/navigation";
import { CITY_COORDINATES } from "@/lib/city-coordinates";

// URL for Canada GeoJSON
const geoUrl = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/canada.geojson";

// Dictionary to offset labels so they don't overlap in dense areas (e.g. GTA, Vancouver, Montreal)
const LABEL_OFFSETS: Record<string, { dx: number, dy: number, align: "start" | "end" | "middle" }> = {
  // ── GTA Cluster (spread radially from Toronto) ──
  "Toronto": { dx: 10, dy: 4, align: "start" },
  "Mississauga": { dx: -20, dy: 4, align: "end" },
  "Brampton": { dx: -20, dy: -8, align: "end" },
  "Vaughan": { dx: -20, dy: -20, align: "end" },
  "Richmond Hill": { dx: 10, dy: -18, align: "start" },
  "Markham": { dx: 15, dy: -8, align: "start" },
  "Oshawa": { dx: 12, dy: 4, align: "start" },
  "Oakville": { dx: -20, dy: 16, align: "end" },
  "Burlington": { dx: -25, dy: 8, align: "end" },
  // ── Golden Horseshoe ──
  "Hamilton": { dx: -20, dy: 14, align: "end" },
  "St. Catharines": { dx: 10, dy: 18, align: "start" },
  "Kitchener": { dx: -25, dy: 4, align: "end" },
  "Cambridge": { dx: -20, dy: 16, align: "end" },
  "Guelph": { dx: 12, dy: -10, align: "start" },
  "Barrie": { dx: 10, dy: -14, align: "start" },
  // ── SW Ontario ──
  "London": { dx: -10, dy: 14, align: "end" },
  "Windsor": { dx: -10, dy: 14, align: "end" },
  // ── Ottawa-Gatineau ──
  "Ottawa": { dx: 10, dy: 14, align: "start" },
  "Gatineau": { dx: -10, dy: -14, align: "end" },
  // ── Montreal Metro ──
  "Montréal": { dx: -18, dy: 4, align: "end" },
  "Montreal": { dx: -18, dy: 4, align: "end" },
  "Laval": { dx: 10, dy: -14, align: "start" },
  "Longueuil": { dx: 14, dy: 10, align: "start" },
  // ── Quebec ──
  "Sherbrooke": { dx: 12, dy: 14, align: "start" },
  "Québec": { dx: -10, dy: -14, align: "end" },
  "Quebec City": { dx: -10, dy: -14, align: "end" },
  "Lévis": { dx: 12, dy: 10, align: "start" },
  // ── Metro Vancouver Cluster ──
  "Vancouver": { dx: 10, dy: 4, align: "start" },
  "Burnaby": { dx: 10, dy: -16, align: "start" },
  "Surrey": { dx: 14, dy: 14, align: "start" },
  "Richmond": { dx: -18, dy: 16, align: "end" },
  "Coquitlam": { dx: 18, dy: -6, align: "start" },
  "Abbotsford": { dx: 14, dy: 14, align: "start" },
  "Kelowna": { dx: 12, dy: 14, align: "start" },
  // ── Prairies ──
  "Calgary": { dx: 10, dy: 14, align: "start" },
  "Edmonton": { dx: 10, dy: -14, align: "start" },
  "Regina": { dx: 0, dy: -14, align: "middle" },
  "Saskatoon": { dx: 0, dy: -14, align: "middle" },
  "Winnipeg": { dx: 0, dy: 14, align: "middle" },
  // ── Atlantic ──
  "Halifax": { dx: 10, dy: 14, align: "start" },
};

export default function CanadaMap({ cities }: { cities: any[] }) {
  const [activeCity, setActiveCity] = useState<any | null>(null);
  const router = useRouter();

  // Cities in dense clusters: labels hidden by default, shown only when hovered
  const HIDDEN_LABELS = new Set([
    "Mississauga", "Brampton", "Vaughan", "Richmond Hill", "Markham",
    "Oshawa", "Oakville", "Burlington",
    "St. Catharines", "Cambridge", "Guelph", "Barrie",
    "Burnaby", "Surrey", "Richmond", "Coquitlam", "Abbotsford",
    "Laval", "Longueuil", "Lévis",
    "Gatineau",
  ]);

  return (
    <div className="w-full h-full bg-surface-container-low overflow-hidden group flex flex-col md:flex-row">
      {/* Map Content - Left Aligned */}
      <div className="flex-1 relative min-h-[400px]">
        <ComposableMap
          projection="geoAzimuthalEqualArea"
          projectionConfig={{
            rotate: [96, -60, 0],
            center: [5, 2],
            scale: 750
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

          {cities.map((city) => {
            const cleanName = city.GEO_NAME.split(",")[0];
            const coords = CITY_COORDINATES[cleanName];

            if (!coords) return null;

            const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

            const labelConfig = LABEL_OFFSETS[cleanName] || { dx: 0, dy: 14, align: "middle" };

            const isActive = activeCity?.GEO_NAME === city.GEO_NAME;
            const isHidden = HIDDEN_LABELS.has(cleanName);
            const showLabel = !isHidden || isActive;

            return (
              <Marker key={city.GEO_NAME} coordinates={coords}>
                <circle
                  r={isActive ? 7 : 4}
                  className={`${isActive ? "fill-tertiary" : "fill-primary"} stroke-white cursor-pointer transition-all duration-200`}
                  strokeWidth={1.5}
                  onMouseEnter={() => setActiveCity(city)}
                  onMouseLeave={() => setActiveCity(null)}
                  onClick={() => router.push(`/location/${slug}`)}
                />
                {showLabel && (
                  <text
                    x={labelConfig.dx}
                    y={labelConfig.dy}
                    textAnchor={labelConfig.align}
                    className={`font-inter text-[7px] sm:text-[9px] font-bold pointer-events-none select-none transition-colors duration-200 drop-shadow-sm ${isActive ? "fill-tertiary" : "fill-on_surface-variant"}`}
                  >
                    {cleanName}
                  </text>
                )}
              </Marker>
            );
          })}
        </ComposableMap>
      </div>

      {/* Hover Details Panel - Right Aligned overlay styling applied as a flex child */}
      <div className="w-full md:w-[320px] lg:w-[380px] bg-surface-dim/30 backdrop-blur-sm border-l border-outline-variant/20 flex flex-col justify-center p-8 transition-all shrink-0">
        {activeCity ? (
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xl border border-outline-variant/30 animate-in fade-in slide-in-from-right-4 duration-300">
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
