import DashboardLayout from "@/src/components/pages/dashboard/DashboardLayout";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;
