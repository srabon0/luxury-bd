import { baseApi } from "../../api/baseApi";

const CAT_URL = "categories";
const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: (arg) => {
        return {
          url: CAT_URL,
          method: "GET",
          params: arg,
        };
      },
      providesTags: ["categories"],
    }),
    addCategory: builder.mutation({
      query: (data) => ({
        url: "categories/create-category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["categories"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categories"],
    }),
    updateCategory: builder.mutation({
      query: (data) => ({
        url: `categories/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} = categoryApi;
