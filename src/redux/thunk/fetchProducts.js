import apiInstance from "../../plugins/axiosIns";
import { loadProducts } from "../actions/productAction";

const fetchProducts = (page, count, searchKey) => {
  return async (dispatch, getState) => {
    let url = `/products`;
    const { data } = await apiInstance.get(url);
    if (data) {
      dispatch(loadProducts(data?.data?.data));
    }
  };
};

export default fetchProducts;
