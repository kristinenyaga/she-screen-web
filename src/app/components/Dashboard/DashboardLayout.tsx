"use client"
import React, { useState } from "react";
import SideBar from "./sidebar/SideBar";

const DashboardLayout = ({ children }) => {
  const [showSideBar, setShowSideBar] = useState(false);

  return (
    <div className='layout'>
      <div>
        <SideBar showSideBar={showSideBar} setShowSideBar={setShowSideBar} />
      </div>
      <main className='content'>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
