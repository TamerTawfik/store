import { describe, it, expect } from 'vitest';
import { Product } from '@/types/product';
import {
  isNewProduct,
  isOnSale,
  isPopularProduct,
  getStockStatus,
  getProductBadges,
  shouldShowBadges,
  getPrimaryBadge
} from '../helpers';

// Mock product data for testing
const mockProducts: Record<string, Product> = {
  newProduct: {
    id: 1,
    title: 'New Product',
    price: 25.99,
    description: 'A new product',
    category: 'electronics',
    image: 'image.jpg',
    rating: { rate: 3.5, count: 10 }
  },
  saleProduct: {
    id: 2,
    title: 'Sale Product',
    price: 15.99,
    description: 'A product on sale',
    category: 'clothing',
    image: 'image.jpg',
    rating: { rate: 4.0, count: 75 }
  },
  popularProduct: {
    id: 3,
    title: 'Popular Product',
    price: 45.99,
    description: 'A popular product',
    category: 'electronics',
    image: 'image.jpg',
    rating: { rate: 4.5, count: 150 }
  },
  lowStockProduct: {
    id: 4,
    title: 'Low Stock Product',
    price: 30.99,
    description: 'A low stock product',
    category: 'books',
    image: 'image.jpg',
    rating: { rate: 3.8, count: 15 }
  },
  outOfStockProduct: {
    id: 5,
    title: 'Out of Stock Product',
    price: 20.99,
    description: 'An out of stock product',
    category: 'clothing',
    image: 'image.jpg',
    rating: { rate: 4.2, count: 0 }
  },
  regularProduct: {
    id: 6,
    title: 'Regular Product',
    price: 35.99,
    description: 'A regular product',
    category: 'home',
    image: 'image.jpg',
    rating: { rate: 3.8, count: 80 }
  }
};

describe('Product Badge Utilities', () => {
  describe('isNewProduct', () => {
    it('should return true for products with low rating count', () => {
      expect(isNewProduct(mockProducts.newProduct)).toBe(true);
      expect(isNewProduct(mockProducts.lowStockProduct)).toBe(true);
    });

    it('should return false for products with high rating count', () => {
      expect(isNewProduct(mockProducts.popularProduct)).toBe(false);
      expect(isNewProduct(mockProducts.regularProduct)).toBe(false);
    });
  });

  describe('isOnSale', () => {
    it('should return true for products under $20', () => {
      expect(isOnSale(mockProducts.saleProduct)).toBe(true);
    });

    it('should return false for products over $20', () => {
      expect(isOnSale(mockProducts.newProduct)).toBe(false);
      expect(isOnSale(mockProducts.popularProduct)).toBe(false);
    });
  });

  describe('isPopularProduct', () => {
    it('should return true for products with high rating and count', () => {
      expect(isPopularProduct(mockProducts.popularProduct)).toBe(true);
    });

    it('should return false for products with low rating or count', () => {
      expect(isPopularProduct(mockProducts.newProduct)).toBe(false);
      expect(isPopularProduct(mockProducts.saleProduct)).toBe(false);
    });
  });

  describe('getStockStatus', () => {
    it('should return out-of-stock for products with 0 rating count', () => {
      expect(getStockStatus(mockProducts.outOfStockProduct)).toBe('out-of-stock');
    });

    it('should return low-stock for products with low rating count', () => {
      expect(getStockStatus(mockProducts.newProduct)).toBe('low-stock');
      expect(getStockStatus(mockProducts.lowStockProduct)).toBe('low-stock');
    });

    it('should return in-stock for products with sufficient rating count', () => {
      expect(getStockStatus(mockProducts.popularProduct)).toBe('in-stock');
      expect(getStockStatus(mockProducts.regularProduct)).toBe('in-stock');
    });
  });

  describe('getProductBadges', () => {
    it('should return new badge for new products', () => {
      const badges = getProductBadges(mockProducts.newProduct);
      expect(badges).toContainEqual({ type: 'new' });
    });

    it('should return sale badge for sale products', () => {
      const badges = getProductBadges(mockProducts.saleProduct);
      expect(badges.some(badge => badge.type === 'sale')).toBe(true);
    });

    it('should return popular badge for popular products', () => {
      const badges = getProductBadges(mockProducts.popularProduct);
      expect(badges).toContainEqual({ type: 'popular' });
    });

    it('should return low-stock badge for low stock products', () => {
      const badges = getProductBadges(mockProducts.lowStockProduct);
      expect(badges.some(badge => badge.type === 'low-stock')).toBe(true);
    });

    it('should return out-of-stock badge for out of stock products', () => {
      const badges = getProductBadges(mockProducts.outOfStockProduct);
      expect(badges).toContainEqual({ type: 'out-of-stock' });
    });

    it('should return multiple badges when applicable', () => {
      // Create a product that qualifies for multiple badges
      const multiBadgeProduct: Product = {
        ...mockProducts.newProduct,
        price: 15.99 // Makes it on sale too
      };
      
      const badges = getProductBadges(multiBadgeProduct);
      expect(badges.length).toBeGreaterThan(1);
      expect(badges.some(badge => badge.type === 'new')).toBe(true);
      expect(badges.some(badge => badge.type === 'sale')).toBe(true);
    });
  });

  describe('shouldShowBadges', () => {
    it('should return true for products with badges', () => {
      expect(shouldShowBadges(mockProducts.newProduct)).toBe(true);
      expect(shouldShowBadges(mockProducts.saleProduct)).toBe(true);
      expect(shouldShowBadges(mockProducts.popularProduct)).toBe(true);
    });

    it('should return false for products without badges', () => {
      expect(shouldShowBadges(mockProducts.regularProduct)).toBe(false);
    });
  });

  describe('getPrimaryBadge', () => {
    it('should return the highest priority badge', () => {
      const primaryBadge = getPrimaryBadge(mockProducts.outOfStockProduct);
      expect(primaryBadge?.type).toBe('out-of-stock');
    });

    it('should return null for products without badges', () => {
      const primaryBadge = getPrimaryBadge(mockProducts.regularProduct);
      expect(primaryBadge).toBeNull();
    });

    it('should prioritize out-of-stock over other badges', () => {
      // Create a product that would have multiple badges but is out of stock
      const outOfStockSaleProduct: Product = {
        ...mockProducts.saleProduct,
        rating: { rate: 4.0, count: 0 }
      };
      
      const primaryBadge = getPrimaryBadge(outOfStockSaleProduct);
      expect(primaryBadge?.type).toBe('out-of-stock');
    });

    it('should prioritize low-stock over sale badges', () => {
      const primaryBadge = getPrimaryBadge(mockProducts.lowStockProduct);
      expect(primaryBadge?.type).toBe('low-stock');
    });
  });
});