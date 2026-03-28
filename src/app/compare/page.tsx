import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getAllLocations } from "@/lib/data-utils";
import ComparisonInterface from "@/components/compare/ComparisonInterface";

export default async function ComparisonPage() {
  const locations = await getAllLocations();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h1 className="font-manrope text-5xl font-bold text-primary mb-4">
              Location <span className="text-tertiary">Comparison</span>
            </h1>
            <p className="text-on_surface-variant font-inter text-lg leading-relaxed max-w-2xl">
              Side-by-side demographic analysis for Canadian provinces, cities, 
              and regional districts. Select two locations of the same level to begin.
            </p>
          </div>
          
          <ComparisonInterface locations={locations} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
