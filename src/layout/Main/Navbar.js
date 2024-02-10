import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import auth from "../../firebase.init";
import { useAuthState } from "react-firebase-hooks/auth";
import { themeChange } from "theme-change";
import { useDispatch, useSelector } from "react-redux";
import loadUserInfo from "../../redux/thunk/fetchUser";
import { resetCurrentUser } from "../../redux/actions/userAction";
const Navbar = () => {
  const [darkMode, setDarkMode] = useState("winter");
  const dispatch = useDispatch();
  const [check, setCheck] = useState(false);
  const setDar = () => {
    if (darkMode == "winter") {
      setDarkMode("dracula");
      setCheck(true);
      localStorage.setItem("theme", "dracula");
    } else {
      setDarkMode("winter");
      setCheck(false);
      localStorage.setItem("theme", "winter");
    }
  };
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const state = useSelector((state) => state.fruitState);
  const cart = state.cart;
  const initialValue = 0;
  const cartTotal = cart.reduce(
    (accumulator, current) => accumulator + current.price * current.quantity,
    initialValue
  );
  useEffect(() => {
    themeChange(false);
    const currentTheme = localStorage.getItem("theme");
    setDarkMode(currentTheme);
    if (currentTheme == "winter") {
      setCheck(false);
    } else {
      setCheck(true);
    }

    // 👆 false parameter is required for react project
  }, [darkMode]);
  const handleSignout = () => {
    signOut(auth);
  };
  if (loading) {
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  }
  if (user) {
    dispatch(loadUserInfo(user?.email));
  }
  return (
    <div className="navbar bg-orange-500">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex="0" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </label>
          <ul
            tabIndex="0"
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">SignUp</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link to="/" className="btn btn-ghost text-white normal-case text-xl">
          FruitMart
        </Link>
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-square btn-ghost text-white lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-6 h-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
          <label tabIndex="0" className="btn btn-ghost btn-circle text-white">
            <div className="indicator">
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="badge badge-sm indicator-item">
                {cart.length}
              </span>
            </div>
          </label>
          <div
            tabIndex="0"
            className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow"
          >
            <div className="card-body">
              <span className="font-bold text-lg">{cart.length} items</span>
              <span className="text-black font-medium text-sm">
                Subtotal: $ {cartTotal.toFixed(2)}
              </span>
              <div className="card-actions">
                <Link
                  to="/cart"
                  className="btn bg-orange-600 btn-sm border-0 text-white btn-block"
                >
                  View cart
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="dropdown dropdown-end">
          <label tabIndex="0" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src="https://placeimg.com/80/80/people" />
            </div>
          </label>
          <ul
            tabIndex="0"
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <p className="bg-emerald-200 justify-between mb-1">
                {user ? user?.email : ""}
              </p>
            </li>
            <li>
              <p className="justify-between mb-1 flex flex-row items-center">
                {" "}
                <span>☀️</span>
                <input
                  onChange={setDar}
                  type="checkbox"
                  className="toggle"
                  checked={check}
                />
                <span>🌙</span>{" "}
              </p>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate("/dashboard");
                }}
                className="justify-between mb-1"
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  handleSignout();
                  dispatch(resetCurrentUser());
                }}
                className="justify-between bg-error text-white mb-1"
              >
                Signout
              </button>
            </li>
          </ul>
        </div>

        <button
          className="btn btn-sm btn-secondary"
          onClick={() => {
            navigate("/login");
          }}
        >
          {" "}
          Login{" "}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
