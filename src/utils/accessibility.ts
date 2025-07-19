/**
 * Accessibility utilities for WCAG 2.1 AA compliance
 */

// ARIA label generators
export const generateAriaLabel = {
    productCard: (title: string, price: number, rating: number, inCart: boolean) =>
        `${title}, priced at $${price}, rated ${rating} out of 5 stars${inCart ? ', already in cart' : ''}`,

    addToCartButton: (title: string, inCart: boolean, isLoading: boolean) => {
        if (isLoading) return `Adding ${title} to cart`;
        return inCart ? `Add another ${title} to cart` : `Add ${title} to cart`;
    },

    filterButton: (filterType: string, isActive: boolean, count?: number) => {
        const activeText = isActive ? 'active' : 'inactive';
        const countText = count ? ` with ${count} options` : '';
        return `${filterType} filter, ${activeText}${countText}`;
    },

    sortSelect: (currentSort: string) => `Sort products by ${currentSort}`,

    viewModeButton: (mode: 'grid' | 'list', isActive: boolean) =>
        `Switch to ${mode} view${isActive ? ', currently active' : ''}`,

    searchInput: (hasResults: boolean, resultCount?: number) => {
        if (hasResults && resultCount !== undefined) {
            return `Search products, ${resultCount} results found`;
        }
        return 'Search products';
    },

    cartButton: (itemCount: number) =>
        `Shopping cart with ${itemCount} item${itemCount !== 1 ? 's' : ''}`,

    priceRange: (min: number, max: number) =>
        `Price range from $${min} to $${max}`,

    rating: (rating: number, count: number) =>
        `Rated ${rating} out of 5 stars based on ${count} reviews`,

    badge: (type: string, value?: string | number) => {
        switch (type) {
            case 'new': return 'New product';
            case 'sale': return value ? `On sale, ${value}% off` : 'On sale';
            case 'popular': return 'Popular product';
            case 'low-stock': return 'Low stock available';
            case 'out-of-stock': return 'Out of stock';
            default: return `${type} badge`;
        }
    }
};

// Keyboard navigation helpers
export const keyboardHandlers = {
    onEnterOrSpace: (callback: () => void) => (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            callback();
        }
    },

    onEscape: (callback: () => void) => (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            callback();
        }
    },

    onArrowKeys: (callbacks: {
        up?: () => void;
        down?: () => void;
        left?: () => void;
        right?: () => void;
    }) => (event: React.KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault();
                callbacks.up?.();
                break;
            case 'ArrowDown':
                event.preventDefault();
                callbacks.down?.();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                callbacks.left?.();
                break;
            case 'ArrowRight':
                event.preventDefault();
                callbacks.right?.();
                break;
        }
    }
};

// Focus management
export const focusManagement = {
    trapFocus: (containerRef: React.RefObject<HTMLElement>) => {
        const container = containerRef.current;
        if (!container) return;

        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTabKey = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') return;

            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };

        container.addEventListener('keydown', handleTabKey);
        return () => container.removeEventListener('keydown', handleTabKey);
    },

    restoreFocus: (elementRef: React.RefObject<HTMLElement>) => {
        return () => {
            setTimeout(() => {
                elementRef.current?.focus();
            }, 0);
        };
    }
};

// Color contrast utilities
export const colorContrast = {
    // WCAG AA compliant color combinations
    getContrastColor: (backgroundColor: string): 'light' | 'dark' => {
        // Simple heuristic - in a real app, you'd calculate actual contrast ratios
        const darkBackgrounds = ['blue', 'purple', 'indigo', 'gray-900', 'black'];
        return darkBackgrounds.some(color => backgroundColor.includes(color)) ? 'light' : 'dark';
    },

    ensureContrast: (textColor: string, backgroundColor: string): string => {
        // Return WCAG AA compliant text color based on background
        const contrastType = colorContrast.getContrastColor(backgroundColor);
        return contrastType === 'light' ? 'text-white' : 'text-gray-900';
    }
};

// Screen reader utilities
export const screenReader = {
    announceToScreenReader: (message: string) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    },

    announceUrgent: (message: string) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'assertive');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
};

// Reduced motion detection
export const motionPreferences = {
    prefersReducedMotion: (): boolean => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    getAnimationDuration: (defaultDuration: number): number => {
        return motionPreferences.prefersReducedMotion() ? 0 : defaultDuration;
    },

    conditionalAnimation: (animationClass: string): string => {
        return motionPreferences.prefersReducedMotion() ? '' : animationClass;
    }
};

// Form validation helpers
export const formValidation = {
    getAriaInvalid: (hasError: boolean): boolean => hasError,

    getAriaDescribedBy: (fieldId: string, hasError: boolean): string | undefined => {
        return hasError ? `${fieldId}-error` : undefined;
    },

    getErrorId: (fieldId: string): string => `${fieldId}-error`
};

// Skip link utilities
export const skipLinks = {
    createSkipLink: (targetId: string, text: string) => {
        const skipLink = document.createElement('a');
        skipLink.href = `#${targetId}`;
        skipLink.textContent = text;
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded';

        return skipLink;
    }
};

// Landmark roles
export const landmarks = {
    main: 'main',
    navigation: 'navigation',
    banner: 'banner',
    contentinfo: 'contentinfo',
    complementary: 'complementary',
    search: 'search',
    form: 'form'
};

// ARIA states and properties
export const ariaStates = {
    expanded: (isExpanded: boolean) => ({ 'aria-expanded': isExpanded }),
    selected: (isSelected: boolean) => ({ 'aria-selected': isSelected }),
    checked: (isChecked: boolean) => ({ 'aria-checked': isChecked }),
    disabled: (isDisabled: boolean) => ({ 'aria-disabled': isDisabled }),
    hidden: (isHidden: boolean) => ({ 'aria-hidden': isHidden }),
    current: (isCurrent: boolean) => ({ 'aria-current': isCurrent ? 'page' : undefined }),
    live: (liveType: 'polite' | 'assertive' | 'off') => ({ 'aria-live': liveType }),
    atomic: (isAtomic: boolean) => ({ 'aria-atomic': isAtomic }),
    describedBy: (id: string) => ({ 'aria-describedby': id }),
    labelledBy: (id: string) => ({ 'aria-labelledby': id }),
    label: (label: string) => ({ 'aria-label': label })
};