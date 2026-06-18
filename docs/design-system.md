# Brainify Design System

> Based on the original Brainify V1 (AfterMath_Metabytes_Civic) — a student-focused, AI-powered personalized learning platform.

---

## 1. Brand Personality

Brainify is **not** a generic B2B SaaS. It is a **friendly, AI-powered learning companion** for students.

| Attribute | Manifestation |
|-----------|---------------|
| **Student-focused** | Rounded corners, playful emoji icons, encouraging copy, approachable scale |
| **Friendly** | Warm gradients, soft shadows, generous whitespace, human tone of voice |
| **AI-powered** | Glowing effects, gradient cards, tech-adjacent iconography (sparkles, brain, robot) |
| **Educational** | Structured layouts, clear hierarchy, progress indicators, stats with citations |
| **Modern** | Clean sans-serif fonts, dark mode support, translucent overlays, subtle animations |

**Tone of Voice:**
- Encouraging: "Learn Your Way, Not Their Way"
- Inclusive: "Built for every student in India"
- AI-augmented: "Now Powered by Gemini AI"
- Trustworthy: Scientific citations (Fleming & Mills, Coffield et al.)

---

## 2. Color Palette

### 2.1 Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `brand` | `#4361EE` | Primary buttons, links, active sidebar, brand accents |
| `brand-dark` | `#2F4ABF` | Button hover states |
| `brand-light` | `#6B83F2` | Lighter brand accents |
| `brand-50` | `#EEF1FD` | Background tint, component hover backgrounds |

### 2.2 VARK Learning Style Colors

| Style | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| Visual | `#4361EE` | `from-blue-500 to-indigo-600` | Blue gradient cards, badges |
| Auditory | `#10B981` | `from-emerald-500 to-teal-600` | Emerald gradient cards, badges |
| Read/Write | `#F59E0B` | `from-amber-500 to-orange-600` | Amber gradient cards, badges |
| Kinesthetic | `#8B5CF6` | `from-purple-500 to-pink-600` | Purple gradient cards, badges |

### 2.3 Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Success | `#10B981` (emerald-500) | Streak notifications, positive stats |
| Warning | `#F59E0B` (amber-500) | Alerts, moderate scores |
| Error | `#EF4444` (red-500) | Errors, destructive actions |
| Info | `#3B82F6` (blue-500) | Information badges |

### 2.4 Neutral Palette

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| Background | `#FFFFFF` / `#F5F7FF` | `#111827` (gray-900) | Page backgrounds |
| Card | `#FFFFFF` | `#1F2937` (gray-800) | Component backgrounds |
| Border | `#F3F4F6` (gray-100) | `#374151` (gray-700) | Borders, dividers |
| Text Primary | `#1F2937` (gray-800) | `#FFFFFF` | Headings |
| Text Secondary | `#6B7280` (gray-500) | `#9CA3AF` (gray-400) | Body text |
| Text Muted | `#9CA3AF` (gray-400) | `#6B7280` (gray-500) | Captions, placeholders |

---

## 3. Typography

### 3.1 Font Family

```css
font-family: 'Inter', 'Poppins', sans-serif;
```

- **Inter** (300–800 weight): Primary font for body text, UI labels, navigation
- **Poppins fallback**: Used for display headings in specific cases
- Both imported via Google Fonts

### 3.2 Font Sizes

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| Hero heading | `text-5xl` (3rem) | `font-extrabold` (800) | Landing page hero |
| Section heading | `text-4xl` (2.25rem) | `font-extrabold` (800) | Section titles |
| Card title | `text-lg` / `text-base` | `font-extrabold` (800) | Feature/step titles |
| Body | `text-sm` (0.875rem) | `font-medium` (500) | Descriptions, paragraphs |
| Small | `text-xs` (0.75rem) | `font-normal` (400) | Captions, metadata, badges |
| Label | `text-xs` | `font-semibold` (600) | Input labels, pill badges |
| Stat value | `text-2xl` / `text-3xl` | `font-extrabold` (800) | Metric displays |

### 3.3 Special Typography Patterns

- **Uppercase section labels** with tracking: `text-xs font-bold uppercase tracking-[0.2em]`
- **Pill badges**: `text-xs font-bold px-3 py-1 rounded-full`
- **Step numbers**: displayed as `text-[10px] font-black` in circular badge
- **Large faded background letter** on VARK cards: `text-[7rem] font-black text-white/10`

---

## 4. Spacing & Layout

### 4.1 Page Layout

- **Landing page**: Full-width sections within `max-w-7xl` container
- **Dashboard**: Sidebar (w-56) + main content area with `max-w-7xl` inner containers
- **Auth pages**: Split-panel (50/50 on desktop, stacked on mobile)

### 4.2 Section Spacing

