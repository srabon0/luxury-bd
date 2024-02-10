import { createBrowserRouter } from "react-router-dom";

import Notfound from "../components/Shared/Notfound";
import Dashboard from "../layout/Dashboard/Dashboard";
import Main from "../layout/Main/Main";
import Login from "../pages/Auth/Login/Login";
import RequireAuth from "../pages/Auth/RequireAuth/RequireAuth";
import SignUp from "../pages/Auth/SignUp/SignUp";
import AddProduct from "../pages/Dashboard/AddProduct";
import Brands from "../pages/Dashboard/Brand";
import Category from "../pages/Dashboard/Categories";
import Products from "../pages/Dashboard/Products";
import StatusCards from "../pages/Dashboard/StatusCards";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },

  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    ),
    children: [
      {
        path: "/dashboard",
        element: (
          <RequireAuth>
            <StatusCards />
          </RequireAuth>
        ), //this will also require admin
      },
      {
        path: "products",
        element: (
          <RequireAuth>
            <Products />
          </RequireAuth>
        ),
      },
      {
        path: "add-product",
        element: (
          <RequireAuth>
            <AddProduct />
          </RequireAuth>
        ),
      },
      {
        path: "edit-product/:prodId",
        element: (
          <RequireAuth>
            <AddProduct />
          </RequireAuth>
        ),
      },
      {
        path: "brands",
        element: (
          <RequireAuth>
            {/* <AddBrand /> */}
            <Brands />
          </RequireAuth>
        ),
      },
      {
        path: "categories",
        element: (
          <RequireAuth>
            <Category />
          </RequireAuth>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Notfound />,
  },
]);

export default routes;
