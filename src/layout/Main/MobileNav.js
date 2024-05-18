import {
  AdjustmentsVerticalIcon,
  Bars2Icon,
  HomeIcon,
} from "@heroicons/react/16/solid";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const indexMap = {
  X: {
    name: "X",
  },
  0: {
    name: "home",
    path: "/",
  },
  1: {
    name: "products",
    path: "/products",
  },
  3: {
    name: "dashboard",
    path: "/dashboard",
  },
};

const MobileNav = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(indexMap[0]);

  const navigateToDetails = (path) => {
    navigate(path);
  };

  const handleClick = (index) => {
    if (index === "X") {
      setActive(indexMap[index]);
      return;
    }
    navigateToDetails(indexMap[index].path);
  };

  return (
    <div className="fixed z-50 w-full h-12 max-w-lg -translate-x-1/2 bg-white border border-gray-200 bottom-0 left-1/2 block lg:hidden">
      <div className="flex items-center justify-evenly mt-2">
        <label
          onClick={() => handleClick(0)}
          htmlFor="mobile-nav"
          className="drawer-button"
        >
          <Bars2Icon
            className={`w-8 h-8 ${
              active?.name === "X"
                ? "text-primary"
                : "text-gray-500 dark:text-gray-400"
            }`}
          />
          <span className="sr-only">Home</span>
        </label>

        <button onClick={() => handleClick(1)} type="button">
          <AdjustmentsVerticalIcon
            className={`w-8 h-8 ${
              active?.name === "products"
                ? "text-primary"
                : "text-gray-500 dark:text-gray-400"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default MobileNav;