| Context | Padding | Usage |
|---------|---------|-------|
| Hero section | `py-20` / `pb-24` | Landing hero |
| Content section | `py-24` | Features, VARK, How it Works |
| Compact section | `py-20` | Testimonials, Stats |
| Footer | `py-12` | Page footer |
| Card padding | `p-6` / `p-8` | Inside cards |
| Between cards | `gap-6` | Grid gaps |

### 4.3 Responsive Breakpoints

- Mobile-first defaults
- `sm:` (640px) — 2-column grids
- `md:` (768px) — Side-by-side layouts, show nav links
- `lg:` (1024px) — 3/4-column grids, show auth panel
- `xl:` (1280px) — 3-column dashboard layouts

---

## 5. Components

### 5.1 Buttons

**Primary Button (`.btn-primary`)**
```css
display: inline-flex;
align-items: center;
justify-content: center;
background-color: #4361EE;  /* brand */
color: white;
padding: 0.75rem 1.5rem;    /* px-6 py-3 */
border-radius: 0.75rem;     /* rounded-xl */
font-weight: 600;           /* font-semibold */
font-size: 0.875rem;        /* text-sm */
transition: all 0.2s;
box-shadow: 0 1px 2px rgba(0,0,0,0.05);
```
- Hover: `background-color: #2F4ABF`
- Disabled: `opacity-50 cursor-not-allowed`
- Variations: `text-base py-3.5 px-8` (hero CTAs), `text-sm py-2.5` (inline)

**Secondary Button (`.btn-secondary`)**
```css
background-color: white;
border: 1px solid #4361EE;
color: #4361EE;
padding: 0.75rem 1.5rem;
border-radius: 0.75rem;
font-weight: 600;
```
- Hover: `background-color: #EEF1FD`
- Dark mode: `dark:bg-gray-700 dark:border-gray-500`

**Ghost Link**
- No background, no border
- `text-sm font-medium text-gray-600 hover:text-brand transition-colors px-4 py-2`

### 5.2 Cards (`.card`)

```css
background-color: white;
border-radius: 1rem;           /* rounded-2xl */
padding: 1.5rem;               /* p-6 */
border: 1px solid #F3F4F6;     /* border-gray-100 */
box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06);
```

**Dark mode:** `dark:bg-gray-800 dark:border-gray-700`

**Card Variants:**
| Variant | Key Features |
|---------|-------------|
| **Feature Card** | Top gradient bar (`h-1 w-full bg-gradient-to-r`), icon circle, title + desc |
| **Step Card** | Top gradient bar (`h-1.5`), step number badge, icon, title + desc, hover lift |
| **VARK Card** | Gradient header (`h-36`), large faded letter, badge, description, "Explore" link |
| **Stat Card** | Compact (`p-4`), top gradient bar, small icon, big number, label |
| **Quick Action** | Row layout with icon + text + chevron, hover background |

**Hover Effects:**
- `hover:-translate-y-2` (lift on hover)
- `hover:shadow-2xl ${glow}` (colored glow shadows)
- `transition-all duration-300`

### 5.3 Input Fields (`.input-field`)

```css
width: 100%;
border: 1px solid #E5E7EB;      /* border-gray-200 */
border-radius: 0.75rem;          /* rounded-xl */
padding: 0.75rem 1rem;           /* px-4 py-3 */
font-size: 0.875rem;             /* text-sm */
background-color: #F9FAFB;       /* bg-gray-50 */
transition: all 0.2s;
```
- Focus: `border-brand bg-white`
- With icon: add `pl-10` padding + absolute positioned icon

### 5.4 Badges & Pills

| Variant | Classes | Usage |
|---------|---------|-------|
| Brand pill | `bg-brand/10 text-brand text-xs font-bold px-3 py-1 rounded-full` | Section labels |
| Green pill | `bg-green-50 text-green-700` | Hero stats |
| VARK badge | `bg-[color]-100 text-[color]-700 dark:bg-[color]-900/40` | Learning style badges |
| Step badge | `w-6 h-6 rounded-full text-[10px] font-black` | Step number circles |
| Notification dot | `w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse` | Unread indicator |
| Feature badge | `text-[10px] font-bold bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full` | "NEW", "AI", "🇮🇳" |

### 5.5 Navigation

**Sidebar (`.sidebar-link`)**
```css
display: flex;
align-items: center;
gap: 0.75rem;
padding: 0.625rem 1rem;       /* px-4 py-2.5 */
border-radius: 0.75rem;        /* rounded-xl */
font-size: 0.875rem;           /* text-sm */
font-weight: 500;
color: #6B7280;                /* text-gray-500 */
transition: all 0.2s;
```
- Hover: `text-brand bg-[#EEF1FD]`
- Active: `bg-brand text-white hover:bg-brand-dark`

