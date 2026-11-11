import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import { IconPlus, IconEdit, IconTrash, IconBold, IconItalic, IconH1, IconH2, IconList, IconListNumbers, IconQuote, IconEye, IconCode } from "@tabler/icons-react";
import { renderBlogMarkdown } from "@/lib/blogMarkdown";

type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string | null;
  published: boolean;
  created_at: string;
  author_id: string;
};

type PostForm = {
  title: string;
  slug: string;
  content: string;
  cover_image: string;
  published: boolean;
};

const emptyForm: PostForm = { title: "", slug: "", content: "", cover_image: "", published: false };

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

// Markdown → HTML for preview (shared with the public blog post renderer)
const renderMarkdown = renderBlogMarkdown;

interface ToolbarButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  title: string;
  onClick: () => void;
}

function ToolbarButton({ icon: Icon, title, onClick }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
    >
      <Icon size={14} stroke={2} />
    </button>
  );
}

function MarkdownEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  const wrap = (before: string, after: string, placeholder = "text") => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || placeholder;
    const newVal = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(newVal);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const insertLine = (prefix: string) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const newVal = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    onChange(newVal);
    setTimeout(() => { el.focus(); el.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length); }, 0);
  };

  return (
    <div className="border border-input rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-input bg-muted/30 flex-wrap">
        <ToolbarButton icon={IconBold} title="Bold (**text**)" onClick={() => wrap("**", "**")} />
        <ToolbarButton icon={IconItalic} title="Italic (*text*)" onClick={() => wrap("*", "*")} />
        <ToolbarButton icon={IconCode} title="Inline code (`code`)" onClick={() => wrap("`", "`", "code")} />
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton icon={IconH1} title="Heading 1" onClick={() => insertLine("# ")} />
        <ToolbarButton icon={IconH2} title="Heading 2" onClick={() => insertLine("## ")} />
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton icon={IconList} title="Bullet list" onClick={() => insertLine("- ")} />
        <ToolbarButton icon={IconListNumbers} title="Numbered list" onClick={() => insertLine("1. ")} />
        <ToolbarButton icon={IconQuote} title="Blockquote" onClick={() => insertLine("> ")} />
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => setPreview(p => !p)}
          className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${preview ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground"}`}
        >
          <IconEye size={13} /> {preview ? "Editing" : "Preview"}
        </button>
      </div>

      {preview ? (
        <div
          className="min-h-[280px] p-3 text-sm text-foreground prose prose-sm max-w-none overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: `<p class='mb-3'>${renderMarkdown(value || "_Nothing to preview yet_")}</p>` }}
        />
      ) : (
        <Textarea
          ref={ref}
          placeholder="Write your blog post content here...&#10;&#10;Use **bold**, *italic*, # Heading, - list, > quote, `code`"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={14}
          className="border-0 rounded-none focus-visible:ring-0 resize-y font-mono text-sm"
        />
      )}
      <div className="px-3 py-1 border-t border-input bg-muted/20 text-xs text-muted-foreground text-right">
        {value.length} chars · {value.split(/\s+/).filter(Boolean).length} words
      </div>
    </div>
  );
}

export default function AdminBlog() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState<PostForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, content, cover_image, published, created_at, author_id")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Post[];
    },
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from("blog_posts").update({ published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blog"] }); toast.success("Post updated"); },
  });

  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blog"] }); toast.success("Post deleted"); },
  });

  const openNew = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (post: Post) => {
    setEditing(post);
    setForm({ title: post.title, slug: post.slug, content: post.content, cover_image: post.cover_image ?? "", published: post.published });
    setDialogOpen(true);
  };

  const handleTitleChange = (title: string) => {
    setForm(f => ({ ...f, title, slug: editing ? f.slug : slugify(title) }));
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      toast.error("Title, slug, and content are required.");
      return;
    }
    if (!user) return;
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      content: form.content.trim(),
      cover_image: form.cover_image.trim() || null,
      published: form.published,
    };

    const { error } = editing
      ? await supabase.from("blog_posts").update(payload).eq("id", editing.id)
      : await supabase.from("blog_posts").insert({ ...payload, author_id: user.id });

    if (error) {
      toast.error("Failed to save post: " + error.message);
    } else {
      toast.success(editing ? "Post updated" : "Post created");
      setDialogOpen(false);
      qc.invalidateQueries({ queryKey: ["admin-blog"] });
    }
    setSaving(false);
  };

  if (isLoading) return <div className="text-muted-foreground">Loading blog posts…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Manage Blog</h2>
        <Button onClick={openNew} className="gap-1"><IconPlus size={16} /> New Post</Button>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No blog posts yet. Create your first one!</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{p.title}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{p.slug}</TableCell>
                  <TableCell>
                    <Badge variant={p.published ? "default" : "secondary"}>{p.published ? "Published" : "Draft"}</Badge>
                  </TableCell>
                  <TableCell>{format(new Date(p.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="space-x-1">
                    <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                      <IconEdit size={14} className="mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => togglePublish.mutate({ id: p.id, published: !p.published })}>
                      {p.published ? "Unpublish" : "Publish"}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => { if (confirm(`Delete "${p.title}"?`)) deletePost.mutate(p.id); }}>
                      <IconTrash size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Post" : "New Blog Post"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Title *</Label>
                <Input placeholder="Post title" value={form.title} onChange={e => handleTitleChange(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Slug *</Label>
                <Input placeholder="url-friendly-slug" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))} />
                <p className="text-xs text-muted-foreground">/blog/{form.slug || "your-slug"}</p>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Cover Image URL</Label>
              <Input placeholder="https://..." value={form.cover_image} onChange={e => setForm(f => ({ ...f, cover_image: e.target.value }))} />
              {form.cover_image && (
                <img src={form.cover_image} alt="" className="h-24 rounded-lg object-cover mt-1" onError={e => (e.currentTarget.style.display = "none")} />
              )}
            </div>
            <div className="space-y-1">
              <Label>Content * <span className="text-xs text-muted-foreground font-normal">(Markdown supported)</span></Label>
              <MarkdownEditor value={form.content} onChange={v => setForm(f => ({ ...f, content: v }))} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="published" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="accent-primary" />
              <Label htmlFor="published" className="cursor-pointer">Publish immediately</Label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editing ? "Save Changes" : "Create Post"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
