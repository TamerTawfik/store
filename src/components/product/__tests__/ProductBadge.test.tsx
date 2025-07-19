import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProductBadge } from "../ProductBadge";

describe("ProductBadge", () => {
  it("renders new badge correctly", () => {
    render(<ProductBadge type="new" />);

    const badge = screen.getByText("New");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-blue-500");
    expect(badge).toHaveClass("animate-pulse");
  });

  it("renders sale badge with value", () => {
    render(<ProductBadge type="sale" value="25%" />);

    const badge = screen.getByText("Sale 25%");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-red-500");
  });

  it("renders popular badge correctly", () => {
    render(<ProductBadge type="popular" />);

    const badge = screen.getByText("Popular");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-green-500");
  });

  it("renders low-stock badge with value", () => {
    render(<ProductBadge type="low-stock" value={5} />);

    const badge = screen.getByText("Low Stock 5");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-orange-500");
    expect(badge).toHaveClass("animate-pulse");
  });

  it("renders out-of-stock badge correctly", () => {
    render(<ProductBadge type="out-of-stock" />);

    const badge = screen.getByText("Out of Stock");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-gray-500");
  });

  it("applies custom className", () => {
    render(<ProductBadge type="new" className="custom-class" />);

    const badge = screen.getByText("New");
    expect(badge).toHaveClass("custom-class");
  });

  it("renders with correct icons", () => {
    const { container } = render(<ProductBadge type="new" />);

    // Check if SVG icon is present
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("w-3", "h-3");
  });

  it("has hover effects", () => {
    render(<ProductBadge type="popular" />);

    const badge = screen.getByText("Popular");
    expect(badge).toHaveClass("hover:scale-105");
    expect(badge).toHaveClass("transition-all");
  });
});
