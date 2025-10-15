export const removeFromWishlist = async (userId: number, productVariantId: number) => {
  const res = await fetch(`https://tamiraaapi.tamiraa.com/api/wishlist/remove`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productVariantId }),
  });
  return res.json();
};
