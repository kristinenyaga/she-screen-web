"use client";
import React, { useState,ReactNode } from "react";
import SideBar from "./sidebar/SideBar";

type DashboardLayoutProps = {
  children: ReactNode;
};
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="flex h-screen">
      <SideBar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />
      <main
        className={`transition-all duration-500 ease-in-out ${isSidebarExpanded ? 'ml-72' : 'ml-20'
          } w-full px-6 py-8`}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
