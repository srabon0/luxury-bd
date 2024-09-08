import React from "react";
import { ImPlus } from "react-icons/im";
import NavTitle from "./NavTitle";

const Category = () => {
  const category = [
    {
      _id: 9006,
      title: "Imprimante",
    },
    {
      _id: 9007,
      title: "Encre",
    },
    {
      _id: 9008,
      title: "Ruban",
    },
    {
      _id: 9009,
      title: "Bac de dechet",
    },
  ];

  return (
    <div className="w-full">
      <NavTitle title="Shop by Category" icons={true} />
      <div>
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {category.map((item) => (
            <li
              key={item._id}
              className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300"
            >
              <input type="checkbox" id={item._id} />
              {item.title}
              {item.icons && (
                <span className="text-[10px] lg:text-xs cursor-pointer text-gray-400 hover:text-primeColor duration-300">
                  <ImPlus />
                </span>
              )}
            </li>
          ))}
          <li onClick={() => console.log("Checkbox clicked")}>test</li>
        </ul>
      </div>
    </div>
  );
};

export default Category;
