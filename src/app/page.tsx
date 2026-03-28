import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CanadaMap from "@/components/home/CanadaMap";
import DataCard from "@/components/ui/DataCard";
import { getProvinces, generateSlug } from "@/lib/data-utils";
import { formatNumber, formatPercent } from "@/lib/utils";
import Link from "next/link";

export default async function Home() {
  const provinces = await getProvinces();
  
  // National stats (hardcoded for now or based on a totals sum)
  const nationalStats = {
    pop: 36991981,
    growth: 5.2,
    income: 84000,
    age: 41.0
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section: National Data */}
        <section className="relative bg-hero-gradient text-white pt-20 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="font-manrope text-display-lg max-w-2xl leading-tight mb-8">
              A Statistical Atlas of the <span className="text-tertiary">Canadian</span> People
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
              <DataCard 
                label="Total Population (2021)" 
                value={formatNumber(nationalStats.pop)} 
                delta={{ value: formatPercent(nationalStats.growth), isPositive: true }}
                className="bg-white/10 border-white/10 text-white"
                hasAccent
              />
              <DataCard 
                label="Median Household Income" 
                value={formatNumber(nationalStats.income)} 
                subValue="After-tax basis"
                className="bg-white/10 border-white/10 text-white"
              />
              <DataCard 
                label="Average Age" 
                value={nationalStats.age} 
                subValue="Years old"
                className="bg-white/10 border-white/10 text-white"
              />
            </div>
          </div>
          
          {/* Abstract Design Element */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-[-12deg] translate-x-1/2 pointer-events-none" />
        </section>

        {/* Map Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="w-full lg:w-2/3">
                <CanadaMap />
              </div>
              <div className="w-full lg:w-1/3">
                <h2 className="text-primary font-manrope text-headline-sm mb-6 accent-bar pl-6">The Shifting Mosaic</h2>
                <p className="text-on_surface-variant font-inter text-sm leading-relaxed mb-8">
                  Statistics Canada 2021 Census data reveals a country in transition. From the record growth in the Atlantic provinces to the aging demographics of rural communities, every number tells a story.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="card-tonal p-4 rounded-md shadow-sm border border-outline-variant/5">
                    <span className="text-on_surface-variant font-inter text-[10px] uppercase tracking-widest block mb-1">Growth leader</span>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-manrope font-bold">Squamish, BC</span>
                      <span className="text-tertiary font-bold">+22.2%</span>
                    </div>
                  </div>
                  <div className="card-tonal p-4 rounded-md shadow-sm border border-outline-variant/5">
                    <span className="text-on_surface-variant font-inter text-[10px] uppercase tracking-widest block mb-1">Highest median income</span>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-manrope font-bold">Fort St. John, BC</span>
                      <span className="text-tertiary font-bold">$105,800</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Province Grid Section */}
        <section className="py-20 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-primary font-manrope text-headline-sm mb-2">Provinces & Territories</h2>
              <p className="text-on_surface-variant font-inter text-sm">Select a region to explore detailed statistics.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {provinces.map((province) => (
                <Link 
                  href={`/location/${generateSlug(province.GEO_NAME)}`}
                  key={province.ALT_GEO_CODE} 
                  className="card-tonal group p-6 rounded-md shadow-sm hover:shadow-ambient transition-all hover:-translate-y-1 block"
                >
                  <h3 className="text-primary font-manrope font-bold text-lg mb-4">{province.GEO_NAME}</h3>
                  <div className="flex flex-col gap-3 mb-6">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-on_surface-variant font-inter uppercase tracking-widest font-bold">Growth</span>
                      <span className="font-bold text-tertiary">{formatPercent(province.POP_CHANGE_PCT)}</span>
                    </div>
                    <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full transition-all group-hover:bg-tertiary" 
                        style={{ width: `${Math.min(100, (province.POP_CHANGE_PCT / 10) * 100)}%` }} 
                      />
                    </div>
                  </div>
                  <div className="text-primary font-manrope font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                    View Profile <span className="text-tertiary">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
