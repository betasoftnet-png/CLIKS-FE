/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

const SCALE = 14.5 / 16;

const scaleRem = (val) => {
  if (typeof val !== 'string') return val;
  return val.replace(/(\d+(?:\.\d+)?|\.\d+)rem/g, (_, n) => {
    const scaled = parseFloat(n) * SCALE;
    return `${Number(scaled.toFixed(4))}rem`;
  });
};

const scaledSpacing = Object.fromEntries(
  Object.entries(defaultTheme.spacing).map(([k, v]) => [k, scaleRem(v)])
);

const scaledFontSize = Object.fromEntries(
  Object.entries(defaultTheme.fontSize).map(([k, v]) => {
    if (Array.isArray(v)) {
      const [size, opts] = v;
      const nextOpts = opts && typeof opts === 'object'
        ? { ...opts, ...(opts.lineHeight ? { lineHeight: scaleRem(opts.lineHeight) } : {}) }
        : opts;
      return [k, [scaleRem(size), nextOpts]];
    }
    return [k, scaleRem(v)];
  })
);

const scaledBorderRadius = Object.fromEntries(
  Object.entries(defaultTheme.borderRadius).map(([k, v]) => [k, scaleRem(v)])
);

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    spacing: scaledSpacing,
    fontSize: scaledFontSize,
    borderRadius: scaledBorderRadius,
    extend: {
      colors: {
        brand: {
          green: '#135029',
          light: '#f0fdf4',
        }
      },
      screens: {
        'xs': '400px',
      }
    },
  },
  plugins: [],
}
