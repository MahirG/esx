import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language } from "@/lib/i18n";

export type ModuleId = "dashboard" | "finance" | "inventory" | "hr" | "sales" | "compliance" | "admin";
export type UserRole = "admin" | "manager" | "staff";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  twoFactorEnabled: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  language: Language;
  activeModule: ModuleId;
  sidebarOpen: boolean;
  theme: "light" | "dark";
  onlineStatus: boolean;
}

interface AuthActions {
  login: (user: User) => void;
  logout: () => void;
  setLanguage: (lang: Language) => void;
  setActiveModule: (module: ModuleId) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  setOnlineStatus: (online: boolean) => void;
}

export const useERPStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      language: "en",
      activeModule: "dashboard",
      sidebarOpen: false,
      theme: "dark",
      onlineStatus: true,

      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null, activeModule: "dashboard" }),
      setLanguage: (language) => set({ language }),
      setActiveModule: (activeModule) => set({ activeModule, sidebarOpen: false }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
      setOnlineStatus: (onlineStatus) => set({ onlineStatus }),
    }),
    {
      name: "addis-erp-store",
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        activeModule: state.activeModule,
      }),
    }
  )
);
