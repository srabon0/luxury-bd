import { baseApi } from "../../api/baseApi";

const PRODUCT_URL = "products";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (arg) => {
        return {
          url: PRODUCT_URL,
          method: "GET",
          params: arg,
        };
      },
      providesTags: ["products"],
    }),

    getSearchProducts: builder.query({
      query: (arg) => {
        return {
          url: PRODUCT_URL + "/search",
          method: "POST",
          body: arg,
        };
      },
      providesTags: ["searchProducts"],
    }),

    addProduct: builder.mutation({
      query: (data) => ({
        url: PRODUCT_URL + "/create-product",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["products"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["products"],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `products/${data?.id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["products"],
    }),

    deleteSingleImage: builder.mutation({
      query: (data) => ({
        url: `products/delete-image/${data?.productId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useDeleteSingleImageMutation,
  useGetSearchProductsQuery,
} = productApi;
