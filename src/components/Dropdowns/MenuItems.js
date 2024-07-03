import { useEffect, useRef, useState } from "react";
import Dropdown from "./Dropdown";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const MenuItems = ({ items, depthLevel }) => {
  const [dropdown, setDropdown] = useState(false);

  let ref = useRef();

  useEffect(() => {
    const handler = (event) => {
      if (dropdown && ref.current && !ref.current.contains(event.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [dropdown]);

  const onMouseEnter = () => {
    window.innerWidth > 960 && setDropdown(true);
  };

  const onMouseLeave = () => {
    window.innerWidth > 960 && setDropdown(false);
  };

  const closeDropdown = () => {
    dropdown && setDropdown(false);
  };

  const commonClasses =
    "block text-capitalize whitespace-nowrap font-bold min-w-full";

  return (
    <li
      className={`menu-items rounded text-lg lg:text-lg font-bold font-sans transition focus:outline-none focus:ring-1 focus:ring-blue-700 focus:ring-offset-2 ${
        depthLevel > 1 ? "max-w-xs overflow-hidden text-ellipsis" : ""
      }`}
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={closeDropdown}
    >
      {items.url && items.submenu ? (
        <>
          <Link to={items.url} className={commonClasses}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={dropdown ? "true" : "false"}
              onClick={() => setDropdown((prev) => !prev)}
              className={commonClasses}
            >
              {items.title}
              {depthLevel > 0 ? (
                <span>
                  <ChevronRightIcon className="text-gray-400 h-5 w-5 ml-2" />
                </span>
              ) : (
                <span className="arrow" />
              )}
            </button>
          </Link>
          <Dropdown
            depthLevel={depthLevel}
            submenus={items.submenu}
            dropdown={dropdown}
          />
        </>
      ) : !items.url && items.submenu ? (
        <>
          <button
            className={commonClasses}
            type="button"
            aria-haspopup="menu"
            aria-expanded={dropdown ? "true" : "false"}
            onClick={() => setDropdown((prev) => !prev)}
          >
            {items.title}{" "}
            {depthLevel > 0 ? (
              <span>
                <ChevronRightIcon className="text-gray-400 h-5 w-5 ml-2" />
              </span>
            ) : (
              <span className="arrow" />
            )}
          </button>
          <Dropdown
            depthLevel={depthLevel}
            submenus={items.submenu}
            dropdown={dropdown}
          />
        </>
      ) : (
        <Link to={items.url} className={commonClasses}>
          {items.title}
        </Link>
      )}
    </li>
  );
};

export default MenuItems;
