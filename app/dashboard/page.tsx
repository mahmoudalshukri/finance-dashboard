"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  LucideIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
}

interface Income {
  id: string;
  amount: number;
  source: string;
  type: "fixed" | "variable";
  date: string;
}

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  dueDate: string;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: number;
  color: string;
}

const Dashboard: React.FC = () => {
  const { t, formatCurrency, isRTL } = useLocale();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");
    const savedIncome = localStorage.getItem("income");
    const savedGoals = localStorage.getItem("goals");

    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedIncome) setIncome(JSON.parse(savedIncome));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const monthlyExpenses = expenses
    .filter((e) => e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + e.amount, 0);

  const monthlyIncome = income
    .filter((i) => i.date.startsWith(currentMonth))
    .reduce((sum, i) => sum + i.amount, 0);

  const netSavings = monthlyIncome - monthlyExpenses;
  const remainingBudget = monthlyIncome - monthlyExpenses;

  // Expense by category data
  const expensesByCategory = expenses
    .filter((e) => e.date.startsWith(currentMonth))
    .reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name: t(`categories.${name}`),
    value,
  }));

  const COLORS = [
    "#4F46E5",
    "#22C55E",
    "#EF4444",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#6366F1",
  ];

  // Monthly cash flow data (last 6 months)
  const getLast6Months = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push(date.toISOString().slice(0, 7));
    }
    return months;
  };

  const cashFlowData = getLast6Months().map((month) => {
    const monthExpenses = expenses
      .filter((e) => e.date.startsWith(month))
      .reduce((sum, e) => sum + e.amount, 0);

    const monthIncome = income
      .filter((i) => i.date.startsWith(month))
      .reduce((sum, i) => sum + i.amount, 0);

    return {
      month: new Date(month).toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
        month: "short",
      }),
      income: monthIncome,
      expenses: monthExpenses,
    };
  });

  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    trend,
    color,
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p
            className={`text-xs ${
              trend > 0 ? "text-green-600" : "text-red-600"
            } mt-1`}>
            {trend > 0 ? "+" : ""}
            {trend}% {t("dashboard.thisMonth")}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("dashboard.thisMonth")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("dashboard.totalIncome")}
          value={formatCurrency(monthlyIncome)}
          icon={TrendingUp}
          color="text-green-600"
        />
        <StatCard
          title={t("dashboard.totalExpenses")}
          value={formatCurrency(monthlyExpenses)}
          icon={TrendingDown}
          color="text-red-600"
        />
        <StatCard
          title={t("dashboard.netSavings")}
          value={formatCurrency(netSavings)}
          icon={Wallet}
          color="text-blue-600"
        />
        <StatCard
          title={t("dashboard.remainingBudget")}
          value={formatCurrency(remainingBudget)}
          icon={Target}
          color="text-purple-600"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.monthlyCashFlow")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#22C55E"
                  strokeWidth={2}
                  name={t("dashboard.totalIncome")}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name={t("dashboard.totalExpenses")}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.expensesByCategory")}</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent = 0 }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                {t("expenses.noExpenses")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Goals */}
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.activeGoals")}</CardTitle>
        </CardHeader>
        <CardContent>
          {goals.length > 0 ? (
            <div className="space-y-4">
              {goals.slice(0, 3).map((goal) => {
                const progress = (goal.savedAmount / goal.targetAmount) * 100;
                return (
                  <div key={goal.id} className="space-y-2">
                    <div
                      className={`flex items-center justify-between ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}>
                      <span className="font-medium">{goal.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(goal.savedAmount)} /{" "}
                        {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {progress.toFixed(0)}% {t("goals.completed")}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              {t("goals.noGoals")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
