import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { blogPosts } from "@/lib/blog-data";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Canadian Data Insights Blog`,
    description: post.excerpt,
  };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-on_surface font-inter">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-20 w-full flex-grow">
        <nav className="mb-12 flex items-center gap-2 text-[10px] font-bold text-on_surface-variant uppercase tracking-widest">
          <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <span className="text-on_surface-variant/20">/</span>
          <span className="text-primary truncate">{post.title}</span>
        </nav>

        <header className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-bold text-on_surface-variant uppercase tracking-widest bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant/10">
              {post.category}
            </span>
            <span className="text-[10px] font-medium text-on_surface-variant uppercase tracking-widest px-2">
              •
            </span>
            <span className="text-[10px] font-medium text-on_surface-variant uppercase tracking-widest">
              {post.date}
            </span>
            <span className="text-[10px] font-medium text-on_surface-variant uppercase tracking-widest px-2">
              •
            </span>
            <span className="text-[10px] font-bold text-on_surface-variant uppercase tracking-widest">
              {post.readTime}
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-primary font-manrope leading-tight mb-8 tracking-tighter">
            {post.title}
          </h1>
          
          <p className="text-on_surface-variant font-medium text-xl leading-relaxed italic border-l-4 border-primary/20 pl-6 py-2">
            {post.excerpt}
          </p>
        </header>

        <article 
          className="prose prose-slate prose-lg max-w-none 
          prose-headings:font-manrope prose-headings:font-bold prose-headings:text-primary 
          prose-p:text-on_surface-variant prose-p:leading-relaxed prose-p:font-inter
          prose-blockquote:border-primary/20 prose-blockquote:bg-surface-container-low/50 prose-blockquote:p-8 prose-blockquote:rounded-xl prose-blockquote:italic prose-blockquote:font-medium
          prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-24 pt-12 border-t border-outline-variant/10">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:translate-x--1 transition-transform"
          >
            <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            Back to All Insights
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
