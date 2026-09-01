# Scroll-Pinned Website — Build Plan

A Matta-style scroll-driven website for three businesses: **TriSaar Consulting**, **Trishader Games**, and **Trinidhi Finserv**. The layout uses a pinned left/center content area that swaps as the user scrolls, with a slim right-side index that highlights the active section in real time. There will be 4 major sections, first section mentions Our Services and then list 3 business with a mini description or detail. Then the rest 3 major sections are for each business

---

## Layout Structure

```
┌──────────────────────────────────────────────┬──────────────┐
│                                              │              │
│  MAIN CONTENT AREA (pinned, sticky)          │  RIGHT INDEX │
│  ~70% width                                  │  ~30% width  │
│                                              │  (narrower)  │
│  ┌────────────┐  ┌──────────────────────┐    │              │
│  │ Visual     │  │ Active slide content  │    │  ● Section 1 │
│  │ Panel      │  │ (headline + body)     │    │  ○ Section 2 │
│  │ (swaps)    │  │ (swaps on scroll)     │    │  ○ Section 3 │
│  └────────────┘  └──────────────────────┘    │  ○ Section 4 │
│                                              │              │
│  Stays pinned in viewport while scrolling    │  Active item │
│  through the section's scroll range          │  highlighted │
│                                              │  in accent   │
│                                              │  color       │
└──────────────────────────────────────────────┴──────────────┘
```

### The right index sidebar

- Narrow column on the right (about 25-30% of viewport width)
- Lists all major sections of the current page as text labels
- The **active section** (currently in scroll range) is highlighted:
  - Dot indicator fills with accent color
  - Label text darkens / bolds
  - Inactive items are muted (light grey)
- Clicking any item scrolls to that section smoothly
- On mobile: collapses to a thin vertical dot progress bar on the right edge (labels hidden, tap a dot to jump)

```
ACTIVE (current)          INACTIVE
─────────────             ────────
○  Understand             ○  Understand
●  Design  ◄ active       ○  Design
○  Deliver                ○  Deliver
```


## Scroll Engine Mechanics

### How pinned scrolling works

1. Each `[data-pin]` section is given extra height (e.g. `300vh` for 3 slides)
2. Inside it, a `.sticky-frame` uses `position: sticky; top: 0; height: 100vh`
3. A scroll listener computes progress (0 to 1) within the section's scroll range
4. Progress is mapped to discrete slides — each slide gets equal scroll budget
5. On slide change: fade out old content, fade in new content, update index highlight

### JavaScript scroll engine

### Updating the right index


## Color Themes (from brand logos)

### TriSaar Consulting

| Token | Hex | Usage |
|---|---|---|
| Accent (red) | `#d32f2f` | Active states, buttons, highlights, index dots |
| Text primary | `#1f2937` | Headlines, body text |
| Text muted | `#6b7280` | Labels, captions, inactive index items |
| Background | `#fafafa` | Page background |
| Surface | `#ffffff` | Cards, panels |
| Border | `#e5e7eb` | Dividers, inactive index dots |

### Trishader Games

Extracted from logo: black background with green circuit-style "T", red and white accent nodes.

| Token | Hex | Usage |
|---|---|---|
| Accent (green) | `#00B020` | Primary brand color, active states, index dots |
| Accent secondary (red) | `#FF0000` | Highlights, small accents, notification-style dots |
| Background | `#000000` | Page background (dark theme) |
| Surface | `#111111` | Cards, panels (slightly lifted from black) |
| Text primary | `#FFFFFF` | Headlines, body text |
| Text muted | `#9ca3af` | Labels, inactive index items |

Note: Trishader uses a **dark theme** — inverted from TriSaar's light theme. The index dots use green for active, red for a secondary accent (e.g. "new" badges, hover states).

### Trinidhi Finserv

Extracted from logo: deep forest green mountain graphic, royal purple brand name, cream background.

| Token | Hex | Usage |
|---|---|---|
| Accent (purple) | `#5D2E7B` | Primary brand color, active states, index dots |
| Accent secondary (green) | `#1A3C24` | Section accents, borders, dividers, icon color |
| Background | `#E2D9C2` | Page background (warm cream) |
| Surface | `#FFFFFF` | Cards, panels (white on cream for contrast) |
| Text primary | `#1A3C24` | Headlines, body text (dark green) |
| Text muted | `#7A6F5A` | Labels, inactive index items (warm grey on cream) |

---

## File Structure
suggestion: no need to be rigit about file structure, also keep this webpage and its content separate from existing website of Trisaar

Each HTML page loads the shared CSS/JS, then a `theme.css` override that sets the `--accent`, `--bg`, `--text`, and `--surface` CSS custom properties for that business.

Example
```css
/* theme.css loaded per page — e.g. Trishader */
:root {
  --accent: #00B020;
  --accent-secondary: #FF0000;
  --bg: #000000;
  --surface: #111111;
  --text: #FFFFFF;
  --text-muted: #9ca3af;
}
```

---

## Content Plan per Site

### TriSaar Consulting

**Section 0 — The Services (1 slide, 500vh)**
Create your own content and design for this
we need to showcase our three different businesses and can introduce new businesses later

**Right index for The Services:**
```
●  TriSaar Consulting
○  Trishader Games
○  Trinidhi Finserv
```

**Section 1 — The Problem (5 slides, 500vh)**
| Slide | Headline | Body | Visual |
|---|---|---|---|
| 0 | Your data lives in 30 spreadsheets | Teams waste hours reconciling tabs, versions, and manual exports. | Scattered Excel window icons |
| 1 | Manual reporting eats 15 hours a week | Reports built by hand, copy-pasted, emailed — every single week. | Clock with burning fuse |
| 2 | We automate it | VBA, Python, and Power Automate replace manual steps end to end. | Before/after flow toggle |
| 3 | 92% less manual effort | One engagement cut a public sector team's model-building time by 92%. | Large number reveal animation |
| 4 | Dashboards that update themselves | Power BI, Tableau, or custom dashboards connected to live data sources. | Dashboard mockup |

