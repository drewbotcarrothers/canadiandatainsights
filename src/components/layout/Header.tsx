import Link from "next/link";
import SearchBar from "./SearchBar";
import { getSearchIndex } from "@/lib/data-utils";

export default async function Header() {
  const searchIndex = await getSearchIndex();

  return (
    <header className="bg-slate-50/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
        <Link href="/" className="text-2xl font-black tracking-tighter font-manrope">
          <span className="text-primary">Canadian</span>
          <span className="text-tertiary">Data</span>
          <span className="text-primary">Insights</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-primary font-bold border-b-2 border-primary pb-1 font-inter text-sm"
          >
            Dashboard
          </Link>
          <Link
            href="/compare"
            className="text-on_surface-variant font-medium hover:text-primary transition-colors font-inter text-sm"
          >
            Comparisons
          </Link>
          <Link
            href="/sources"
            className="text-on_surface-variant font-medium hover:text-primary transition-colors font-inter text-sm"
          >
            Sources
          </Link>
          <Link
            href="/blog"
            className="text-on_surface-variant font-medium hover:text-primary transition-colors font-inter text-sm"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-on_surface-variant font-medium hover:text-primary transition-colors font-inter text-sm"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden lg:block w-64 xl:w-80">
            <SearchBar searchIndex={searchIndex} />
          </div>
        </div>
      </div>
    </header>
  );
}
