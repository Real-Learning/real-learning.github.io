# Agent Configuration for real-learning.github.io

This document outlines the key configuration details and project structure for the real-learning.github.io repository, which serves as a static website built with Vite using a "Static-First" architecture.

## Project Overview

The project is a highly optimized, SEO-friendly, responsive static website using:
- **Bundler:** Vite
- **Styling:** Vanilla CSS with modern features (Grid, Flexbox, Variables)
- **Logic:** Minimal TypeScript for UI enhancements and menu logic
- **Injection:** `vite-plugin-html-inject` for reusable components (Header, Footer, Head)

## Directory Structure

```
/
├── *.html              # Main pages (index, about, faq, careers, etc.)
├── vite.config.ts      # Build optimization & injection config
├── package.json        # Project dependencies
├── Makefile            # Holds common useful commands
├── src/
│   ├── **/*.ts         # TypeScript files (global logic)
│   ├── **/*.html       # HTML pages
│   └── styles/         # Stylesheets
└── public/             # Logos, icons, and source images
```

## Key Technical Details

**CSS Architecture:**
- Uses CSS variables for consistent theming (colors, spacing, layout)
- Implements "Middle Column" layout with configurable content width
- Leverages `dvh` (Dynamic Viewport Height) for Hero sections to prevent layout jumping
- Emphasis on RWD with responsive design patterns

**TypeScript:**
- Minimal TS code
- Uses `passive` event listeners for performance

**HTML Components:**
- Reusable components injected via `vite-plugin-html-inject`
- Accessibility features implemented:
  - Semantic HTML elements (`<header>`, `<main>`, `<section>`, `<footer>`)
  - Proper ARIA attributes
  - Keyboard accessible menu
  - Native `<details>`/`<summary>` for FAQ accordion

**Accessibility Standards:**
- WCAG 2.1 AA compliance
- Minimum 4.5:1 contrast ratio
- Focus indicators
- Explicit labeling for form inputs
- `alt` text on meaningful images
- `aria-hidden="true"` for decorative icons

**Performance Requirements:**
- Zero layout shifts (CLS compliance)
- Responsive images with proper dimensions/aspect ratios
- Lazy-loaded non-critical assets
- Clean code: No dead code, trailing whitespace, or unneeded hardcoded values

**Build Process:**
- Uses Vite configuration with multi-page build targeting main pages
- Static-first approach with HTML injection for SEO and performance

**Style:**
- 2 space indentation
- all files must end with a newline character
- the code must be idiomatic to the language (html, css, or ts)
