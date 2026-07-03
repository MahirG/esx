"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Globe,
  Wifi,
  WifiOff,
  Check,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useERPStore } from "@/stores/erp-store";
import { useTranslation } from "@/lib/use-translation";
import { cn } from "@/lib/utils";

export function Header() {
  const { t, language, isAmharic, toggleLanguage } = useTranslation();
  const toggleSidebar = useERPStore((s) => s.toggleSidebar);
  const theme = useERPStore((s) => s.theme);
  const toggleTheme = useERPStore((s) => s.toggleTheme);
  const onlineStatus = useERPStore((s) => s.onlineStatus);
  const setOnlineStatus = useERPStore((s) => s.setOnlineStatus);
  const user = useERPStore((s) => s.user);

  const [searchOpen, setSearchOpen] = useState(false);

  const moduleTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: t.dashboard.title, subtitle: t.dashboard.subtitle },
    finance: { title: t.finance.title, subtitle: t.finance.subtitle },
    inventory: { title: t.inventory.title, subtitle: t.inventory.subtitle },
    hr: { title: t.hr.title, subtitle: t.hr.subtitle },
    sales: { title: t.sales.title, subtitle: t.sales.subtitle },
    compliance: { title: t.compliance.title, subtitle: t.compliance.subtitle },
    admin: { title: t.admin.title, subtitle: t.admin.subtitle },
  };

  const activeModule = useERPStore((s) => s.activeModule);
  const currentTitle = moduleTitles[activeModule] || moduleTitles.dashboard;

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-3 px-4 lg:px-6 py-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Page title */}
        <div className="flex-1 min-w-0">
          <h1 className={cn(
            "text-base sm:text-lg font-bold text-foreground truncate",
            isAmharic && "lang-am"
          )}>
            {currentTitle.title}
          </h1>
          <p className="hidden sm:block text-xs text-muted-foreground truncate">
            {currentTitle.subtitle}
          </p>
        </div>

        {/* Search (desktop) */}
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder={t.nav.search}
            className="pl-10 w-64 lg:w-72 bg-muted/40 border-transparent focus-visible:bg-background"
          />
        </div>

        {/* Search (mobile) */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Online/Offline toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 relative"
          onClick={() => setOnlineStatus(!onlineStatus)}
          title={onlineStatus ? t.common.online : t.common.offline}
        >
          {onlineStatus ? (
            <Wifi className="h-4 w-4 text-primary" />
          ) : (
            <WifiOff className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>

        {/* Language toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-1.5 px-2 sm:px-3">
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium hidden sm:inline">
                {isAmharic ? "አማ" : "EN"}
              </span>
              <ChevronDown className="h-3 w-3 hidden sm:inline" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>Language / ቋንቋ</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => !isAmharic && toggleLanguage()}
              className="cursor-pointer"
            >
              <span className="flex-1">English</span>
              {!isAmharic && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => isAmharic && toggleLanguage()}
              className="cursor-pointer lang-am"
            >
              <span className="flex-1">አማርኛ</span>
              {isAmharic && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Badge variant="secondary" className="text-xs">3 new</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <div className="flex items-center gap-2 w-full">
                <div className="h-2 w-2 rounded-full bg-destructive" />
                <span className="text-xs font-medium">VAT Return Overdue</span>
                <span className="text-xs text-muted-foreground ml-auto">2h</span>
              </div>
              <p className="text-xs text-muted-foreground">June VAT return due in 3 days</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <div className="flex items-center gap-2 w-full">
                <div className="h-2 w-2 rounded-full bg-accent-foreground" />
                <span className="text-xs font-medium">Low Stock Alert</span>
                <span className="text-xs text-muted-foreground ml-auto">4h</span>
              </div>
              <p className="text-xs text-muted-foreground">Yirgacheffe Coffee below reorder level</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <div className="flex items-center gap-2 w-full">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-xs font-medium">Payment Received</span>
                <span className="text-xs text-muted-foreground ml-auto">6h</span>
              </div>
              <p className="text-xs text-muted-foreground">ETB 184,000 from Selam Trading</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User avatar */}
        {user && (
          <div className="h-9 w-9 rounded-full gradient-emerald flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user.avatar}
          </div>
        )}
      </div>

      {/* Mobile search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border"
          >
            <div className="p-3 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t.nav.search}
                className="pl-10"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
