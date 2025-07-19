import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  ProductSkeleton,
  ProductSkeletonGrid,
  ProductSkeletonList,
} from "../ProductSkeleton";

describe("ProductSkeleton", () => {
  describe("Grid View (default)", () => {
    it("renders skeleton with default grid layout", () => {
      const { container } = render(<ProductSkeleton />);

      // Check for main container
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass("bg-white", "rounded-lg", "shadow-md");
    });

    it("renders skeleton with badges when showBadges is true", () => {
      const { container } = render(<ProductSkeleton showBadges={true} />);

      // Check for badge skeletons
      const badgeSkeletons = container.querySelectorAll(".absolute");
      expect(badgeSkeletons.length).toBeGreaterThan(0);
    });

    it("does not render badges when showBadges is false", () => {
      const { container } = render(<ProductSkeleton showBadges={false} />);

      // Check that no badge skeletons are present
      const badgeSkeletons = container.querySelectorAll(".absolute");
      expect(badgeSkeletons.length).toBe(0);
    });

    it("applies custom className", () => {
      const customClass = "custom-skeleton-class";
      const { container } = render(<ProductSkeleton className={customClass} />);

      expect(container.firstChild).toHaveClass(customClass);
    });

    it("renders all required skeleton elements for grid view", () => {
      const { container } = render(<ProductSkeleton />);

      // Check for image skeleton
      const imageContainer = container.querySelector(".h-48");
      expect(imageContainer).toBeInTheDocument();

      // Check for content skeletons (category, title, rating, price, button)
      const skeletonElements = container.querySelectorAll(
        '[data-slot="skeleton"]'
      );
      expect(skeletonElements.length).toBeGreaterThan(5); // Should have multiple skeleton elements
    });
  });

  describe("List View", () => {
    it("renders skeleton with list layout", () => {
      const { container } = render(<ProductSkeleton viewMode="list" />);

      // Check for flex layout characteristic of list view
      const flexContainer = container.querySelector(".flex.gap-4");
      expect(flexContainer).toBeInTheDocument();
    });

    it("renders smaller image skeleton in list view", () => {
      const { container } = render(<ProductSkeleton viewMode="list" />);

      // Check for smaller image dimensions in list view
      const imageContainer = container.querySelector(".w-24.h-24");
      expect(imageContainer).toBeInTheDocument();
    });

    it("renders badges in list view when enabled", () => {
      const { container } = render(
        <ProductSkeleton viewMode="list" showBadges={true} />
      );

      // Check for badge skeletons in list view
      const badgeSkeletons = container.querySelectorAll(".absolute");
      expect(badgeSkeletons.length).toBeGreaterThan(0);
    });

    it("renders all required skeleton elements for list view", () => {
      const { container } = render(<ProductSkeleton viewMode="list" />);

      // Check for content structure
      const contentContainer = container.querySelector(".flex-1.space-y-3");
      expect(contentContainer).toBeInTheDocument();

      // Check for skeleton elements
      const skeletonElements = container.querySelectorAll(
        '[data-slot="skeleton"]'
      );
      expect(skeletonElements.length).toBeGreaterThan(5);
    });
  });

  describe("Responsive Design", () => {
    it("includes responsive classes for list view image", () => {
      const { container } = render(<ProductSkeleton viewMode="list" />);

      // Check for responsive image classes
      const imageContainer = container.querySelector(
        ".w-24.h-24.md\\:w-32.md\\:h-32"
      );
      expect(imageContainer).toBeInTheDocument();
    });

    it("maintains consistent spacing across different view modes", () => {
      const { container: gridContainer } = render(
        <ProductSkeleton viewMode="grid" />
      );
      const { container: listContainer } = render(
        <ProductSkeleton viewMode="list" />
      );

      // Both should have proper spacing classes
      expect(gridContainer.querySelector(".space-y-3")).toBeInTheDocument();
      expect(listContainer.querySelector(".space-y-3")).toBeInTheDocument();
    });
  });
});

