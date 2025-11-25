"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import locales from "../i18n/locales.json";

type Locale = "en" | "ar";
type Currency = "USD" | "ILS" | "EUR" | "AED" | "SAR";
type Theme = "light" | "dark" | "system";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  isRTL: boolean;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  formatCurrency: (amount: number) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // ---- Locale ----
  const [locale, setLocaleState] = useState<Locale>("en");

  // ---- Currency ----
  const [currency, setCurrencyState] = useState<Currency>("USD");

  // ---- Theme ----
  const [theme, setThemeState] = useState<Theme>("system");

  const isRTL = locale === "ar";

  // Load saved settings on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    const savedCurrency = localStorage.getItem("currency") as Currency | null;
    const savedTheme = localStorage.getItem("theme") as Theme | null;

    if (savedLocale) setLocaleState(savedLocale);
    if (savedCurrency) setCurrencyState(savedCurrency);
    if (savedTheme) setThemeState(savedTheme);
  }, []);

  // Apply locale change
  useEffect(() => {
    localStorage.setItem("locale", locale);
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale, isRTL]);

  // Apply currency
  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.toggle("dark", systemTheme === "dark");
    } else {
      root.classList.toggle("dark", theme === "dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const setLocale = (newLocale: Locale) => setLocaleState(newLocale);
  const setCurrency = (newCurrency: Currency) => setCurrencyState(newCurrency);
  const setTheme = (newTheme: Theme) => setThemeState(newTheme);

  // ---- Translator ----
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = locales[locale];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }

    return typeof value === "string" ? value : key;
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    const symbols: Record<Currency, string> = {
      USD: "$",
      ILS: "₪",
      EUR: "€",
      AED: "د.إ",
      SAR: "ر.س",
    };

    const formatted = amount.toLocaleString(
      locale === "ar" ? "ar-EG" : "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    );

    return isRTL
      ? `${formatted} ${symbols[currency]}`
      : `${symbols[currency]}${formatted}`;
  };

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        t,
        isRTL,
        currency,
        setCurrency,
        theme,
        setTheme,
        formatCurrency,
      }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
};
