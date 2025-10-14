import React from "react";
import AdminHeader from "../admin-header/admin-header";
import AdminFooter from "../admin-footer/admin-footer";

const AppLayout = ({ children }) => {
  return (
    <>
      <AdminHeader />
      <main className="pt-12 sm:pt-16 min-h-screen bg-premium-cream">
        {children}
      </main>
      <AdminFooter />
    </>
  );
};

export default AppLayout;
