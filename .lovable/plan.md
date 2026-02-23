

# GENBOX Landing Page — Navigation & Hero Section

## Overview
Build the landing page for GENBOX, an AI UGC Generator platform targeting Indonesian affiliate marketers. Dark-themed, modern startup aesthetic with lime green (#BFFF00) accents.

## Design System Setup
- Dark-only theme with custom color palette (#0A0A0A background, #BFFF00 lime accent)
- Google Fonts: Satoshi (headings), DM Sans (body), JetBrains Mono (monospace)
- Custom component styles: cards with hover glow, lime CTA buttons, ghost secondary buttons
- Motion system: staggered fade-in animations using CSS @keyframes and Intersection Observer

## Navigation Bar (Fixed Top)
- Glassmorphism navbar: semi-transparent black with backdrop blur
- **Desktop**: Logo left, centered nav links (Fitur, Cara Kerja, Harga, FAQ), lime "MULAI GRATIS" button right
- **Mobile**: Logo left, hamburger icon right opening a full-screen overlay menu with all nav links
- Slide-down entrance animation on page load
- All text in Bahasa Indonesia

## Hero Section (Full Viewport)
- Full-screen height with radial gradient background and subtle CSS grid pattern overlay
- Staggered content reveal animation (badge → headline → subheadline → buttons → trust text → image row)
- Lime pill badge: "✦ AI-POWERED UGC GENERATOR"
- Bold uppercase headline: "BIKIN KONTEN UGC REALISTIS DALAM 30 DETIK" (56px desktop / 32px mobile)
- Descriptive subheadline explaining the product value prop
- Two CTA buttons: "MULAI GRATIS →" (lime) + "LIHAT DEMO ▶" (ghost), stacked on mobile
- Trust indicators: "Gratis 3 kredit • Tanpa kartu kredit • Setup 30 detik"
- Auto-scrolling marquee of 5 placeholder UGC example cards (gradient cards, 200×280px, infinite CSS animation)

## Responsive Design
- Mobile-first: single column, 16px padding, touch-friendly targets (44px min)
- Tablet (768px+): two-column layouts where appropriate
- Desktop (1024px+): max-width 1200px centered container
- All typography scales down appropriately on smaller screens

