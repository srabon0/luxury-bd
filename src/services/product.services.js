import apiInstance from "../plugins/axiosIns";

export const ProductServices = {
  async fetchProducts(paylaod) {
    console.log(paylaod);

    let url = "products";

    if (paylaod?.page) {
      url += `?page=${paylaod?.page}&limit=${paylaod?.limit}`;
      if (paylaod?.search) {
        url += `&searchTerm=${paylaod?.search}`;
      }
      if (paylaod?.category) {
        url += `&category=${paylaod?.category}`;
      }
      if (paylaod?.brand) {
        url += `&brand=${paylaod?.brand}`;
      }
    }

    const { data } = await apiInstance.get(url);

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
  async updateProduct(id, product) {
    const url = `products/${id}`;
    const { data } = await apiInstance.patch(url, product);
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
      "products/delete-image/" + imageFileObj?.productId,
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
