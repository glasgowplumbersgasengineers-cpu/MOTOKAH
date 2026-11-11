import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { usePageTitle } from "@/hooks/usePageTitle";
import { IconCalendar, IconArrowLeft } from "@tabler/icons-react";
import { format } from "date-fns";
import { sanitizeCalloutPricingText } from "@/lib/seoText";
import { renderBlogMarkdown } from "@/lib/blogMarkdown";

type BlogPostData = {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string | null;
  created_at: string;
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  usePageTitle(post ? `${post.title} | Motokah Blog` : "Blog Post");

  const seoDesc = post
    ? sanitizeCalloutPricingText(
        post.content
          .replace(/^#{1,3}\s.*$/gm, "")
          .replace(/[*`>]/g, "")
          .replace(/\n+/g, " ")
          .trim()
          .slice(0, 160),
      )
    : undefined;
  const canonicalUrl = post
    ? `https://www.motokah.com/blog/${post.slug}`
    : undefined;

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("blog_posts")
      .select("id, title, slug, content, cover_image, created_at")
      .eq("slug", slug)
      .eq("published", true)
      .single()
      .then(({ data }) => {
        setPost(data as BlogPostData | null);
        setLoading(false);
      });
  }, [slug]);

  return (
    <div className="min-h-screen bg-background">
      {post && (
        <Helmet>
          <title>{sanitizeCalloutPricingText(`${post.title} | Motokah Blog`)}</title>
          <meta name="description" content={seoDesc} />
          <link rel="canonical" href={canonicalUrl} />
          <meta property="og:title" content={sanitizeCalloutPricingText(post.title)} />
          <meta property="og:description" content={seoDesc} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={canonicalUrl} />
          {post.cover_image && <meta property="og:image" content={post.cover_image} />}
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: sanitizeCalloutPricingText(post.title),
            description: seoDesc,
            datePublished: post.created_at,
            dateModified: post.created_at,
            author: { "@type": "Organization", name: "Motokah" },
            publisher: { "@type": "Organization", name: "Motokah", url: "https://www.motokah.com" },
            url: canonicalUrl,
            ...(post.cover_image ? { image: post.cover_image } : {}),
          })}</script>
        </Helmet>
      )}
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <IconArrowLeft size={16} /> Back to Blog
        </Link>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-64 bg-muted rounded" />
          </div>
        ) : !post ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">Post not found</p>
          </div>
        ) : (
          <article>
            {post.cover_image && (
              <img src={post.cover_image} alt={post.title} className="w-full h-64 object-cover rounded-xl mb-6" />
            )}
            <h1 className="text-3xl font-bold text-foreground mb-3">{post.title}</h1>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
              <IconCalendar size={14} />
              {format(new Date(post.created_at), "MMMM d, yyyy")}
            </div>
            <div
              className="prose prose-sm max-w-none text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: `<p class='mb-4'>${renderBlogMarkdown(post.content)}</p>`,
              }}
            />
          </article>
        )}
      </div>
      <Footer />
    </div>
  );
}
