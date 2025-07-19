# ProductFilters Component

The `ProductFilters` component provides advanced filtering capabilities for product listings with a modern, collapsible sidebar design.

## Features

- **Category Selection**: Multiple category selection with visual hierarchy
- **Price Range Slider**: Interactive price range filtering with real-time updates
- **Rating Filter**: Star-based minimum rating selection
- **Stock Status Filter**: Filter by availability (in-stock, low-stock, out-of-stock)
- **Active Filter Chips**: Visual representation of active filters with easy removal
- **Clear All Filters**: One-click filter reset functionality
- **Responsive Design**: Collapsible sidebar for desktop, bottom sheet for mobile
- **Collapsible Sections**: Expandable/collapsible filter sections

## Usage

```tsx
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductFilters as ProductFiltersType } from "@/types/product";

const MyComponent = () => {
  const [filters, setFilters] = useState<ProductFiltersType>({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const categories = [
    "electronics",
    "jewelery",
    "men's clothing",
    "women's clothing",
  ];
  const priceRange = { min: 0, max: 1000 };

  return (
    <ProductFilters
      filters={filters}
      onFiltersChange={setFilters}
      categories={categories}
      priceRange={priceRange}
      isOpen={isFiltersOpen}
      onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
    />
  );
};
```

## Props

| Prop              | Type                                    | Description                            |
| ----------------- | --------------------------------------- | -------------------------------------- |
| `filters`         | `ProductFiltersType`                    | Current filter state                   |
| `onFiltersChange` | `(filters: ProductFiltersType) => void` | Callback when filters change           |
| `categories`      | `string[]`                              | Available categories for filtering     |
| `priceRange`      | `{ min: number; max: number }`          | Price range bounds                     |
| `isOpen`          | `boolean`                               | Whether filters panel is open (mobile) |
| `onToggle`        | `() => void`                            | Toggle filters panel visibility        |
| `className`       | `string`                                | Optional CSS classes                   |

## Filter Types

The component supports the following filter types:

### Category Filters

- Single category selection (`category`)
- Multiple category selection (`categories`)

### Price Filters

- Price range with slider (`priceRange`)
- Individual min/max prices (`minPrice`, `maxPrice`)

### Rating Filter

- Minimum rating selection (`rating`)

### Stock Status Filter

- Multiple stock status selection (`stockStatus`)
- Options: 'in-stock', 'low-stock', 'out-of-stock'

### Search and Sort

- Search query (`searchQuery`)
- Sort options (`sortBy`)

## Integration with Product Filtering

Use the `filterProductsAdvanced` helper function to apply filters:

```tsx
import { filterProductsAdvanced } from "@/utils/helpers";

const filteredProducts = filterProductsAdvanced(products, filters);
```

## Styling

The component uses Tailwind CSS classes and shadcn/ui components:

- `Card` components for filter sections
- `Slider` for price range
- `Badge` for active filter chips
- `Button` for actions
- Lucide React icons for visual elements

## Accessibility

- Keyboard navigation support
- Screen reader friendly labels
- ARIA attributes for interactive elements
- Focus management for collapsible sections

## Responsive Behavior

- **Desktop**: Fixed sidebar with collapsible sections
- **Tablet**: Collapsible sidebar
- **Mobile**: Hidden by default, toggleable with button

## Active Filter Management

The component automatically:

- Counts active filters
- Displays filter chips with remove buttons
- Provides "Clear All" functionality
- Maintains sort order when clearing filters
