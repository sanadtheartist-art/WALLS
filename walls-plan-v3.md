# Walls — Full Project Plan v3
> A next-generation link-in-bio canvas platform — motion-first and fully responsive — at `walls.com/username`

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Tech Stack](#2-tech-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [Data Models (Firebase + Supabase)](#4-data-models-firebase--supabase)
5. [Media Storage (Cloudinary)](#5-media-storage-cloudinary)
6. [Feature Breakdown](#6-feature-breakdown)
7. [Block System](#7-block-system)
8. [Theme & Color Palette System](#8-theme--color-palette-system)
9. [Motion & Animation System](#9-motion--animation-system)
10. [Client Dashboard — `walls.com/dashboard`](#10-client-dashboard--wallscomdashboard)
11. [Admin Dashboard — `walls.com/admin`](#11-admin-dashboard--wallscomadmin)
12. [Public Profile Page](#12-public-profile-page)
13. [Loading Page](#13-loading-page)
14. [404 Error Page](#14-404-error-page)
15. [Onboarding & UX Polish](#15-onboarding--ux-polish)
16. [Routing & URL Structure](#16-routing--url-structure)
17. [Authentication Flow](#17-authentication-flow)
18. [Drag & Drop System](#18-drag--drop-system)
19. [PWA & Performance](#19-pwa--performance)
20. [Project Folder Structure](#20-project-folder-structure)
21. [Development Phases / Roadmap](#21-development-phases--roadmap)
22. [Security Considerations](#22-security-considerations)

---

## 1. Product Vision

**Walls** is a personal link-in-bio platform where every user gets a living, animated public page at `walls.com/username`. It's not a list of links — it's your corner of the internet, built like a canvas of expressive, draggable **blocks** that move, glow, and react.

Where Linktree shows a list, Walls shows a *world*. Ambient backgrounds, entrance animations, interactive embeds, and real-time previews make every wall feel alive.

### Core Pillars

| Pillar | What it means |
|---|---|
| **Blocks-first design** | Page = stack of reorderable, typed blocks. Everything is a block. |
| **Motion-first** | Blocks animate in on load. Hover effects, scroll reveals, ambient particles. |
| **Custom branding** | Themes, palettes, fonts, animated backgrounds, avatar glow, custom icons. |
| **No-code power** | Non-developers build rich pages — drag, drop, click, done. |
| **Mobile-first** | Dashboard and public pages are equally stunning on a phone. |
| **Live preview** | Every change reflects instantly in a phone-frame preview inside the dashboard. |
| **Delightful states** | Loading and error pages are branded experiences, not blank screens. |

---

## 2. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend framework | **Vue 3** (Composition API) | Reactive, lightweight, `<script setup>` DX is excellent |
| CSS utility | **UnoCSS** | Atomic CSS, zero unused styles, fast compile |
| Animations | **GSAP 3** + **@vueuse/motion** | Scroll-triggered entrance animations, timeline sequences |
| Routing | **Vue Router 4** | SPA routing, dynamic `/:username` route, scroll behavior |
| State management | **Pinia** | Simple stores, Vue 3 native, devtools support |
| Primary DB | **Firebase Firestore** | Real-time, NoSQL, onSnapshot for live dashboard |
| Secondary DB | **Supabase (PostgreSQL)** | Relational mirror of client data; admin queries, reporting, analytics |
| Auth | **Firebase Auth** | Email/password + Google OAuth + Magic Link |
| Admin Auth | **Supabase Auth** | Separate auth layer for `walls.com/admin` — no crossover with client accounts |
| File storage | **Cloudinary** | All images, videos, avatars, backgrounds — CDN + auto-transforms |
| Drag & drop | **vue-draggable-plus** | SortableJS wrapper, touch + pointer support |
| Icons | **Iconify** | 200k+ icons, custom SVG upload support |
| Build tool | **Vite 5** | Fastest HMR, first-class Vue, chunk splitting |
| Hosting | **Firebase Hosting** or **Vercel** | Free SSL, global CDN, edge functions |

---

## 3. Architecture Overview

```
┌───────────────────────────────────────────────────────────────────────┐
│                            walls.com                                  │
│                                                                       │
│  ┌─────────────────────┐  ┌───────────────────┐  ┌─────────────────┐ │
│  │  Auth pages          │  │  /dashboard/*     │  │  /admin/*       │ │
│  │  /login /signup      │  │  CLIENT DASHBOARD │  │  ADMIN DASHBOARD│ │
│  │                      │  │  Customize wall   │  │  Manage site,   │ │
│  │                      │  │  walls.com/user   │  │  users, content │ │
│  └──────────┬───────────┘  └────────┬──────────┘  └───────┬─────────┘ │
│             │                       │                      │           │
│  ┌──────────▼───────────────────────▼──────────┐          │           │
│  │         /username  (public wall)             │          │           │
│  │         Motion-first, responsive             │          │           │
│  │         Rendered from Firestore              │          │           │
│  └──────────────────────────────────────────────┘          │           │
│                                                             │           │
│  ┌──────────────────────┐  ┌──────────────────────────────┐│           │
│  │  LoadingPage.vue     │  │  NotFoundPage.vue (404)      ││           │
│  │  Branded spinner     │  │  Animated Walls 404          ││           │
│  └──────────────────────┘  └──────────────────────────────┘│           │
└──────────────────┬──────────────────────────────────────────┘           │
                   │                                                       │
     ┌─────────────┼──────────────────────────────────────────────────────┘
     │             │
     ▼             ▼
┌─────────────┐  ┌─────────────────────────────┐  ┌─────────────────┐
│  Firebase   │  │  Supabase (PostgreSQL)       │  │   Cloudinary    │
│  Auth       │  │  Mirror of client data       │  │   All media     │
│  Firestore  │  │  Admin queries & reporting   │  │   Images/videos │
│  (realtime  │  │  Reserved usernames table    │  │   Avatars/icons │
│  onSnapshot)│  │  Site config table           │  └─────────────────┘
└─────────────┘  └─────────────────────────────┘
```

### Data Flow

1. **App boots** → `LoadingPage.vue` plays branded animation → Firebase Auth state resolves → route continues
2. **Sign up** → Firebase Auth creates UID → Firestore creates `/users/{uid}` → Supabase mirrors the user row → guided onboarding starts
3. **Build page** → Dashboard blocks saved to `/users/{uid}/blocks` in Firestore → Supabase synced via Firebase Function webhook → live preview updates via `onSnapshot`
4. **Upload media** → goes to Cloudinary → `secure_url` stored back to Firestore (and mirrored to Supabase)
5. **Visit `walls.com/alex`** → Vue Router resolves username → if not found → `NotFoundPage.vue` with branded 404
6. **Visit valid wall** → blocks fetched from Firestore → entrance animations play
7. **Admin visits `walls.com/admin`** → Supabase Auth session required → full site management panel

---

## 4. Data Models (Firebase + Supabase)

### Dual Database Strategy

| Concern | Firebase Firestore | Supabase (PostgreSQL) |
|---|---|---|
| Real-time client dashboard sync | ✅ Primary (onSnapshot) | — |
| User profile + blocks storage | ✅ Primary | ✅ Mirror (via webhook) |
| Admin queries & filtering | — | ✅ Primary (SQL power) |
| Reserved / blocked usernames | — | ✅ `reserved_usernames` table |
| Site config (hero images, announcements) | — | ✅ `site_config` table |
| Analytics aggregation | Firestore counters | ✅ Supabase materialized views |
| Auth for clients | Firebase Auth | — |
| Auth for admins | — | Supabase Auth |

> **Sync strategy:** A Firebase Cloud Function triggers on every `/users/{uid}` write and upserts the corresponding row in Supabase via REST API. This keeps both DBs in sync without client overhead.

---

### Firebase: `/users/{uid}` — User Profile Document

```json
{
  "uid": "abc123",
  "username": "alex",
  "displayName": "Alex Rivera",
  "bio": "Designer & maker of things",
  "avatarUrl": "https://res.cloudinary.com/walls/...",
  "backgroundUrl": "https://res.cloudinary.com/walls/...",
  "backgroundType": "gradient",
  "theme": "midnight",
  "colorPalette": "violet",
  "font": "inter",
  "animationStyle": "fade-up",
  "ambientEffect": "particles",
  "glowColor": "#7c3aed",
  "avatarGlow": true,
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-06-01T00:00:00Z",
  "isPublic": true,
  "customDomain": null,
  "plan": "free"
}
```

**New fields explained:**

| Field | Values | Effect |
|---|---|---|
| `animationStyle` | `fade-up`, `zoom-in`, `slide-left`, `none` | Controls how blocks animate in on page load |
| `ambientEffect` | `particles`, `aurora`, `noise`, `grid`, `none` | Background ambient layer |
| `glowColor` | hex string | Pulsing glow on avatar and accent blocks |
| `avatarGlow` | boolean | Animated ring glow around avatar |
| `backgroundType` | `solid`, `gradient`, `image`, `video`, `mesh` | Background layer type |

---

### `/users/{uid}/blocks/{blockId}` — Block Documents

Every block has `type`, `position`, `visible`, `animation`, and `style` plus a `data` object.

```json
{
  "blockId": "blk_001",
  "type": "link",
  "position": 1,
  "visible": true,
  "animation": "fade-up",
  "animationDelay": 100,
  "style": "glass",
  "data": {
    "label": "My Portfolio",
    "url": "https://alex.design",
    "iconType": "iconify",
    "iconValue": "mdi:briefcase",
    "buttonStyle": "filled",
    "hoverEffect": "glow"
  }
}
```

```json
{
  "blockId": "blk_002",
  "type": "social",
  "position": 2,
  "visible": true,
  "animation": "fade-up",
  "animationDelay": 150,
  "style": "icon-row",
  "data": {
    "platforms": [
      { "platform": "instagram", "url": "https://instagram.com/alex" },
      { "platform": "twitter",   "url": "https://x.com/alex" },
      { "platform": "github",    "url": "https://github.com/alex" }
    ],
    "iconSize": "md",
    "layout": "row"
  }
}
```

```json
{
  "blockId": "blk_007",
  "type": "countdown",
  "position": 7,
  "visible": true,
  "data": {
    "label": "My product launches in",
    "targetDate": "2026-09-01T00:00:00Z",
    "style": "digital",
    "showDays": true,
    "showHours": true
  }
}
```

```json
{
  "blockId": "blk_008",
  "type": "poll",
  "position": 8,
  "visible": true,
  "data": {
    "question": "What should I build next?",
    "options": ["Mobile app", "Desktop tool", "SaaS platform"],
    "allowMultiple": false,
    "showResults": true
  }
}
```

### Firebase: `/usernames/{username}` — Username Index (fast lookup)

```json
{ "uid": "abc123" }
```

---

### Supabase Tables

#### `users` — Mirror of Firebase client data

```sql
CREATE TABLE users (
  uid           TEXT PRIMARY KEY,          -- matches Firebase Auth UID
  username      TEXT UNIQUE NOT NULL,
  display_name  TEXT,
  bio           TEXT,
  avatar_url    TEXT,                       -- Cloudinary URL
  background_url TEXT,                     -- Cloudinary URL
  theme         TEXT DEFAULT 'midnight',
  color_palette TEXT DEFAULT 'violet',
  plan          TEXT DEFAULT 'free',
  is_public     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);
```

#### `reserved_usernames` — Admin-managed blocked usernames

```sql
CREATE TABLE reserved_usernames (
  username    TEXT PRIMARY KEY,
  reason      TEXT,                         -- e.g. 'brand', 'profanity', 'celebrity'
  added_by    TEXT,                         -- admin email
  added_at    TIMESTAMPTZ DEFAULT now()
);
```

> Reserved usernames are checked during signup alongside the Firebase `/usernames` index.  
> Examples pre-loaded by admin: `admin`, `login`, `signup`, `facebook`, `nike`, `apple` — **not hardcoded in source**, managed entirely from the Admin Dashboard.

#### `site_config` — Admin-controlled global settings

```sql
CREATE TABLE site_config (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL,
  updated_by  TEXT,
  updated_at  TIMESTAMPTZ DEFAULT now()
);
```

Example rows:

| key | value |
|---|---|
| `hero_images` | `["https://res.cloudinary.com/walls/...", "..."]` |
| `announcement_banner` | `{"text": "New: Countdown blocks!", "active": true}` |
| `maintenance_mode` | `{"active": false, "message": ""}` |
| `featured_walls` | `["username1", "username2"]` |

#### `analytics_events` — Click tracking (append-only)

```sql
CREATE TABLE analytics_events (
  id          BIGSERIAL PRIMARY KEY,
  uid         TEXT REFERENCES users(uid),
  block_id    TEXT,
  event_type  TEXT,                         -- 'click', 'view'
  ip_hash     TEXT,                         -- hashed for privacy
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

---

## 5. Media Storage (Cloudinary)

### Upload Strategy

- All uploads use a **signed upload preset** via Firebase Function (secret never exposed on client)
- Folder structure: `walls/{uid}/avatars/`, `walls/{uid}/blocks/`, `walls/{uid}/icons/`, `walls/{uid}/backgrounds/`
- On upload → Cloudinary returns `secure_url` → stored in Firestore
- Auto-transforms applied via URL params: format, quality, responsive srcset

### Cloudinary Transform Examples

```
Avatar (80×80, circle crop, auto format):
/image/upload/w_80,h_80,c_fill,r_max,f_auto,q_auto/walls/{uid}/avatars/photo.jpg

Avatar srcset (retina):
/image/upload/w_160,h_160,c_fill,r_max,f_auto,q_auto/...  (2×)

Block image (responsive, full width):
/image/upload/f_auto,q_auto,w_600/walls/{uid}/blocks/banner.jpg

Custom icon (32×32, padded):
/image/upload/w_32,h_32,c_pad,f_auto/walls/{uid}/icons/myicon.png

Background (blurred, dark overlay):
/image/upload/f_auto,q_auto,w_1200,e_blur:300/walls/{uid}/backgrounds/bg.jpg
```

---

## 6. Feature Breakdown

### Authentication
- Email + password signup / login
- Google OAuth one-click login
- **Magic link login** (passwordless via Firebase email link)
- Username claim on signup (real-time availability check — green/red indicator as the user types)
- Password reset via Firebase Auth email

### Dashboard (upgraded)
- **Command palette** (Cmd+K) — search blocks, switch themes, jump to settings
- **Undo / Redo** (Ctrl+Z / Ctrl+Y) — full block action history via Pinia
- Left panel: block type picker with searchable block menu
- Center: live block stack — draggable, toggleable
- Right panel: **phone-frame live preview** that mirrors changes in real time via `onSnapshot`
- Top bar: profile avatar, theme switcher, "Open my Wall ↗" button, autosave indicator
- **Keyboard shortcuts panel** (press `?` to open)

### Block Management
- Add block (pick type → pre-filled template → opens inline editor)
- Edit block (click anywhere → slide-in editor panel from right)
- **Duplicate block** (copy icon)
- Reorder blocks (drag handle or keyboard `Alt+↑ / Alt+↓`)
- Toggle visibility (eye icon — hidden from public, dimmed in editor)
- Delete block (trash icon → undo toast for 5 seconds)
- **Block templates** — pre-made styled combos (e.g. "Social Row", "About Card")

### Profile Customization
- Avatar upload with **crop & zoom tool**
- Display name + bio text editor
- Background: solid / gradient / image / **animated mesh gradient** / video loop
- Font selection (10 options — Google Fonts + system)
- Theme + palette picker (see Section 8)
- **Ambient effect** toggle (particles, aurora, noise, none)
- **Avatar glow** toggle with color picker

### Public Page
- Responsive single-column layout, max-width centered
- Entrance animations staggered per block
- Avatar + name + bio at top with optional glow ring
- Blocks rendered in order with per-block hover effects
- **Click tracking** — Firestore counter per link click
- **Analytics summary** visible to page owner (clicks this week, top block)
- Meta tags + OG image for rich social previews

---

## 7. Block System

### Block Types

| Type | Description | New in v2 |
|---|---|---|
| `link` | Button linking to any URL, with icon, label, hover effect | — |
| `social` | Social icons row/grid — all platforms in one block | multi-platform |
| `header` | Section title or divider with optional emoji | — |
| `image` | Uploaded or URL image, optional link wrap | — |
| `video` | YouTube / Vimeo / TikTok embed | TikTok added |
| `text` | Rich text paragraph (bold, italic, links) | — |
| `music` | Spotify / SoundCloud / Apple Music embed | — |
| `gallery` | 2–4 image grid with lightbox | lightbox new |
| `countdown` | Live countdown timer to a target date | ✅ New |
| `poll` | Voteable poll with live result bar | ✅ New |
| `contact` | Email contact form (Firebase Function sends email) | — |
| `badge` | Achievement / credential card | ✅ New |
| `product` | Product card — image, price, buy button | ✅ New |
| `custom` | Sandboxed raw HTML block | — |

### Block Animation Config (per block)

```json
{
  "animation": "fade-up",
  "animationDelay": 200,
  "animationDuration": 500,
  "hoverEffect": "glow"
}
```

| `animation` options | `hoverEffect` options |
|---|---|
| `fade-up`, `fade-in`, `zoom-in`, `slide-left`, `none` | `glow`, `lift`, `shimmer`, `scale`, `none` |

### Block Component Architecture (Vue)

```
src/
  components/
    blocks/
      BlockWrapper.vue          ← drag handle, animation wrapper, controls overlay
      types/
        LinkBlock.vue
        SocialBlock.vue
        HeaderBlock.vue
        ImageBlock.vue
        VideoBlock.vue
        TextBlock.vue
        CountdownBlock.vue       ← new
        PollBlock.vue            ← new
        BadgeBlock.vue           ← new
        ProductBlock.vue         ← new
        GalleryBlock.vue
        CustomBlock.vue
    editors/
      BlockEditorPanel.vue      ← slide-in panel, shared shell
      [editor per block type]
```

---

## 8. Theme & Color Palette System

### Themes (Layout / Visual Style)

| Theme | Description |
|---|---|
| `minimal` | White bg, thin borders, lots of whitespace — clean and sharp |
| `midnight` | Near-black bg, glowing accent color, depth layers |
| `glass` | Frosted glass cards with backdrop-blur and subtle borders |
| `aurora` | Dark bg with shifting aurora gradient ambient overlay ✅ New |
| `neon` | Dark bg, neon-glow borders, cyberpunk energy ✅ New |
| `retro` | Bold fonts, high contrast, chunky borders, pixel-era feel |
| `soft` | Pastel tones, rounded corners, gentle box shadows |
| `brutalist` | Raw, blocky, bold type, high contrast, no softness ✅ New |

### Color Palettes (CSS variables applied over themes)

Each palette defines 6 CSS custom properties:

| Palette | `--bg` | `--surface` | `--text` | `--accent` | `--muted` | `--glow` |
|---|---|---|---|---|---|---|
| `violet` | `#0d0d14` | `#1a1a2e` | `#f0eeff` | `#7c3aed` | `#3b3b5c` | `#7c3aed66` |
| `ocean` | `#021b2e` | `#0a2840` | `#e0f4ff` | `#0ea5e9` | `#0a3a5c` | `#0ea5e966` |
| `rose` | `#1a0a0f` | `#2a1218` | `#ffe4ec` | `#f43f5e` | `#4a1828` | `#f43f5e66` |
| `forest` | `#0a1a0f` | `#122318` | `#e4ffec` | `#22c55e` | `#1a3824` | `#22c55e66` |
| `sand` | `#f5f0e8` | `#ffffff` | `#1a1611` | `#d97706` | `#c8bca8` | `#d9770640` |
| `mono` | `#111111` | `#1e1e1e` | `#f5f5f5` | `#ffffff` | `#555555` | `#ffffff22` |
| `ember` | `#14080a` | `#201015` | `#ffe8d6` | `#ff6b35` | `#3d1a12` | `#ff6b3566` |
| `ice` | `#f0f8ff` | `#e8f4fd` | `#0a1628` | `#3b82f6` | `#a0c8ef` | `#3b82f640` |

### CSS Implementation

```css
/* Applied dynamically to :root based on user config */
:root {
  --color-bg:      v-bind(palette.bg);
  --color-surface: v-bind(palette.surface);
  --color-text:    v-bind(palette.text);
  --color-accent:  v-bind(palette.accent);
  --color-muted:   v-bind(palette.muted);
  --color-glow:    v-bind(palette.glow);
  --font-family:   v-bind(profile.font);
}
```

The public profile page reads `theme` and `colorPalette` from Firestore → applies matching CSS class on `<body>`.

---

## 9. Motion & Animation System

### Philosophy

Motion is purposeful. Blocks don't just appear — they **arrive**. Every entrance has direction and timing that implies the page assembled itself from somewhere. Hover effects confirm interactivity. Ambient effects give depth without competing with content.

### Entrance Animations (GSAP)

```javascript
// BlockWrapper.vue — staggered entrance on page load
onMounted(() => {
  gsap.fromTo(blockEl.value,
    { opacity: 0, y: 24 },
    {
      opacity: 1, y: 0,
      duration: 0.5,
      ease: 'power2.out',
      delay: props.block.animationDelay / 1000
    }
  )
})
```

Each block's `animationDelay` is computed as `position × 80ms` by default, creating a natural stagger. Users can override per block.

### Hover Effects

| Effect | CSS / GSAP |
|---|---|
| `glow` | `box-shadow: 0 0 24px var(--color-glow)` on hover |
| `lift` | `transform: translateY(-3px)` + deeper shadow |
| `shimmer` | Animated gradient sweep across block surface |
| `scale` | `transform: scale(1.02)` smooth spring |
| `none` | No effect |

### Ambient Effects

| Effect | Implementation |
|---|---|
| `particles` | `tsparticles` (≈5kb gzipped) — floating dots in accent color |
| `aurora` | CSS `@keyframes` animated conic-gradient overlay, `opacity: 0.2`, `blur(80px)` |
| `noise` | SVG feTurbulence filter, subtle grain texture |
| `grid` | CSS grid lines at low opacity, sci-fi HUD feel |
| `none` | Clean — no ambient layer |

### Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```

All animations respect `prefers-reduced-motion`. Block entrances become instant; ambient effects disabled.

---

## 10. Client Dashboard — `walls.com/dashboard`

This is the dashboard every registered user gets. It lets them customize their public wall at `walls.com/username` — blocks, themes, media, profile. No access to site-level data.

### Desktop Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  ◼ Walls   alex's wall             [⌘K]  ● Saved  [Open Wall ↗]  │
├───────────┬──────────────────────────────┬───────────────────────┤
│           │                              │  ┌─────────────────┐  │
│  + Block  │  ≡ My Portfolio     🖊 👁 🗑  │  │ ┌─────────────┐ │  │
│  ─────    │  ≡ Social Icons     🖊 👁 🗑  │  │ │   [avatar]  │ │  │
│  [Link]   │  ≡ About Me         🖊 👁 🗑  │  │ │  Alex Rivera│ │  │
│  [Social] │  ≡ Banner Image     🖊 👁 🗑  │  │ │  Designer.. │ │  │
│  [Image]  │  ≡ YouTube Video    🖊 👁 🗑  │  │ ├─────────────┤ │  │
│  [Video]  │  ≡ Countdown        🖊 👁 🗑  │  │ │ Portfolio → │ │  │
│  [Text]   │                              │  │ ├─────────────┤ │  │
│  [Count-  │  [+ Add a block]             │  │ │ IG  X  GH   │ │  │
│   down]   │                              │  │ └─────────────┘ │  │
│  [Poll]   │                              │  └─────────────────┘  │
│  [Badge]  │                              │  📱 Phone frame        │
│  [More ▾] │                              │                       │
│           │                              │  Theme: Midnight      │
│           │                              │  Palette: Violet      │
│           │                              │  Motion: Fade Up      │
└───────────┴──────────────────────────────┴───────────────────────┘
```

### Mobile Layout (< 768px)

Three-panel layout collapses into a **bottom tab bar**:

```
┌─────────────────────────┐
│  ◼ Walls   [Open Wall ↗]│
│─────────────────────────│
│                         │
│    Block list           │
│    (scrollable)         │
│                         │
│─────────────────────────│
│  [Blocks] [Design] [Me] │  ← bottom nav tabs
└─────────────────────────┘
```

- **Blocks tab**: scrollable block stack, tap to edit, long-press to drag
- **Design tab**: theme, palette, font, ambient effect pickers
- **Me tab**: avatar, display name, bio editor

### Block Editor Slide Panel

Tapping ✏️ slides a panel up from the bottom (mobile) or right (desktop):

- **Link block** → URL input, label, icon search, hover effect picker
- **Image block** → drag-and-drop upload zone → Cloudinary → preview
- **Countdown block** → date picker, label, display style toggle
- **Poll block** → question + option list, show results toggle
- **Custom block** → Monaco editor (syntax highlighted HTML)

### Command Palette (Cmd+K)

```
┌─────────────────────────────────────────────┐
│  🔍  Search blocks, themes, actions...      │
├─────────────────────────────────────────────┤
│  📎  Add Link Block                         │
│  🖼  Add Image Block                        │
│  🎨  Switch Theme → Midnight                │
│  🔗  Open my Wall in new tab               │
│  ↩   Undo last action                      │
└─────────────────────────────────────────────┘
```

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Cmd+K` | Open command palette |
| `Cmd+Z` | Undo |
| `Cmd+Shift+Z` | Redo |
| `Alt+↑ / ↓` | Move selected block up / down |
| `Backspace` | Delete selected block (undo toast) |
| `E` | Edit focused block |
| `H` | Toggle visibility of focused block |
| `?` | Open keyboard shortcuts panel |

---

## 11. Admin Dashboard — `walls.com/admin`

Completely separate from the client dashboard. Protected by **Supabase Auth** — admin accounts are not regular user accounts. No client can access this route.

### Access

- URL: `walls.com/admin`
- Auth: Supabase Auth (email + password, separate from Firebase client auth)
- Roles: `super_admin`, `moderator` (defined in Supabase `admin_roles` table)
- Route guard: if no valid Supabase session → redirect to `/admin/login`

### Admin Dashboard Sections

#### 1. User Management

- View all registered users (paginated, searchable)
- Filter by: plan, join date, public/private, username
- Actions per user: view wall, suspend account, delete account, force-reset username
- Export user list as CSV

#### 2. Content Moderation

- Flag queue: reported walls/blocks
- Preview flagged wall in iframe
- Actions: approve, remove block, suspend user

#### 3. Reserved Usernames

> These are managed here — **not hardcoded anywhere in source code**.

```
┌────────────────────────────────────────────────────┐
│  Reserved Usernames                  [+ Add New]   │
├────────────────────────────────────────────────────┤
│  Username      Reason        Added by    Date       │
│  ─────────     ───────────   ─────────   ────────   │
│  admin         system        superadmin  2026-01-01 │
│  login         system        superadmin  2026-01-01 │
│  facebook      brand         lolo        2026-03-10 │
│  nike          brand         lolo        2026-03-10 │
│  [+ row]                                            │
└────────────────────────────────────────────────────┘
```

- Add a reserved username: input field + reason dropdown + submit → inserts into `reserved_usernames` Supabase table
- Delete a reservation: removes it, making the username claimable again
- Changes take effect immediately — signup flow queries this table in real time

#### 4. Site Config & Hero Images

Manage global site content without touching code:

```
┌────────────────────────────────────────────────────┐
│  Site Config                                       │
├────────────────────────────────────────────────────┤
│  Hero Images (Landing Page)                        │
│  [Upload Image ↑]  [drag to reorder]               │
│  [ img1 ] [ img2 ] [ img3 ]  ← Cloudinary URLs    │
│                                                    │
│  Announcement Banner                               │
│  Text: [New: Countdown blocks! 🎉         ]        │
│  Active: [✓]                                       │
│                                                    │
│  Featured Walls                                    │
│  [ @alex ] [ @mona ] [ + add ]                     │
│                                                    │
│  Maintenance Mode                                  │
│  Active: [ ] Message: [                   ]        │
│                                                    │
│  [Save Changes]                                    │
└────────────────────────────────────────────────────┘
```

All changes write to the `site_config` Supabase table. The landing page reads from this table on load.

#### 5. Analytics Overview

- Total users, active walls, total block clicks (from Supabase `analytics_events`)
- Signups over time (line chart)
- Top 10 most-visited walls
- Top block types used platform-wide

#### 6. Admin Account Management

- Invite new admin (sends Supabase magic link)
- Manage roles: `super_admin` can promote/demote `moderator`
- Audit log: all admin actions timestamped

### Admin Layout

```
┌──────────────────────────────────────────────────────┐
│  ◼ Walls Admin                          [admin@…] ▾  │
├──────────────┬───────────────────────────────────────┤
│              │                                       │
│  👥 Users    │   [Main content panel]                │
│  🚩 Reports  │                                       │
│  🔒 Reserved │                                       │
│  ⚙️  Site     │                                       │
│  📊 Analytics│                                       │
│  👤 Admins   │                                       │
│              │                                       │
└──────────────┴───────────────────────────────────────┘
```

---

## 12. Public Profile Page

### Layout

```
┌──────────────────────────────────┐
│  [ambient effect layer]          │
│  [background: gradient/image]    │
│                                  │
│     ┌────────────────────┐       │
│     │  [avatar + glow]   │  ← fade-in
│     │  Alex Rivera       │
│     │  Designer & maker  │
│     └────────────────────┘
│                                  │
│     ┌────────────────────┐       │
│     │ 💼  My Portfolio → │  ← staggered fade-up
│     └────────────────────┘
│     ┌────────────────────┐
│     │ 📸  IG  X  GH  YT  │  ← delay +80ms
│     └────────────────────┘
│     ┌────────────────────┐
│     │   [banner image]   │  ← delay +160ms
│     └────────────────────┘
│     ┌────────────────────┐
│     │  ▶  YouTube embed  │  ← delay +240ms
│     └────────────────────┘
│     ┌────────────────────┐
│     │  ⏱  3 days left    │  ← countdown live
│     └────────────────────┘
│                                  │
│  walls.com  ·  © alex            │
└──────────────────────────────────┘
```

### SEO / Meta Tags

```html
<title>Alex Rivera | walls.com/alex</title>
<meta name="description" content="Designer & maker of things">
<meta property="og:title" content="Alex Rivera on Walls">
<meta property="og:description" content="Designer & maker of things">
<meta property="og:image" content="[cloudinary avatar url, 1200x630]">
<meta property="og:url" content="https://walls.com/alex">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="https://walls.com/alex">
```

### Analytics (Owner View)

When the page owner visits their own wall while logged in, a floating stats bar appears at the bottom:

```
[ 👁 142 views   🔗 38 clicks   📅 This week ]  [✕]
```

---

## 13. Loading Page

### Purpose

Shown in two situations:
1. **App boot** — while Firebase Auth state resolves (usually 300–800ms)
2. **Profile load** — while a public wall's Firestore data is being fetched

This is a branded moment, not a spinner. The loading screen should feel intentional.

### Visual Design

Dark background (`#0d0d14`). The word **"Walls"** sits centered, built from individual letters that animate in one by one, then the whole word pulses with an accent-colored glow before fading out.

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│         W a l l s               │  ← letters draw in left → right
│         ─────────               │  ← underline sweeps in
│                                 │
│   ●  ●  ●  ●  ●  ●  ●  ●        │  ← dots pulse as loading indicator
│                                 │
│                                 │
└─────────────────────────────────┘
```

### GSAP Animation Sequence

```javascript
// LoadingPage.vue
const tl = gsap.timeline()

// Phase 1 — letters draw in from left, staggered
tl.fromTo('.letter', 
  { opacity: 0, y: 12 },
  { opacity: 1, y: 0, stagger: 0.07, duration: 0.4, ease: 'power2.out' }
)

// Phase 2 — underline sweeps in
.fromTo('.underline',
  { scaleX: 0, transformOrigin: 'left center' },
  { scaleX: 1, duration: 0.4, ease: 'power3.out' }
)

// Phase 3 — glow pulse on the whole word
.to('.wordmark',
  { textShadow: '0 0 32px var(--color-accent)', duration: 0.5, yoyo: true, repeat: -1 }
)
```

### Vue Component Structure

```vue
<!-- LoadingPage.vue -->
<template>
  <div class="loading-screen">
    <div class="wordmark">
      <span class="letter" v-for="l in 'Walls'" :key="l">{{ l }}</span>
    </div>
    <div class="underline" />
    <div class="dots">
      <span v-for="i in 8" :key="i" class="dot" />
    </div>
  </div>
</template>
```

### Dots Loader (CSS)

```css
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  animation: dotPulse 1.2s ease-in-out infinite;
}

.dot:nth-child(n) { animation-delay: calc(n * 0.12s); }

@keyframes dotPulse {
  0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; }
  40%            { transform: scale(1.0); opacity: 1.0; }
}
```

### Minimum Display Time

To prevent a jarring flash if loading is under 200ms:

```javascript
// router/index.js
const MIN_LOADING_MS = 600

router.beforeEach(async (to) => {
  const start = Date.now()
  store.setLoading(true)
  await resolveRoute(to)
  const elapsed = Date.now() - start
  if (elapsed < MIN_LOADING_MS) {
    await sleep(MIN_LOADING_MS - elapsed)
  }
  store.setLoading(false)
})
```

### Reduced Motion Variant

When `prefers-reduced-motion` is active, all letters appear instantly and the glow pulse is replaced with a simple static opacity on the wordmark.

---

## 14. 404 Error Page

### Purpose

Shown when a `/:username` route resolves but no matching user exists in Firestore, or any other unmatched URL.

### Visual Design

Same dark canvas as the rest of the app. The **"404"** number is massive — it fills the screen — with a glitch effect that periodically flickers the digits. Below it, a one-liner and a call to action.

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│   4  0  4                               │
│   ─────────────────────────────         │  ← enormous, glitching
│                                         │
│   This wall doesn't exist.             │
│                                         │
│   [ Go back ]   [ Explore Walls ]       │
│                                         │
│                                         │
│   walls.com                             │
└─────────────────────────────────────────┘
```

### Glitch Effect (CSS)

The "404" text uses a CSS glitch animation — two pseudo-elements offset in red and cyan, briefly desynchronized from the base text:

```css
.glitch {
  position: relative;
  font-size: clamp(120px, 25vw, 220px);
  font-weight: 900;
  color: var(--color-text);
  letter-spacing: -0.04em;
}

.glitch::before,
.glitch::after {
  content: '404';
  position: absolute;
  inset: 0;
  clip-path: polygon(0 30%, 100% 30%, 100% 60%, 0 60%);
}

.glitch::before {
  color: #f43f5e;
  animation: glitchA 3s infinite step-end;
}

.glitch::after {
  color: #0ea5e9;
  animation: glitchB 3s infinite step-end;
}

@keyframes glitchA {
  0%, 90%, 100% { transform: translate(0); }
  92%            { transform: translate(-4px, 2px); }
  94%            { transform: translate(4px, -2px); }
}

@keyframes glitchB {
  0%, 90%, 100% { transform: translate(0); }
  92%            { transform: translate(4px, -2px); }
  94%            { transform: translate(-4px, 2px); }
}
```

### GSAP Entrance

```javascript
// NotFoundPage.vue
onMounted(() => {
  gsap.fromTo('.glitch',
    { opacity: 0, scale: 0.85 },
    { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }
  )
  gsap.fromTo('.message',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, delay: 0.3 }
  )
  gsap.fromTo('.actions',
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.4, delay: 0.5 }
  )
})
```

### Vue Component Structure

```vue
<!-- NotFoundPage.vue -->
<template>
  <div class="not-found">
    <h1 class="glitch" aria-label="404">404</h1>
    <p class="message">
      {{ isUsername
        ? `@${route.params.username} hasn't built their wall yet.`
        : `This page doesn't exist.`
      }}
    </p>
    <div class="actions">
      <button @click="router.back()">← Go back</button>
      <router-link to="/">Explore Walls</router-link>
    </div>
    <footer>walls.com</footer>
  </div>
</template>
```

The component detects whether the 404 came from a `/:username` route and shows a specific message — `"@alex hasn't built their wall yet."` — rather than a generic one.

### Routing Integration

```javascript
// router/index.js
{
  path: '/:username',
  component: PublicProfile,
  // Inside PublicProfile.vue: if username not found in Firestore → redirect to /404
},
{
  path: '/404',
  component: NotFoundPage,
},
{
  path: '/:pathMatch(.*)*',
  redirect: '/404'
}
```

---

## 15. Onboarding & UX Polish

### Setup Wizard (First Login)

On first login, a 4-step overlay wizard guides the user:

```
Step 1 → Upload avatar + set display name + bio
Step 2 → Add your first link block
Step 3 → Pick a theme & palette
Step 4 → View your live wall → Share the link
```

Progress is saved per step so users can leave and return.

### Empty State Design

The empty block stack shows an illustrated prompt:

```
   ┌──────────────────────────────┐
   │                              │
   │   🧱                         │
   │   Your wall is empty.        │
   │   Add your first block to    │
   │   start building.            │
   │                              │
   │   [+ Add a Link Block]       │
   │   [Start with a Template]    │
   │                              │
   └──────────────────────────────┘
```

### Autosave

- Changes auto-save to Firestore with a 500ms debounce
- Top bar shows: `● Saving...` → `✓ Saved` → `✗ Save failed — Retry`
- No manual Save button needed

### Undo / Redo

Pinia-based action history stack:

```javascript
// stores/history.js
const past  = ref([])
const future = ref([])

function push(action) {
  past.value.push(action)
  future.value = []
}

function undo() {
  const last = past.value.pop()
  if (last) { last.undo(); future.value.push(last) }
}

function redo() {
  const next = future.value.pop()
  if (next) { next.redo(); past.value.push(next) }
}
```

### Toast Notifications

| Action | Toast |
|---|---|
| Block deleted | `"Block deleted — Undo"` (5s) |
| Block added | `"Link block added ✓"` |
| Theme changed | `"Theme: Midnight ✓"` |
| Save failed | `"Couldn't save — check connection"` |

### Block Templates

Pre-made block combos a user can insert in one click:

| Template | Contains |
|---|---|
| **Creator Starter** | Avatar header + 3 links + social row |
| **Portfolio** | Header + image + 3 links + contact form |
| **Musician** | Music embed + social row + countdown |
| **Product Launch** | Image + countdown + link block + poll |

---

## 16. Routing & URL Structure

```
/                       → Landing / marketing page
/login                  → Login form (email + Google + magic link)
/signup                 → Signup form (includes username claim)
/dashboard              → Protected client dashboard — blocks editor
/dashboard/design       → Theme, palette, ambient, fonts
/dashboard/profile      → Avatar, bio, display name
/dashboard/analytics    → Click stats, top blocks
/dashboard/settings     → Account, export data, delete account
/admin                  → Admin dashboard (Supabase Auth required)
/admin/login            → Admin login (separate from client login)
/admin/users            → User management
/admin/reports          → Content moderation queue
/admin/reserved         → Reserved usernames manager
/admin/config           → Site config & hero images
/admin/analytics        → Platform-wide analytics
/404                    → 404 branded error page
/:username              → Public profile page (e.g. /alex)
/:pathMatch(.*)         → Redirect to /404
```

### Vue Router Config

```javascript
const routes = [
  { path: '/',        component: LandingPage  },
  { path: '/login',   component: LoginPage    },
  { path: '/signup',  component: SignupPage   },
  { path: '/404',     component: NotFoundPage },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },   // Firebase Auth
    children: [
      { path: '',          component: DashboardBlocks    },
      { path: 'design',    component: DashboardDesign    },
      { path: 'profile',   component: DashboardProfile   },
      { path: 'analytics', component: DashboardAnalytics },
      { path: 'settings',  component: DashboardSettings  },
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAdminAuth: true },  // Supabase Auth — separate guard
    children: [
      { path: '',           component: AdminOverview    },
      { path: 'users',      component: AdminUsers       },
      { path: 'reports',    component: AdminReports     },
      { path: 'reserved',   component: AdminReserved    },
      { path: 'config',     component: AdminSiteConfig  },
      { path: 'analytics',  component: AdminAnalytics   },
    ]
  },
  { path: '/admin/login',        component: AdminLoginPage    },
  { path: '/:username',          component: PublicProfile     },
  { path: '/:pathMatch(.*)*',    redirect: '/404'             },
]
```

---

## 17. Authentication Flow

```
Client Signup:
  1. User fills email + password + desired username
  2. Real-time check: /usernames/{username} in Firestore AND reserved_usernames in Supabase
  3. Firebase createUserWithEmailAndPassword()
  4. Write /users/{uid} profile doc to Firestore
  5. Write /usernames/{username} index doc to Firestore
  6. Supabase upserts user row via Firebase Cloud Function webhook
  7. Redirect to /dashboard → onboarding wizard starts

Client Login (email):
  1. Firebase signInWithEmailAndPassword()
  2. Pinia auth store updates
  3. Redirect to /dashboard

Client Login (Google):
  1. Firebase signInWithPopup(GoogleAuthProvider)
  2. If new user → prompt username claim → write docs → Supabase sync
  3. Redirect to /dashboard

Magic Link:
  1. User enters email → Firebase sendSignInLinkToEmail()
  2. User clicks link in email → Firebase signInWithEmailLink()
  3. Same flow as above

Admin Login:
  1. Navigate to /admin/login (separate page, no Firebase)
  2. Supabase signInWithPassword() with admin credentials
  3. Session stored in Supabase client
  4. Redirect to /admin

Client Route Guard:
  router.beforeEach((to) => {
    if (to.meta.requiresAuth && !firebaseAuthStore.user) {
      return '/login'
    }
  })

Admin Route Guard:
  router.beforeEach(async (to) => {
    if (to.meta.requiresAdminAuth) {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return '/admin/login'
    }
  })
```

---

## 18. Drag & Drop System

Uses **vue-draggable-plus** (SortableJS wrapper) — supports mouse, touch, and keyboard:

```vue
<VueDraggable
  v-model="blocks"
  handle=".drag-handle"
  animation="200"
  ghost-class="block-ghost"
  chosen-class="block-chosen"
  @end="onReorder"
>
  <BlockWrapper
    v-for="block in blocks"
    :key="block.blockId"
    :block="block"
  />
</VueDraggable>
```

### On `@end` (drag complete)

1. New order reflects in local `blocks` array (optimistic UI)
2. Batch Firestore write updates all `position` fields at once
3. No loading spinner — instant feel

### Touch Drag (Mobile)

SortableJS handles touch natively. Long-press (300ms) activates drag on mobile, preventing conflict with tap-to-edit.

### Keyboard Reorder

`Alt+↑` / `Alt+↓` moves the focused block without drag:

```javascript
function moveBlock(blockId, direction) {
  const idx    = blocks.value.findIndex(b => b.blockId === blockId)
  const target = direction === 'up' ? idx - 1 : idx + 1
  if (target < 0 || target >= blocks.value.length) return
  ;[blocks.value[idx], blocks.value[target]] = [blocks.value[target], blocks.value[idx]]
  batchUpdatePositions(blocks.value)
}
```

---

## 19. PWA & Performance

### Progressive Web App

Walls installs as a PWA on iPhone and Android. Dashboard is accessible from the home screen.

```javascript
// vite.config.js — VitePWA plugin
import { VitePWA } from 'vite-plugin-pwa'

VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'Walls',
    short_name: 'Walls',
    theme_color: '#0d0d14',
    icons: [{ src: '/icon-192.png', sizes: '192x192' }]
  }
})
```

### Performance Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 90 |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Largest Contentful Paint | < 2.5s |
| CLS | < 0.1 |

### Optimizations

- **Code splitting** — dashboard chunks lazy-loaded, public profile is lean
- **Image lazy loading** — `loading="lazy"` on all block images, Cloudinary srcset
- **Font preload** — `<link rel="preload">` for chosen font
- **Firestore caching** — `enableIndexedDbPersistence()` for offline reads
- **Block virtualization** — users with 20+ blocks use virtual scrolling in editor

---

## 20. Project Folder Structure

```
walls/
├── index.html
├── vite.config.js              ← VitePWA, chunk splitting
├── uno.config.js
├── firebase.js                 ← Firebase init + persistence
├── supabase.js                 ← Supabase client init (anon key)
├── cloudinary.js               ← Signed upload helper
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── router/
│   │   └── index.js            ← includes 404 catch-all, Firebase guard, Supabase admin guard
│   ├── stores/
│   │   ├── auth.js             ← Firebase auth state (clients)
│   │   ├── adminAuth.js        ← Supabase auth state (admins)
│   │   ├── profile.js          ← User profile data
│   │   ├── blocks.js           ← Blocks CRUD + reorder
│   │   ├── history.js          ← Undo / redo stack
│   │   └── ui.js               ← Toast queue, loading state, command palette
│   ├── pages/
│   │   ├── LandingPage.vue
│   │   ├── LoginPage.vue
│   │   ├── SignupPage.vue
│   │   ├── LoadingPage.vue      ← Branded "Walls" loading animation
│   │   ├── NotFoundPage.vue     ← Glitch 404 error page
│   │   ├── PublicProfile.vue
│   │   ├── dashboard/           ← CLIENT DASHBOARD (/dashboard/*)
│   │   │   ├── DashboardLayout.vue
│   │   │   ├── DashboardBlocks.vue
│   │   │   ├── DashboardDesign.vue
│   │   │   ├── DashboardProfile.vue
│   │   │   ├── DashboardAnalytics.vue
│   │   │   └── DashboardSettings.vue
│   │   └── admin/               ← ADMIN DASHBOARD (/admin/*)
│   │       ├── AdminLayout.vue
│   │       ├── AdminLoginPage.vue
│   │       ├── AdminOverview.vue
│   │       ├── AdminUsers.vue
│   │       ├── AdminReports.vue
│   │       ├── AdminReserved.vue   ← Reserved usernames manager
│   │       ├── AdminSiteConfig.vue ← Hero images, banners, featured walls
│   │       └── AdminAnalytics.vue
│   ├── components/
│   │   ├── blocks/
│   │   │   ├── BlockWrapper.vue
│   │   │   └── types/
│   │   │       ├── LinkBlock.vue
│   │   │       ├── SocialBlock.vue
│   │   │       ├── ImageBlock.vue
│   │   │       ├── VideoBlock.vue
│   │   │       ├── TextBlock.vue
│   │   │       ├── CountdownBlock.vue
│   │   │       ├── PollBlock.vue
│   │   │       ├── BadgeBlock.vue
│   │   │       ├── ProductBlock.vue
│   │   │       ├── GalleryBlock.vue
│   │   │       └── CustomBlock.vue
│   │   ├── editors/
│   │   │   ├── BlockEditorPanel.vue
│   │   │   └── [editor per block type]
│   │   ├── ui/
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseInput.vue
│   │   │   ├── IconPicker.vue
│   │   │   ├── ColorPicker.vue
│   │   │   ├── ThemeCard.vue
│   │   │   ├── CommandPalette.vue
│   │   │   ├── ToastQueue.vue
│   │   │   ├── OnboardingWizard.vue
│   │   │   └── KeyboardShortcuts.vue
│   │   ├── ambient/
│   │   │   ├── ParticlesLayer.vue
│   │   │   ├── AuroraLayer.vue
│   │   │   └── NoiseLayer.vue
│   │   └── layout/
│   │       ├── DashboardSidebar.vue
│   │       ├── TopBar.vue
│   │       ├── BottomTabBar.vue        ← Mobile bottom nav
│   │       └── PreviewPanel.vue
│   ├── composables/
│   │   ├── useAnimation.js             ← GSAP helpers
│   │   ├── useCloudinaryUpload.js
│   │   └── useKeyboard.js              ← Keyboard shortcut binding
│   └── utils/
│       ├── firestore.js
│       ├── supabaseAdmin.js            ← Supabase query helpers for admin pages
│       ├── blockDefaults.js            ← Default data + animation per block type
│       └── blockTemplates.js           ← Pre-made block combos
```

---

## 21. Development Phases / Roadmap

### Phase 1 — Foundation (Weeks 1–2)
- [ ] Vite + Vue 3 + UnoCSS + Firebase project setup
- [ ] Supabase project setup + schema migrations (`users`, `reserved_usernames`, `site_config`, `analytics_events`)
- [ ] Firebase Cloud Function webhook → sync to Supabase on user write
- [ ] Auth: signup / login / Google OAuth / magic link (Firebase)
- [ ] Admin auth: Supabase Auth setup + `/admin/login` page
- [ ] Username claim with real-time availability check (Firestore + Supabase reserved list)
- [ ] Basic dashboard shell + routing (client + admin)
- [ ] Public profile page routing + basic render
- [ ] **Loading page** — branded "Walls" animation (GSAP)
- [ ] **404 page** — glitch effect, contextual message

### Phase 2 — Block System (Weeks 3–4)
- [ ] Firestore blocks CRUD (add, edit, delete)
- [ ] Link block + Social block (multi-platform)
- [ ] Drag & drop reorder (desktop + touch)
- [ ] Block visibility toggle
- [ ] Live preview panel (phone frame)

### Phase 3 — Media & Customization (Weeks 5–6)
- [ ] Cloudinary integration (avatar crop, image blocks, custom icons, backgrounds)
- [ ] Image block + Video block + Gallery block
- [ ] Text block + Header block
- [ ] Theme + Palette system (CSS variables, 8 palettes)
- [ ] Font selection (10 options)

### Phase 4 — Motion & Ambience (Weeks 7–8)
- [ ] GSAP entrance animations (staggered per block)
- [ ] Per-block hover effects (glow, lift, shimmer)
- [ ] Ambient effects: particles, aurora, noise, grid
- [ ] Avatar glow + animated ring
- [ ] Animated mesh gradient background option

### Phase 5 — New Blocks (Weeks 9–10)
- [ ] Countdown block (live timer)
- [ ] Poll block (Firestore vote counter)
- [ ] Badge block + Product block
- [ ] Music block (Spotify / SoundCloud embed)
- [ ] Custom block (Monaco editor)

### Phase 6 — Admin Dashboard (Weeks 11–12)
- [ ] Admin layout + sidebar navigation
- [ ] User management table (search, filter, suspend, delete)
- [ ] Reserved usernames CRUD panel (add/remove from Supabase)
- [ ] Site config panel: hero image upload to Cloudinary, announcement banner, featured walls
- [ ] Content moderation queue
- [ ] Platform-wide analytics (Supabase queries + charts)
- [ ] Admin role management + audit log

### Phase 7 — UX Polish (Weeks 13–14)
- [ ] Onboarding wizard (4-step)
- [ ] Undo / redo system (Pinia history store)
- [ ] Autosave with status indicator
- [ ] Command palette (Cmd+K)
- [ ] Toast notification system
- [ ] Keyboard shortcuts (full set + help panel)
- [ ] Block templates (4 starter sets)
- [ ] Mobile bottom tab bar

### Phase 8 — Launch (Weeks 15–16)
- [ ] PWA manifest + offline support
- [ ] OG image + full meta tags on public profiles
- [ ] Click analytics (Firestore counters → Supabase sync + dashboard chart)
- [ ] Firebase Hosting deploy + custom domain support
- [ ] Performance audit (Lighthouse ≥ 90)
- [ ] Reduced motion + ARIA accessibility audit
- [ ] Rate limiting + abuse prevention

---

## 22. Security Considerations

| Risk | Mitigation |
|---|---|
| Username squatting | Rate-limit signups per IP; 30-day username cooldown after account delete |
| Reserved username bypass | Signup checks both Firestore `/usernames` AND Supabase `reserved_usernames` — both must pass |
| XSS via custom HTML blocks | Render in sandboxed `<iframe srcdoc>` — no `allow-scripts`, no `allow-same-origin` |
| Firestore unauthorized writes | Security rules: users only write their own `/users/{uid}` and sub-collections |
| Supabase unauthorized reads | Row-level security (RLS) on all tables; clients never have Supabase service key |
| Admin route access by clients | Admin routes guarded by Supabase Auth session — completely separate from Firebase client auth |
| Cloudinary unsigned uploads | Signed upload presets via Firebase Function; folder restricted to `walls/{uid}/` |
| Username enumeration | Public profiles are public by design; per-IP rate limit on `/:username` route |
| Poll vote stuffing | Rate-limit vote Firestore writes per IP per poll per 24h |
| Data ownership | JSON export button + account delete that purges Firestore docs, Supabase row, and Cloudinary assets |
| Click counter integrity | Increment only on `click` event; debounce client-side; block owner clicks not counted |
| Admin credential leak | Supabase admin keys never exposed on client; admin session short-lived with refresh tokens |

### Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == uid;

      match /blocks/{blockId} {
        allow read: if true;
        allow write: if request.auth != null && request.auth.uid == uid;
      }

      match /analytics/{docId} {
        allow read: if request.auth != null && request.auth.uid == uid;
        allow update: if true; // click counters writable by anyone (rate limited via client)
      }
    }
    match /usernames/{username} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && request.auth.uid == resource.data.uid;
    }
    match /polls/{pollId}/votes/{voteId} {
      allow read: if true;
      allow create: if true; // anonymous votes allowed, rate limited server-side
    }
  }
}
```

### Supabase Row-Level Security (RLS)

```sql
-- users table: clients can only read/update their own row
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users: read own row"
  ON users FOR SELECT
  USING (uid = auth.uid()::text OR true);  -- public profiles readable by all

CREATE POLICY "users: update own row"
  ON users FOR UPDATE
  USING (uid = auth.uid()::text);

-- reserved_usernames: read-only for all, write only via service role (admin backend)
ALTER TABLE reserved_usernames ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reserved_usernames: public read"
  ON reserved_usernames FOR SELECT
  USING (true);

-- site_config: read-only for all, write only via service role (admin backend)
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_config: public read"
  ON site_config FOR SELECT
  USING (true);

-- analytics_events: append-only for anyone, read only via service role
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "analytics: insert"
  ON analytics_events FOR INSERT
  WITH CHECK (true);
```

> Admin dashboard uses the **Supabase service role key** (server-side only, never exposed to client) for full read/write access to all tables.

---

*Walls v3 — Vue 3 · UnoCSS · Firebase · Supabase · Cloudinary · GSAP*
*Motion-first · Mobile-ready · Dual dashboard · Delightful on every screen*
