import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

const API_URL = `${API_BASE_URL}/api/product-stock`;

export const getCategories = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/categories`);
  return res.data;
};

export const getProducts = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/products`);
  return res.data;
};

export const getStock = async (productVariantId: number) => {
  const res = await axios.get(`${API_URL}/${productVariantId}`);
  return res.data;
};

export const getAllStocks = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const addStock = async (productVariantId: number, quantity: number) => {
  // Backend now updates both ProductStock and ProductVariant
  const res = await axios.post(`${API_URL}/add`, { productVariantId, quantity });
  return res.data; // includes updated stock + variant
};

export const reduceStock = async (productVariantId: number, quantity: number) => {
  // Backend now updates both ProductStock and ProductVariant
  const res = await axios.post(`${API_URL}/reduce`, { productVariantId, quantity });
  return res.data; // includes updated stock + variant
};
