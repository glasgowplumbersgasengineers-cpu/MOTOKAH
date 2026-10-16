import { useEffect, useState } from "react";
import {
  IconLayoutDashboard,
  IconCar,
  IconUsers,
  IconFlag,
  IconArticle,
  IconMail,
  IconNews,
  IconBuildingStore,
  IconArrowLeft,
  IconCalendarEvent,
  IconChartBar,
} from "@tabler/icons-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Overview", url: "/admin", icon: IconLayoutDashboard },
  { title: "Analytics", url: "/admin/analytics", icon: IconChartBar },
  { title: "Listings", url: "/admin/listings", icon: IconCar },
  { title: "Users", url: "/admin/users", icon: IconUsers },
  { title: "Reports", url: "/admin/reports", icon: IconFlag },
  { title: "Blog", url: "/admin/blog", icon: IconArticle },
  { title: "Contact Messages", url: "/admin/contacts", icon: IconMail },
  { title: "Newsletter", url: "/admin/newsletter", icon: IconNews },
  { title: "Dealer Applications", url: "/admin/dealers", icon: IconBuildingStore, badgeKey: "dealerApps" },
  { title: "Content Calendar", url: "/admin/content", icon: IconCalendarEvent },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const [pendingDealers, setPendingDealers] = useState(0);

  useEffect(() => {
    supabase
      .from("dealer_applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .then(({ count }) => setPendingDealers(count ?? 0));
  }, []);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const badgeCount = item.badgeKey === "dealerApps" ? pendingDealers : 0;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/admin"}
                        className="hover:bg-muted/50"
                        activeClassName="bg-muted text-primary font-medium"
                      >
                        <item.icon className="mr-2 h-4 w-4 shrink-0" />
                        {!collapsed && (
                          <span className="flex-1 flex items-center justify-between gap-2">
                            {item.title}
                            {badgeCount > 0 && (
                              <span className="ml-auto inline-flex items-center justify-center h-4 min-w-[1rem] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold leading-none">
                                {badgeCount}
                              </span>
                            )}
                          </span>
                        )}
                        {collapsed && badgeCount > 0 && (
                          <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-destructive" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/" className="hover:bg-muted/50">
                <IconArrowLeft className="mr-2 h-4 w-4 shrink-0" />
                {!collapsed && <span>Back to Site</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
