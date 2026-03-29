import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-100 w-full py-12 px-8 mt-20">
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-200/50 pt-12">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="font-bold text-slate-900 text-xl font-manrope tracking-tighter">
            CanadianDataInsights
          </Link>
          <p className="font-medium font-inter text-[10px] uppercase tracking-widest text-slate-500">
            &copy; {currentYear} Statistics Canada Data Atlas. All rights reserved.
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-8">
          <Link href="/sources" className="font-medium font-inter text-xs uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">
            Census Methodology
          </Link>
          <Link href="/privacy" className="font-medium font-inter text-xs uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="font-medium font-inter text-xs uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="/data" className="font-medium font-inter text-xs uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">
            Open Data Portal
          </Link>
        </nav>
        <div className="flex gap-4">
          <button className="text-slate-500 hover:text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
          </button>
          <button className="text-slate-500 hover:text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
            </svg>
          </button>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto mt-8 text-center md:text-left">
        <p className="text-[10px] text-on_surface-variant/60 max-w-2xl leading-relaxed">
          Source: Statistics Canada, Census of Population. All data visualized represents official federal registries and metropolitan hub projections. High-accuracy mapping provided by the Canadian Geomatics Infrastructure.
        </p>
      </div>
    </footer>
  );
}
