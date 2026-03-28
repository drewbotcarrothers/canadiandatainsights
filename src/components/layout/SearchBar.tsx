"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  name: string;
  level: string;
  slug: string;
}

interface SearchBarProps {
  searchIndex: SearchResult[];
}

export default function SearchBar({ searchIndex }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const filtered = searchIndex
      .filter((loc) => 
        loc.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 8); // Limit to 8 results for better UI

    setResults(filtered);
    setIsOpen(true);
    setSelectedIndex(-1);
  }, [query, searchIndex]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (slug: string) => {
    router.push(`/location/${slug}`);
    setIsOpen(false);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      handleSelect(results[selectedIndex].slug);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-sm lg:max-w-md" ref={containerRef}>
      <div className="relative flex items-center">
        <svg 
          className="absolute left-3 w-4 h-4 text-on_surface-variant z-10" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          className="bg-surface-container-highest border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/40 transition-all w-full outline-none text-on_surface placeholder:text-on_surface-variant/50"
          placeholder="Search a city, province, or region..."
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 glass border border-outline-variant/10 rounded-lg shadow-ambient overflow-hidden z-[100] p-1"
          >
            <div className="max-h-[320px] overflow-y-auto no-scrollbar">
              {results.map((result, index) => (
                <button
                  key={`${result.slug}-${index}`}
                  onClick={() => handleSelect(result.slug)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left p-3 rounded-md transition-all flex flex-col gap-0.5 ${
                    selectedIndex === index ? "bg-surface-container-low" : "hover:bg-surface-container-lowest"
                  }`}
                >
                  <span className="text-sm font-manrope font-bold text-primary">
                    {result.name}
                  </span>
                  <span className="text-[10px] font-inter uppercase tracking-widest text-on_surface-variant font-medium">
                    {result.level}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
