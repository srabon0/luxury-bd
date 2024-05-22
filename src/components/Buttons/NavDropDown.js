import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const DropdownItem = ({ item }) => {
  return (
    <li key={item._id} className="px-4">
      {item?.children?.length == 0 ? (
        <NavLink
          to={`/products/${item.slug}`}
          className="text-lg lg:text-lg font-extralight font-sans  transition focus:outline-none "
        >
          {item.name}
        </NavLink>
      ) : null}
      {item?.children?.length > 0 && (
        <details close>
          <summary className="text-lg lg:text-lg font-extralight font-sans transition focus:outline-none">
            {item.name}{" "}
            <span className="text-xs">({item?.children?.length})</span>
          </summary>
          {item.children && (
            <ul className="rounded-none w-full">
              {item?.children?.map((child) => (
                <DropdownItem key={child._id} item={child} />
              ))}
            </ul>
          )}
        </details>
      )}
    </li>
  );
};

const NavMenu = ({ menu }) => {
  const location = useLocation();
  return (
    <NavLink
      currentPath={location.pathname}
      to={menu?.link}
      className="lg:mr-12"
    >
      <span
        className={`rounded text-lg lg:text-lg font-bold font-sans transition focus:outline-none focus:ring-1 focus:ring-blue-700 focus:ring-offset-2 ${
          location.pathname === menu?.link ? "text-primary" : "text-black"
        }`}
      >
        {menu?.name}
      </span>
    </NavLink>
  );
};

const NavDropDown = ({ mainMenuList }) => {
  return (
    <div
      style={{
        zIndex: 100000,
        position: "relative",
      }}
      className="navbar-center hidden lg:flex"
    >
      <ul className="menu menu-horizontal px-1">
        {mainMenuList.map((menu) => (
          <li key={menu.id}>
            {menu.children ? (
              <details close>
                <summary className="text-lg lg:text-lg font-bold font-sans transition focus:outline-none">
                  {menu.name}
                </summary>
                <ul className="rounded-none w-96">
                  {menu.children.map((child) => (
                    <DropdownItem key={child._id} item={child} />
                  ))}
                </ul>
              </details>
            ) : (
              <NavMenu menu={menu} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavDropDown;
