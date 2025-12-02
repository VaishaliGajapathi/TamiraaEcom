import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";

const WishlistContext = createContext<any>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<any[]>([]);

  // ✅ Correct way to get userId
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?._id; // or user.id

  const fetchWishlist = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/wishlist/${userId}`);
      console.log("Fetched wishlist:", res.data);
      setWishlist(res.data?.wishlist || res.data || []); // adjust based on API shape
    } catch (err) {
      console.error("Error fetching wishlist", err);
    }
  };

  const addToWishlist = async (productVariantId: number) => {
    try {
      await axios.post(`${API_BASE_URL}/api/wishlist/add`, {
        userId,
        productVariantId,
      });
      fetchWishlist();
    } catch (err) {
      console.error("Error adding to wishlist", err);
    }
  };

  const removeFromWishlist = async (wishlistId: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/wishlist/${wishlistId}`);
      fetchWishlist();
    } catch (err) {
      console.error("Error removing from wishlist", err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [userId]);

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, fetchWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
