// PostCSS config — Tailwind v4 is loaded via CDN (index.html).
// Angular 21's internal build pipeline detects Tailwind directives and
// attempts to use its own Tailwind v3 PostCSS plugin, which is incompatible
// with Tailwind v4. Using CDN avoids this conflict entirely.
module.exports = {
  plugins: [],
};

