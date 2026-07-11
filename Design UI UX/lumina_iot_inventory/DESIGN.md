---
name: Lumina IoT Inventory
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#47454f'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#787581'
  outline-variant: '#c9c4d1'
  surface-tint: '#5e5695'
  primary: '#5b5492'
  on-primary: '#ffffff'
  primary-container: '#746dad'
  on-primary-container: '#fffbff'
  inverse-primary: '#c7bfff'
  secondary: '#605b77'
  on-secondary: '#ffffff'
  secondary-container: '#e3dbfd'
  on-secondary-container: '#645f7c'
  tertiary: '#5c5b5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#757478'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5deff'
  primary-fixed-dim: '#c7bfff'
  on-primary-fixed: '#1a104e'
  on-primary-fixed-variant: '#463e7c'
  secondary-fixed: '#e6deff'
  secondary-fixed-dim: '#cac2e3'
  on-secondary-fixed: '#1c1831'
  on-secondary-fixed-variant: '#48435f'
  tertiary-fixed: '#e4e1e6'
  tertiary-fixed-dim: '#c8c5ca'
  on-tertiary-fixed: '#1b1b1e'
  on-tertiary-fixed-variant: '#47464a'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
  surface-card: '#FFFFFF'
  status-success: '#10B981'
  status-warning: '#F59E0B'
  status-error: '#F43F5E'
  text-primary: '#18181B'
  text-secondary: '#71717A'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin: 2rem
  gutter: 1.5rem
  sidebar-width: 80px
  card-padding: 1.5rem
  bento-gap: 1.25rem
---

## Brand & Style

The design system is built on a **Soft Minimalist** aesthetic, prioritizing clarity, physical depth through soft diffusion, and an organized "Bento Grid" layout. It is designed for engineers and inventory managers who require a high-density information environment that remains calm and approachable.

The personality is professional yet modern, utilizing high-contrast elements (like the dark floating sidebar) to anchor the interface against a lightweight, airy workspace. By combining **Bento Grid** modularity with extreme roundedness, the system feels tactile and organized, evoking the precision of high-end electronic components.

## Colors

The palette is anchored by a sterile **Off-white (#F8F9FA)** background to reduce eye strain during long inventory sessions. 

- **Primary & Secondary:** A sophisticated Pastel Lavender pair used for data visualization (charts), primary calls to action, and active states.
- **Sidebar & Contrast:** A deep Zinc/Charcoal provides a "floating" anchor for navigation, creating clear functional separation.
- **Semantic Colors:** Emerald (Success), Amber (Warning), and Rose (Error) are used for inventory status (e.g., "In Stock," "Low Stock," "Damaged") and are paired with 10% opacity backgrounds for badge treatments.

## Typography

This design system utilizes **Geist** for its technical precision and modern geometric construction, which complements the electronic/IoT subject matter.

- **Headlines:** Use Bold weights with tighter letter-spacing to create a strong visual hierarchy.
- **Subtitles:** Rendered in `text-secondary` (Medium Gray) to provide context without competing with primary headings.
- **Tables & Data:** Utilize a tabular-nums feature if available to ensure numerical alignment in inventory counts.
- **Labels:** Use uppercase for small labels and badges to increase scannability.

## Layout & Spacing

The layout follows a **Bento Grid** philosophy—a modular, fixed-grid system that groups related information into distinct cards of varying sizes.

- **Floating Sidebar:** Positioned with a `2rem` margin from the screen edge. It is not docked, enhancing the "soft" feel.
- **Grid Strategy:** A 12-column grid is used for the main content area. Components span 3, 4, 6, or 12 columns depending on information density.
- **Rhythm:** An 8px base unit governs all spacing. The gap between Bento cards is strictly `1.25rem` (20px) to maintain a cohesive, "packed" appearance.
- **Responsive Behavior:** On mobile, the Bento Grid collapses into a single-column stack, and the floating sidebar transitions to a bottom-fixed navigation bar.

## Elevation & Depth

Hierarchy is established through **Soft Diffusion Shadows** rather than harsh borders or deep layers.

- **Base Layer:** The off-white background sits at the lowest level.
- **Interactive Layer:** Cards use a `shadow-[0_8px_30px_rgb(0,0,0,0.04)]`. This extremely light, large-radius shadow makes cards appear to hover just above the surface.
- **Active States:** Elements being dragged or clicked increase shadow opacity slightly (`0.08`) to simulate physical lift.
- **Sidebar:** The dark sidebar uses a stronger elevation to emphasize its role as a persistent utility above the content.

## Shapes

The shape language is defined by **Highly Rounded Corners** to offset the technical nature of the app with a friendly, modern feel.

- **Bento Cards & Sidebar:** Use `rounded-3xl` (24px) to create a soft, containerized look.
- **Navigation Pills:** Use full `rounded-full` (pill-shaped) for active menu indicators and status badges.
- **Input Fields:** Follow the `rounded-xl` (12px) standard for a balance between card style and functional clarity.

## Components

### Buttons
- **Primary:** Lavender background (#877FC1) with white text, `rounded-full` or `rounded-2xl`.
- **Secondary:** Dark Zinc (#18181B) for high-contrast actions (e.g., Login, Sidebar icons).
- **Ghost:** Transparent background with `text-secondary` for low-priority actions.

### Cards (Bento Boxes)
- Pure white background, `rounded-3xl` corners, and soft diffusion shadows. 
- Padding should be consistent (`1.5rem`).
- Internal headers should use Bold `headline-md` typography.

### Inventory Tables
- Clean style: **No vertical borders**.
- Horizontal borders use a faint `border-slate-100`.
- Use `hover:bg-slate-50` to assist row tracking.
- Columns should be logically grouped (Item, Category, Location, Status, Stock).

### Input Fields & Search
- Universal Search (Header): Pure white, `rounded-full`, with a subtle shadow and Lucide magnifying glass icon.
- Form Inputs: Minimalist with a light gray border that changes to Lavender on focus.

### Status Badges
- Pill-shaped (`rounded-full`) with 10% background opacity of the status color and 100% opacity for text (e.g., Emerald text on light emerald background).

### AI Assistant
- Floating Action Button: Circular, Lavender or Black, positioned bottom-right with a "Sparkles" icon.
- Drawer: Slides from the right, maintaining the `rounded-3xl` corner on the leading edge.