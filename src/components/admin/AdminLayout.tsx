import { Navigate, Outlet } from "react-router-dom";
import { useAuth, checkUserIsAdmin } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";

export default function AdminLayout() {
  const { user, loading: authLoading, isAdmin: authContextAdmin } = useAuth();

  const { data: supabaseIsAdmin, isLoading: roleLoading } = useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      if (!user) return false;
      if (checkUserIsAdmin(user)) return true;
      if (user.id.startsWith("demo-")) return authContextAdmin;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");
      return Array.isArray(data) && data.length > 0;
    },
    enabled: !!user,
  });

  const isAdmin = authContextAdmin || supabaseIsAdmin || checkUserIsAdmin(user);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b bg-background px-4 gap-3 shrink-0">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold text-foreground">Admin Dashboard</h1>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
