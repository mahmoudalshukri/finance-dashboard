"use client";

import DashboardLayout from "@/components/Layout/DashboardLayout";
import Dashboard from "./dashboard/page";

export default function Home() {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}