**Section 2 — What We Deliver (6 slides, 600vh)**
| Slide | Service | Body |
|---|---|---|
| 0 | Business Intelligence | Interactive dashboards and executive reporting |
| 1 | Process Automation | VBA, Python, Power Automate workflow automation |
| 2 | AI Workflow Automation | AI-assisted business processes via LLMs |
| 3 | Financial Modelling | Dynamic Excel models for strategic decisions |
| 4 | Supply Chain Analytics | Inventory, logistics, operational analytics |
| 5 | Reporting Automation | Automated pipelines that save hours weekly |

**Section 3 — How We Work (3 slides, 300vh)**
| Slide | Step | Body |
|---|---|---|
| 0 | Understand | Business context, inefficiencies, measurable objectives |
| 1 | Design | Combine analytics, automation, AI into scalable solution |
| 2 | Deliver | Implement, validate, improve through measurable results |

**Right index for TriSaar:**
```
●  The Problem
●  What We Deliver  ← active
○  How We Work
```

---

### Trishader Games

**Section 1 — Who We Are (3 slides, 300vh)**
| Slide | Headline | Body | Visual |
|---|---|---|---|
| 0 | We make games | [Placeholder: studio intro] | Logo on black |
| 1 | Genre / platform focus | [Placeholder] | Game genre icon |
| 2 | Studio philosophy | [Placeholder] | Abstract game visual |

**Section 2 — Our Titles (4 slides, 400vh)**
| Slide | Title | Body | Visual |
|---|---|---|---|
| 0 | Title One | [Placeholder] | Cover art placeholder |
| 1 | Title Two | [Placeholder] | Cover art placeholder |
| 2 | Title Three | [Placeholder] | Cover art placeholder |
| 3 | Title Four | [Placeholder] | Cover art placeholder |

**Section 3 — Our Approach (3 slides, 300vh)**
| Slide | Step | Body |
|---|---|---|
| 0 | Concept | [Placeholder] |
| 1 | Prototype | [Placeholder] |
| 2 | Ship | [Placeholder] |

**Right index for Trishader:**
```
●  Who We Are
○  Our Titles
○  Our Approach
```

---

### Trinidhi Finserv

**Section 1 — The Financial Challenge (4 slides, 400vh)**
| Slide | Headline | Body | Visual |
|---|---|---|---|
| 0 | Managing wealth is complex | [Placeholder] | Abstract financial visual on cream |
| 1 | Markets move faster than spreadsheets | [Placeholder] | Market chart abstract |
| 2 | Regulation keeps tightening | [Placeholder] | Document/ compliance visual |
| 3 | You need a partner, not just a provider | [Placeholder] | Handshake / partnership visual |

**Section 2 — What We Offer (4 slides, 400vh)**
| Slide | Service | Body |
|---|---|---|
| 0 | Mutual Fund Investment | [Placeholder] |
| 1 | ITR-1 & ITR-2 Filing | [Placeholder] |
| 2 | Wealth Dashboard | [Placeholder] |

**Section 3 — Why Trust Us (3 slides, 300vh)**
| Slide | Headline | Body |
|---|---|---|
| 0 | Experience / track record | [Placeholder] |
| 1 | Personalized, data-driven approach | [Placeholder] |
| 2 | Outcomes — growth, protection, compliance | [Placeholder] |

**Right index for Trinidhi:**
```
○  The Challenge
●  What We Offer  ← active
○  Why Trust Us
```

---

## Navigation: Business Switcher

A top-nav element present on all three sites that lets users switch between the three businesses:

```
┌─────────────────────────────────────────────────────┐
│  [Logo]   TRISAAR | TRISHADER | TRINIDHI     [Menu] │
└─────────────────────────────────────────────────────┘
```

- The current business is highlighted in its own accent color
- The other two are muted text links
- Clicking switches to that business's site
- this will not replace the existing navbar, a seperate element

---

## Mobile Adaptations

| Element | Desktop | Mobile |
|---|---|---|
| Right index | 200px sidebar with labels + dots | Thin vertical dot bar (right edge, labels hidden) |
| Content layout | Visual panel left, text right (side by side) | Stacked: visual on top, text below |
| Slides per section | 3-5 | 3 max (shorten scroll range to avoid frustration) |
| Business switcher | Full text labels in nav bar | Hamburger menu with three options |
| Sticky frame | Full viewport height | Full viewport height, but content scrollable within |

---

## Performance Notes

- Use `requestAnimationFrame` for scroll handling (never raw scroll events)
- Only animate `transform` and `opacity` (GPU-accelerated, no reflow)
- Preload all slide images in pinned sections (no lazy loading within the scroll experience)
- Keep total page weight low: SVG visuals preferred over PNG/JPG
- Debounce resize events to recalculate section offsets
- Use CSS `will-change: transform, opacity` on slide elements during transitions

---

## Build Sequence

1. **Shared scroll engine + CSS + index sidebar** — one working demo with dummy content
2. **TriSaar Consulting** — fill in real content from existing site
3. **Trishader Games** — placeholder content, dark theme
4. **Trinidhi Finserv** — placeholder content, cream/purple/green theme
5. **Business switcher navigation** — cross-link all three
6. **Mobile testing** — adjust slide counts, stacking, dot bar index
7. **Polish** — smooth scroll (Lenis optional), entrance animations, micro-interactions
