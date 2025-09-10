const API_BASE_URL = 'http://localhost:5000/api';

export interface ProductVariant {
  productVariantId: number;
  productId: number;
  subCategoryId: number | null;
  categoryId: number | null;
  productColor: string;
  stockQuantity: number;
  lowStock: number;
  productVariantImage: string;
  createdAt: string;
  updatedAt: string;
  Product: {
    productId: number;
    productName: string;
    productDescription: string;
    productImage: string;
    brandName: string;
    material: string;
    productMrpPrice: number;
    productOfferPrice: number;
    subCategoryId: number;
    categoryId: number;
    createdAt: string;
    updatedAt: string;
  };
  SubCategory: {
    subCategoryId: number;
    subCategoryName: string;
    categoryId: number;
    createdAt: string;
    updatedAt: string;
    Category: {
      categoryId: number;
      categoryName: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export interface Category {
  categoryId: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory {
  subCategoryId: number;
  subCategoryName: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  productId: number;
  productName: string;
  productDescription: string;
  productImage: string;
  brandName: string;
  material: string;
  productMrpPrice: number;
  productOfferPrice: number;
  subCategoryId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  SubCategory?: {
    subCategoryId: number;
    subCategoryName: string;
    categoryId: number;
    createdAt: string;
    updatedAt: string;
    Category: {
      categoryId: number;
      categoryName: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

class ApiService {
  private async fetchApi<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getProductVariants(): Promise<ProductVariant[]> {
    const response = await this.fetchApi<ProductVariant[]>('/product-variants');
    return response.data;
  }

  async getCategories(): Promise<Category[]> {
    const response = await this.fetchApi<Category[]>('/categories');
    return response.data;
  }

  async getSubCategories(): Promise<SubCategory[]> {
    const response = await this.fetchApi<SubCategory[]>('/subcategories');
    return response.data;
  }

  async getProducts(): Promise<Product[]> {
    const response = await this.fetchApi<Product[]>('/products');
    return response.data;
  }
}

export const apiService = new ApiService();

