import '@testing-library/jest-dom/vitest';

if (typeof window !== 'undefined' && typeof window.IntersectionObserver === 'undefined') {
    window.IntersectionObserver = class IntersectionObserver {
        constructor() {}
        observe() {}
        unobserve() {}
        disconnect() {}
    };
}

if (typeof window !== 'undefined' && typeof window.ResizeObserver === 'undefined') {
    window.ResizeObserver = class ResizeObserver {
        constructor() {}
        observe() {}
        unobserve() {}
        disconnect() {}
    };
}
