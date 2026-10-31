import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Home from "../pages/Home/Home";
const Shop = lazy(() => import("../pages/Shop/Shop"));
const Details = lazy(() => import("../pages/ProductDetails/ProductDetails"));
const About = lazy(() => import("../pages/About/About"));
const Contact = lazy(() => import("../pages/Contact/Contact"));
const NotFound = () => (
  <main id="main-content" className="section-wrap empty-state">
    <h1>Page not found.</h1>
    <a href="/shop">Explore the collection ↗</a>
  </main>
);
const page = (node) => (
  <Suspense
    fallback={
      <main id="main-content" className="section-wrap" role="status">
        Loading…
      </main>
    }
  >
    {node}
  </Suspense>
);
export default createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "shop", element: page(<Shop />) },
      { path: "product/:id", element: page(<Details />) },
      { path: "about", element: page(<About />) },
      { path: "contact", element: page(<Contact />) },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
