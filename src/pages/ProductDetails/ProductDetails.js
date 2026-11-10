import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetProductQuery } from "../../redux/features/product/productApi";
import { getImageUrl } from "../../utils";
export default function ProductDetails() {
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useGetProductQuery(id);
  const product = data?.data;
  if (isLoading)
    return (
      <main
        id="main-content"
        className="section-wrap empty-state"
        role="status"
      >
        Loading product…
      </main>
    );
  if (isError)
    return (
      <main id="main-content" className="section-wrap empty-state">
        <h1>We couldn’t load this product.</h1>
        <button className="collection-button" onClick={refetch}>
          Try again
        </button>
        <Link to="/shop">Back to collections</Link>
      </main>
    );
  if (!product)
    return (
      <main id="main-content" className="section-wrap empty-state">
        <h1>Product not found.</h1>
        <Link to="/shop">Back to collections ↗</Link>
      </main>
    );
  return (
    <main id="main-content" className="section-wrap">
      <p className="eyebrow">
        <Link to="/shop">COLLECTIONS</Link> / PRODUCT
      </p>
      <div className="product-detail">
        <div className="detail-images">
          {(product.image?.length ? product.image : [{}]).map((img, i) => (
            <img
              key={img._id || i}
              src={getImageUrl(img.imageUrl)}
              alt={`${product.title}${i ? ` — view ${i + 1}` : ""}`}
              loading={i ? "lazy" : "eager"}
              width="700"
              height="700"
            />
          ))}
        </div>
        <div className="detail-copy">
          <p className="eyebrow">THE LUXURRY COLLECTION</p>
          <h1>{product.title}</h1>
          <p className="detail-price">
            {Number(product.price) > 0
              ? `৳ ${Number(product.price).toLocaleString("en-BD")}`
              : "Contact for pricing"}
          </p>
          <p className="product-description">
            {product.description ||
              "Talk to our team for product details and availability."}
          </p>
          <dl>
            {[
              ["Product code", product.code],
              ["Model", product.model],
              ["Unit", product.unit],
              ["Carton capacity", product.cartoncapacity],
            ]
              .filter(([, v]) => v !== undefined && v !== null && v !== "")
              .map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
          </dl>
          <a
            className="collection-button"
            href={`mailto:hrtamim7@gmail.com?subject=${encodeURIComponent(
              `Product enquiry: ${product.title} (${product.code || id})`,
            )}`}
          >
            Enquire about this product ↗
          </a>
          <p className="detail-note">
            Contact us to confirm availability and current pricing.
          </p>
        </div>
      </div>
    </main>
  );
}
