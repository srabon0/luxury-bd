import React from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils";
export default function ProductCard({ product }) {
  return (
    <Link className="catalog-card" to={`/product/${product._id}`}>
      <div className="catalog-card-image">
        <img
          src={getImageUrl(product.image?.[0]?.imageUrl)}
          alt={product.title || "Product"}
          loading="lazy"
          decoding="async"
          width="500"
          height="500"
        />
        <span aria-hidden="true">↗</span>
      </div>
      <div className="catalog-card-meta">
        <p>{product.category?.name || "Collection"}</p>
        <h3>{product.title}</h3>
        <span>
          {Number(product.price) > 0
            ? `৳ ${Number(product.price).toLocaleString("en-BD")}`
            : "Contact for pricing"}
        </span>
      </div>
    </Link>
  );
}
