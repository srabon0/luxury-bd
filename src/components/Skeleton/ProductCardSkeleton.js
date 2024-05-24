import React from "react";

const SingleGridSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-56 mx-3 mb-3 bg-slate-100 p-3 rounded-md">
      <div className="skeleton h-32 w-full rounded-sm"></div>
      <div className="skeleton h-4 w-40"></div>
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-full"></div>
    </div>
  );
};

const ProductCardSkeleton = ({
  className = "grid grid-cols-3 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 mx-auto px-4 my-5 bg-gray-50 p-5",
}) => {
  return (
    <div className={className}>
      {[...Array(8)].map((_, i) => (
        <SingleGridSkeleton key={i} />
      ))}
    </div>
  );
};

export default ProductCardSkeleton;
