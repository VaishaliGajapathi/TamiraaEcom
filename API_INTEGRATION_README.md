# API Integration for Nyra Sarees Website

This document explains how the website has been integrated with your backend API to fetch real product data.

## API Endpoints Used

The website now fetches data from these backend endpoints:

- `http://localhost:5000/api/product-variants` - Main product data
- `http://localhost:5000/api/categories` - Category information
- `http://localhost:5000/api/subcategories` - Subcategory information  
- `http://localhost:5000/api/products` - Product information

## Key Features Implemented

### 1. Product Data Integration
- **Images**: Uses `productVariantImage` from the API response
- **Prices**: Displays `productOfferPrice` from the API
- **Names**: Shows `productName` from the API
- **Categories**: Uses `subCategoryName` for product categorization

### 2. Smart Tag System
The system automatically generates product tags based on:
- **Low Stock**: When `stockQuantity <= lowStock`
- **10% OFF**: When offer price is significantly lower than MRP
- **Hot Sale**: When stock quantity is high (>50)

### 3. Image Handling
- Automatically constructs image URLs for backend images
- Falls back to local images if API images fail to load
- Supports both local assets and backend image paths

## Files Created/Modified

### New Files:
- `src/services/api.ts` - API service layer
- `src/hooks/useProducts.ts` - Custom hook for product management
- `API_INTEGRATION_README.md` - This documentation

### Modified Files:
- `src/components/product/layout-one.tsx` - Updated to handle API images
- `src/pages/index/index.tsx` - Main page now uses API data
- `src/pages/shop/shop-v1.tsx` - Shop page uses API data

## How It Works

1. **Data Fetching**: The `useProducts` hook fetches data from your API when components mount
2. **Data Transformation**: API response is transformed to match the existing component interface
3. **Image URL Construction**: Images are automatically converted to proper URLs
4. **Error Handling**: Graceful fallbacks for loading states and errors
5. **Real-time Updates**: Products are fetched fresh from the API each time

## Usage Example

```tsx
import { useProducts } from '../hooks/useProducts';

function MyComponent() {
  const { products, loading, error } = useProducts();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {products.map(product => (
        <LayoutOne key={product.id} item={product} />
      ))}
    </div>
  );
}
```

## Backend Requirements

Your backend should:
- Serve images from `/uploads/` directory
- Return JSON responses with the structure shown in the API response
- Handle CORS for localhost:3000 (React dev server)
- Include proper error handling

## Testing

1. Start your backend server on `localhost:5000`
2. Start the React development server
3. Navigate to the home page or shop pages
4. Products should load from your API with real images and prices

## Troubleshooting

- **Images not loading**: Check if backend serves images from `/uploads/` directory
- **API errors**: Verify backend server is running and endpoints are correct
- **CORS issues**: Ensure backend allows requests from frontend origin
- **Data not showing**: Check browser console for API response errors

## Future Enhancements

- Add pagination for large product catalogs
- Implement search and filtering on the backend
- Add real-time stock updates
- Implement product caching for better performance

