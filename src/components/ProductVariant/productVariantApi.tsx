import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

export const BASE_URL = `${API_BASE_URL}/api/product-variants`;

export const getCategories = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/categories`);
  return res.data; 
};

export const getSubCategories = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/subcategories`);
  return res.data;
};

export const getProducts = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/products`); 
  return res.data;
};

export const getProductVariants = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const createProductVariant = async (formData: FormData) => {
  const res = await axios.post(BASE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateProductVariant = async (id: number | string, formData: FormData) => {
  const res = await axios.put(`${BASE_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteProductVariant = async (id: number | string) => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};
