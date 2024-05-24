import React, { useState } from "react";

const NestedDropdown = ({ menu }) => {
  return (
    <ul className="menu menu-horizontal px-1">
      {menu.map((item, index) => (
        <DropdownItem key={index} item={item} />
      ))}
    </ul>
  );
};

const DropdownItem = ({ item }) => {
  const [open, setOpen] = useState(false);

  const hasChildren = item.children && item.children.length > 0;

  return (
    <li className="relative group">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full p-2 hover:bg-gray-200 rounded-lg"
      >
        <span>{item.name}</span>
        {hasChildren && (
          <svg
            className={`w-4 h-4 transform transition-transform ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        )}
      </button>
      {hasChildren && open && (
        <ul className="absolute left-full top-0 mt-2 ml-2 bg-gray-100 rounded-lg p-2 shadow-lg">
          {item.children.map((child, index) => (
            <DropdownItem key={index} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default NestedDropdown;
