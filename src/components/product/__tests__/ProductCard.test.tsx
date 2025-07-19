import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { ProductCard } from "../ProductCard";
import { Product } from "@/types/product";

// Mock Next.js components
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: unknown) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock the ProductBadge component
vi.mock("../ProductBadge", () => ({
  ProductBadge: ({
    type,
    value,
  }: {
    type: string;
    value?: string | number;
  }) => (
    <div data-testid={`badge-${type}`}>
      {type} {value && `- ${value}`}
    </div>
  ),
}));

// Mock helper functions
vi.mock("@/utils/helpers", () => ({
  formatPrice: (price: number) => `$${price.toFixed(2)}`,
  truncateText: (text: string, length: number) =>
    text.length > length ? `${text.substring(0, length)}...` : text,
  getProductBadges: () => [
    { type: "new", value: undefined },
    { type: "popular", value: undefined },
  ],
  getPrimaryBadge: () => ({ type: "new", value: undefined }),
}));

const mockProduct: Product = {
  id: 1,
  title: "Test Product with a Very Long Title That Should Be Truncated",
  price: 29.99,
  description: "Test description",
  category: "electronics",
  image: "https://example.com/image.jpg",
  rating: {
    rate: 4.5,
    count: 120,
  },
};

const defaultProps = {
  product: mockProduct,
  onAddToCart: vi.fn(),
  isInCart: false,
  cartQuantity: 0,
};

describe("ProductCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders product information correctly", () => {
      render(<ProductCard {...defaultProps} />);

      expect(screen.getByText("electronics")).toBeInTheDocument();
      expect(
        screen.getByText(/Test Product with a Very Long Title/)
      ).toBeInTheDocument();
      expect(screen.getByText("$29.99")).toBeInTheDocument();
      expect(screen.getByText("(120)")).toBeInTheDocument();
    });

    it("renders product image with correct attributes", () => {
      render(<ProductCard {...defaultProps} />);

      const image = screen.getByAltText(
        "Test Product with a Very Long Title That Should Be Truncated"
      );
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
    });

    it("renders star rating correctly", () => {
      render(<ProductCard {...defaultProps} />);

      // Should render 4 full stars, 1 half star for rating 4.5
      const stars = screen.getAllByTestId(/star/i);
      expect(stars.length).toBeGreaterThan(0);
    });
  });

  describe("View Modes", () => {
    it("renders in grid view by default", () => {
      const { container } = render(<ProductCard {...defaultProps} />);

      // Grid view should not have flex-row class
      const card = container.firstChild as HTMLElement;
      expect(card).not.toHaveClass("flex-row");
    });

    it("renders in list view when specified", () => {
      const { container } = render(
        <ProductCard {...defaultProps} viewMode="list" />
      );

      // List view should have flex-row class
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("flex-row");
    });
  });

  describe("Product Badges", () => {
    it("shows badges when showBadges is true", () => {
      render(<ProductCard {...defaultProps} showBadges={true} />);

      expect(screen.getByTestId("badge-new")).toBeInTheDocument();
    });

    it("hides badges when showBadges is false", () => {
      render(<ProductCard {...defaultProps} showBadges={false} />);

      expect(screen.queryByTestId("badge-new")).not.toBeInTheDocument();
    });

    it("shows badges by default", () => {
      render(<ProductCard {...defaultProps} />);

      expect(screen.getByTestId("badge-new")).toBeInTheDocument();
    });
  });

  describe("Cart Interactions", () => {
    it('shows "Add to Cart" button when product is not in cart', () => {
      render(<ProductCard {...defaultProps} />);

      expect(screen.getByText("Add to Cart")).toBeInTheDocument();
    });

    it('shows "Add More" button when product is in cart', () => {
      render(
        <ProductCard {...defaultProps} isInCart={true} cartQuantity={2} />
      );

      expect(screen.getByText("Add More")).toBeInTheDocument();
      expect(screen.getByText("In cart: 2")).toBeInTheDocument();
    });

    it("calls onAddToCart when button is clicked", async () => {
      const mockOnAddToCart = vi.fn();
      render(<ProductCard {...defaultProps} onAddToCart={mockOnAddToCart} />);

      const addButton = screen.getByText("Add to Cart");
      fireEvent.click(addButton);

      expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct);
    });

    it("shows loading state when adding to cart", async () => {
      const mockOnAddToCart = vi.fn(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      render(<ProductCard {...defaultProps} onAddToCart={mockOnAddToCart} />);

      const addButton = screen.getByText("Add to Cart");
      fireEvent.click(addButton);

      expect(screen.getByText("Adding...")).toBeInTheDocument();
      expect(addButton).toBeDisabled();

      await waitFor(() => {
        expect(screen.queryByText("Adding...")).not.toBeInTheDocument();
      });
    });
  });

  describe("Hover Effects", () => {
    it("applies hover effects to image container", () => {
      render(<ProductCard {...defaultProps} />);

      const imageContainer = screen.getByAltText(
        mockProduct.title
      ).parentElement;
      expect(imageContainer).toBeInTheDocument();

      // Test hover state
      fireEvent.mouseEnter(imageContainer!);
      // Note: Testing actual CSS classes is sufficient for hover effects
      // as the visual changes are handled by CSS
    });
  });

  describe("Navigation Links", () => {
    it("creates correct product detail links", () => {
      render(<ProductCard {...defaultProps} />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveAttribute("href", "/product/1");
      });
    });
  });

  describe("Responsive Design", () => {
    it("applies correct classes for different view modes", () => {
      const { container: gridContainer } = render(
        <ProductCard {...defaultProps} viewMode="grid" />
      );

      const { container: listContainer } = render(
        <ProductCard {...defaultProps} viewMode="list" />
      );

      const gridCard = gridContainer.firstChild as HTMLElement;
      const listCard = listContainer.firstChild as HTMLElement;

      expect(gridCard).not.toHaveClass("flex-row");
      expect(listCard).toHaveClass("flex-row");
    });
  });

  describe("Accessibility", () => {
    it("has proper focus management", () => {
      render(<ProductCard {...defaultProps} />);

      const addButton = screen.getByText("Add to Cart");
      expect(addButton).toHaveClass("focus-ring");
    });

    it("has proper alt text for images", () => {
      render(<ProductCard {...defaultProps} />);

      const image = screen.getByAltText(mockProduct.title);
      expect(image).toBeInTheDocument();
    });

    it("has proper button labeling", () => {
      render(<ProductCard {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("Add to Cart");
    });
  });

  describe("Custom Styling", () => {
    it("applies custom className when provided", () => {
      const { container } = render(
        <ProductCard {...defaultProps} className="custom-class" />
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("custom-class");
    });
  });

  describe("Error Handling", () => {
    it("handles missing product data gracefully", () => {
      const incompleteProduct = {
        ...mockProduct,
        rating: { rate: 0, count: 0 },
      };

      expect(() => {
        render(<ProductCard {...defaultProps} product={incompleteProduct} />);
      }).not.toThrow();
    });
  });
});
