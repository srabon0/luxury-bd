import React from "react";
import SingleGrid from "./SingleGrid";

const ProductsGrid = ({ products }) => {
  return (
    <div
      className="py-6 sm:py-8 lg:py-12"
      data-aos="fade-left"
      data-aos-offset="300"
    >
      <div className="mx-auto max-w-screen-2xl px-3 md:px-2">
        <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 md:gap-x-4 lg:grid-cols-3 xl:grid-cols-4">
          {products?.map((product, i) => (
            <SingleGrid key={i} item={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsGrid;
