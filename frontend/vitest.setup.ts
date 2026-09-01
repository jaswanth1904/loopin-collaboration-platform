import '@testing-library/jest-dom'
// Polyfill for matchMedia which might be needed by some Radix/Tailwind components
window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};
