import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface CartItem {
  cartId: number;
  productVariantId: number;
  quantity: number;
  ProductVariant?: {
    productVariantId: number;
    productVariantImage: string;
    Product?: {
      productId: number;
      productName: string;
      productOfferPrice: number;
      productMrpPrice: number;
    };
  };
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  fetchCart: () => Promise<void>;
  addToCart: (productVariantId: number, quantity?: number) => Promise<void>;
  updateCart: (cartId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartId: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // ✅ Correct way to get logged-in user
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?._id; // or user.id depending on backend

  // Fetch Cart
  const fetchCart = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      setCart(res.data || []);
    } catch (err) {
      console.error("Error fetching cart", err);
    }
  };

  // Add to Cart
  const addToCart = async (productVariantId: number, quantity: number = 1) => {
    try {
      await axios.post("http://localhost:5000/api/cart/add", {
        userId,
        productVariantId,
        quantity,
      });
      await fetchCart();
    } catch (err) {
      console.error("Error adding to cart", err);
    }
  };

  // Update quantity
  const updateCart = async (cartId: number, quantity: number) => {
    try {
      await axios.put(`http://localhost:5000/api/cart/update/${cartId}`, {
        quantity,
      });
      await fetchCart();
    } catch (err) {
      console.error("Error updating cart", err);
    }
  };

  // Remove from cart
  const removeFromCart = async (cartId: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${cartId}`);
      await fetchCart();
    } catch (err) {
      console.error("Error removing from cart", err);
    }
  };

  // Auto-fetch cart on load
  useEffect(() => {
    fetchCart();
  }, [userId]);

  // Derived values
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) =>
      sum + (item.ProductVariant?.Product?.productOfferPrice || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, cartCount, cartTotal, fetchCart, addToCart, updateCart, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
