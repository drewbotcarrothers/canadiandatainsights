# Design System Specification: The Statistically Elegant Editorial

This design system is a high-end framework crafted for a Canadian demographic platform. It moves beyond "government-standard" dashboards to create an authoritative, editorial experience. It balances the precision of data with the warmth of a premium publication, utilizing deep maritime blues, crisp snow-like surfaces, and a sharp, intentional "Maple" accent.

---

## 1. Overview & Creative North Star

### The Creative North Star: "The Digital Cartographer"
This system is built on the metaphor of a modern atlas. It is not just a collection of charts; it is a curated narrative of a nation. We break the "template" look through **intentional asymmetry**, where heavy data visualizations are balanced by wide, generous "breathing zones." We reject the rigid, boxed-in grid in favor of layered, floating surfaces that feel like fine paper sheets stacked on a desk.

---

## 2. Color Strategy & Surface Logic

Our palette is rooted in the `primary` (#003461) deep navy—representing authority and vast horizons—complemented by a sophisticated `tertiary` (#6e000b) red used sparingly for surgical emphasis.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. Traditional "boxes" make data feel trapped. Instead, boundaries must be defined solely through background color shifts.
*   **The Transition:** A section using `surface-container-low` (#f3f3f7) sitting directly on a `background` (#f9f9fd) creates a natural, sophisticated break without the visual clutter of a line.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack. The deeper the information, the higher it sits on the stack:
1.  **Base:** `background` (#f9f9fd) - The canvas.
2.  **Sectioning:** `surface-container` (#edeef1) - For large content blocks.
3.  **Emphasis:** `surface-container-highest` (#e2e2e6) - For interactive sidebars or utility panels.
4.  **Floating Elements:** `surface-container-lowest` (#ffffff) - Reserved for cards or modals that need to "pop" off the page.

### The "Glass & Gradient" Rule
To avoid a flat, "out-of-the-box" feel, use **Glassmorphism** for floating overlays (e.g., map tooltips). Use `surface` colors at 80% opacity with a `backdrop-blur` of 12px. 
*   **Signature Textures:** Apply a subtle linear gradient from `primary` (#003461) to `primary_container` (#004b87) on hero sections to provide a sense of atmospheric depth.

---

## 3. Typography: The Editorial Voice

We utilize a dual-font pairing to distinguish between "Narrative" and "Precision."

*   **Display & Headlines (Manrope):** Use Manrope for all `display-` and `headline-` tokens. Its wide stance and modern geometric curves provide a welcoming, high-end editorial feel.
*   **Data & Body (Inter):** Use Inter for all `title-`, `body-`, and `label-` tokens. Inter is a workhorse for legibility, specifically chosen for high-density data tables and map labels.

**The Hierarchy of Authority:**
*   `display-lg` (3.5rem): Used for singular, impactful national statistics.
*   `headline-sm` (1.5rem): Used for regional titles.
*   `label-sm` (0.6875rem): Set in `on_surface_variant` (#424750) for map legends and chart axes.

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are too "software-like." We use **Tonal Layering** to achieve depth.

*   **The Layering Principle:** Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#f3f3f7) section. This creates a soft, natural "lift" based on color theory rather than artificial shadows.
*   **Ambient Shadows:** When a modal or dropdown must float, use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(25, 28, 30, 0.06)`. The shadow color is a tinted version of `on_surface`, never pure black.
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke (e.g., in high-contrast needs), use `outline-variant` (#c2c6d1) at **20% opacity**.

---

## 5. Signature Components

### Primary Buttons
*   **Styling:** Background `primary` (#003461), Text `on_primary` (#ffffff).
*   **Shape:** `md` (0.375rem) corner radius for a professional, stable feel.
*   **Interaction:** On hover, transition to `primary_container` (#004b87). Avoid heavy shadows; use a subtle scale increase (1.02x).

### Data Cards & Lists
*   **The Divider Ban:** Strictly forbid 1px horizontal lines between list items. Use vertical white space `spacing.4` (0.9rem) or alternating background tints using `surface-container-low` and `surface-container-lowest`.
*   **The Accent Bar:** For high-priority data cards, use a 4px vertical "signature stripe" of `tertiary` (#6e000b) on the far left edge of the card to draw the eye.

### Input Fields
*   **Style:** Minimalist. No bottom line. Use a `surface-container-highest` (#e2e2e6) background with a `sm` (0.125rem) radius.
*   **Focus State:** A 2px "Ghost Border" using `primary` at 40% opacity.

### Interactive Demographic Maps
*   **Base:** Use `surface_dim` (#d9dadd) for inactive regions.
*   **Active:** Use `primary` (#003461) with `on_primary` text for tooltips.
*   **Accents:** Use `tertiary` (#6e000b) to highlight specific demographic outliers or "hotspots."

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical layouts. A data table can be 60% width, balanced by a large typographic insight in the remaining 40%.
*   **Do** lean into white space. Use `spacing.16` (3.5rem) or `spacing.20` (4.5rem) between major sections to allow the data to "breathe."
*   **Do** use `tertiary` (#6e000b) only for the most important "call to action" or "critical data point." It is a surgical tool, not a decorative one.

### Don't:
*   **Don't** use 100% black text. Always use `on_surface` (#191c1e) for a softer, more premium reading experience.
*   **Don't** use "Standard" card borders. A card should be defined by its background color or a very soft ambient shadow, never a dark stroke.
*   **Don't** overcrowd maps. If a map is dense, use `surface-container-lowest` as a backdrop to separate the map from the rest of the page UI.