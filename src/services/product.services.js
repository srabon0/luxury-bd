import apiInstance from "../plugins/axiosIns";

export const ProductSerdcvices = {
  async fetchProducts(page, count, searchKey) {
    console.log(page, count, searchKey);

    let url = `backend/product/all?page=${page}&count=${count}`;
    if (searchKey) {
      url += `&searchKey=${searchKey}`;
    }

    const { data } = await apiInstance.get(url);
    console.log(data?.data?.products);
    return data?.data;
  },

  async fetchProductById(productId) {
    const { data } = await apiInstance.get(`frontend/product/id/${productId}`);
    return data?.data;
  },
  async addProduct(product) {
    const { data } = await apiInstance.post("backend/product", product);
    return data;
  },
  async updateProduct(product) {
    const { data } = await apiInstance.put("backend/product", product);
    return data;
  },
  async deleteProduct(productId) {
    const { data } = await apiInstance.delete(`backend/product/${productId}`);
    return data;
  },

  async searchProducts(searchKey) {
    const url = `frontend/product/search?${
      searchKey?.page ? `page=${searchKey?.page}&` : ""
    }${searchKey?.count ? `count=${searchKey?.count}` : ""}`;
    const { data } = await apiInstance.post(url, {
      searchKey,
    });
    return data?.data;
  },

  async deleteSingleImage(imageFileObj) {
    console.log(imageFileObj);
    const { data } = await apiInstance.post(
      "backend/product/delete/image/" + imageFileObj?.productId,
      imageFileObj
    );
    return data;
  },

  async getLatestProduct() {
    const { data } = await apiInstance.get("frontend/product/latest");
    console.log(data);
    return data?.data;
  },
};
