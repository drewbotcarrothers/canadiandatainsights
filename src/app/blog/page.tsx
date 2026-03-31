import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { blogPosts } from "@/lib/blog-data";

export default function BlogListingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-on_surface font-inter">
      <Header />

      <main className="max-w-screen-2xl mx-auto px-6 py-12 w-full flex-grow">
        <header className="mb-16 max-w-3xl">
          <h1 className="text-5xl font-black text-primary font-manrope tracking-tight mb-4">
            Demographic <span className="text-tertiary">Insights</span>
          </h1>
          <p className="text-on_surface-variant font-medium text-lg leading-relaxed">
            Exploring the trends, challenges, and stories behind the 2021 Canadian Census. Long-form analysis to complement our data visualizations.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link 
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 shadow-sm hover:shadow-ambient hover:border-primary/20 transition-all flex flex-col group h-full"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[10px] font-bold text-on_surface-variant uppercase tracking-widest bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant/10 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-colors">
                  {post.category}
                </span>
                <span className="text-[10px] font-medium text-on_surface-variant uppercase tracking-widest px-2">
                  •
                </span>
                <span className="text-[10px] font-medium text-on_surface-variant uppercase tracking-widest">
                  {post.date}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-primary font-manrope leading-tight mb-4 group-hover:text-primary-container transition-colors">
                {post.title}
              </h2>
              
              <p className="text-on_surface-variant text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-outline-variant/5">
                <span className="text-[10px] font-bold text-on_surface-variant uppercase tracking-widest">
                  {post.readTime}
                </span>
                <div className="flex items-center text-xs font-bold text-primary gap-1 group-hover:translate-x-1 transition-transform">
                  Read Article
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
