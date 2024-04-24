import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { resetCurrentUser } from "../../redux/actions/userAction";
import mainLogo from "./../../assests/svg/classic.svg";
const mainMenuList = [
  {
    id: 1000,
    name: "Home",
    link: "/",
  },
  {
    id: 1001,
    name: "Products",
    link: "/products",
  },
  // {
  //   id: 1002,
  //   name: "About",
  //   link: "/about",
  // },

  {
    id: 1003,
    name: "Contact",
    link: "/contact",
  },
];

const adminMenuList = [
  {
    id: 3000,
    name: "Dashboard",
    link: "/dashboard",
  },
  {
    id: 3001,
    name: "Profile",
    link: "/dashboard/profile",
  },
];
const NavMenu = ({ menu }) => {
  const location = useLocation();
  return (
    <NavLink
      currentPath={location.pathname}
      to={menu?.link}
      className="lg:mr-12"
    >
      <span
        className={`rounded text-md font-semibold font-sans  transition focus:outline-none focus:ring-1 focus:ring-blue-700 focus:ring-offset-2 ${
          location.pathname === menu?.link ? "text-blue-400" : "text-black"
        }`}
      >
        {menu?.name}
      </span>
    </NavLink>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const redirectToDetails = (link) => {
    navigate(link);
  };

  const currentUser = useSelector((state) => state?.userState?.authUser?.user);
  const dispatch = useDispatch();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    dispatch(resetCurrentUser());
    navigate("/login");
  };
  return (
    <header className="text-slate-700 container relative mx-auto flex flex-col overflow-hidden px-4 py-4 lg:flex-row lg:items-center">
      <span className="flex items-center whitespace-nowrap text-2xl font-black">
        <span className="mr-2 w-16">
          <img src={mainLogo} alt="" />
        </span>
        <span className="text-blue-800 font-bold text-2xl italic">Classic</span>
        <span className="text-purple-800 font-bold text-2xl italic">Group</span>
      </span>
      <input type="checkbox" className="peer hidden" id="navbar-open" />
      <label
        className="absolute top-5 right-5 cursor-pointer lg:hidden"
        for="navbar-open"
      >
        <svg
          className="h-7 w-7"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </label>

      <nav
        aria-label="Header Navigation"
        className="peer-checked:pt-8 peer-checked:max-h-60 flex max-h-0 w-full flex-col items-center overflow-hidden transition-all lg:ml-24 lg:max-h-full lg:flex-row"
      >
        <ul className="flex w-full flex-col items-center space-y-2 lg:flex-row lg:justify-center lg:space-y-0">
          {mainMenuList?.map((menu) => (
            <NavMenu key={menu?.id} menu={menu} />
          ))}

          {currentUser && currentUser?.role === "admin" && (
            <>
              {adminMenuList?.map((menu) => (
                <NavMenu key={menu?.id} menu={menu} />
              ))}
            </>
          )}
        </ul>
        {!currentUser && (
          <>
            <hr className="mt-4 w-full lg:hidden" />
            <div className="my-4 flex items-center space-x-6 space-y-2 lg:my-0 lg:ml-auto lg:space-x-8 lg:space-y-0">
              <button
                onClick={() => redirectToDetails("/login")}
                className="whitespace-nowrap rounded font-medium transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-blue-700 focus:ring-offset-2 hover:text-opacity-50"
              >
                Log in
              </button>
              <button
                onClick={() => redirectToDetails("/signup")}
                className="whitespace-nowrap rounded-xl bg-blue-700 px-5 py-3 font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 hover:bg-blue-600"
              >
                Sign up
              </button>
            </div>
          </>
        )}
        {currentUser && (
          <>
            <hr className="mt-4 w-full lg:hidden" />
            <div className="my-4 flex items-center space-x-6 space-y-2 lg:my-0 lg:ml-auto lg:space-x-8 lg:space-y-0">
              <button
                onClick={logout}
                className="whitespace-nowrap rounded-xl bg-blue-700 px-5 py-3 font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 hover:bg-blue-600"
              >
                Log Out
              </button>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