**Top Navigation (Landing)**
- `sticky top-0 z-50 bg-white border-b shadow-sm`
- Links: `text-sm font-medium text-gray-500 hover:text-brand`

### 5.6 Gradient Accent Patterns

All gradient cards use the same pattern:
1. **Top accent bar** (`h-1` or `h-1.5`) with gradient
2. **Gradient icon container** (`w-11 h-11 rounded-2xl` or `w-16 h-16 rounded-2xl`)
3. **Glow shadow** on hover (`hover:shadow-[color]-500/20` or `/30`)

Standard gradients used:
- `from-blue-500 to-indigo-600`
- `from-violet-500 to-purple-600`
- `from-emerald-500 to-teal-600`
- `from-amber-500 to-orange-600`
- `from-pink-500 to-rose-600`
- `from-sky-500 to-cyan-600`

### 5.7 Loading States

```jsx
<div className="flex items-center justify-center h-64">
  <div className="flex gap-2">
    {[0, 1, 2].map((i) => (
      <div key={i} className="w-3 h-3 bg-brand rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
    ))}
  </div>
</div>
```

---

## 6. Landing Page Sections

The V1 landing page follows this exact section structure:

### 6.1 Navigation Bar
- Sticky top, white background, border-bottom, shadow-sm
- Logo: Brain icon + "Brainify" text
- Nav links: "How it Works", "VARK Model", "Features", "Civic Impact" (green)
- Right: Dark mode toggle + "Log In" + "Start Learning Style Test" CTA
- User state aware: shows "Go to Dashboard" if logged in

### 6.2 Hero Section
- Background: `bg-gradient-to-br from-white via-brand-50 to-white`
- Two-column grid (text left, visual right)
- **Left column:**
  - Green pill with live counter: "12,000+ students already learning"
  - Headline: "Learn Your Way,\nNot Their Way" with `text-brand` emphasis
  - Subheading: explanation paragraph
  - Dual CTAs: "Take Learning Style Test" (primary) + "Explore Platform" (secondary)
  - Social proof: "Joined by 12,000+ active learners"
- **Right column (desktop only):**
  - Large glowing brain emoji (🧠) with animated float
  - Rotating decorative ring with slow spin animation
  - Floating audit/profile badge cards with translucent backgrounds
  - Gaussian blur glow effects

### 6.3 How It Works Section
- Background: `bg-gray-50`
- Section label pill: "The Process"
- Three step cards with connecting gradient line
- Each card: gradient bar, step number badge, SVG icon, title, description
- Hover lift effect: `hover:-translate-y-2`

### 6.4 VARK Framework Section
- Background: white
- Section label: "Our Framework"
- 4-card grid (one per learning style)
- Each card: colored gradient header with large faded letter, SVG icon, style badge, description, explore link

### 6.5 Why Personalization Matters
- Background: `bg-gray-50`
- Two-column: Stats grid (4 metrics) + explanation text
- Stats: "85%", "92%", "2.5x", "60%" with source citations
- Checkmark list items

### 6.6 Features Section
- Background: white
- Section label: "Platform Features"
- 3-column grid of 6 feature cards
- Each card: gradient top bar, gradient icon, title, description
- Hover lift + colored glow

### 6.7 Testimonials
- Background: `bg-gray-50`
- 3-column grid of student testimonials
- Each card: quote text, avatar initial circle, name, role

### 6.8 CTA Section
- **Full-width brand background** (`bg-brand`)
- White heading + blue-100 subtext
- Two white-brand CTAs with hover effects
- Three feature bullets in blue-200

### 6.9 Footer
- 5-column grid (2-1-1-1)
- Logo + tagline + 3 link columns
- Copyright + legal links

---

## 7. Dashboard UI Patterns

### 7.1 Layout
- Sidebar (w-56, sticky, min-h-screen) + main content
- Top bar with search, dark mode toggle, notification bell, user avatar
- Main content: `p-8`

### 7.2 Welcome Banner
- Brand background (`bg-brand`) with decorative translucent circles
- Shows VARK style pill: "Daily Insight: You learn best with [style] content!"
- Greeting based on time of day
- CTAs: "View Results" / "Start Assessment" (white) + "View Schedule" (translucent)

### 7.3 Stat Cards Row
- 4 compact stat cards with gradient top bars
- Each: gradient icon, large value, label
- Hover: `hover:-translate-y-1 hover:shadow-xl`

### 7.4 Learning Engagement Chart
- Card with LineChart (Recharts)
- Live Data badge
- Civic Impact mini-banner (green gradient)
- Last 7 days of study hours

### 7.5 VARK Profile Radar
- Card with RadarChart (Recharts)
- Shows dominant style as large colored text
- 4-axis radar: Visual, Auditory, Read/Write, Kinesthetic
- Color legend below

