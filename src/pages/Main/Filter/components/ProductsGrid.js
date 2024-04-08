import React from "react";
import SingleGrid from "./SingleGrid";

const ProductsGrid = ({ products }) => {
  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
          {products?.map((product) => (
            <SingleGrid key={product._id} item={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsGrid;
