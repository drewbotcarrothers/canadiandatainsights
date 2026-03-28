import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full glass shadow-ambient border-b border-outline-variant/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-primary font-manrope font-bold text-lg tracking-tight">
            Canadian<span className="text-tertiary">Data</span>Insights
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-on_surface-variant hover:text-primary font-inter text-sm font-medium transition-colors">
            Dashboard
          </Link>
          <Link href="/compare" className="text-on_surface-variant hover:text-primary font-inter text-sm font-medium transition-colors">
            Comparisons
          </Link>
          <Link href="/sources" className="text-on_surface-variant hover:text-primary font-inter text-sm font-medium transition-colors">
            Sources
          </Link>
          <Link href="/about" className="text-on_surface-variant hover:text-primary font-inter text-sm font-medium transition-colors">
            About
          </Link>
        </nav>
        
        <div className="flex items-center">
          {/* Potential search icon or CTA could go here */}
        </div>
      </div>
    </header>
  );
}
