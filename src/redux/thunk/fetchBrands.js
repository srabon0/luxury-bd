import apiInstance from "../../plugins/axiosIns";
import { loadBrands } from "../actions/brandAction";

const fetchBrands = () => {
  return async (dispatch, getState) => {
    const url = "brands";
    const { data } = await apiInstance.get(url);

    if (data?.success) {
      dispatch(loadBrands(data?.data));
    }
  };
};

export default fetchBrands;
