// Lightweight markdown -> HTML renderer shared by the admin editor preview
// and the public blog post page. Intentionally dependency-free (no remark/marked)
// to match the existing plain-text `blog_posts.content` column.
export function renderBlogMarkdown(md: string): string {
  return md
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^#{3}\s(.+)$/gm, "<h3 class='text-lg font-bold mt-6 mb-2'>$1</h3>")
    .replace(/^#{2}\s(.+)$/gm, "<h2 class='text-xl font-bold mt-8 mb-3'>$1</h2>")
    .replace(/^#{1}\s(.+)$/gm, "<h1 class='text-2xl font-bold mt-8 mb-3'>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code class='bg-muted px-1 rounded text-sm font-mono'>$1</code>")
    .replace(/^> (.+)$/gm, "<blockquote class='border-l-4 border-primary pl-4 text-muted-foreground italic my-2'>$1</blockquote>")
    .replace(/^\d+\.\s(.+)$/gm, "<li class='list-decimal ml-6'>$1</li>")
    .replace(/^[-*]\s(.+)$/gm, "<li class='list-disc ml-6'>$1</li>")
    .replace(/\n\n/g, "</p><p class='mb-4'>")
    .replace(/\n/g, "<br/>");
}
