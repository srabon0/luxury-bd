import apiInstance from "../../plugins/axiosIns";
import { loadProducts } from "../actions/productAction";

const fetchProducts = (page, count, searchKey) => {
  return async (dispatch, getState) => {
    let url = `backend/product/all`;
    const { data } = await apiInstance.get(url);
    if (data) {
      dispatch(loadProducts(data?.data));
    }
  };
};

export default fetchProducts;
