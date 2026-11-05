import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../../components/catalog/ProductCard";
import { useGetProductsQuery } from "../../redux/features/product/productApi";
import { useGetBrandsQuery } from "../../redux/features/brand/brandApi";
import { useGetCategoriesQuery } from "../../redux/features/categories/categoryApi";
import { useDebounced } from "../../redux/hook";
export default function Shop() {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "";
  const category = params.get("category") || "";
  const brand = params.get("brand") || "";
  const page = Math.max(1, parseInt(params.get("page"), 10) || 1);
  const sort = params.get("sort") || "-createdAt";
  const debounced = useDebounced({ searchQuery: search, delay: 400 });
  const update = (key, value) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      value ? next.set(key, value) : next.delete(key);
      if (key !== "page") next.delete("page");
      return next;
    });
  const query = {
    limit: 12,
    page,
    sort,
    ...(debounced ? { searchTerm: debounced } : {}),
    ...(category ? { category } : {}),
    ...(brand ? { brand } : {}),
  };
  const { data, isLoading, isFetching, isError, refetch } =
    useGetProductsQuery(query);
  const { data: categories } = useGetCategoriesQuery({ limit: 100, page: 1 });
  const { data: brands } = useGetBrandsQuery({ limit: 100, page: 1 });
  const products = data?.data?.data || [];
  const meta = data?.data?.meta;
  return (
    <main id="main-content">
      <div className="catalog-intro section-wrap">
        <p className="eyebrow">
          <Link to="/">HOME</Link> / COLLECTIONS
        </p>
        <h1>Find your everyday.</h1>
        <p>Explore the details that make a space your own.</p>
      </div>
      <section
        className="section-wrap catalog-section"
        aria-label="Product collection"
      >
        <div className="catalog-toolbar">
          <label className="catalog-search">
            Search products
            <input
              type="search"
              placeholder="Try basin, tap or kitchen…"
              value={search}
              onChange={(e) => update("search", e.target.value)}
            />
          </label>
          <label>
            Category
            <select
              value={category}
              onChange={(e) => update("category", e.target.value)}
            >
              <option value="">All categories</option>
              {categories?.data?.data?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Brand
            <select
              value={brand}
              onChange={(e) => update("brand", e.target.value)}
            >
              <option value="">All brands</option>
              {brands?.data?.data?.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Sort by
            <select
              value={sort}
              onChange={(e) => update("sort", e.target.value)}
            >
              <option value="-createdAt">Newest first</option>
              <option value="price">Price: low to high</option>
              <option value="-price">Price: high to low</option>
              <option value="title">Name: A–Z</option>
            </select>
          </label>
        </div>
        <div className="results-line">
          <p role="status">
            {isFetching
              ? "Updating collection…"
              : `${meta?.totalCounts ?? products.length} products`}
          </p>
          {(search || category || brand) && (
            <button className="text-link" onClick={() => setParams({})}>
              Clear filters ×
            </button>
          )}
        </div>
        {isError ? (
          <div className="empty-state">
            <h2>We couldn’t load the collection.</h2>
            <p>Please try again, or contact our team for help.</p>
            <button className="collection-button" onClick={refetch}>
              Try again
            </button>
          </div>
        ) : isLoading ? (
          <div className="catalog-grid" aria-label="Loading products">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="catalog-skeleton" />
            ))}
          </div>
        ) : products.length ? (
          <div className="catalog-grid" aria-busy={isFetching}>
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No matching products.</h2>
            <p>Try a different search or clear your filters.</p>
            <button className="text-link" onClick={() => setParams({})}>
              Explore all products ↗
            </button>
          </div>
        )}
        {!isError && products.length > 0 && (
          <nav className="catalog-pagination" aria-label="Product pages">
            <button
              disabled={page <= 1 || isFetching}
              onClick={() => update("page", String(page - 1))}
            >
              ← Previous
            </button>
            <span>
              Page {page} of {Math.max(1, meta?.totalPages || 1)}
            </span>
            <button
              disabled={page >= (meta?.totalPages || 1) || isFetching}
              onClick={() => update("page", String(page + 1))}
            >
              Next →
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}
