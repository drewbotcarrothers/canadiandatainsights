import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogVisualization from "@/components/blog/BlogVisualization";
import { blogPosts } from "@/lib/blog-data";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-on_surface font-inter">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-16 w-full flex-grow">
        <nav className="mb-12 flex items-center gap-2 text-[10px] font-bold text-on_surface-variant uppercase tracking-widest">
          <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <span className="text-on_surface-variant/20">/</span>
          <span className="text-primary truncate">{post.title}</span>
        </nav>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] font-bold text-on_surface-variant uppercase tracking-widest bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant/10 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20 transition-colors">
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

          <h1 className="text-4xl lg:text-6xl font-black text-primary font-manrope leading-tight mb-8 tracking-tighter">
            {post.title}
          </h1>
          
          <p className="text-on_surface-variant font-medium text-xl leading-relaxed max-w-3xl">
            {post.excerpt}
          </p>
        </header>

        {post.heroImage && (
          <div className="mb-16 relative aspect-video rounded-2xl overflow-hidden shadow-ambient ring-1 ring-outline-variant/10">
            <Image 
              src={post.heroImage} 
              alt={post.title} 
              fill 
              className="object-cover"
              priority
            />
          </div>
        )}

        <article 
          className="prose prose-slate prose-lg max-w-none 
          prose-headings:font-manrope prose-headings:font-bold prose-headings:text-primary 
          prose-p:text-on_surface-variant prose-p:leading-relaxed prose-p:font-inter
          prose-blockquote:border-primary/20 prose-blockquote:bg-surface-container-low/50 prose-blockquote:p-8 prose-blockquote:rounded-xl prose-blockquote:italic prose-blockquote:font-medium
          prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.chartType && post.chartData && (
          <BlogVisualization 
            type={post.chartType} 
            data={post.chartData} 
            title={post.chartTitle}
          />
        )}

        <div className="mt-24 pt-12 border-t border-outline-variant/10">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:translate-x--2 transition-transform"
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
