import apiInstance from "../../plugins/axiosIns";
import {
  deleteCategory,
  loadCategory,
  updateCategory,
} from "../actions/categoryAction";

const CategoryThunks = {
  fetchCategories: () => async (dispatch) => {
    const url = "categories";
    const { data } = await apiInstance.get(url);
    if (data?.success) {
      dispatch(loadCategory(data?.data));
    }
  },
  deleteCategoryById: (id) => async (dispatch) => {
    console.log(id);
    const url = `categories/` + id;
    const { data } = await apiInstance.delete(url);
    if (data) {
      console.log(data?.data?.id);
      dispatch(deleteCategory(id));
    }
  },
  updateCategory: (id, updatedData) => async (dispatch) => {
    const url = `categories/` + id;
    const { data } = await apiInstance.put(url, updatedData);
    if (data) {
      dispatch(updateCategory({ id, updatedData }));
    }
  },
};

export default CategoryThunks;
