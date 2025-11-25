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
import { Progress } from "@/components/ui/progress";
import { Plus, Trash2, Target, Calendar } from "lucide-react";
import DashboardLayout from "@/components/Layout/DashboardLayout";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  dueDate: string;
}

const GoalsPage: React.FC = () => {
  const { t, formatCurrency, isRTL } = useLocale();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("goals");
    if (saved) {
      setGoals(JSON.parse(saved));
    }
  }, []);

  const saveGoals = (newGoals: Goal[]) => {
    setGoals(newGoals);
    localStorage.setItem("goals", JSON.stringify(newGoals));
  };

  const handleAddGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newGoal: Goal = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      targetAmount: parseFloat(formData.get("targetAmount") as string),
      savedAmount: parseFloat(formData.get("savedAmount") as string) || 0,
      dueDate: formData.get("dueDate") as string,
    };

    saveGoals([...goals, newGoal]);
    setIsDialogOpen(false);
    e.currentTarget.reset();
  };

  const handleDeleteGoal = (id: string) => {
    saveGoals(goals.filter((g) => g.id !== id));
  };

  const handleUpdateSavedAmount = (id: string, amount: number) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id ? { ...goal, savedAmount: amount } : goal,
    );
    saveGoals(updatedGoals);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div
          className={`flex items-center justify-between ${
            isRTL ? "flex-row-reverse" : ""
          }`}>
          <div>
            <h1 className="text-3xl font-bold">{t("goals.title")}</h1>
            <p className="text-muted-foreground mt-1">{t("goals.progress")}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className={`gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Plus className="w-4 h-4" />
                {t("goals.addGoal")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("goals.addGoal")}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("goals.goalName")}</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder={t("goals.goalName")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAmount">
                    {t("goals.targetAmount")}
                  </Label>
                  <Input
                    id="targetAmount"
                    name="targetAmount"
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="savedAmount">{t("goals.savedSoFar")}</Label>
                  <Input
                    id="savedAmount"
                    name="savedAmount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    defaultValue="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">{t("goals.dueDate")}</Label>
                  <Input id="dueDate" name="dueDate" type="date" required />
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

        {/* Goals Grid */}
        {goals.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => {
              const progress = (goal.savedAmount / goal.targetAmount) * 100;
              const isCompleted = progress >= 100;
              const daysRemaining = Math.ceil(
                (new Date(goal.dueDate).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24),
              );

              return (
                <Card
                  key={goal.id}
                  className={isCompleted ? "border-green-500" : ""}>
                  <CardHeader>
                    <div
                      className={`flex items-start justify-between ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}>
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-primary" />
                          {goal.name}
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteGoal(goal.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div
                        className={`flex items-center justify-between mb-2 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}>
                        <span className="text-sm text-muted-foreground">
                          {t("goals.progress")}
                        </span>
                        <span className="text-sm font-medium">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                      <Progress
                        value={Math.min(progress, 100)}
                        className="h-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <div
                        className={`flex items-center justify-between ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}>
                        <span className="text-sm text-muted-foreground">
                          {t("goals.savedSoFar")}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(goal.savedAmount)}
                        </span>
                      </div>
                      <div
                        className={`flex items-center justify-between ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}>
                        <span className="text-sm text-muted-foreground">
                          {t("goals.targetAmount")}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(goal.targetAmount)}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-2 text-sm text-muted-foreground ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}>
                      <Calendar className="w-4 h-4" />
                      <span>
                        {daysRemaining > 0
                          ? `${daysRemaining} ${
                              isRTL ? "يوم متبقي" : "days remaining"
                            }`
                          : isRTL
                          ? "منتهي"
                          : "Overdue"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`update-${goal.id}`}>
                        {t("common.update")} {t("goals.savedSoFar")}
                      </Label>
                      <div
                        className={`flex gap-2 ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}>
                        <Input
                          id={`update-${goal.id}`}
                          type="number"
                          step="0.01"
                          defaultValue={goal.savedAmount}
                          onBlur={(e) => {
                            const newAmount = parseFloat(e.target.value);
                            if (
                              !isNaN(newAmount) &&
                              newAmount !== goal.savedAmount
                            ) {
                              handleUpdateSavedAmount(goal.id, newAmount);
                            }
                          }}
                        />
                      </div>
                    </div>

                    {isCompleted && (
                      <div className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 p-3 rounded-lg text-center font-medium">
                        🎉 {t("goals.completed")}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <Target className="w-16 h-16 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">{t("goals.noGoals")}</p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className={`gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Plus className="w-4 h-4" />
                  {t("goals.addGoal")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GoalsPage;
