import { useState, useEffect } from 'react';
import { apiService, Product } from '../services/api';

export interface ProductItem {
  id: number;
  image: string;
  tag: string;
  price: string;
  name: string;
  category: string;
  stockQuantity: number;
  productVariantId: number;
}

export const useProducts = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiProducts = await apiService.getProducts();
      
      // Transform API data to match our component interface
      const transformedProducts: ProductItem[] = apiProducts.map((product) => {
        // Determine tag based on price difference
        let tag = '';
        if (product.productOfferPrice < product.productMrpPrice * 0.9) {
          tag = '10% OFF';
        } else if (product.productOfferPrice < product.productMrpPrice * 0.8) {
          tag = '20% OFF';
        } else if (product.productOfferPrice < product.productMrpPrice * 0.7) {
          tag = '30% OFF';
        } else if (product.productOfferPrice < product.productMrpPrice) {
          tag = 'Sale';
        }

        return {
          id: product.productId,
          image: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/uploads/${product.productImage}`,
          tag,
          price: `₹${product.productOfferPrice}`,
          name: product.productName,
          category: product.SubCategory?.subCategoryName || 'Uncategorized',
          stockQuantity: 100, // Default stock since it's not in the products API
          productVariantId: product.productId, // Using productId as variantId for now
        };
      });

      setProducts(transformedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
};

