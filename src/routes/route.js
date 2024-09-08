import { createBrowserRouter } from "react-router-dom";
// import Brands from "../components/Brands/Brands";
// import Categories from "../components/Categories/Categories";
import Layout from "../layout/Layout";
// import About from "../pages/About/About";
// import SignIn from "../pages/Account/SignIn";
// import SignUp from "../pages/Account/SignUp";
// import Cart from "../pages/Cart/Cart";
// import Contact from "../pages/Contact/Contact";
import Home from "../pages/Home/Home";
// import Journal from "../pages/Journal/Journal";
// import Offer from "../pages/Offer/Offer";
// import Payment from "../pages/payment/Payment";
// import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Shop from "../pages/Shop/Shop";
import NotFoundPage from "../pages/404/404";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "shop",
        element: <Shop />,
      },
      // {
      //   path: "about",
      //   element: <About />,
      // },
      // {
      //   path: "contact",
      //   element: <Contact />,
      // },
      // {
      //   path: "journal",
      //   element: <Journal />,
      // },
      // {
      //   path: "category/:category",
      //   element: <Offer />,
      // },
      // {
      //   path: "product/:_id",
      //   element: <ProductDetails />,
      // },
      // {
      //   path: "cart",
      //   element: <Cart />,
      // },
      // {
      //   path: "paymentgateway",
      //   element: <Payment />,
      // },
      // {
      //   path: "categries",
      //   element: <Categories />,
      // },
      // {
      //   path: "brands",
      //   element: <Brands />,
      // },
    ],
  },
  // {
  //   path: "/signup",
  //   element: <SignUp />,
  // },
  // {
  //   path: "/signin",
  //   element: <SignIn />,
  // },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
