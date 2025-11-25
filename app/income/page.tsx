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
import { Plus, Trash2, TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/Layout/DashboardLayout";

interface Income {
  id: string;
  amount: number;
  source: string;
  type: "fixed" | "variable";
  date: string;
}

const IncomePage: React.FC = () => {
  const { t, formatCurrency, isRTL } = useLocale();
  const [income, setIncome] = useState<Income[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("income");
    if (saved) {
      setIncome(JSON.parse(saved));
    }
  }, []);

  const saveIncome = (newIncome: Income[]) => {
    setIncome(newIncome);
    localStorage.setItem("income", JSON.stringify(newIncome));
  };

  const handleAddIncome = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newIncome: Income = {
      id: Date.now().toString(),
      amount: parseFloat(formData.get("amount") as string),
      source: formData.get("source") as string,
      type: formData.get("type") as "fixed" | "variable",
      date: formData.get("date") as string,
    };

    saveIncome([...income, newIncome]);
    setIsDialogOpen(false);
    e.currentTarget.reset();
  };

  const handleDeleteIncome = (id: string) => {
    saveIncome(income.filter((i) => i.id !== id));
  };

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyIncome = income
    .filter((i) => i.date.startsWith(currentMonth))
    .reduce((sum, i) => sum + i.amount, 0);

  const fixedIncome = income
    .filter((i) => i.type === "fixed" && i.date.startsWith(currentMonth))
    .reduce((sum, i) => sum + i.amount, 0);

  const variableIncome = income
    .filter((i) => i.type === "variable" && i.date.startsWith(currentMonth))
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div
          className={`flex items-center justify-between ${
            isRTL ? "flex-row-reverse" : ""
          }`}>
          <div>
            <h1 className="text-3xl font-bold">{t("income.title")}</h1>
            <p className="text-muted-foreground mt-1">
              {t("income.monthlyIncome")}
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className={`gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Plus className="w-4 h-4" />
                {t("income.addIncome")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("income.addIncome")}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddIncome} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">{t("income.amount")}</Label>
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
                  <Label htmlFor="source">{t("income.source")}</Label>
                  <Input
                    id="source"
                    name="source"
                    required
                    placeholder={t("income.source")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">{t("income.type")}</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">{t("income.fixed")}</SelectItem>
                      <SelectItem value="variable">
                        {t("income.variable")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">{t("income.date")}</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("income.total")}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(monthlyIncome)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {t("income.fixed")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(fixedIncome)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {t("income.variable")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(variableIncome)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Income Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t("income.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            {income.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("income.date")}</TableHead>
                      <TableHead>{t("income.source")}</TableHead>
                      <TableHead>{t("income.type")}</TableHead>
                      <TableHead>{t("income.amount")}</TableHead>
                      <TableHead>{t("common.delete")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {income.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {new Date(item.date).toLocaleDateString(
                            isRTL ? "ar-EG" : "en-US",
                          )}
                        </TableCell>
                        <TableCell>{item.source}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.type === "fixed" ? "default" : "secondary"
                            }>
                            {t(`income.${item.type}`)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(item.amount)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteIncome(item.id)}>
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
                {t("income.noIncome")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default IncomePage;
