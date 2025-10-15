import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

export const BASE_URL = `${API_BASE_URL}/api/coupons`;

// Get all coupons
export const getCoupons = async () => {
  const res = await axios.get(BASE_URL);
  return res.data.data;
};

// Create coupon
export const createCoupon = async (couponData: any) => {
  const res = await axios.post(BASE_URL, couponData);
  return res.data.data;
};

// Update coupon
export const updateCoupon = async (id: number, couponData: any) => {
  const res = await axios.put(`${BASE_URL}/${id}`, couponData);
  return res.data.data;
};

// Delete coupon
export const deleteCoupon = async (id: number) => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};
