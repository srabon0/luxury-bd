import React from "react";

const Notice = () => {
  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <p className="mb-2 text-center font-semibold text-indigo-500 md:mb-3 lg:text-lg">
          Luxury
        </p>

        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
          Latest Notice
        </h2>

        <div className="flex flex-col rounded-lg border p-4 md:p-6 hover:border-indigo-700 transition-all">
          <h3 className="mb-2 text-lg font-semibold md:text-xl">
            BECOME A DEALER OF{" "}
            <span className="mb-2 text-center font-semibold text-indigo-500 md:mb-3 ">
              Classic Group
            </span>
          </h3>
          <p className="mb-4 text-gray-500">
            We are appointing dealership for our “Luxurry” brand all over
            Bangladesh Market.
          </p>
          <p className="mb-4 text-gray-500">
            However, we are keen to assign more distributors around all district
            in Bangladesh.
          </p>
          <p className="mb-4 text-gray-500">
            We would like to appoint such kind of dealers who have proven
            trusted in sanitary market.
          </p>
          <p className="mb-4 text-gray-500">
            We will give you a handsome percentage of commission based on your
            sale.
          </p>
          <p className="mb-4 text-gray-500">
            Our dealer management team are always ready to provide you marketing
            and technical support including all kinds of critical with
            fundamental training tailored to your team’s needs complementary.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notice;
