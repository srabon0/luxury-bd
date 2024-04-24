import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/16/solid";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import profBg from "../../assests/profbg.jpg";
import { resetCurrentUser } from "../../redux/actions/userAction";
import { dashboardMenuList } from "./menuList";

const MenuLinks = ({ menu }) => {
  const location = useLocation();
  return (
    <NavLink currentPath={location.pathname} to={menu?.link}>
      <span className="flex flex-row gap-2 text-lg items-center hover:text-blue-400">
        {menu?.icon}
        {menu?.name}
      </span>
    </NavLink>
  );
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state?.userState?.authUser?.user);
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    dispatch(resetCurrentUser());
    navigate("/login");
  };

  return (
    <ul className="menu p-4 w-80 min-h-screen bg-base-200 text-base-content lg:block hidden relative">
      {/* Sidebar content here */}
      {dashboardMenuList.map((menu) => (
        <li key={menu.id}>
          <MenuLinks menu={menu} />
        </li>
      ))}
      <div className="card bg-base-100 shadow-xl image-full absolute bottom-4 left-3 right-3">
        <figure>
          <img src={profBg} alt={"logo"} />
        </figure>
        <div className="card-body p-3">
          <div className="avatar">
            <div className="w-24 mask mask-squircle">
              <img
                src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                alt="user"
              />
            </div>
          </div>
          <p className="text-xl font-mono">
            {currentUser?.first_name
              ? currentUser?.first_name + " " + currentUser?.last_name
              : currentUser?.username || currentUser?.email}
            <div className="badge badge-accent badge-outline mx-2">accent</div>
          </p>
          <p className="p-0 m-0">{currentUser?.email}</p>
          <div className="card-actions justify-start">
            <button onClick={logout} className="btn btn-secondary btn-xs">
              <ArrowLeftStartOnRectangleIcon className="w-6 h-6 rotate-180" />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </ul>
  );
};
export default Sidebar;
