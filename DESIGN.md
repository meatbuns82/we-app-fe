---
name: Baby Order
description: A warm minimalist group food ordering mini program
colors:
  primary: "#C97060"
  primary-light: "#F1DED9"
  accent: "#A5B8A5"
  accent-light: "#EBF1E8"
  neutral-bg: "#F3F0EB"
  neutral-surface: "#FFFFFF"
  text-primary: "#2C2C2A"
  text-secondary: "#8A847E"
  text-tertiary: "#B0A8A0"
  border: "#E2DBD4"
  divider: "#EDE8E2"
typography:
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, 'Segoe UI', sans-serif"
    fontSize: "28rpx"
    fontWeight: 400
    lineHeight: 1.5
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, 'Segoe UI', sans-serif"
    fontSize: "32rpx"
    fontWeight: 600
    lineHeight: 1.3
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, 'Segoe UI', sans-serif"
    fontSize: "24rpx"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, 'Segoe UI', sans-serif"
    fontSize: "22rpx"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.02em"
rounded:
  card: "20rpx"
  button: "999rpx"
  image: "16rpx"
  small: "12rpx"
spacing:
  page: "32rpx"
  card: "24rpx"
  section: "32rpx"
  item: "20rpx"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.button}"
    padding: "20rpx 40rpx"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
    textColor: "#FFFFFF"
  button-soft:
    backgroundColor: "{colors.primary-light}"
    textColor: "{colors.primary}"
    rounded: "{rounded.button}"
  card-default:
    backgroundColor: "{colors.neutral-surface}"
    rounded: "{rounded.card}"
    padding: "{spacing.card}"
  tag-primary:
    backgroundColor: "{colors.primary-light}"
    textColor: "{colors.primary}"
    rounded: "{rounded.button}"
  tag-accent:
    backgroundColor: "{colors.accent-light}"
    textColor: "{colors.accent}"
    rounded: "{rounded.button}"
---

# Design System: Warm Calm

## 1. Overview

**Creative North Star: "A Breath of Fresh Air"**

Warm Calm is a minimalist design system for a group food ordering app. It pairs a sophisticated dusty terracotta with a refreshing sage green against a warm cream canvas. The interface breathes — generous whitespace, soft curves, and deliberate restraint create a sense of calm in the daily ritual of deciding what to eat.

This system explicitly rejects the visual noise of commercial food delivery apps (Meituan, Ele.me), the coldness of SaaS dashboards, and the saccharine cuteness of generic couples apps. Instead it finds warmth in material honesty: creamy backgrounds, subtle surface shadows, and a single warm accent that never shouts.

The boldness is in the restraint. Confident use of whitespace. A warm-cold color tension between terracotta and sage. Typographic hierarchy that doesn't need to be loud to be clear.

### Key Characteristics:
- **Generous whitespace** that lets content and food photography lead
- **Warm-cool color tension** between dusty terracotta and sage green
- **Soft geometry** with pill-shaped buttons and rounded cards (20rpx radius)
- **Subtle depth** through shadows that whisper rather than shout
- **Consistent rhythm** through a strict spacing scale (32rpx page padding, 24rpx card padding)

## 2. Colors

A warm-cream canvas warmed by a dusty terracotta accent and cooled by a sage green counterpoint. The palette is restrained enough for daily use but distinctive enough to feel intentional.

