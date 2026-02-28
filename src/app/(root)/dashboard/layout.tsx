import DashboardLayout from "@/src/components/pages/dashboard/DashboardLayout";
import PrivateRoute from "@/src/components/shared/PrivateRoute";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivateRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </PrivateRoute>
  );
};

export default Layout;
