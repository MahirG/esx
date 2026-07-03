"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useERPStore } from "@/stores/erp-store";
import { LoginScreen } from "@/components/erp/auth/login-screen";
import { Sidebar } from "@/components/erp/layout/sidebar";
import { Header } from "@/components/erp/layout/header";
import { DashboardModule } from "@/components/erp/modules/dashboard";
import { FinanceModule } from "@/components/erp/modules/finance";
import { InventoryModule } from "@/components/erp/modules/inventory";
import { HRModule } from "@/components/erp/modules/hr";
import { SalesModule } from "@/components/erp/modules/sales";
import { ComplianceModule } from "@/components/erp/modules/compliance";
import { AdminModule } from "@/components/erp/modules/admin";

export default function Home() {
  const isAuthenticated = useERPStore((s) => s.isAuthenticated);
  const activeModule = useERPStore((s) => s.activeModule);
  const theme = useERPStore((s) => s.theme);
  const language = useERPStore((s) => s.language);

  // Apply theme class
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Apply language attribute
  useEffect(() => {
    document.documentElement.lang = language;
    if (language === "am") {
      document.documentElement.classList.add("lang-am");
    } else {
      document.documentElement.classList.remove("lang-am");
    }
  }, [language]);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <DashboardModule />;
      case "finance":
        return <FinanceModule />;
      case "inventory":
        return <InventoryModule />;
      case "hr":
        return <HRModule />;
      case "sales":
        return <SalesModule />;
      case "compliance":
        return <ComplianceModule />;
      case "admin":
        return <AdminModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 ethiopian-pattern">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderModule()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
