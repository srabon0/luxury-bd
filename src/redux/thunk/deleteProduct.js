import apiInstance from "../../plugins/axiosIns";
import { deleteProduct } from "../actions/productAction";

const deleteProductById = (id) => {
  return async (dispatch, getState) => {
    let url = `backend/product/delete/` + id;
    const { data } = await apiInstance.get(url);
    if (data) {
      dispatch(deleteProduct(id));
    }
  };
};

export default deleteProductById;
