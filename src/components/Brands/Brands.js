// src/components/Brands.js
import React from "react";
import { useGetBrandsQuery } from "../../redux/features/brand/brandApi";
import { useAppSelector } from "../../redux/hook";

const Brands = () => {
  const orebistate = useAppSelector((state) => state.orebi);
  const { data, error, isLoading } = useGetBrandsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading brands</div>;

  return (
    <div>
      <h2>Brands</h2>
      <div>{JSON.stringify(data)}</div>
      <div>{JSON.stringify(orebistate)}</div>
      <ul>
        {data?.data?.data?.map((brand) => (
          <li key={brand?._id}>{brand?.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Brands;
