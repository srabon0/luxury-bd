import React from "react";

const PrimaryButton = ({ children, eventHandler, icon }) => {
  return (
    <button
      onClick={eventHandler}
      className="btn lg:btn-md md:btn-md btn-sm text-white normal-case lg:px-8 md:px-8 px-5 rounded-md border-none bg-violet-500"
    >
      {children} &nbsp;
      {icon && <span className="mx-2">{icon}</span>}
    </button>
  );
};

export default PrimaryButton;
