import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="max-w-sm">
          <Link href="/" className="text-primary font-manrope font-bold text-xl tracking-tight mb-4 inline-block">
            Canadian<span className="text-tertiary">Data</span>Insights
          </Link>
          <p className="text-on_surface-variant font-inter text-sm leading-relaxed text-balance">
            Educate and empower viewers with high-precision Canadian census demographic data and location-specific insights.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-12 sm:gap-24">
          <div className="flex flex-col gap-3">
            <h4 className="text-primary font-manrope font-bold text-xs uppercase tracking-widest">Navigation</h4>
            <Link href="/" className="text-on_surface-variant hover:text-primary font-inter text-sm transition-colors">Dashboard</Link>
            <Link href="/compare" className="text-on_surface-variant hover:text-primary font-inter text-sm transition-colors">Comparisons</Link>
            <Link href="/sources" className="text-on_surface-variant hover:text-primary font-inter text-sm transition-colors">Sources</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-primary font-manrope font-bold text-xs uppercase tracking-widest">Legal</h4>
            <Link href="/about" className="text-on_surface-variant hover:text-primary font-inter text-sm transition-colors">About</Link>
            <Link href="/privacy" className="text-on_surface-variant hover:text-primary font-inter text-sm transition-colors">Privacy Policy</Link>
            <p className="text-on_surface-variant font-inter text-xs mt-2">Data Source: Statistics Canada 2021 Census</p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-outline-variant/5 text-center md:text-left">
        <p className="text-on_surface-variant font-inter text-xs">
          &copy; {currentYear} Canadian Data Insights. All rights reserved. 
          Website built for editorial excellence and data precision.
        </p>
      </div>
    </footer>
  );
}
