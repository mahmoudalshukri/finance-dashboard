"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import {
  LayoutDashboard,
  TrendingDown,
  TrendingUp,
  Target,
  Settings,
  Menu,
  Moon,
  Sun,
} from "lucide-react";

import { useLocale } from "@/contexts/LocaleContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { t, isRTL, theme, setTheme } = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: t("nav.dashboard") },
    { path: "/expenses", icon: TrendingDown, label: t("nav.expenses") },
    { path: "/income", icon: TrendingUp, label: t("nav.income") },
    { path: "/goals", icon: Target, label: t("nav.goals") },
    { path: "/settings", icon: Settings, label: t("nav.settings") },
  ];

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b flex justify-between items-center">
        <h1
          className={`text-2xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent ${
            isRTL ? "text-right" : "text-left"
          }`}>
          {t("dashboard.title")}
        </h1>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="hidden lg:flex">
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-accent text-muted-foreground hover:text-foreground"
              } ${isRTL ? "flex-row-reverse" : ""}`}>
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Sidebar – Desktop */}
      <aside
        className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col bg-card ${
          isRTL ? "lg:right-0 border-l" : "lg:left-0 border-r"
        }`}>
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b">
        <div
          className={`flex items-center justify-between p-4 ${
            isRTL ? "flex-row-reverse" : ""
          }`}>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side={isRTL ? "right" : "left"} className="w-72 p-0">
              <NavContent />
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-bold">{t("dashboard.title")}</h1>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className={`pt-16 lg:pt-0 ${isRTL ? "lg:pr-72" : "lg:pl-72"}`}>
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
