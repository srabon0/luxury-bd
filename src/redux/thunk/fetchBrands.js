import apiInstance from "../../plugins/axiosIns";
import { loadBrands } from "../actions/brandAction";

const fetchBrands = () => {
  return async (dispatch, getState) => {
    const url = "/frontend/brand/all";
    const { data } = await apiInstance.get(url);
    console.log(data?.data?.brands);
    if (data) {
      dispatch(loadBrands(data?.data?.brands));
    }
  };
};

export default fetchBrands;
