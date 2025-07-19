/**
 * Accessibility validation utilities
 * This file provides runtime validation for accessibility features
 */

export interface AccessibilityValidationResult {
    passed: boolean;
    errors: string[];
    warnings: string[];
    score: number;
}

export class AccessibilityValidator {
    private errors: string[] = [];
    private warnings: string[] = [];

    /**
     * Validate a DOM element for accessibility compliance
     */
    validateElement(element: Element): AccessibilityValidationResult {
        this.errors = [];
        this.warnings = [];

        this.checkAriaLabels(element);
        this.checkKeyboardAccessibility(element);
        this.checkColorContrast(element);
        this.checkSemanticStructure(element);
        this.checkFocusManagement(element);
        this.checkScreenReaderSupport(element);

        const score = this.calculateScore();

        return {
            passed: this.errors.length === 0,
            errors: [...this.errors],
            warnings: [...this.warnings],
            score
        };
    }

    private checkAriaLabels(element: Element): void {
        // Check for interactive elements without proper labels
        const interactiveElements = element.querySelectorAll(
            'button, a, input, select, textarea, [role="button"], [role="link"], [tabindex]'
        );

        interactiveElements.forEach((el) => {
            const hasAriaLabel = el.hasAttribute('aria-label');
            const hasAriaLabelledBy = el.hasAttribute('aria-labelledby');
            const hasTextContent = el.textContent?.trim();
            const hasAltText = el.hasAttribute('alt');
            const isHidden = el.hasAttribute('aria-hidden') && el.getAttribute('aria-hidden') === 'true';

            if (!isHidden && !hasAriaLabel && !hasAriaLabelledBy && !hasTextContent && !hasAltText) {
                this.errors.push(`Interactive element missing accessible name: ${el.tagName.toLowerCase()}`);
            }
        });

        // Check for proper ARIA usage
        const ariaElements = element.querySelectorAll('[aria-expanded], [aria-selected], [aria-checked]');
        ariaElements.forEach((el) => {
            const ariaExpanded = el.getAttribute('aria-expanded');
            const ariaSelected = el.getAttribute('aria-selected');
            const ariaChecked = el.getAttribute('aria-checked');

            if (ariaExpanded && !['true', 'false'].includes(ariaExpanded)) {
                this.errors.push(`Invalid aria-expanded value: ${ariaExpanded}`);
            }
            if (ariaSelected && !['true', 'false'].includes(ariaSelected)) {
                this.errors.push(`Invalid aria-selected value: ${ariaSelected}`);
            }
            if (ariaChecked && !['true', 'false', 'mixed'].includes(ariaChecked)) {
                this.errors.push(`Invalid aria-checked value: ${ariaChecked}`);
            }
        });
    }

    private checkKeyboardAccessibility(element: Element): void {
        // Check for keyboard traps
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) {
            this.warnings.push('No focusable elements found');
            return;
        }

        // Check for proper tabindex usage
        const tabIndexElements = element.querySelectorAll('[tabindex]');
        tabIndexElements.forEach((el) => {
            const tabIndex = el.getAttribute('tabindex');
            if (tabIndex && parseInt(tabIndex) > 0) {
                this.warnings.push(`Positive tabindex found: ${tabIndex}. Consider using 0 or -1.`);
            }
        });

