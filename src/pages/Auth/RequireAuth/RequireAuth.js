import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const RequireAuth = ({ children }) => {
  const navigate = useNavigate();

  const token =
    useSelector((state) => state?.userState?.authUser?.accessToken) ||
    localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return children;
};

export default RequireAuth;