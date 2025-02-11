import { motion } from "framer-motion";
import React from "react";
import NavTitle from "./NavTitle";

const Brand = () => {
  const brands = [
    {
      _id: 900,
      title: "Pantum",
    },
    {
      _id: 901,
      title: "Hp",
    },
    {
      _id: 902,
      title: "Epson",
    },
    {
      _id: 903,
      title: "Ricoh",
    },
  ];

  return (
    <div>
      <div className="cursor-pointer">
        <NavTitle title="Shop by Brand" icons={true} />
      </div>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {brands.map((item) => (
            <li
              key={item._id}
              className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300"
            >
              <input type="checkbox" id={item._id} />
              {item.title}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default Brand;