### Primary
- **Dusty Terracotta** (#C97060): Primary actions, active indicators, key accents. Used on approximately 15-20% of visible surfaces. Its muted saturation keeps it sophisticated rather than aggressive.
- **Primary Light** (#F1DED9): Background tint for tags, soft buttons, and light emphasis areas.

### Accent
- **Sage Green** (#A5B8A5): Secondary accent for the "refreshing" counterpoint. Used sparingly on hotpot sections, success states, and alternate category markers.
- **Accent Light** (#EBF1E8): Light tint for accent-tagged backgrounds.

### Neutral
- **Warm Cream** (#F3F0EB): Page background. A barely-there warmth that makes white surfaces pop.
- **Pure White** (#FFFFFF): Card surfaces, modals, elevated elements.
- **Warm Dark** (#2C2C2A): Primary text. Never pure black — the warm tint keeps it soft.
- **Warm Gray** (#8A847E): Secondary text, labels, metadata.
- **Warm Light Gray** (#B0A8A0): Placeholder text, disabled states, tertiary info.
- **Warm Border** (#E2DBD4): Active borders, dividers between sections.
- **Warm Divider** (#EDE8E2): Subtle separators, table rows.

### Named Rules
**The One Accent Rule.** Dusty Terracotta carries the personality. Sage Green is the counterpoint — it appears on half as many surfaces. Their tension is the point. Don't mix them on the same element.

**The Cream Canvas Rule.** The page background is never white. #F3F0EB is non-negotiable. White is reserved for elevated surfaces (cards, modals, sheets) so they register as distinct layers.

## 3. Typography

**Body Font:** System stack (`-apple-system, BlinkMacSystemFont, system-ui, 'Segoe UI', sans-serif`)

**Character:** Clean, neutral, and quietly confident. The system font stack ensures native feel on every device — no custom fonts, no display pairings. Hierarchy comes from weight and size contrast, not font choice.

### Hierarchy
- **Title** (600 weight, 32rpx, 1.3 line-height): Page headers, section titles, dish names. The boldest thing on any screen.
- **Body** (400 weight, 28rpx, 1.5 line-height): Primary content, descriptions, list items. Cap line length at 65-75 characters.
- **Caption** (400 weight, 24rpx, 1.4 line-height): Secondary info, tags, timestamps.
- **Small** (500 weight, 22rpx, 1.3 line-height, 0.02em letter-spacing): Labels, badges, auxiliary text. Uppercased for emphasis where appropriate.

### Named Rules
**The Single Voice Rule.** One font family for everything. No display fonts, no serif pairings. The personality comes from spacing and color, not typographic variety.

## 4. Elevation

The system uses a hybrid approach: flat surfaces with subtle shadow cues. Cards sit on the cream background with a soft cast shadow (0 4rpx 16rpx rgba(0,0,0,0.04)). Modals and half-screen dialogs lift higher with a slightly larger shadow. The effect is three layers deep: background → card → modal, each distinguished by shadow depth and background lightness.

### Shadow Vocabulary
- **Card Shadow** (`0 4rpx 16rpx rgba(0,0,0,0.04)`): Default card elevation. Cards, list items, nav grid items.
- **Elevated Shadow** (`0 8rpx 24rpx rgba(0,0,0,0.06)`): Modals, dialogs, half-screen sheets. Noticeably higher than cards.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only to distinguish layers. No decorative shadows on background elements.

## 5. Components

### Buttons
- **Shape:** Pill-shaped (999rpx radius). All buttons share this silhouette.
- **Primary:** Warm cream background → Dusty Terracotta background. White text. 20rpx 40rpx padding.
- **Active:** Darken background, slight scale-down (0.96).
- **Soft/Secondary:** Primary Light (#F1DED9) background, Dusty Terracotta (#C97060) text. Used for secondary actions, cancel, "soft" CTAs.
- **Ghost (future):** Transparent background, Dusty Terracotta text, border.

### Count Buttons (+/-)
- **Shape:** Perfect circle (50% radius), 56rpx diameter.
- **Rest:** Primary Light (#F1DED9) background, Dusty Terracotta (#C97060) text.
- **Active:** Dusty Terracotta background, white text. Scale down to 0.9.

### Cards / Containers
- **Corner Style:** 20rpx radius for all card surfaces.
- **Background:** Pure White (#FFFFFF)
- **Shadow Strategy:** 0 4rpx 16rpx rgba(0,0,0,0.04)
- **Border:** None. Shadow alone defines the card edge.
- **Internal Padding:** 24rpx

### Tags / Chips
- **Style:** Pill-shaped (999rpx radius), Primary Light background.
- **Text:** Dusty Terracotta (#C97060), 22rpx.
- **Accent variant:** Accent Light background, Sage Green text. For hotpot items and alternative categories.

### Lists (Dish items)
- **Layout:** Horizontal flex: image (140rpx × 140rpx) + content.
- **Image:** 16rpx radius, cover-fit.
- **Divider:** 1px solid #EDE8E2 between items.
- **Last item:** No divider.

### Navigation Grid (Home)
- **Layout:** 3-column grid with 24rpx gap.
- **Items:** White card, 20rpx radius, 32rpx vertical padding.
- **Icon:** 48rpx emoji centered.
- **Label:** 24rpx Caption style, Warm Gray.
- **Active:** Scale 0.95, background shifts to Primary Light.

### Inputs / Fields
- **Style:** Soft pill, Primary Light (#F1DED9) background, no border.
- **Height:** 60rpx
- **Text:** Body size (28rpx), Warm Dark (#2C2C2A)
- **Placeholder:** Warm Light Gray (#B0A8A0)

### Filters (Menu page)
- **Trigger:** Pill-shaped button with Primary Light background.
- **Sheet:** Half-screen dialog with white background, 24rpx top radius.
- **Picker rows:** Horizontal label + value layout with subtle dividers.

## 6. Do's and Don'ts

### Do:
- **Do** use Dusty Terracotta (#C97060) as the single accent voice. It warms, it signals action, it calls attention — but only when it needs to.
- **Do** let whitespace breathe. 32rpx minimum between sections. Content should feel aired out, not packed in.
- **Do** use the warm cream (#F3F0EB) as the default page background everywhere. It unifies the experience.
- **Do** keep cards flat with soft shadows. The shadow is 0 4rpx 16rpx rgba(0,0,0,0.04) — barely perceptible, just enough to lift.
- **Do** make all buttons pill-shaped. Consistent silhouette across all actions builds trust.
- **Do** use primary-light tint (#F1DED9) for interactive backgrounds (hover, light states, tag backgrounds).
- **Do** use the sage accent (#A5B8A5) sparingly — as a refreshing counterpoint on hotpot sections or alternate categories.
- **Do** keep food images at 16rpx radius — soft but clear.

### Don't:
- **Don't** use pure white (#FFFFFF) as a page background. White is for elevated surfaces only.
- **Don't** use pure black (#000000) for text. The warm dark (#2C2C2A) is the darkest value allowed.
- **Don't** add side-stripe borders (border-left > 1px as accent). They're the universal sign of "designed by default."
- **Don't** use gradient text or background-clip: text patterns. All text is solid color.
- **Don't** create nested cards. A card on top of a card is a layout failure.
- **Don't** over-decorate buttons with shadows, gradients, or icons. A clean pill with text is enough.
- **Don't** mix the terracotta primary and sage accent on the same component. They are alternatives, not partners.
- **Don't** replicate the visual density of food delivery apps. This is not Meituan or Ele.me.
- **Don't** use glassmorphism or backdrop blur as decorative elements.
- **Don't** use full-saturation accents on inactive interface elements.
