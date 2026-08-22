---
name: Infinite Material & Technology Design System
colors:
  surface: '#effdf2'
  surface-dim: '#cfded3'
  surface-bright: '#effdf2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e9f7ed'
  surface-container: '#e3f1e7'
  surface-container-high: '#ddece1'
  surface-container-highest: '#d8e6dc'
  on-surface: '#121e18'
  on-surface-variant: '#3e4a3e'
  inverse-surface: '#27332c'
  inverse-on-surface: '#e6f4ea'
  outline: '#6e7a6d'
  outline-variant: '#becabb'
  surface-tint: '#006e2d'
  primary: '#00682a'
  on-primary: '#ffffff'
  primary-container: '#018438'
  on-primary-container: '#e7ffe4'
  inverse-primary: '#71dd85'
  secondary: '#3c674d'
  on-secondary: '#ffffff'
  secondary-container: '#beeecd'
  on-secondary-container: '#426d53'
  tertiary: '#4e5d54'
  on-tertiary: '#ffffff'
  tertiary-container: '#67766d'
  on-tertiary-container: '#ecfdf1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#8dfa9e'
  primary-fixed-dim: '#71dd85'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005320'
  secondary-fixed: '#beeecd'
  secondary-fixed-dim: '#a3d1b2'
  on-secondary-fixed: '#002111'
  on-secondary-fixed-variant: '#244f37'
  tertiary-fixed: '#d6e6db'
  tertiary-fixed-dim: '#bacac0'
  on-tertiary-fixed: '#111e18'
  on-tertiary-fixed-variant: '#3c4a42'
  background: '#effdf2'
  on-background: '#121e18'
  surface-variant: '#d8e6dc'
typography:
  headline-lg:
    fontFamily: IBM Plex Sans Thai
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: IBM Plex Sans Thai
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: IBM Plex Sans Thai
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: '0'
  body-lg:
    fontFamily: IBM Plex Sans Thai
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-md:
    fontFamily: IBM Plex Sans Thai
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  body-sm:
    fontFamily: IBM Plex Sans Thai
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: '0'
  label-mono:
    fontFamily: IBM Plex Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.08em
  headline-lg-mobile:
    fontFamily: IBM Plex Sans Thai
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  sidebar_width: 260px
  container_gutter: 24px
  card_padding: 20px
  stack_gap_sm: 8px
  stack_gap_md: 16px
  stack_gap_lg: 24px
---

## Brand & Style
The design system is engineered for industrial precision and administrative efficiency. It targets professionals managing complex material data and technological assets. The aesthetic is **Corporate Modern** with a focus on high data density and clarity. 

The emotional response is one of stability, authority, and meticulous organization. By utilizing a sophisticated green-scale palette, the UI evokes environmental consciousness paired with industrial strength. The interface avoids all decorative flourishes, gradients, or illustrations, relying instead on structural alignment, rigorous typography, and functional color application to guide the user through complex workflows.

## Colors
The palette is rooted in a professional "Forest Industrial" spectrum. 

- **Primary (#018438):** Used exclusively for actionable elements, primary buttons, and active navigational states. It signifies progress and confirmation.
- **Sidebar (#06351F):** A deep, grounding green used for the primary navigation container to provide high contrast against the content area, creating a clear mental model of "Navigation vs. Workspace."
- **Text Hierarchy:** Text Primary (#0E1A14) is used for headlines and body text to ensure maximum legibility. Text Secondary (#5C6B62) is reserved for descriptions and supporting information.
- **Surface & Background:** The Page Background (#F6F8F5) provides a soft, cool-toned canvas that allows White (#FFFFFF) cards and surfaces to pop with subtle distinction.

## Typography
All text is rendered in **Thai**. This design system utilizes a dual-font approach to balance readability with technical aesthetics.

- **Main Interface (IBM Plex Sans Thai):** Chosen for its exceptional legibility in both Thai and Latin characters. It carries a neutral, engineered feel.
- **Technical Metadata (IBM Plex Mono):** Used for IDs, timestamps, labels, and status indicators. The 11px uppercase styling with increased letter spacing creates a "data-tag" effect that distinguishes metadata from content.
- **Line Heights:** Generous line heights are maintained to ensure Thai tone marks (diacritics) do not clash between lines in dense data views.

## Layout & Spacing
The layout follows a **Fixed Sidebar + Fluid Content** model. 

- **Sidebar:** Fixed at 260px. This provides ample horizontal space for long Thai navigation labels without truncation.
- **Grid System:** A strict 8px rhythm governs all margins and paddings. 
- **Data Density:** In table views or lists, vertical padding can be reduced to 4px or 8px to maximize information visibility, while page-level margins remain at 24px.
- **Breakpoints:** On tablet devices, the sidebar collapses into a narrow icon-only rail (64px). On mobile, the sidebar transitions to a hidden drawer.

## Elevation & Depth
The design system utilizes **Tonal Layering** supplemented by extremely soft shadows to define hierarchy.

- **Level 0 (Background):** #F6F8F5. The base layer.
- **Level 1 (Cards/Surfaces):** #FFFFFF with a 1px border of #E7EAE4. A very soft, diffused shadow (0px 2px 4px rgba(0,0,0,0.04)) is applied to provide separation without adding visual weight.
- **Level 2 (Overlays/Modals):** #FFFFFF with a more pronounced but still subtle shadow (0px 8px 16px rgba(0,0,0,0.08)).
- **Sidebar:** Does not use shadows; depth is achieved purely through color contrast (#06351F).

## Shapes
The shape language is controlled and systematic.

- **Cards:** Use a 12px radius (`rounded-lg`) to soften the dense industrial data and make the interface feel modern.
- **Buttons & Inputs:** Use a 6px or 8px radius to maintain a professional, slightly sharper appearance than the containing cards.
- **Status Pills:** Utilize a full pill-shape (100px) to distinguish them from interactive buttons.

## Components
- **Buttons:** Primary buttons use #018438 with white text. Secondary buttons use a #E7EAE4 border with #0E1A14 text. Use "Medium" (36px) and "Small" (32px) heights for administrative efficiency.
- **Sidebar Items:** Background is transparent in default state; active state uses a subtle highlight or a left-side 4px border in Primary Green. Icons should be 20px line icons with a 1.5px stroke width.
- **Input Fields:** 1px border (#E7EAE4). On focus, the border changes to Primary Green (#018438) with a soft 2px outer glow.
- **Data Tables:** Use a zebra-striping or 1px bottom border (#E7EAE4). Header cells use the `label-mono` typography style for a technical, professional look.
- **Chips/Status:** Use low-saturation background tints (e.g., light green, light amber) with high-saturation text to indicate status without overpowering the UI.
- **Cards:** Always contain a 20px internal padding. Titles within cards should use `headline-sm`.