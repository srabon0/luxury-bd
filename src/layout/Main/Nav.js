import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { resetCurrentUser } from "../../redux/actions/userAction";
import mainLogo from "./../../assests/svg/classic.svg";
import Test from "./Test";
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
        className={` rounded text-lg lg:text-lg font-bold font-sans  transition focus:outline-none focus:ring-1 focus:ring-blue-700 focus:ring-offset-2  ${
          location.pathname === menu?.link ? "text-primary" : "text-black"
        }`}
      >
        {menu?.name}
      </span>
    </NavLink>
  );
};

const sampleMenuData = [
  {
    label: "Home",
    children: [
      {
        label: "About",
        children: [
          {
            label: "Mission",
          },
          {
            label: "Vision",
          },
        ],
      },
      {
        label: "Contact",
      },
    ],
  },
  {
    label: "Services",
    children: [
      {
        label: "Service 1",
      },
      {
        label: "Service 2",
      },
    ],
  },
  {
    label: "Products",
    children: [
      {
        label: "Product 1",
      },
      {
        label: "Product 2",
      },
    ],
  },
];

const mother = [
  {
    label: "Products",
    children: sampleMenuData,
  },
];

const Nav = () => {
  const { categoryState } = useSelector((state) => state);
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
    <div className="navbar bg-base-100 px-14">
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
      {/* <div
        style={{
          zIndex: 100000,
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
          <li>
            <details close>
              <summary className="text-lg lg:text-lg font-bold font-sans  transition focus:outline-none focus:ring-1 focus:ring-blue-700 focus:ring-offset-2">
                Products
              </summary>
              <ul className="rounded-none">
                {categoryState?.categories?.length &&
                  categoryState?.categories?.map((category) => (
                    <li key={category?._id} className="px-4">
                      <div className=" py-2 font-bold font-sans stransition focus:outline-none w-full focus:ring-1 focus:ring-blue-700 focus:ring-offset-2">
                        {category.name}
                      </div>
                    </li>
                  ))}
              </ul>
            </details>
          </li>
        </ul>
      </div> */}
       <Test data={mother} />
      <div className="navbar-end ">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar mt-2"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {currentUser && currentUser?.role === "admin" && (
              <>
                {adminMenuList.map((menu) => (
                  <li key={menu.id}>
                    <NavMenu menu={menu} />
                  </li>
                ))}
              </>
            )}
            {!currentUser && (
              <>
                <li>
                  <button
                    onClick={() => redirectToDetails("/login")}
                    className="btn btn-ghost"
                  >
                    Log in
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => redirectToDetails("/signup")}
                    className="btn btn-ghost"
                  >
                    Sign up
                  </button>
                </li>
              </>
            )}
            {currentUser && (
              <>
                <li>
                  <button onClick={logout} className="btn btn-ghost">
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Nav;
