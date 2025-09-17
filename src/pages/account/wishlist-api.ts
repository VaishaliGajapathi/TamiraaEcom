export const removeFromWishlist = async (userId: number, productVariantId: number) => {
  const res = await fetch(`http://localhost:5000/api/wishlist/remove`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productVariantId }),
  });
  return res.json();
};
