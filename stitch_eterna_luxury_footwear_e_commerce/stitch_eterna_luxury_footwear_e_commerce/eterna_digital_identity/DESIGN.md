---
name: Eterna Digital Identity
colors:
  surface: '#faf9f7'
  surface-dim: '#dadad8'
  surface-bright: '#faf9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeec'
  surface-container-high: '#e9e8e6'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1b'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#25190f'
  on-tertiary-container: '#938072'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#f5dece'
  tertiary-fixed-dim: '#d8c3b3'
  on-tertiary-fixed: '#25190f'
  on-tertiary-fixed-variant: '#534438'
  background: '#faf9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e3e2e0'
typography:
  display-lg:
    fontFamily: Bodoni Moda
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Bodoni Moda
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Bodoni Moda
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Bodoni Moda
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '300'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.15em
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 80px
  section-gap: 120px
---

## Brand & Style
The design system embodies the essence of high-fashion editorial: a sanctuary of understated luxury where the product is the protagonist. The brand persona is sophisticated and feminine, balancing the weight of timeless heritage with a sharp, contemporary edge.

The visual style is a blend of **Minimalism** and **High-Fashion Editorial**. It relies on generous whitespace (macro-typography), a restricted but warm color palette, and a focus on "quiet luxury." Transitions should be fluid and cinematic, evoking the effortless grace of a runway walk. The emotional response is one of aspiration, calm, and exclusivity.

## Colors
The palette is rooted in organic, skin-toned neutrals to emphasize the craftsmanship of leather and silk. 

- **Primary (Black):** Used for core typography and high-contrast UI elements to provide a modern "anchor."
- **Neutral (Ivory/Warm White):** Used for page backgrounds to create an expansive, airy feel.
- **Accents (Champagne/Gold):** Reserved exclusively for small luxury touchpoints: micro-interactions, active states of high-importance buttons, or thin divider lines. 
- **Functional Tones (Taupe/Beige):** Used for secondary text, borders, and disabled states to maintain a soft visual hierarchy without the harshness of standard grays.

## Typography
Typography is the primary vehicle for the brand’s "Timeless by Design" narrative. 

- **Headlines:** Use **Bodoni Moda**. Its high stroke contrast reflects the precision of luxury footwear. For Display sizes, use tighter letter spacing to create a rhythmic, editorial look.
- **Body & Navigation:** Use **Inter**. It provides a clean, systematic counterpoint to the decorative serif. Keep body weights light (300) for a premium feel, switching to 400 for long-form readability.
- **Labels:** Product categories, tags, and small navigation items should always use `label-caps` to evoke the feeling of a physical fashion tag or embossed leather logo.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop, centered with significant side margins to mimic the layout of a physical high-end lookbook.

- **Desktop (1440px+):** 12-column grid. Use exaggerated vertical spacing (`section-gap`) between product tiers to allow the user's eyes to rest.
- **Mobile:** 4-column grid with a minimum 20px margin.
- **Alignment:** Headlines should often be center-aligned for landing pages, but left-aligned for functional shopping interfaces to ensure efficiency. 
- **Negative Space:** Elements should never feel crowded. If in doubt, increase the padding. Whitespace is a luxury asset in this system.

## Elevation & Depth
This design system avoids heavy shadows and skeuomorphism in favor of **Tonal Layering** and **Low-Contrast Outlines**.

- **Surfaces:** Use subtle shifts between `Ivory` and `Warm White` to define different content areas. 
- **Outlines:** Use 0.5pt lines in `Champagne` or `Taupe` for input fields and card borders. The lines should feel like delicate threads.
- **Depth:** When elevation is required (e.g., a cart drawer), use a very large, soft blur (60px+) with a low opacity (4%) neutral tint. Avoid "black" shadows; use shadows tinted with `Deep Brown` to maintain warmth.

## Shapes
To maintain a contemporary, architectural aesthetic, this design system utilizes **Sharp (0px)** roundedness. 

Rectilinear shapes convey a sense of structural integrity and modernism. All buttons, image containers, and input fields should have 90-degree corners. The only exception is for circular "action" icons (like a Close 'X' or navigation arrows), which should be contained within perfect circles to create a visual contrast with the rigid grid.

## Components

- **Buttons:** 
  - *Primary:* Solid Black background, White `label-caps` text. No border. High-padding (16px vertical, 40px horizontal).
  - *Secondary:* Transparent background, Black text, 1px Black bottom-border only (an "underline" style button).
- **Cards:** Product cards should be "borderless" images. The typography (Name, Price) sits below the image in a centered layout. On hover, the image should subtly scale (1.05x) or switch to an "on-foot" lifestyle shot.
- **Input Fields:** Single bottom-line borders in `Taupe`. Placeholder text in italicized `Body-md`. Focus state shifts the border color to `Black`.
- **Chips/Filters:** Rectangular boxes with 1px `Taupe` borders. When selected, the background fills with `Champagne` and text stays `Black`.
- **Navigation:** The top-bar is persistent but transparent, turning `Warm White` only upon scroll. Use `label-caps` for all main menu items.
- **Product Details:** Use a "sticky" vertical layout for descriptions so the product imagery remains the focus during the scroll.