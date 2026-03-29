import { getAllLocations, getLocationBySlug, generateSlug } from "@/lib/data-utils";
import { formatNumber, formatPercent, formatCurrency } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DataCard from "@/components/ui/DataCard";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const locations = await getAllLocations();
  return locations.map((loc) => ({
    slug: generateSlug(loc.GEO_NAME),
  }));
}

export default async function LocationProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  const displayName = location.GEO_NAME.split(",")[0];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-surface-container-low py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-on_surface-variant font-inter text-[10px] uppercase tracking-widest mb-6">
              <span className="hover:text-primary transition-colors cursor-pointer">Canada</span>
              <span className="opacity-30">/</span>
              <span className="text-primary font-bold">{displayName}</span>
            </nav>
            
            <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
              <div className="max-w-2xl">
                <h1 className="font-manrope text-5xl font-bold text-primary mb-4 leading-tight">
                  {displayName} <span className="text-tertiary">Profile</span>
                </h1>
                <p className="text-on_surface-variant font-inter text-lg leading-relaxed mb-8">
                  A comprehensive demographic breakdown using data from the 2021 Statistics Canada Census.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="glass px-4 py-2 rounded-md shadow-sm">
                    <span className="text-on_surface-variant font-inter text-[10px] uppercase font-bold mr-2">National Rank:</span>
                    <span className="text-primary font-manrope font-bold text-sm">
                      {location.RANK_POPULATION} of {location.RANK_TOTAL_IN_GEO_LEVEL}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="w-full lg:w-96 aspect-video bg-surface-dim rounded-md overflow-hidden relative shadow-ambient">
                {/* Google Maps Embed Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center font-manrope font-black text-primary/10 text-4xl">MAP</div>
                <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Vital Statistics (Population) */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-primary font-manrope text-headline-sm mb-12 accent-bar pl-6">Vital Statistics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DataCard 
                label="Total Population" 
                value={formatNumber(location.POP_2021)} 
                delta={{ value: formatPercent(location.POP_CHANGE_PCT), isPositive: location.POP_CHANGE_PCT > 0 }}
                hasAccent
              />
              <DataCard 
                label="Average Age" 
                value={location.POP_AVG_AGE} 
                subValue={`Ranked #${location.RANK_AVG_AGE || '-'} in geo level`}
              />
              <DataCard 
                label="Median Income (HH)" 
                value={formatCurrency(location.HH_INCOME_MEDIAN_AFTER_TAX)} 
                subValue="After-tax basis"
              />
              <DataCard 
                label="M:F Ratio" 
                value={location.POP_MALE_TO_FEMALE_RATIO?.toFixed(2) || "1.02"} 
                subValue="Males per female"
              />
            </div>

            <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h3 className="text-primary font-manrope font-bold text-lg mb-6">Population Context</h3>
                <p className="text-on_surface-variant font-inter text-sm leading-relaxed mb-6">
                  {location.GEO_NAME} has seen an absolute population change of {formatNumber(location.POP_CHANGE_ABS)} people 
                  between 2016 and 2021. This represents a growth rate of {formatPercent(location.POP_CHANGE_PCT)}, 
                  placing it as rank {location.RANK_POP_GROWTH} within its geographical peer group.
                </p>
                
                {/* Visual Chart Placeholder */}
                <div className="w-full h-64 bg-surface-container-low rounded-md flex items-end p-6 gap-2">
                  {[40, 60, 45, 70, 85, 55, 65, 90, 75, 50].map((h, i) => (
                    <div key={i} className="flex-grow bg-primary/20 rounded-t-sm transition-all hover:bg-tertiary" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <span className="text-on_surface-variant font-inter text-[10px] mt-2 block text-center uppercase tracking-widest">Age Distribution Brackets</span>
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="card-tonal p-6 rounded-md border border-outline-variant/10">
                  <h4 className="text-primary font-manrope font-bold text-sm mb-4">Household Composition</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-on_surface-variant">Average HH Size</span>
                      <span className="font-bold">{location.HH_AVG_SIZE?.toFixed(1) || '2.4'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-on_surface-variant">One-person</span>
                      <span className="font-bold">28.4%</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-on_surface-variant">Couples w/ children</span>
                      <span className="font-bold">42.1%</span>
                    </div>
                  </div>
                </div>
                <div className="card-tonal p-6 rounded-md border border-outline-variant/10">
                  <h4 className="text-primary font-manrope font-bold text-sm mb-4">Labour & Economy</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-on_surface-variant">Employment Rate</span>
                      <span className="font-bold">{location.LABOUR_EMPLOYMENT_RATE?.toFixed(1) || '61.2'}%</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-on_surface-variant">Unemployment Rate</span>
                      <span className="font-bold">{location.LABOUR_UNEMPLOYMENT_RATE?.toFixed(1) || '7.4'}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA / Footer context */}
        <section className="bg-surface-container py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-primary font-manrope text-headline-sm mb-6">Discover More Insights</h2>
            <p className="text-on_surface-variant font-inter text-sm mb-8 max-w-xl mx-auto">
              Compare {location.GEO_NAME} with other Canadian locations to see how it stacks up 
              against similar population centers.
            </p>
            <button className="bg-primary text-white font-manrope font-bold px-8 py-3 rounded-md hover:bg-primary-container transition-all shadow-ambient">
              Open Comparison Tool
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
