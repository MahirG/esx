"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Wallet,
  Package,
  Users,
  ShoppingCart,
  ShieldCheck,
  Settings,
  Building2,
  X,
  LogOut,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useERPStore, type ModuleId } from "@/stores/erp-store";
import { useTranslation } from "@/lib/use-translation";
import { cn } from "@/lib/utils";

interface NavItem {
  id: ModuleId;
  label: string;
  icon: React.ReactNode;
  roles: Array<"admin" | "manager" | "staff">;
}

export function Sidebar() {
  const { t } = useTranslation();
  const activeModule = useERPStore((s) => s.activeModule);
  const setActiveModule = useERPStore((s) => s.setActiveModule);
  const sidebarOpen = useERPStore((s) => s.sidebarOpen);
  const setSidebarOpen = useERPStore((s) => s.setSidebarOpen);
  const user = useERPStore((s) => s.user);
  const logout = useERPStore((s) => s.logout);
  const onlineStatus = useERPStore((s) => s.onlineStatus);

  const navItems: NavItem[] = [
    { id: "dashboard", label: t.nav.dashboard, icon: <LayoutDashboard className="h-5 w-5" />, roles: ["admin", "manager", "staff"] },
    { id: "finance", label: t.nav.finance, icon: <Wallet className="h-5 w-5" />, roles: ["admin", "manager"] },
    { id: "inventory", label: t.nav.inventory, icon: <Package className="h-5 w-5" />, roles: ["admin", "manager", "staff"] },
    { id: "hr", label: t.nav.hr, icon: <Users className="h-5 w-5" />, roles: ["admin", "manager"] },
    { id: "sales", label: t.nav.sales, icon: <ShoppingCart className="h-5 w-5" />, roles: ["admin", "manager", "staff"] },
    { id: "compliance", label: t.nav.compliance, icon: <ShieldCheck className="h-5 w-5" />, roles: ["admin", "manager"] },
    { id: "admin", label: t.nav.admin, icon: <Settings className="h-5 w-5" />, roles: ["admin"] },
  ];

  const visibleItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  const handleNavClick = (id: ModuleId) => {
    setActiveModule(id);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl gradient-emerald flex items-center justify-center text-white shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sidebar-foreground text-sm leading-tight">{t.brand}</p>
            <p className="text-[10px] text-muted-foreground leading-tight">{t.tagline}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-8 w-8"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2">
          {t.nav.modules}
        </p>
        <ul className="space-y-1">
          {visibleItems.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <span className={cn("transition-colors", isActive ? "text-sidebar-primary-foreground" : "text-muted-foreground group-hover:text-sidebar-accent-foreground")}>
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-dot"
                      className="h-1.5 w-1.5 rounded-full bg-sidebar-primary-foreground"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User card & logout */}
      <div className="p-3 border-t border-sidebar-border space-y-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent/50">
          <div className={cn(
            "h-2 w-2 rounded-full",
            onlineStatus ? "bg-primary" : "bg-muted-foreground"
          )} />
          <span className="text-xs text-muted-foreground flex-1">
            {onlineStatus ? (
              <span className="flex items-center gap-1"><Wifi className="h-3 w-3" />{t.common.online}</span>
            ) : (
              <span className="flex items-center gap-1"><WifiOff className="h-3 w-3" />{t.common.offline}</span>
            )}
          </span>
        </div>

        {user && (
          <div className="flex items-center gap-3 p-2 rounded-lg">
            <div className="h-9 w-9 rounded-full gradient-emerald flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate capitalize">{user.role}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-border bg-sidebar h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-sidebar z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
