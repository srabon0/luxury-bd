import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Footer from "../components/home/Footer/Footer";
import Header from "../components/GlobalHeader/Header";

const Layout = () => {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      {/* <Header /> */}
      {/* <HeaderBottom /> */}

      <ScrollRestoration />
      <Outlet />
      <Footer />
      {/* <Footer />
          <FooterBottom /> */}
    </div>
  );
};
export default Layout;
