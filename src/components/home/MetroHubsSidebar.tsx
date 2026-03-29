"use client";

import Link from "next/link";

function generateSlug(name: string): string {
  if (!name) return "unknown";
  
  let targetName = name;
  if (name.includes(",")) {
    const parts = name.split(",");
    const suffix = parts[1].trim();
    if (/^(City|Ville|Cité)/i.test(suffix)) {
      targetName = parts[0];
    }
  }

  return targetName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface City {
  GEO_NAME: string;
  POP_2021: number;
  POP_AVG_AGE: number;
  GEO_LEVEL: string;
  HH_INCOME_MEDIAN_AFTER_TAX: number;
}

export default function MetroHubsSidebar({ cities }: { cities: City[] }) {
  const formatPop = (pop: number) => {
    if (pop >= 1000000) return `${(pop / 1000000).toFixed(2)}M`;
    if (pop >= 1000) return `${(pop / 1000).toFixed(0)}K`;
    return pop.toLocaleString();
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
          <h2 className="text-primary font-manrope text-3xl font-bold mb-2">Major Cities</h2>
          <p className="text-on_surface-variant font-medium max-w-xl">
            Demographic profiles for the top 32 major urban centers across Canada.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cities.map((city, index) => (
          <Link
            key={city.GEO_NAME}
            href={`/location/${generateSlug(city.GEO_NAME)}`}
            className={`bg-surface-container-lowest p-4 rounded-lg text-left group hover:shadow-ambient hover:border-primary/20 transition-all border border-outline-variant/10 flex flex-col justify-between min-h-[100px] ${
              index === 0 ? "border-l-4 border-l-tertiary" : ""
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-on_surface group-hover:text-primary transition-colors font-manrope text-lg">
                {city.GEO_NAME.replace(/, .*/, "")}
              </span>
              {index === 0 && (
                <span className="text-[10px] font-bold text-tertiary bg-[#ffdad7] px-2 py-0.5 rounded">
                  Major
                </span>
              )}
            </div>
            <div className="flex gap-4 text-xs text-on_surface-variant font-medium mt-auto">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                {formatPop(city.POP_2021)}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                Age: {city.POP_AVG_AGE}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ${(city.HH_INCOME_MEDIAN_AFTER_TAX / 1000).toFixed(0)}k
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
