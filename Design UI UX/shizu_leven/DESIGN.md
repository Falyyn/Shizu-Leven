---
name: Shizu Leven
colors:
  surface: '#f9f9fa'
  surface-dim: '#dadadb'
  surface-bright: '#f9f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeef'
  surface-container-high: '#e8e8e9'
  surface-container-highest: '#e2e2e3'
  on-surface: '#1a1c1d'
  on-surface-variant: '#494552'
  inverse-surface: '#2f3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#7a7583'
  outline-variant: '#cac4d4'
  surface-tint: '#674bb5'
  primary: '#674bb5'
  on-primary: '#ffffff'
  primary-container: '#a78bfa'
  on-primary-container: '#3c1989'
  inverse-primary: '#cebdff'
  secondary: '#5f5e61'
  on-secondary: '#ffffff'
  secondary-container: '#e4e1e6'
  on-secondary-container: '#656467'
  tertiary: '#6a5f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#af9e00'
  on-tertiary-container: '#3b3500'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e8ddff'
  primary-fixed-dim: '#cebdff'
  on-primary-fixed: '#21005e'
  on-primary-fixed-variant: '#4f319c'
  secondary-fixed: '#e4e1e6'
  secondary-fixed-dim: '#c8c5ca'
  on-secondary-fixed: '#1b1b1e'
  on-secondary-fixed-variant: '#47464a'
  tertiary-fixed: '#f8e454'
  tertiary-fixed-dim: '#dbc839'
  on-tertiary-fixed: '#201c00'
  on-tertiary-fixed-variant: '#504700'
  background: '#f9f9fa'
  on-background: '#1a1c1d'
  surface-variant: '#e2e2e3'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  margin-page: 2rem
  gutter-grid: 1.5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
  sidebar-width: 280px
---

## Brand & Style
This design system embodies a serene, high-end lifestyle aesthetic that blends modern minimalism with soft, organic touches. The brand personality is calm, intentional, and premium, targeting an audience that values sophisticated simplicity and tactile digital experiences.

The design style is a hybrid of **Minimalism** and **Glassmorphism**, characterized by expansive white space, subtle background blurs, and generous corner radii. The UI should evoke a sense of "digital sanctuary"—quiet, focused, and effortless. Heavy emphasis is placed on "breathing room" and a refined hierarchical structure that avoids visual clutter.

## Colors
The palette is anchored by a soft lavender primary tone, used for key actions and brand highlights to provide a sense of elegance and calm. The secondary color is a deep zinc, specifically reserved for high-contrast structural elements like sidebars and navigation drawers to provide grounding and depth.

The neutral palette utilizes a range of cool greys and off-whites to maintain a clean canvas. Backgrounds should primarily use the softest neutrals, while text employs the deep zinc for maximum readability. Accent colors are used sparingly to guide the eye without overwhelming the serene atmosphere.

## Typography
The typography strategy pairs the approachable, modern curves of Plus Jakarta Sans for headings and labels with the systematic clarity of Inter for body copy. This ensures that brand-heavy moments feel welcoming while data-dense areas remain highly legible.

Headlines should utilize tighter letter spacing and bold weights to command attention. Body text maintains a generous line height to enhance the "airy" feel of the design. On mobile devices, headline sizes are scaled down to ensure they do not break across too many lines, preserving the visual balance of the layout.

## Layout & Spacing
The layout follows a fluid grid system with fixed-width constraints for content containers on large screens. A standard 12-column grid is used for desktop environments, transitioning to a 4-column grid for mobile.

Spacing is dictated by a strict 8px rhythm. Margins are intentionally wide to reinforce the minimalist aesthetic. Sidebars are treated as distinct architectural blocks, often utilizing a dark zinc background to contrast against the light fluid content area. Content should be grouped logically using vertical stacks, with significant white space between major sections to prevent cognitive overload.

## Elevation & Depth
Depth is conveyed through a mix of **Tonal Layers** and **Glassmorphism**. Rather than traditional heavy shadows, this system uses "Ambient Glows"—very soft, low-opacity shadows tinted with the primary lavender or a neutral grey to suggest height.

Surface-on-surface elevation is achieved by subtle shifts in background color (e.g., a white card on a light grey background). For floating elements like modals or dropdowns, a backdrop blur (glass effect) is applied to maintain a sense of context with the layer beneath while clearly defining the active surface.

## Shapes
The shape language is defined by extreme roundedness, specifically a `rounded-3xl` aesthetic. This "pill-style" geometry softens the interface, making it feel organic and friendly. Every interactive element—from buttons to large card containers—must adhere to these generous radii. 

Large containers and cards use the maximum `rounded-xl` (3rem) setting to create a friendly, "bubbled" layout that feels modern and approachable.

## Components
- **Buttons:** Primary buttons feature a solid lavender fill with white text and a fully rounded pill shape. Secondary buttons use a transparent background with a lavender border or a subtle zinc-tinted fill.
- **Sidebars:** The sidebar is a dominant structural element in dark zinc (#18181B) with high-contrast light typography and lavender active-state indicators.
- **Cards:** White or semi-transparent backgrounds with a `3rem` corner radius. Soft ambient shadows are applied to indicate interactivity.
- **Input Fields:** Large, pill-shaped inputs with a light grey background. Focus states are indicated by a 2px lavender border.
- **Chips:** Small, highly rounded labels used for categorization, utilizing the `accent_lavender_light` for the background to differentiate from primary actions.
- **Lists:** Clean, borderless list items with generous vertical padding and soft rounded hover states in neutral tones.