### 7.6 Quick Actions
- Card with 3 action rows (VARK, Brain Quiz, Results)
- Each row: emoji icon + title + subtitle
- Hover: `group-hover:bg-brand group-hover:text-white` on icon

### 7.7 Notification Bell
- Bell icon button with red pulse dot when unread
- Dropdown panel: `w-80 rounded-2xl shadow-xl`
- List of notifications with type emoji + message + time ago

---

## 8. Animations

| Animation | Implementation | Usage |
|-----------|---------------|-------|
| Brain float | `@keyframes brainFloat { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-14px) } }` 4s ease-in-out infinite | Hero section brain emoji |
| Ring spin | `animate-spin` with `animationDuration: '18s'` | Hero decorative ring |
| Card hover lift | `hover:-translate-y-2 transition-all duration-300` | All feature/step cards |
| Bounce loading | `animate-bounce` with `animationDelay` on 3 dots | Loading states |
| Pulse notification | `animate-pulse` | Unread bell indicator |
| Button hover | `hover:bg-[color] transition-colors duration-200` | All interactive elements |
| Arrow animation | `group-hover:translate-x-1` | "Explore" link arrows |
| Shimmer overlay | `opacity-0 group-hover:opacity-100 transition-opacity` | VARK card hover overlay |

---

## 9. Dark Mode

- **Strategy:** `darkMode: 'class'` — toggle `.dark` class on `<html>`
- **Implementation:** ThemeContext persists preference to `localStorage`
- **Toggle:** Sun/moon icon button in navbar + top bar
- **Color shifts:**
  - Background: `#F5F7FF` → `#111827` (gray-900)
  - Cards: `white` → `gray-800`
  - Text: `gray-800` → `white`
  - Muted: `gray-400` → `gray-500`
  - Borders: `gray-100` → `gray-700`
  - Inputs: `bg-gray-50` → `bg-gray-700`
  - Sidebar: `white` → `gray-800`
- **Gradient cards** maintain their gradient colors in dark mode (brand colors unchanged)

---

## 10. Auth Pages Pattern

### Login & Register
- **Split panel layout** (hidden on `< lg`)
- **Left panel** (50%): Brand-colored background with decorative circles
  - Brainify logo (translucent icon)
  - AI badge pill
  - Inspiring headline
  - Feature list with checkmark items
  - Copyright footer
- **Right panel** (50%): White/dark form area
  - "Back to Home" link
  - Form title + subtitle
  - Input fields with left icon padding (`pl-10`)
  - Primary submit button (full width)
  - OR divider
  - Social login buttons (Google + GitHub)
  - Sign up/login link

---

## 11. SVG Icon Style

- **Stroke-based** (Heroicons style): `strokeWidth="1.5"` or `2`
- **Size**: `w-5 h-5` (nav), `w-7 h-7` (step icons), `w-12 h-12` (VARK cards)
- **Stroke properties**: `stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"`
- **Fill variants**: Used for brain icon logo, GitHub mark
- **No external icon library** — all inline SVGs for zero dependency

---

## 12. Design Decisions Summary

| Decision | Rationale |
|----------|-----------|
| Emoji-first icons (🧠, 📝, 📊) | Instantly recognizable, zero bundle cost, youthful feel |
| Generous rounded corners (2xl/3xl) | Soft, approachable, modern educational feel |
| Gradient accent bars on cards | Adds visual interest without overwhelming content |
| Hover lift effects | Provides tactile feedback, encourages interaction |
| Split-panel auth | Brand immersion before sign-up, shows value proposition |
| Section label pills | Creates clear visual hierarchy, breaks up content rhythm |
| Dark mode support | Reduces eye strain during night study sessions |
| Semi-transparent overlays | Depth and layering without sacrificing readability |
| Scientific citations | Builds credibility with education stakeholders |

---

## 13. SVG Icon Library (Brainify-specific)

### Logo Icon (Layered boxes)
```jsx
<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
</svg>
```

### Navigation Icons (all `className="w-5 h-5"`)
- **Dashboard**: 4 rounded rects (2x2 grid)
- **My Courses**: Book with bookmark
- **Analytics**: 3 bar chart columns
- **AI Recommends**: Lightbulb with sparkle
- **Smart Search**: Search magnifier
- **Life Skills**: Globe with grid lines
- **AI Study Buddy**: Chat bubble
- **Profile**: Person silhouette
- **Logout**: Arrow out of door

### Feature Icons (color-coded by section)
- Clock, Zap, Shield/Checkmark, Lightning Bolt, Star, Users, Book — all in white SVG inside colored gradient circles

### Auth Icons
- Google full-color logo, GitHub mark, Email envelope, Lock, Left chevron