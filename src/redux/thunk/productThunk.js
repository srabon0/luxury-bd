import apiInstance from "../../plugins/axiosIns";
import { loadProducts } from "../actions/productAction";

const ProductThunks = {
  fetchProducts: () => async (dispatch) => {
    const url = "products";
    const { data } = await apiInstance.get(url);
    if (data) {
      dispatch(loadProducts(data?.data?.products));
    }
  },
  updateProduct: (id, updatedData) => async (dispatch) => {
    const url = `backend/product/update/` + id;
    const { data } = await apiInstance.put(url, updatedData);
    if (data) {
      dispatch(loadProducts({ id, updatedData }));
    }
  },
};

export default ProductThunks;
