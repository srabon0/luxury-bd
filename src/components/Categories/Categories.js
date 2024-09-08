// src/components/Categories.js
import React from "react";
import { useGetCategoriesQuery } from "../../redux/features/categories/categoryApi";

const Categories = () => {
  const { data: categories, error, isLoading } = useGetCategoriesQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories</div>;

  return (
    <div>
      <h2>Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
