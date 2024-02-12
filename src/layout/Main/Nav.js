import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or site name */}
        <Link to="/" className="text-gray-800 font-bold text-4xl">
          Classic Group
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-gray-800 focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-4">
          <NavLink to="/" currentPath={location.pathname}>
            Home
          </NavLink>
          <NavLink to="/dashboard" currentPath={location.pathname}>
            Dashboard
          </NavLink>
          <NavLink to="/services" currentPath={location.pathname}>
            Services
          </NavLink>
          <NavLink to="/contact" currentPath={location.pathname}>
            Contact
          </NavLink>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden ${
          isMobileMenuOpen
            ? "block transition-all duration-300"
            : "hidden transition-all duration-300"
        } bg-white`}
      >
        <NavLink to="/" currentPath={location.pathname}>
          Home
        </NavLink>
        <NavLink to="/about" currentPath={location.pathname}>
          About
        </NavLink>
        <NavLink to="/services" currentPath={location.pathname}>
          Services
        </NavLink>
        <NavLink to="/contact" currentPath={location.pathname}>
          Contact
        </NavLink>
      </div>

      {/* <div className="dropdown dropdown-end">
        <div tabindex="0" role="button" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
            />
          </div>
        </div>
        <ul
          tabindex="0"
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <a className="justify-between">
              Profile
              <span className="badge">New</span>
            </a>
          </li>
          <li>
            <a>Settings</a>
          </li>
          <li>
            <a>Logout</a>
          </li>
        </ul>
      </div> */}
    </nav>
  );
};

const NavLink = ({ to, currentPath, children }) => {
  const isActive = to === currentPath;

  return (
    <Link
      to={to}
      className={`block p-4 text-left ${isActive ? "text-emerald-400" : ""}`}
    >
      {children}
    </Link>
  );
};

export default Navbar;
