import { API_BASE_URL } from "../../utils/api";

export default function ProductDetailsPage({ product }: { product: any }) {
  if (!product) return <p>No product details available</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{product.productname}</h2>

      {product.product_variant_image ? (
        <img
          src={`${API_BASE_URL}/uploads/${product.product_variant_image}`}
          alt={product.productname}
          className="w-64 h-64 object-cover rounded"
        />
      ) : (
        <p>No Image Available</p>
      )}

      <p className="mt-4">Quantity: {product.quantity}</p>
      <p className="mt-2">Price per Item: ₹{product.product_price}</p>
      
    </div>
  );
}
