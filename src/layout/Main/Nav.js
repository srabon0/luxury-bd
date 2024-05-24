import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import SearchModal from "../../components/Modals/SearchModal";
import Drawer from "../../components/Shared/Drawer/Drawer";
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
const NavMenu = ({ menu, redirectFunc }) => {
  const location = useLocation();
  return (
    <NavLink
      onClick={redirectFunc}
      currentPath={location.pathname}
      to={menu?.link}
      className="lg:mr-5"
    >
      <span
        className={` rounded text-lg lg:text-lg font-bold font-sans  transition focus:outline-none focus:ring-1 focus:ring-blue-700 focus:ring-offset-2  ${
          location.pathname === menu?.link ? "text-primary" : "text-black"
        }`}
      >
        {menu?.name}
      </span>
    </NavLink>
  );
};

const Nav = () => {
  const [searhcModalOpen, setSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { categoryState } = useSelector((state) => state);
  const navigate = useNavigate();
  const redirectToDetails = (link) => {
    navigate(link);
    setIsMobileMenuOpen(false);
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
    <>
      <div className="navbar bg-base-100 px-8 lg:px-14 md:px-10">
        <div className="navbar-start">
          <div className="cursor-pointer">
            <span
              onClick={() => navigate("/")}
              className="flex items-center whitespace-nowrap text-2xl font-black"
            >
              <span className="mr-2 w-16">
                <img src={mainLogo} alt="" />
              </span>
              <span className="text-secondary font-bold text-2xl italic">
                Classic
              </span>
              <span className="text-violet-700 font-bold text-2xl italic">
                Group
              </span>
            </span>
          </div>
        </div>

        <div
          style={{
            zIndex: 100,
            position: "relative",
          }}
          className="navbar-center hidden lg:flex"
        >
          <ul className="menu menu-horizontal px-1">
            {mainMenuList.map((menu) => (
              <li key={menu.id}>
                <NavMenu menu={menu} />
              </li>
            ))}

            {currentUser && currentUser?.role === "admin" && (
              <>
                {adminMenuList.map((menu) => (
                  <li key={menu.id}>
                    <NavMenu menu={menu} />
                  </li>
                ))}
              </>
            )}
            <li>
              <details close>
                <summary className="text-lg lg:text-lg font-bold font-sans  transition text-black">
                  Categories
                </summary>
                <ul className="rounded-none w-96">
                  {categoryState?.categories?.length &&
                    categoryState?.categories?.map((category) => (
                      <li key={category?._id} className="px-4">
                        <div className="font-bold font-sans stransition focus:outline-none w-full ">
                          {category.name}
                        </div>
                      </li>
                    ))}
                </ul>
              </details>
            </li>
            <button
              onClick={() => setSearchModalOpen(!searhcModalOpen)}
              className="btn btn-ghost btn-square ml-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </ul>
        </div>

        <div className="navbar-end ">
          <div className="dropdown dropdown-end">
            <div className="flex-none block lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-5 h-5 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
            </div>

            {!currentUser && (
              <>
                <div className=" hidden lg:block my-4  items-center space-x-6 space-y-2 lg:my-0 lg:ml-auto lg:space-x-8 lg:space-y-0">
                  <button
                    onClick={() => redirectToDetails("/login")}
                    className="whitespace-nowrap rounded font-medium transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-blue-700 focus:ring-offset-2 hover:text-opacity-50"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => redirectToDetails("/signup")}
                    className="btn btn-primary"
                  >
                    Sign up
                  </button>
                </div>
              </>
            )}
            {currentUser && (
              <>
                <div className="hidden lg:block my-4 items-center space-x-6 space-y-2 lg:my-0 lg:ml-auto lg:space-x-8 lg:space-y-0">
                  <button
                    onClick={logout}
                    className="whitespace-nowrap rounded-xl bg-primary px-5 py-3 font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 hover:bg-blue-600"
                  >
                    Log Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        {searhcModalOpen && <SearchModal setModalOpen={setSearchModalOpen} />}
      </div>
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        direction="left"
        bg="bg-base-100"
      >
        <ul className="menu">
          {mainMenuList.map((menu) => (
            <li key={menu.id}>
              <NavMenu menu={menu} />
            </li>
          ))}

          {currentUser && currentUser?.role === "admin" && (
            <>
              {adminMenuList.map((menu) => (
                <li key={menu.id}>
                  <NavMenu menu={menu} />
                </li>
              ))}
            </>
          )}
          <li>
            <details close>
              <summary className="text-lg lg:text-lg font-bold font-sans transition  ">
                Categories
              </summary>
              <ul className="rounded-none w-96">
                {categoryState?.categories?.length &&
                  categoryState?.categories?.map((category) => (
                    <li key={category?._id} className="px-4">
                      <div className="font-bold font-sans transition focus:outline-none w-full ">
                        {category.name}
                      </div>
                    </li>
                  ))}
              </ul>
            </details>
          </li>

          <button
            onClick={() => setSearchModalOpen(!searhcModalOpen)}
            className="btn btn-ghost flex items-center justify-start"
          >
            <BsSearch className="h-6 w-6" />
            <span className="font-bold font-sans transition text-lg">
              Search
            </span>
          </button>

          <br />
          <hr />

          {!currentUser && (
            <div className="flex items-center justify-evenly mt-10">
              <button
                onClick={() => redirectToDetails("/login")}
                className="btn btn-primary"
              >
                Log in
              </button>
              <button
                onClick={() => redirectToDetails("/signup")}
                className="btn btn-secondary"
              >
                Sign up
              </button>
            </div>
          )}

          {currentUser && (
            <div className="flex items-center justify-between mt-10">
              <button onClick={logout} className="btn btn-primary">
                Logout
              </button>
            </div>
          )}
        </ul>
      </Drawer>
    </>
  );
};

export default Nav;

// <ul
//             tabIndex={0}
//             className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
//           >
//             {currentUser && currentUser?.role === "admin" && (
//               <>
//                 {adminMenuList.map((menu) => (
//                   <li key={menu.id}>
//                     <NavMenu menu={menu} />
//                   </li>
//                 ))}
//               </>
//             )}
//             {!currentUser && (
//               <>
//                 <li>
//                   <button
//                     onClick={() => redirectToDetails("/login")}
//                     className="btn btn-ghost"
//                   >
//                     Log in
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => redirectToDetails("/signup")}
//                     className="btn btn-ghost"
//                   >
//                     Sign up
//                   </button>
//                 </li>
//               </>
//             )}
//             {currentUser && (
//               <>
//                 <li>
//                   <button onClick={logout} className="btn btn-ghost">
//                     Logout
//                   </button>
//                 </li>
//               </>
//             )}
//           </ul>
