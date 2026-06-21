---
name: Savia Vitality System
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf1'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fa'
  on-surface: '#111c2c'
  on-surface-variant: '#58413e'
  inverse-surface: '#263142'
  inverse-on-surface: '#ebf1ff'
  outline: '#8b716d'
  outline-variant: '#dfbfbb'
  surface-tint: '#a8372b'
  primary: '#a8372b'
  on-primary: '#ffffff'
  primary-container: '#f46f5e'
  on-primary-container: '#670504'
  inverse-primary: '#ffb4a9'
  secondary: '#29676e'
  on-secondary: '#ffffff'
  secondary-container: '#b0edf5'
  on-secondary-container: '#306d74'
  tertiary: '#576061'
  on-tertiary: '#ffffff'
  tertiary-container: '#919a9b'
  on-tertiary-container: '#293233'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4a9'
  on-primary-fixed: '#410000'
  on-primary-fixed-variant: '#872017'
  secondary-fixed: '#b0edf5'
  secondary-fixed-dim: '#95d0d9'
  on-secondary-fixed: '#001f23'
  on-secondary-fixed-variant: '#044f56'
  tertiary-fixed: '#dbe4e5'
  tertiary-fixed-dim: '#bfc8c9'
  on-tertiary-fixed: '#151d1e'
  on-tertiary-fixed-variant: '#404849'
  background: '#f9f9ff'
  on-background: '#111c2c'
  surface-variant: '#d8e3fa'
  growth-green: '#8bc34a'
  surface-warm: '#fffcfb'
  stardust-white: '#ffffff'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-md:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-margin: 20px
  gutter: 16px
  section-gap: 40px
---

## Brand & Style

The design system is rooted in the concept of **Organic Vitality**. It balances the clinical precision of blockchain technology with the soft, empathetic nature of medical crowdfunding. The brand personality is "Nurturing, Transparent, and Hopeful," aiming to evoke a sense of security and communal growth.

The visual style is a blend of **Modern Minimalism** and **Tactile Softness**. It utilizes generous whitespace to reduce cognitive load—crucial in medical contexts—and employs subtle, nature-inspired motifs (leaf veins, cellular structures, and growth rings) as background textures to reinforce the theme of evolution. The UI feels like a living organism: responsive, gentle, and constantly evolving.

## Colors

The palette is driven by the interplay between **Coral Heart (#f46f5e)** and **Muted Teal (#6faab2)**. Coral represents the human element—blood, warmth, and urgency—while Teal provides a calming, professional anchor reminiscent of medical environments and the stability of the Stellar blockchain.

- **Primary (Coral):** Used for primary actions, progress indicators, and "Heart" icons.
- **Secondary (Teal):** Used for navigation, typography, and secondary call-to-actions.
- **Tertiary (Teal Mist):** A very desaturated version of the secondary color used for large background sections or container fills.
- **Surface:** The background is not a pure sterile white, but a slightly warmed "Stardust White" to prevent eye strain and feel more welcoming.

## Typography

This design system uses a high-contrast typographic pairing to bridge the gap between "Science" and "Soul." 

**Newsreader** (Serif) is reserved for headlines and editorial moments. Its organic terminals and variable stroke weights feel human-made and trustworthy, perfect for patient stories and campaign titles. 

**Hanken Grotesk** (Sans-Serif) handles the UI's functional requirements. It is a clean, sharp, and highly legible grotesque that ensures medical data and blockchain transaction details are easy to parse at any size.

- Use **Display** styles for campaign impact numbers.
- Use **Body-LG** for patient narratives to improve readability.
- Use **Label** styles for metadata like "Stellar Transaction ID" or "Funding Goal."

## Layout & Spacing

This design system follows a **Mobile-First Fluid Grid** philosophy. Because medical needs often happen on the go, the layout is optimized for single-handed use and vertical scrolling.

- **Grid:** A 4-column grid for mobile, expanding to 12 columns for desktop. 
- **Rhythm:** An 8px base unit (linear scale) governs all padding and margins. 
- **Generous Whitespace:** Content blocks should be separated by a minimum of `section-gap` to ensure the UI feels "breathable" and calm.
- **Safe Areas:** On mobile, ensure all interactive elements remain within the comfortable "thumb zone" (lower 60% of the screen).

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and **Tonal Layers** rather than heavy borders.

- **Level 1 (Base):** The main canvas.
- **Level 2 (Cards):** Use a very soft, diffused shadow (Offset: 0, 4px; Blur: 20px) with a 4% opacity tint of the Primary color. This makes cards appear to "float" organically over the surface.
- **Level 3 (Modals/Overlays):** Increased elevation with a backdrop blur (Glassmorphism) of 12px to maintain context of the underlying page while focusing user attention.
- **Depth as Growth:** Elements related to "Evolution" or "Growth" (like NFT stages) should use subtle inner glows to appear as if they are radiating light.

## Shapes

The shape language is defined by **Softened Geometry**. To align with the "2xl" request, all major containers use a 1.5rem (24px) corner radius.

- **Primary Containers/Cards:** 24px (rounded-xl/2xl).
- **Buttons & Inputs:** 16px (rounded-lg) to maintain a cohesive look without appearing too "bubbly."
- **Evolutionary Elements:** Interactive "Growth" icons or NFT displays should be circular (pill-shaped) to represent unity and the cycle of life.

## Components

### Buttons
Buttons are high-affordance and tactile. The **Primary Button** uses a solid Coral fill with a subtle "lift" hover effect. **Secondary Buttons** use a Teal outline with a 2px stroke.

### Cards
Cards are the primary vehicle for crowdfunding campaigns. They feature a top-aligned image with a 24px radius, followed by a Newsreader headline. A progress bar in Coral shows the funding status.

### Progress Bars
Progress bars should be thick (12px) with fully rounded ends. The unfilled portion should be the Tertiary Teal Mist color, and the filled portion should use a subtle horizontal gradient from Secondary Teal to Primary Coral to represent "Evolution."

### Inputs
Fields use a "Surface Warm" background with a 1px Secondary Teal border that thickens to 2px on focus. Labels are always positioned above the field in **Label-MD**.

### Growth Indicator (NFT Stage)
A unique component for Savia. This is a circular container that holds a nature-inspired graphic. As funding increases, the graphic "evolves" (e.g., from a seed to a sprout to a flower), accompanied by a soft glow effect.