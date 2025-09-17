import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

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
      const res = await axios.get(`http://localhost:5000/api/wishlist/${userId}`);
      console.log("Fetched wishlist:", res.data);
      setWishlist(res.data?.wishlist || res.data || []); // adjust based on API shape
    } catch (err) {
      console.error("Error fetching wishlist", err);
    }
  };

  const addToWishlist = async (productVariantId: number) => {
    try {
      await axios.post("http://localhost:5000/api/wishlist/add", {
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
      await axios.delete(`http://localhost:5000/api/wishlist/${wishlistId}`);
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
