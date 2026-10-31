import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Shop from "./Shop";
import ProductDetails from "../ProductDetails/ProductDetails";
import {
  useGetProductsQuery,
  useGetProductQuery,
} from "../../redux/features/product/productApi";
jest.mock("../../redux/features/product/productApi", () => ({
  useGetProductsQuery: jest.fn(),
  useGetProductQuery: jest.fn(),
}));
jest.mock("../../redux/features/categories/categoryApi", () => ({
  useGetCategoriesQuery: () => ({
    data: { data: { data: [{ _id: "cat-1", name: "Basins" }] } },
  }),
}));
jest.mock("../../redux/features/brand/brandApi", () => ({
  useGetBrandsQuery: () => ({ data: { data: { data: [] } } }),
}));
jest.mock("../../redux/hook", () => ({
  useDebounced: ({ searchQuery }) => searchQuery,
}));
const response = {
  data: {
    data: {
      data: [{ _id: "product-1", title: "Basin tap", price: 1200, image: [] }],
      meta: { page: 2, totalPages: 3, totalCounts: 30 },
    },
  },
  isLoading: false,
  isFetching: false,
  isError: false,
};
function mountShop(url = "/shop") {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Shop />
    </MemoryRouter>,
  );
}
beforeEach(() => {
  jest.clearAllMocks();
  useGetProductsQuery.mockReturnValue(response);
});
test("shareable filters are sent to the API; changing category resets the page", () => {
  mountShop("/shop?search=basin&page=2");
  expect(useGetProductsQuery.mock.calls.at(-1)[0]).toMatchObject({
    page: 2,
    searchTerm: "basin",
  });
  fireEvent.change(screen.getByLabelText("Category"), {
    target: { value: "cat-1" },
  });
  expect(useGetProductsQuery.mock.calls.at(-1)[0]).toMatchObject({
    page: 1,
    category: "cat-1",
    searchTerm: "basin",
  });
  expect(
    screen.getByRole("link", { name: /Basin tap/ }).getAttribute("href"),
  ).toBe("/product/product-1");
});
test("an API failure offers retry and preserves navigation", () => {
  const refetch = jest.fn();
  useGetProductsQuery.mockReturnValue({ isError: true, refetch });
  mountShop();
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(refetch).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("heading", { name: /couldn’t load/ })).toBeTruthy();
});
test("an empty collection offers clear filters instead of broken pagination", () => {
  useGetProductsQuery.mockReturnValue({
    data: { data: { data: [], meta: { totalCounts: 0 } } },
  });
  mountShop("/shop?search=unknown");
  expect(
    screen.getByRole("heading", { name: "No matching products." }),
  ).toBeTruthy();
  expect(
    screen.queryByRole("navigation", { name: "Product pages" }),
  ).toBeNull();
  fireEvent.click(
    screen.getByRole("button", { name: "Explore all products ↗" }),
  );
  expect(useGetProductsQuery.mock.calls.at(-1)[0].searchTerm).toBeUndefined();
});
test("a direct product URL fetches the product without navigation state", () => {
  useGetProductQuery.mockReturnValue({
    data: {
      data: {
        _id: "product-1",
        title: "Basin tap",
        price: 1200,
        code: "BT-01",
        image: [],
      },
    },
  });
  render(
    <MemoryRouter initialEntries={["/product/product-1"]}>
      <Routes>
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </MemoryRouter>,
  );
  expect(useGetProductQuery).toHaveBeenCalledWith("product-1");
  expect(screen.getByRole("heading", { name: "Basin tap" })).toBeTruthy();
  expect(
    screen.getByRole("link", { name: /Enquire/ }).getAttribute("href"),
  ).toContain("BT-01");
});
