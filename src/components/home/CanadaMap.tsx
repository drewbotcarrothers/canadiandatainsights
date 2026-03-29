"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { useRouter } from "next/navigation";
import { CITY_COORDINATES } from "@/lib/city-coordinates";

// URL for Canada GeoJSON
const geoUrl = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/canada.geojson";

export default function CanadaMap({ cities }: { cities: any[] }) {
  const [tooltip, setTooltip] = useState<any | null>(null);
  const router = useRouter();

  return (
    <div className="relative w-full h-full bg-surface-container-low rounded-xl overflow-hidden group">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{
          rotate: [96, -60, 0],
          center: [5, 2], // Slight adjustment to center the geojson
          scale: 800
        }}
        className="w-full h-full object-cover"
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#e2e6f2" // Very light surface-container style
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
          // Look up coordinate. If it doesn't exist, we don't render this dot.
          const cleanName = city.GEO_NAME.split(",")[0];
          const coords = CITY_COORDINATES[cleanName];

          if (!coords) return null;

          // generate the short URL slug exactly as the server does
          const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

          return (
            <Marker key={city.GEO_NAME} coordinates={coords}>
              <circle
                r={5}
                className="fill-primary stroke-white cursor-pointer hover:fill-tertiary transition-colors duration-200"
                strokeWidth={1.5}
                onMouseEnter={() => setTooltip(city)}
                onMouseLeave={() => setTooltip(null)}
                onClick={() => router.push(`/location/${slug}`)}
              />
            </Marker>
          );
        })}
      </ComposableMap>

      {/* Dynamic Hover Tooltip */}
      {tooltip && (
        <div className="absolute top-8 right-8 bg-surface-container-lowest/95 backdrop-blur-sm p-4 rounded-xl shadow-ambient border border-outline-variant/20 z-20 pointer-events-none min-w-[200px]">
          <h4 className="text-primary font-manrope font-bold text-lg border-b border-outline-variant/10 pb-2 mb-2">
            {tooltip.GEO_NAME.split(",")[0]}
          </h4>
          <div className="flex flex-col gap-1">
            <p className="text-on_surface-variant font-inter text-xs flex justify-between">
              <span className="font-bold">Population:</span>
              <span>{(tooltip.POP_2021).toLocaleString()}</span>
            </p>
            <p className="text-on_surface-variant font-inter text-xs flex justify-between">
              <span className="font-bold">Avg Age:</span>
              <span>{tooltip.POP_AVG_AGE} yrs</span>
            </p>
            {tooltip.HH_INCOME_MEDIAN_AFTER_TAX && (
               <p className="text-on_surface-variant font-inter text-xs flex justify-between">
                 <span className="font-bold">Income:</span>
                 <span>${(tooltip.HH_INCOME_MEDIAN_AFTER_TAX / 1000).toFixed(0)}k</span>
               </p>
            )}
          </div>
          <p className="text-tertiary font-bold text-[10px] uppercase tracking-wider mt-3 text-center">
            Click to view Profile
          </p>
        </div>
      )}
    </div>
  );
}
