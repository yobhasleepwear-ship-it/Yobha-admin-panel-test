import React from "react";
import Header from "../app-header/app-header";
import Footer from "../footer/footer";
import Sidebar from "../sidebar/sidebar";

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header at top */}
      <Header />

      {/* Main area with sidebar and content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="flex-none">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 p-4">{children}</main>
      </div>

      {/* Footer at bottom */}
      <Footer />
    </div>
  );
};

export default AppLayout;
