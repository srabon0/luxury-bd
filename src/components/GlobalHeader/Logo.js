import React from "react";
import { useNavigate } from "react-router-dom";

const Logo = ({ src, alt }) => {
  const navigate = useNavigate();
  return (
    <div className="cursor-pointer">
      <span
        onClick={() => navigate("/")}
        className="flex items-center whitespace-nowrap text-2xl font-black"
      >
        <span className="mr-2 w-16">
          <img src={src} alt={alt} />
        </span>
        <span className="text-gray-600 font-bold text-2xl italic">Classic</span>
        <span className="text-violet-700 font-bold text-2xl italic">Group</span>
      </span>
    </div>
  );
};

export default Logo;
