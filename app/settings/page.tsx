"use client";
import React, { useState, useEffect } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Download,
  Upload,
  Globe,
  DollarSign,
  Palette,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/Layout/DashboardLayout";

type Currency = "USD" | "ILS" | "EUR" | "AED" | "SAR";
type Theme = "light" | "dark" | "system";
type Locale = "en" | "ar";

const SettingsPage: React.FC = () => {
  const {
    t,
    locale,
    setLocale,
    currency,
    setCurrency,
    theme,
    setTheme,
    isRTL,
  } = useLocale();
  const [categories, setCategories] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const defaultCategories = [
      "food",
      "transport",
      "shopping",
      "entertainment",
      "bills",
      "health",
      "education",
      "other",
    ];
    const saved = localStorage.getItem("categories");
    setCategories(saved ? JSON.parse(saved) : defaultCategories);
  }, []);

  const saveCategories = (newCategories: string[]) => {
    setCategories(newCategories);
    localStorage.setItem("categories", JSON.stringify(newCategories));
  };

  const handleAddCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCategory = formData.get("categoryName") as string;

    if (newCategory && !categories.includes(newCategory.toLowerCase())) {
      saveCategories([...categories, newCategory.toLowerCase()]);
      setIsDialogOpen(false);
      toast.success(
        isRTL ? "تمت إضافة الفئة بنجاح" : "Category added successfully",
      );
      e.currentTarget.reset();
    }
  };

  const handleDeleteCategory = (category: string) => {
    const defaultCategories = [
      "food",
      "transport",
      "shopping",
      "entertainment",
      "bills",
      "health",
      "education",
      "other",
    ];
    if (defaultCategories.includes(category)) {
      toast.error(
        isRTL
          ? "لا يمكن حذف الفئات الافتراضية"
          : "Cannot delete default categories",
      );
      return;
    }
    saveCategories(categories.filter((c) => c !== category));
    toast.success(
      isRTL ? "تم حذف الفئة بنجاح" : "Category deleted successfully",
    );
  };

  const handleExportData = () => {
    const data = {
      expenses: localStorage.getItem("expenses"),
      income: localStorage.getItem("income"),
      goals: localStorage.getItem("goals"),
      categories: localStorage.getItem("categories"),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finance-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(
      isRTL ? "تم تصدير البيانات بنجاح" : "Data exported successfully",
    );
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.expenses) localStorage.setItem("expenses", data.expenses);
        if (data.income) localStorage.setItem("income", data.income);
        if (data.goals) localStorage.setItem("goals", data.goals);
        if (data.categories)
          localStorage.setItem("categories", data.categories);

        toast.success(
          isRTL ? "تم استيراد البيانات بنجاح" : "Data imported successfully",
        );
        setTimeout(() => window.location.reload(), 1000);
      } catch {
        toast.error(isRTL ? "فشل استيراد البيانات" : "Failed to import data");
      }
    };
    reader.readAsText(file);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("settings.title")}</h1>
          <p className="text-muted-foreground mt-1">
            {isRTL ? "إدارة تفضيلات التطبيق" : "Manage your app preferences"}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle
                className={`flex items-center gap-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}>
                <Globe className="w-5 h-5" />
                {t("settings.language")}
              </CardTitle>
              <CardDescription>
                {isRTL ? "اختر لغة التطبيق" : "Choose your app language"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={locale}
                onValueChange={(value: Locale) => setLocale(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Currency Settings */}
          <Card>
            <CardHeader>
              <CardTitle
                className={`flex items-center gap-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}>
                <DollarSign className="w-5 h-5" />
                {t("settings.currency")}
              </CardTitle>
              <CardDescription>
                {isRTL
                  ? "اختر عملتك المفضلة"
                  : "Choose your preferred currency"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={currency}
                onValueChange={(value: Currency) => setCurrency(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="ILS">ILS (₪)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="AED">AED (د.إ)</SelectItem>
                  <SelectItem value="SAR">SAR (ر.س)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle
                className={`flex items-center gap-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}>
                <Palette className="w-5 h-5" />
                {t("settings.theme")}
              </CardTitle>
              <CardDescription>
                {isRTL ? "اختر مظهر التطبيق" : "Choose your app theme"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={theme}
                onValueChange={(value: Theme) => setTheme(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t("settings.light")}</SelectItem>
                  <SelectItem value="dark">{t("settings.dark")}</SelectItem>
                  <SelectItem value="system">{t("settings.system")}</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle
                className={`flex items-center gap-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}>
                <Download className="w-5 h-5" />
                {isRTL ? "إدارة البيانات" : "Data Management"}
              </CardTitle>
              <CardDescription>
                {isRTL
                  ? "تصدير واستيراد بياناتك"
                  : "Export and import your data"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleExportData}
                variant="outline"
                className={`w-full gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Download className="w-4 h-4" />
                {t("settings.exportData")}
              </Button>
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                  id="import-file"
                />
                <Button
                  onClick={() =>
                    document.getElementById("import-file")?.click()
                  }
                  variant="outline"
                  className={`w-full gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Upload className="w-4 h-4" />
                  {t("settings.importData")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Management */}
        <Card>
          <CardHeader>
            <div
              className={`flex items-center justify-between ${
                isRTL ? "flex-row-reverse" : ""
              }`}>
              <div>
                <CardTitle
                  className={`flex items-center gap-2 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}>
                  <Tag className="w-5 h-5" />
                  {t("settings.manageCategories")}
                </CardTitle>
                <CardDescription>
                  {isRTL
                    ? "إضافة وإدارة فئات المصروفات"
                    : "Add and manage expense categories"}
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className={`gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Plus className="w-4 h-4" />
                    {t("settings.addCategory")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("settings.addCategory")}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddCategory} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="categoryName">
                        {t("settings.categoryName")}
                      </Label>
                      <Input
                        id="categoryName"
                        name="categoryName"
                        required
                        placeholder={t("settings.categoryName")}
                      />
                    </div>
                    <div
                      className={`flex gap-2 ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}>
                      <Button type="submit" className="flex-1">
                        {t("common.add")}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="flex-1">
                        {t("common.cancel")}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className={`px-3 py-2 flex items-center gap-2 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}>
                  {t(`categories.${category}`)}
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className="hover:text-red-600 transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
