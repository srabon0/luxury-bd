import { createBrowserRouter } from "react-router-dom";
import ProductDetails from "../components/ProductDetails/ProductDetails";
import Notfound from "../components/Shared/Notfound";
import Main from "../layout/Main/Main";
import Home from "../pages/Home/Home";
import ContactForm from "../pages/Main/Contact";
import AllProductsWIthFilter from "../pages/Main/Filter/AllProductsWIthFilter";
import Service from "../pages/Main/Service";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/contact",
        element: <ContactForm />,
      },
      {
        path: "/services",
        element: <Service />,
      },
      {
        path: "/products",
        element: <AllProductsWIthFilter />,
      },
      {
        path: "/product/:id",
        element: <ProductDetails />,
      },
      // {
      //   path: "/categories/:categoryId/:subCategory",
      //   element: <Cat />,
      // },
      // {
      //   path: "/categories/:categoryId",
      //   element: <Cat />,
      // },
      // {
      //   path: "/categories",
      //   element: <Cat />,
      // },
    ],
  },

  {
    path: "*",
    element: <Notfound />,
  },
]);

export default routes;
