"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface CityMarker {
  id: string;
  name: string;
  x: number;
  y: number;
  pop: string;
}

const CITIES: CityMarker[] = [
  { id: "toronto", name: "Toronto", x: 780, y: 560, pop: "2.79M" },
  { id: "montreal", name: "Montreal", x: 840, y: 530, pop: "1.76M" },
  { id: "vancouver", name: "Vancouver", x: 120, y: 480, pop: "662K" },
  { id: "calgary", name: "Calgary", x: 260, y: 460, pop: "1.3M" },
  { id: "ottawa", name: "Ottawa", x: 810, y: 540, pop: "1.01M" },
  { id: "edmonton", name: "Edmonton", x: 270, y: 420, pop: "1M" },
  { id: "winnipeg", name: "Winnipeg", x: 500, y: 490, pop: "749K" },
  { id: "halifax", name: "Halifax", x: 940, y: 510, pop: "439K" },
];

export default function CanadaMap() {
  const [hoveredCity, setHoveredCity] = useState<CityMarker | null>(null);

  return (
    <div className="relative w-full aspect-[2/1] bg-surface-container-low rounded-md overflow-hidden group">
      <svg
        viewBox="0 0 1000 700"
        className="w-full h-full text-surface-dim fill-current"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simplified Canada Shape Path (Representative) */}
        <path
          d="M100,450 L150,420 L200,400 L300,380 L400,390 L500,410 L600,420 L750,450 L850,480 L950,450 L980,500 L950,550 L850,580 L750,600 L650,580 L500,560 L350,550 L200,560 L100,540 Z"
          className="transition-colors group-hover:text-surface-dim/80"
        />
        
        {/* Province Borders (Representative) */}
        <line x1="180" y1="470" x2="180" y2="560" stroke="#f9f9fd" strokeWidth="2" />
        <line x1="320" y1="440" x2="320" y2="550" stroke="#f9f9fd" strokeWidth="2" />
        <line x1="450" y1="410" x2="450" y2="560" stroke="#f9f9fd" strokeWidth="2" />
        <line x1="580" y1="430" x2="580" y2="570" stroke="#f9f9fd" strokeWidth="2" />
        <line x1="750" y1="450" x2="750" y2="600" stroke="#f9f9fd" strokeWidth="2" />

        {/* City Markers */}
        {CITIES.map((city) => (
          <motion.circle
            key={city.id}
            cx={city.x}
            cy={city.y}
            r="6"
            className="fill-primary cursor-pointer"
            whileHover={{ r: 12, fill: "#6e000b" }}
            onMouseEnter={() => setHoveredCity(city)}
            onMouseLeave={() => setHoveredCity(null)}
          />
        ))}
      </svg>

      {/* Map Insight Tooltip */}
      {hoveredCity && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute glass p-4 rounded-md shadow-ambient border border-outline-variant/10 z-20 pointer-events-none"
          style={{ 
            left: `${(hoveredCity.x / 1000) * 100}%`, 
            top: `${(hoveredCity.y / 700) * 100 - 15}%`,
            transform: "translate(-50%, -100%)"
          }}
        >
          <h4 className="text-primary font-manrope font-bold text-sm">{hoveredCity.name}</h4>
          <p className="text-on_surface-variant font-inter text-[10px] mt-1 uppercase tracking-wider">
            Pop: <span className="text-tertiary font-bold">{hoveredCity.pop}</span>
          </p>
        </motion.div>
      )}

      {/* Decorative Label */}
      <div className="absolute bottom-6 left-6 pointer-events-none">
        <span className="text-primary font-manrope font-black text-6xl opacity-10 select-none">
          CENSUS 2021
        </span>
      </div>
    </div>
  );
}
