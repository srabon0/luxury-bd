import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="mx-auto p-5 w-4/5">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