        // Check for skip links
        const skipLinks = element.querySelectorAll('a[href^="#"]');
        if (skipLinks.length === 0) {
            this.warnings.push('No skip links found. Consider adding skip navigation.');
        }
    }

    private checkColorContrast(element: Element): void {
        // Basic color contrast check (simplified)
        const textElements = element.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, button, a');

        textElements.forEach((el) => {
            const styles = window.getComputedStyle(el);
            const color = styles.color;
            const backgroundColor = styles.backgroundColor;

            // Skip if no text content
            if (!el.textContent?.trim()) return;

            // Basic check for transparent backgrounds
            if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
                this.warnings.push('Element with transparent background may have contrast issues');
            }

            // Check for very light text on light backgrounds (simplified)
            if (color.includes('rgb(255') && backgroundColor.includes('rgb(255')) {
                this.warnings.push('Potential low contrast: light text on light background');
            }
        });
    }

    private checkSemanticStructure(element: Element): void {
        // Check for proper heading hierarchy
        const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;

        headings.forEach((heading) => {
            const level = parseInt(heading.tagName.charAt(1));
            if (level > lastLevel + 1) {
                this.warnings.push(`Heading level skipped: ${heading.tagName} after h${lastLevel}`);
            }
            lastLevel = level;
        });

        // Check for landmark roles
        const landmarks = element.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer');
        if (landmarks.length === 0) {
            this.warnings.push('No landmark roles found. Consider adding semantic structure.');
        }

        // Check for proper list structure
        const listItems = element.querySelectorAll('li');
        listItems.forEach((li) => {
            const parent = li.parentElement;
            if (parent && !['UL', 'OL'].includes(parent.tagName)) {
                this.errors.push('List item not contained in proper list element');
            }
        });
    }

    private checkFocusManagement(element: Element): void {
        // Check for focus indicators
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach((el) => {
            const styles = window.getComputedStyle(el, ':focus-visible');
            const outline = styles.outline;
            const boxShadow = styles.boxShadow;

            if (outline === 'none' && boxShadow === 'none') {
                this.warnings.push('Element may lack visible focus indicator');
            }
        });

        // Check for focus traps in modals
        const modals = element.querySelectorAll('[role="dialog"], [role="alertdialog"]');
        modals.forEach((modal) => {
            const focusableInModal = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            if (focusableInModal.length === 0) {
                this.warnings.push('Modal without focusable elements may trap focus');
            }
        });
    }

    private checkScreenReaderSupport(element: Element): void {
        // Check for screen reader only content
        const srOnlyElements = element.querySelectorAll('.sr-only, .visually-hidden');
        if (srOnlyElements.length === 0) {
            this.warnings.push('No screen reader only content found. Consider adding context for screen readers.');
        }

        // Check for live regions
        const liveRegions = element.querySelectorAll('[aria-live]');
        const dynamicContent = element.querySelectorAll('[data-dynamic], .loading, .error');

        if (dynamicContent.length > 0 && liveRegions.length === 0) {
            this.warnings.push('Dynamic content found without live regions. Consider adding aria-live attributes.');
        }

        // Check for proper image alt text
        const images = element.querySelectorAll('img');
        images.forEach((img) => {
            const alt = img.getAttribute('alt');
            const ariaHidden = img.getAttribute('aria-hidden');

            if (alt === null && ariaHidden !== 'true') {
                this.errors.push('Image missing alt attribute');
            }

            if (alt === '') {
                // Empty alt is okay for decorative images, but warn if it might be content
                const hasCaption = img.closest('figure')?.querySelector('figcaption');
                if (!hasCaption) {
                    this.warnings.push('Image with empty alt text. Ensure it is decorative.');
                }
            }
        });
    }

    private calculateScore(): number {
        const totalChecks = 10; // Approximate number of check categories
        const errorWeight = 2;
        const warningWeight = 1;

        const deductions = (this.errors.length * errorWeight) + (this.warnings.length * warningWeight);
        const maxDeductions = totalChecks * errorWeight;

        return Math.max(0, Math.round(((maxDeductions - deductions) / maxDeductions) * 100));
    }
}

/**
 * Quick accessibility check for development
 */
export function quickAccessibilityCheck(element?: Element): AccessibilityValidationResult {
    const validator = new AccessibilityValidator();
    const targetElement = element || document.body;

    return validator.validateElement(targetElement);
}

/**
 * Log accessibility results to console
 */
export function logAccessibilityResults(results: AccessibilityValidationResult): void {
    console.group('🔍 Accessibility Validation Results');
    console.log(`Score: ${results.score}/100`);
    console.log(`Status: ${results.passed ? '✅ Passed' : '❌ Failed'}`);

    if (results.errors.length > 0) {
        console.group('❌ Errors');
        results.errors.forEach(error => console.error(error));
        console.groupEnd();
    }

    if (results.warnings.length > 0) {
        console.group('⚠️ Warnings');
        results.warnings.forEach(warning => console.warn(warning));
        console.groupEnd();
    }

    console.groupEnd();
}

/**
 * Development helper to run accessibility checks
 */
export function runAccessibilityAudit(): void {
    if (typeof window === 'undefined') return;

    const results = quickAccessibilityCheck();
    logAccessibilityResults(results);

    // Store results for debugging
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__accessibilityResults = results;
}

// Auto-run in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Run after DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAccessibilityAudit);
    } else {
        setTimeout(runAccessibilityAudit, 1000);
    }
}