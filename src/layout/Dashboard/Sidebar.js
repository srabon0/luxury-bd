import React from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { resetCurrentUser } from "../../redux/actions/userAction";
const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    dispatch(resetCurrentUser());
    navigate("/login");
  };

  return (
    <div class="w-64 min-h-screen bg-gray-800 mt-8 sm:mt-0 ">
      <div class="flex items-center justify-center mt-10 mx-2">
        <button className="btn btn-wide btn-primary">Dashboard</button>
      </div>

      <nav className="flex flex-col mt-10 space-y-1 px-2">
        <NavLink to="/dashboard/products">
          <p className="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-blue-500 hover:text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 opacity-75"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>

            <span className="ml-3 text-sm font-medium">Products </span>
          </p>
        </NavLink>
        <NavLink to="/dashboard/add-product">
          <p className="flex items-center px-4 py-2 text-gray-300 hover:bg-blue-500 hover:text-gray-200 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 opacity-75"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>

            <span className="ml-3 text-sm font-medium"> Add Product </span>
          </p>
        </NavLink>
        <NavLink to="/dashboard/categories">
          <p className="flex items-center px-4 py-2 text-gray-300 hover:bg-blue-500 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 opacity-75"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>

            <span className="ml-3 text-sm font-medium">Categories </span>
          </p>
        </NavLink>
        <NavLink to="/dashboard/brands">
          <p className="flex items-center px-4 py-2 text-gray-300 hover:bg-blue-500 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 opacity-75"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>

            <span className="ml-3 text-sm font-medium"> Brands </span>
          </p>
        </NavLink>

        <NavLink to="">
          <p className="flex items-center px-4 py-2 text-gray-300 hover:bg-blue-500 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 opacity-75"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>

            <span className="ml-3 text-sm font-medium"> Orders </span>
          </p>
        </NavLink>

        <NavLink to="/dashboard/payment">
          <p className="flex items-center px-4 py-2 text-gray-300 hover:bg-blue-500 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 opacity-75"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>

            <span className="ml-3 text-sm font-medium"> Payment </span>
          </p>
        </NavLink>

        <NavLink to="/home">
          <p className="flex items-center px-4 py-2 text-gray-300 hover:bg-blue-500 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 opacity-75"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>

            <span className="ml-3 text-sm font-medium"> Back to home </span>
          </p>
        </NavLink>
      </nav>
      <button
        onClick={() => {
          logout();
        }}
        className="flex items-center w-full px-4 py-2 text-gray-300 rounded-lg hover:bg-blue-500 hover:text-gray-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 opacity-75"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>

        <span className="ml-3 text-sm font-medium"> Logout </span>
      </button>
    </div>
  );
};

export default Sidebar;
