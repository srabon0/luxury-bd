import { baseApi } from "../../api/baseApi";
const BRAND_URL = "brands";

const brandAPi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: (arg) => {
        return {
          url: BRAND_URL,
          method: "GET",
          params: arg,
        };
      },
      providesTags: ["brands"],
    }),

    addBrand: builder.mutation({
      query: (data) => ({
        url: "brands/create-brand",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["brands"],
    }),

    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["brands"],
    }),

    updateBrand: builder.mutation({
      query: (data) => ({
        url: `brands/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["brands"],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useAddBrandMutation,
  useDeleteBrandMutation,
  useUpdateBrandMutation,
} = brandAPi;
