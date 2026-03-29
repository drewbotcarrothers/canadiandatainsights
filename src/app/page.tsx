import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MetroHubsSidebar from "@/components/home/MetroHubsSidebar";
import { getTopCities, getProvinces, generateSlug } from "@/lib/data-utils";
import { formatNumber } from "@/lib/utils";

export default async function Home() {
  const topCities = await getTopCities(7);
  const provinces = await getProvinces();

  const nationalStats = {
    pop: 36991981,
    growth: 5.2,
    income: 84000,
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-on_surface font-inter">
      <Header />

      <main className="max-w-screen-2xl mx-auto px-6 py-8 w-full">
        {/* ── National Census Statistics Bento ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Population */}
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-l-4 border-primary relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <p className="text-[10px] font-medium text-on_surface-variant uppercase tracking-widest mb-2 font-inter">
              Total Population
            </p>
            <h2 className="text-4xl font-extrabold text-primary font-manrope tracking-tight">
              {formatNumber(nationalStats.pop)}
            </h2>
            <div className="mt-4 flex items-center gap-2 text-primary font-bold">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
              <span className="text-sm">+{nationalStats.growth}% since 2016</span>
            </div>
          </div>

          {/* Growth Rate */}
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-l-4 border-tertiary relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <p className="text-[10px] font-medium text-on_surface-variant uppercase tracking-widest mb-2 font-inter">
              Growth Rate
            </p>
            <h2 className="text-4xl font-extrabold text-primary font-manrope tracking-tight">
              1.8% <span className="text-lg font-normal text-on_surface-variant">Annual</span>
            </h2>
            <div className="mt-4 flex items-center gap-2 text-tertiary font-bold">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              <span className="text-sm">G7 Leading Factor</span>
            </div>
          </div>

          {/* Median Income */}
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-l-4 border-primary relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
            </div>
            <p className="text-[10px] font-medium text-on_surface-variant uppercase tracking-widest mb-2 font-inter">
              Median Income
            </p>
            <h2 className="text-4xl font-extrabold text-primary font-manrope tracking-tight">
              ${formatNumber(nationalStats.income)}
            </h2>
            <div className="mt-4 flex items-center gap-2 text-primary font-bold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="4" />
              </svg>
              <span className="text-sm">Household Adjusted</span>
            </div>
          </div>
        </section>

        {/* ── Map Hero Section ── */}
        <section className="relative bg-surface-container rounded-xl overflow-hidden min-h-[600px] flex flex-col">
            <div className="absolute inset-0 z-0 bg-surface-dim">
              {/* Map background - uses CSS fallback if image missing */}
              <div 
                className="w-full h-full bg-cover bg-center opacity-40 mix-blend-multiply filter grayscale"
                style={{ backgroundImage: "url('/map-canada.jpg')" }}
              />
            </div>
            {/* Map Overlay Content */}
            <div className="relative z-10 p-8 flex flex-col h-full justify-between pointer-events-none min-h-[600px]">
              <div className="max-w-md pointer-events-auto">
                <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter uppercase mb-4">
                  Interactive Atlas
                </span>
                <h1 className="text-5xl font-extrabold text-primary font-manrope leading-tight mb-4">
                  National Population Density Explorer
                </h1>
                <p className="text-on_surface-variant leading-relaxed font-medium">
                  Discover demographic insights across 32 major metropolitan hubs. Hover over markers to see real-time census adjustments.
                </p>
              </div>

              {/* City markers (positioned absolutely on the map area) */}
              <div className="absolute inset-0">
                {/* Toronto */}
                <div className="absolute top-[75%] left-[70%] group pointer-events-auto">
                  <div className="w-4 h-4 bg-tertiary rounded-full ring-4 ring-tertiary/20 cursor-pointer animate-pulse" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-surface-container-lowest p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <p className="text-xs font-bold text-primary">Toronto</p>
                    <p className="text-[10px] text-on_surface-variant">Pop: 2.93M</p>
                  </div>
                </div>
                {/* Vancouver */}
                <div className="absolute top-[65%] left-[15%] group pointer-events-auto">
                  <div className="w-4 h-4 bg-primary rounded-full ring-4 ring-primary/20 cursor-pointer" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-surface-container-lowest p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <p className="text-xs font-bold text-primary">Vancouver</p>
                    <p className="text-[10px] text-on_surface-variant">Pop: 675k</p>
                  </div>
                </div>
                {/* Montreal */}
                <div className="absolute top-[72%] left-[78%] group pointer-events-auto">
                  <div className="w-4 h-4 bg-primary rounded-full ring-4 ring-primary/20 cursor-pointer" />
                </div>
                {/* Ottawa */}
                <div className="absolute top-[74%] left-[74%] group pointer-events-auto">
                  <div className="w-4 h-4 bg-primary rounded-full ring-4 ring-primary/20 cursor-pointer" />
                </div>
              </div>

              <div className="flex gap-4 pointer-events-auto">
                <div className="bg-surface-container-lowest/90 backdrop-blur-sm p-4 rounded-lg flex gap-6 items-center shadow-lg border-l-4 border-primary">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-on_surface-variant">Data Maturity</span>
                    <span className="text-sm font-bold text-primary">2021 Census Ref.</span>
                  </div>
                  <div className="w-px h-8 bg-outline-variant" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-on_surface-variant">Coverage</span>
                    <span className="text-sm font-bold text-primary">98.4% National</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

        {/* ── Provincial Insights Grid ── */}
        <section className="mt-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h2 className="text-primary font-manrope text-3xl font-bold mb-2">Provincial Insights</h2>
              <p className="text-on_surface-variant font-medium max-w-xl">
                A high-level overview of demographic shifts across Canada's provinces and territories, based on latest census registers.
              </p>
            </div>
            <Link href="/compare" className="text-primary font-bold text-sm hover:underline flex items-center gap-1 group">
              View Detailed Comparison
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {provinces.map((prov) => (
              <Link 
                key={prov.GEO_NAME}
                href={`/location/${generateSlug(prov.GEO_NAME)}`}
                className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 hover:shadow-ambient hover:border-primary/20 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold text-on_surface-variant uppercase tracking-widest bg-surface-container-low px-2 py-1 rounded">
                    {prov.GEO_LEVEL}
                  </span>
                  <div className={`text-[10px] font-bold px-2 py-1 rounded ${prov.POP_CHANGE_PCT > 0 ? 'bg-primary/10 text-primary' : 'bg-tertiary/10 text-tertiary'}`}>
                    {prov.POP_CHANGE_PCT > 0 ? '+' : ''}{prov.POP_CHANGE_PCT.toFixed(1)}%
                  </div>
                </div>
                <h3 className="text-xl font-bold text-primary font-manrope mb-4 group-hover:text-primary-container transition-colors">
                  {prov.GEO_NAME}
                </h3>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-medium text-on_surface-variant uppercase tracking-tighter">Population</span>
                  <span className="text-2xl font-black text-on_surface font-manrope">
                    {formatNumber(prov.POP_2021)}
                  </span>
                </div>
                <div className="mt-6 flex items-center text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  View Profile
                  <svg className="ml-1 w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Metropolitan Hubs Section ── */}
        <section className="mt-20 mb-12">
          <MetroHubsSidebar cities={topCities} />
        </section>

      </main>

      <Footer />
    </div>
  );
}
