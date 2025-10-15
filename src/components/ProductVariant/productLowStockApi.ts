import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

export const getLowStockProducts = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/low-stock`);
  return res.data.data || [];
};
