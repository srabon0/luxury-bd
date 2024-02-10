import apiInstance from "../../plugins/axiosIns";
import {
  loadCategory,
  deleteCategory,
  updateCategory,
} from "../actions/categoryAction";

const CategoryThunks = {
  fetchCategories: () => async (dispatch) => {
    const url = "/frontend/category/all";
    const { data } = await apiInstance.get(url);
    if (data) {
      dispatch(loadCategory(data?.data?.categories));
    }
  },
  deleteCategoryById: (id) => async (dispatch) => {
    console.log(id);
    const url = `backend/category/delete/` + id;
    const { data } = await apiInstance.delete(url);
    if (data) {
      console.log(data?.data?.id);
      dispatch(deleteCategory(id));
    }
  },
  updateCategory: (id, updatedData) => async (dispatch) => {
    const url = `backend/category/update/` + id;
    const { data } = await apiInstance.put(url, updatedData);
    if (data) {
      dispatch(updateCategory({ id, updatedData }));
    }
  },
};

export default CategoryThunks;
