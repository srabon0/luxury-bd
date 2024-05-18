import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { dashboardMenuList } from "./menuList";
const Dashboard = () => {
  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="w-full">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
        </div>
        {/* Page content here */}
        <div className="flex">
          <div className="bg-gray-50">
            <div className="mt-5 hidden lg:block">
              <Link to="/dashboard">
                <h3 className="text-center md:text-2xl text-xl font-bold cursor-pointer">
                  Dashboard
                </h3>
              </Link>
            </div>
            <Sidebar />
          </div>
          <div className="mx-auto p-5 w-4/5">
            <Outlet />
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200">
          {/* Sidebar content here */}
          {dashboardMenuList.map((menu) => (
            <li key={menu.id}>
              <NavLink to={menu?.link}>
                <span className="flex flex-row gap-2 text-lg items-center hover:text-blue-400">
                  {menu.icon}
                  {menu.name}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
