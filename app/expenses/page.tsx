"use client";
import React, { useState, useEffect } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Filter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import DashboardLayout from "@/components/Layout/DashboardLayout";

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  recurring: boolean;
}

const Expenses: React.FC = () => {
  const { t, formatCurrency, isRTL } = useLocale();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterMonth, setFilterMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );

  const categories = [
    "food",
    "transport",
    "shopping",
    "entertainment",
    "bills",
    "health",
    "education",
    "other",
  ];

  useEffect(() => {
    const saved = localStorage.getItem("expenses");
    if (saved) {
      setExpenses(JSON.parse(saved));
    }
  }, []);

  const saveExpenses = (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
    localStorage.setItem("expenses", JSON.stringify(newExpenses));
  };

  const handleAddExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(formData.get("amount") as string),
      category: formData.get("category") as string,
      date: formData.get("date") as string,
      description: formData.get("description") as string,
      recurring: formData.get("recurring") === "on",
    };

    saveExpenses([...expenses, newExpense]);
    setIsDialogOpen(false);
    e.currentTarget.reset();
  };

  const handleDeleteExpense = (id: string) => {
    saveExpenses(expenses.filter((e) => e.id !== id));
  };

  const filteredExpenses = expenses.filter((expense) => {
    const categoryMatch =
      filterCategory === "all" || expense.category === filterCategory;
    const monthMatch = expense.date.startsWith(filterMonth);
    return categoryMatch && monthMatch;
  });

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const recurringExpenses = filteredExpenses.filter((e) => e.recurring);
  const recurringTotal = recurringExpenses.reduce(
    (sum, e) => sum + e.amount,
    0,
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div
          className={`flex items-center justify-between ${
            isRTL ? "flex-row-reverse" : ""
          }`}>
          <div>
            <h1 className="text-3xl font-bold">{t("expenses.title")}</h1>
            <p className="text-muted-foreground mt-1">
              {t("expenses.monthlyExpenseSummary")}
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className={`gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Plus className="w-4 h-4" />
                {t("expenses.addExpense")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("expenses.addExpense")}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">{t("expenses.amount")}</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">{t("expenses.category")}</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {t(`categories.${cat}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">{t("expenses.date")}</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">
                    {t("expenses.description")}
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    required
                    placeholder={t("expenses.description")}
                  />
                </div>
                <div
                  className={`flex items-center gap-2 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}>
                  <Checkbox id="recurring" name="recurring" />
                  <Label htmlFor="recurring" className="cursor-pointer">
                    {t("expenses.recurring")}
                  </Label>
                </div>
                <div
                  className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Button type="submit" className="flex-1">
                    {t("common.save")}
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

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {t("expenses.total")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalExpenses)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {t("expenses.recurringSubscriptions")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(recurringTotal)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {recurringExpenses.length} {t("expenses.recurring")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {t("common.filter")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("expenses.allCategories")}
                  </SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {t(`categories.${cat}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Expenses Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t("expenses.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredExpenses.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("expenses.date")}</TableHead>
                      <TableHead>{t("expenses.category")}</TableHead>
                      <TableHead>{t("expenses.description")}</TableHead>
                      <TableHead>{t("expenses.amount")}</TableHead>
                      <TableHead>{t("common.delete")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          {new Date(expense.date).toLocaleDateString(
                            isRTL ? "ar-EG" : "en-US",
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {t(`categories.${expense.category}`)}
                          </Badge>
                          {expense.recurring && (
                            <Badge
                              variant="secondary"
                              className={isRTL ? "mr-2" : "ml-2"}>
                              {t("expenses.recurring")}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(expense.amount)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteExpense(expense.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                {t("expenses.noExpenses")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Expenses;
