import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { usePageTitle } from "@/hooks/usePageTitle";
import { IconCalendar, IconArrowRight } from "@tabler/icons-react";
import { format } from "date-fns";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string | null;
  published: boolean;
  created_at: string;
};

export default function Blog() {
  usePageTitle("Blog & News");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id, title, slug, content, cover_image, published, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setPosts((data as BlogPost[]) || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-2 text-center">Blog & News</h1>
        <p className="text-muted-foreground text-center mb-10">Car tips, market insights, and Motokah updates.</p>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
                <div className="h-40 bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-2">No blog posts yet</p>
            <p className="text-sm text-muted-foreground">Check back soon for car tips, market insights, and more.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                {post.cover_image ? (
                  <img src={post.cover_image} alt={post.title} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-primary/5 flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary/20">M</span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <IconCalendar size={12} />
                    {format(new Date(post.created_at), "MMM d, yyyy")}
                  </div>
                  <h2 className="font-bold text-foreground group-hover:text-primary transition-colors mb-2">{post.title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.content.slice(0, 150)}...</p>
                  <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold mt-3 group-hover:gap-2 transition-all">
                    Read More <IconArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
