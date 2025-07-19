import { BreadcrumbItem } from '@/components/ui/breadcrumb';

export interface BreadcrumbConfig {
    category?: string;
    searchQuery?: string;
    productName?: string;
    customPath?: { label: string; href?: string; current?: boolean }[];
}

export const generateBreadcrumbs = (config: BreadcrumbConfig): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];

    // Add Products as base
    breadcrumbs.push({
        label: 'Products',
        href: '/'
    });

    // Add custom path if provided
    if (config.customPath) {
        breadcrumbs.push(...config.customPath);
        return breadcrumbs;
    }

    // Add category if present
    if (config.category) {
        breadcrumbs.push({
            label: formatCategoryName(config.category),
            href: `/?category=${encodeURIComponent(config.category)}`
        });
    }

    // Add search query if present
    if (config.searchQuery) {
        breadcrumbs.push({
            label: `Search: "${config.searchQuery}"`,
            current: true
        });
    }

    // Add product name if present (for product detail pages)
    if (config.productName) {
        breadcrumbs.push({
            label: truncateText(config.productName, 50),
            current: true
        });
    }

    // Mark the last item as current if not already marked
    if (breadcrumbs.length > 0 && !breadcrumbs[breadcrumbs.length - 1].current) {
        breadcrumbs[breadcrumbs.length - 1].current = true;
    }

    return breadcrumbs;
};

export const formatCategoryName = (category: string): string => {
    return category
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
};

// Generate breadcrumbs for common page types
export const getBreadcrumbsForPage = (
    pathname: string,
    searchParams: URLSearchParams
): BreadcrumbItem[] => {
    const category = searchParams.get('category');
    const search = searchParams.get('search') || searchParams.get('q');

    if (pathname === '/') {
        return generateBreadcrumbs({
            category: category || undefined,
            searchQuery: search || undefined
        });
    }

    if (pathname.startsWith('/product/')) {
        // For product detail pages - would need product data
        return generateBreadcrumbs({
            category: category || undefined
        });
    }

    if (pathname === '/cart') {
        return generateBreadcrumbs({
            customPath: [{ label: 'Shopping Cart', current: true }]
        });
    }

    return generateBreadcrumbs({});
};