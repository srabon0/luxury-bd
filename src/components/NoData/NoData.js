import React from "react";
import noData from "../../assests/images/undraw_no_data_re_kwbl.svg";

const NoData = ({ textData = "No Data Found" }) => {
  return (
    <div className="w-ful h-full bg-base-100 rounded-sm m-5 p-5 flex items-center flex-col justify-between gap-8 border border-gray-200 shadow-md">
      <img
        data-aos="fade-up"
        src={noData}
        alt="No Data"
        className="w-1/3 h-1/3 mx-auto object-contain shadow-sm"
      />
      <h5 className="fw-bold text-xl text-center text-gray-500">{textData}</h5>
    </div>
  );
};

export default NoData;
