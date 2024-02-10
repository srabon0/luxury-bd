import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const RequireAdmin = ({ children }) => {
  const currentUserRole = useSelector((state) => state.userState.authUser.role);
  const location = useLocation();
  if (currentUserRole != "Admin") {
    //   signOut(auth)

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAdmin;
