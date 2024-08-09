import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import MenuItems from "../../components/Dropdowns/MenuItems";
import SearchModal from "../../components/Modals/SearchModal";
import Drawer from "../../components/Shared/Drawer/Drawer";
import mainLogo from "./../../assests/svg/classic.svg";
import { convertCategoriesToMenu } from "./utils";

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
  {
    id: 1003,
    name: "Contact",
    link: "/contact",
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
        className={`rounded text-lg lg:text-lg font-bold font-sans  transition focus:outline-none focus:ring-1 focus:ring-blue-700 focus:ring-offset-2  ${
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
  const categoryArray = [
    {
      name: "Categories",
      subCategories: categoryState?.categories,
    },
  ];
  const menuItems = convertCategoriesToMenu(categoryArray);

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
          </ul>

          <ul>
            {menuItems &&
              menuItems?.map((menu, index) => (
                <MenuItems items={menu} key={index} depthLevel={0} />
              ))}
          </ul>

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
        </div>

        <div className="navbar-end ">
          <div className="block lg:hidden">
            <div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-5 h-5 stroke-current"
                  color="currentColor"
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
        </ul>

        {/* <ul>
          {menuItems.map((menu, index) => {
            return <MenuItems items={menu} key={index} depthLevel={0} />;
          })}
        </ul> */}
      </Drawer>
    </>
  );
};

export default Nav;
