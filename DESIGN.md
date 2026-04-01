# Design System — Gamekeeper

## Product Context
- **What this is:** Game library organizer for Steam users with large collections
- **Who it's for:** PC gamers with 500+ games who want automatic classification
- **Space/industry:** Game library managers (Playnite, GOG Galaxy, Steam)
- **Project type:** Desktop app (Tauri + React)

## Aesthetic Direction
- **Direction:** Modern Curator
- **Decoration level:** Minimal (typography and spacing do the work)
- **Mood:** Clean, structured, premium. A beautifully organized digital shelf, not a Steam reskin.
- **Differentiator:** Teal accent in a sea of blue/purple gaming tools. Neutral grays instead of Steam's blue-tinted darks.

## Typography
- **Display/Hero:** Space Grotesk (geometric, techy, structured) — via Google Fonts
- **Body/UI:** Geist (clean, modern, great at small sizes) — via Google Fonts
- **Data/Tables:** Geist Mono (tabular-nums, pairs with Geist) — via Google Fonts
- **Scale:** 11px (caption) / 13px (body) / 14px (ui) / 18px (subtitle) / 24px (h2) / 28px (h1)

## Color
- **Approach:** Restrained cool palette
- **Background:** #0f1114 (neutral near-black)
- **Surface:** #181b20 (neutral dark)
- **Surface Light:** #22262d (hover state)
- **Border:** #2e333b (neutral border)
- **Text:** #d1d5db (clean light gray)
- **Text Dim:** #6b7280 (neutral muted)
- **Accent:** #14b8a6 (teal)
- **Accent Hover:** #0d9488 (darker teal)
- **Categories:** completed #4ade80, in-progress #fbbf24, endless #3b82f6, not-a-game #6b7280
- **Semantic:** success #4ade80, warning #fbbf24, error #f87171

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable
- **Scale:** 2xs(2) xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64)

## Layout
- **Approach:** Grid-disciplined (sidebar + content)
- **Border radius:** sm:4px, md:8px, lg:12px

## Motion
- **Approach:** Minimal-functional
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **Duration:** micro(50-100ms) short(150ms) medium(250ms)

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-31 | Modern Curator aesthetic with teal accent | Differentiate from Steam's blue and SaveForge's amber. Own teal in gaming tools. |
| 2026-03-31 | Space Grotesk + Geist + Geist Mono | Geometric techy display, clean modern body, distinct from both Inter and Satoshi. |
| 2026-03-31 | Neutral grays instead of blue-tinted | Removes "Steam clone" feel while staying in cool spectrum. |
