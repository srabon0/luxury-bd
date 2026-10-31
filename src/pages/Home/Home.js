import React from "react";
import { Link } from "react-router-dom";
import Hero from "../../components/Hero/Hero";
import ProductCard from "../../components/catalog/ProductCard";
import { useGetProductsQuery } from "../../redux/features/product/productApi";
import basin from "../../assets/images/feature/BASINTAP.jpg";
import tap from "../../assets/images/flyouts/1.png";
import hood from "../../assets/images/feature/KITCHENHOOD.jpg";
const collections = [
  ["Bathroom", "Basins & fittings", basin, "basin"],
  ["The finishing touch", "Taps & faucets", tap, "tap"],
  ["Kitchen", "Kitchen essentials", hood, "kitchen"],
];
export default function Home() {
  const { data, isLoading, isError } = useGetProductsQuery({
    limit: 4,
    page: 1,
  });
  const products = data?.data?.data || [];
  return (
    <main id="main-content">
      <Hero />
      <div className="value-strip">
        <span>
          01 <strong>Bathroom essentials</strong>
        </span>
        <span>
          02 <strong>Kitchen collections</strong>
        </span>
        <span>
          03 <strong>Details that bring it together</strong>
        </span>
      </div>
      <section className="section-wrap" aria-labelledby="collections-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FIND YOUR FINISH</p>
            <h2 id="collections-title">A space for every style.</h2>
          </div>
          <Link className="text-link" to="/shop">
            All collections ↗
          </Link>
        </div>
        <div className="collection-grid">
          {collections.map(([label, title, img, search]) => (
            <Link
              className="collection-tile"
              key={title}
              to={`/shop?search=${search}`}
            >
              <img
                src={img}
                alt={title}
                width="500"
                height="500"
                loading="lazy"
                decoding="async"
              />
              <div>
                <span>{label}</span>
                <h3>{title}</h3>
                <b aria-hidden="true">↗</b>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section
        className="section-wrap section-tinted"
        aria-labelledby="latest-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">EXPLORE THE DETAILS</p>
            <h2 id="latest-title">From our collection.</h2>
          </div>
          <Link className="text-link" to="/shop">
            Browse products ↗
          </Link>
        </div>
        {isLoading ? (
          <p role="status">Loading the collection…</p>
        ) : isError ? (
          <div className="empty-state">
            <p>Our online collection is temporarily unavailable.</p>
            <Link to="/contact">Our team can help you find a product ↗</Link>
          </div>
        ) : products.length ? (
          <div className="catalog-grid">
            {products.map((p) => (
              <ProductCard product={p} key={p._id} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Explore our bathroom and kitchen ranges with our team.</p>
            <Link to="/contact">Get in touch ↗</Link>
          </div>
        )}
      </section>
      <section className="brand-story section-wrap">
        <p className="eyebrow">CONSIDERED FOR YOUR HOME</p>
        <h2>
          Small details.
          <br />
          <em>A lasting impression.</em>
        </h2>
        <div>
          <p>
            From a basin that anchors your bathroom to the fittings you use
            every day, discover pieces that make your space feel complete.
          </p>
          <Link className="text-link" to="/about">
            Meet Luxurry ↗
          </Link>
        </div>
      </section>
      <section className="contact-banner section-wrap">
        <div>
          <p className="eyebrow">LET’S FIND YOUR NEXT DETAIL</p>
          <h2>Your space. Your style.</h2>
          <p>Need help choosing? Talk to our team about your project.</p>
        </div>
        <Link className="collection-button" to="/contact">
          Start a conversation ↗
        </Link>
      </section>
    </main>
  );
}