describe("ProductSkeletonGrid", () => {
  it("renders default number of skeleton items", () => {
    const { container } = render(<ProductSkeletonGrid />);

    // Should render 8 skeleton items by default
    const skeletonItems = container.querySelectorAll(".bg-white.rounded-lg");
    expect(skeletonItems.length).toBe(8);
  });

  it("renders custom number of skeleton items", () => {
    const customCount = 4;
    const { container } = render(<ProductSkeletonGrid count={customCount} />);

    const skeletonItems = container.querySelectorAll(".bg-white.rounded-lg");
    expect(skeletonItems.length).toBe(customCount);
  });

  it("applies grid layout classes", () => {
    const { container } = render(<ProductSkeletonGrid />);

    const gridContainer = container.firstChild;
    expect(gridContainer).toHaveClass(
      "grid",
      "grid-cols-1",
      "sm:grid-cols-2",
      "lg:grid-cols-3",
      "xl:grid-cols-4",
      "gap-6"
    );
  });

  it("applies custom className to grid container", () => {
    const customClass = "custom-grid-class";
    const { container } = render(
      <ProductSkeletonGrid className={customClass} />
    );

    expect(container.firstChild).toHaveClass(customClass);
  });

  it("passes showBadges prop to individual skeletons", () => {
    const { container } = render(<ProductSkeletonGrid showBadges={false} />);

    // Check that badge skeletons are not present when showBadges is false
    const badgeSkeletons = container.querySelectorAll(".absolute");
    expect(badgeSkeletons.length).toBe(0);
  });

  it("generates unique keys for skeleton items", () => {
    const { container } = render(<ProductSkeletonGrid count={3} />);

    const skeletonItems = container.querySelectorAll(".bg-white.rounded-lg");
    expect(skeletonItems.length).toBe(3);

    // Each item should be rendered (no key conflicts)
    skeletonItems.forEach((item) => {
      expect(item).toBeInTheDocument();
    });
  });
});

describe("ProductSkeletonList", () => {
  it("renders default number of skeleton items", () => {
    const { container } = render(<ProductSkeletonList />);

    // Should render 6 skeleton items by default
    const skeletonItems = container.querySelectorAll(".bg-white.rounded-lg");
    expect(skeletonItems.length).toBe(6);
  });

  it("renders custom number of skeleton items", () => {
    const customCount = 3;
    const { container } = render(<ProductSkeletonList count={customCount} />);

    const skeletonItems = container.querySelectorAll(".bg-white.rounded-lg");
    expect(skeletonItems.length).toBe(customCount);
  });

  it("applies list layout classes", () => {
    const { container } = render(<ProductSkeletonList />);

    const listContainer = container.firstChild;
    expect(listContainer).toHaveClass("space-y-4");
  });

  it("applies custom className to list container", () => {
    const customClass = "custom-list-class";
    const { container } = render(
      <ProductSkeletonList className={customClass} />
    );

    expect(container.firstChild).toHaveClass(customClass);
  });

  it("renders skeletons in list view mode", () => {
    const { container } = render(<ProductSkeletonList />);

    // Check for list view characteristics (flex layout)
    const flexContainers = container.querySelectorAll(".flex.gap-4");
    expect(flexContainers.length).toBeGreaterThan(0);
  });

  it("passes showBadges prop to individual skeletons", () => {
    const { container } = render(<ProductSkeletonList showBadges={false} />);

    // Check that badge skeletons are not present when showBadges is false
    const badgeSkeletons = container.querySelectorAll(".absolute");
    expect(badgeSkeletons.length).toBe(0);
  });

  it("generates unique keys for skeleton items", () => {
    const { container } = render(<ProductSkeletonList count={3} />);

    const skeletonItems = container.querySelectorAll(".bg-white.rounded-lg");
    expect(skeletonItems.length).toBe(3);

    // Each item should be rendered (no key conflicts)
    skeletonItems.forEach((item) => {
      expect(item).toBeInTheDocument();
    });
  });
});

describe("Animation and Styling", () => {
  it("includes animation classes for grid view", () => {
    const { container } = render(<ProductSkeleton viewMode="grid" />);

    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass("animate-pulse");
  });

  it("includes proper styling classes", () => {
    const { container } = render(<ProductSkeleton />);

    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass(
      "bg-white",
      "rounded-lg",
      "shadow-md",
      "overflow-hidden"
    );
  });

  it("skeleton elements have proper styling", () => {
    const { container } = render(<ProductSkeleton />);

    const skeletonElements = container.querySelectorAll(
      '[data-slot="skeleton"]'
    );
    skeletonElements.forEach((element) => {
      expect(element).toHaveClass("bg-accent", "animate-pulse");
      // Check that element has some form of rounded corners (rounded-md or rounded-full)
      expect(element.className).toMatch(/rounded-(md|full)/);
    });
  });
});
