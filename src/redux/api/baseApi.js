import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const url =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_LOCAL_BACKEND
    : process.env.REACT_APP_BACKEND;

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: url,
  }),
  endpoints: () => ({}),
  tagTypes: ["brands", "categories", "products"],
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
