import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CatSlides from "../../../components/Slider/CatSlides/CategorySlider";
const Cat = () => {
  const categoryState = useSelector((state) => state.categoryState);
  const params = useParams();
  const { categoryId, subCategory } = params;
  console.log(categoryId, subCategory);
  return (
    <div>
      <CatSlides noHeading activeFunctionalities />
      <h1>Category</h1>
    </div>
  );
};

export default Cat;
