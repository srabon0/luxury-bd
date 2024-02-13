import React from "react";

const Loader = ({ text, className }) => {
  return (
    <div
      className={
        className ? className : "w-full flex items-center justify-center"
      }
    >
      <span className="loading loading-infinity loading-lg"></span>
      {text && <p className="ml-2 text-gray-500">{text}</p>}
    </div>
  );
};

export default Loader;
