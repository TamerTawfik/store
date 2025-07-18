import { Product } from '@/types/product';

const BASE_URL = 'https://fakestoreapi.com';

// API Error handling
export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API request function with error handling
async function apiRequest<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or invalid response');
  }
}

// Product API functions
export const productApi = {
  // Get all products
  getAllProducts: (): Promise<Product[]> => {
    return apiRequest<Product[]>('/products');
  },

  // Get single product by ID
  getProductById: (id: number): Promise<Product> => {
    return apiRequest<Product>(`/products/${id}`);
  },

  // Get products by category
  getProductsByCategory: (category: string): Promise<Product[]> => {
    return apiRequest<Product[]>(`/products/category/${category}`);
  },

  // Get all categories
  getCategories: (): Promise<string[]> => {
    return apiRequest<string[]>('/products/categories');
  },

  // Get limited products (for pagination)
  getLimitedProducts: (limit: number): Promise<Product[]> => {
    return apiRequest<Product[]>(`/products?limit=${limit}`);
  },

  // Get sorted products
  getSortedProducts: (sort: 'asc' | 'desc'): Promise<Product[]> => {
    return apiRequest<Product[]>(`/products?sort=${sort}`);
  }
};

export default productApi;
