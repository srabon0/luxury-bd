import apiInstance from "../../plugins/axiosIns";
import { loadBrands, deleteBrand, updateBrand } from "../actions/brandAction";

const BrandThunks = {
  fetchBrands: () => async (dispatch) => {
    const url = "/frontend/brand/all";
    const { data } = await apiInstance.get(url);
    if (data) {
      dispatch(loadBrands(data?.data?.brands));
    }
  },
  deleteBrandById: (id) => async (dispatch) => {
    console.log(id);
    const url = `backend/brand/delete/` + id;
    const { data } = await apiInstance.delete(url);
    if (data) {
      console.log(data?.data?.id);
      dispatch(deleteBrand(id));
    }
  },
  updateBrand: (id, updatedData) => async (dispatch) => {
    const url = `backend/brand/update/` + id;
    const { data } = await apiInstance.put(url, updatedData);
    if (data) {
      dispatch(updateBrand({ id, updatedData }));
    }
  },
};

export default BrandThunks;
