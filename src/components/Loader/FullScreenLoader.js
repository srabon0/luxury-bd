import React from "react";

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="loader">Loading...</div>
    </div>
  );
};

export default FullScreenLoader;
