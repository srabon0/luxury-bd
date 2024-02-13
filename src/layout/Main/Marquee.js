import React from "react";

const Marquee = () => {
  return (
    <div className="overflow-hidden bg-blue-500 fixed top-0 w-full z-50">
      <div className="marquee">
        <div className="text-white text-1xl font-bold p-2">
          Contact us for more information : phone : +8801711542678,
          +880 1763-547691, Email : hrtamim7@gmail.com
        </div>
      </div>
    </div>
  );
};

export default Marquee;
