import { loadCategory } from "../actions/categoryAction";
import apiInstance from "../../plugins/axiosIns";

const fetchCategories = () => {
  return async (dispatch, getState) => {
    const url = "categories";
    const { data } = await apiInstance.get(url);

    if (data?.success) {
      dispatch(loadCategory(data?.data));
    }
  };
};

export default fetchCategories;
