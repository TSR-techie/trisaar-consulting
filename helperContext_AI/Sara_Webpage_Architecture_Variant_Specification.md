# Sāra Webpage Architecture & Variant Specification

**Project:** TriSaar Consulting  
**System:** Sāra Case Study Engine  
**Status:** Architecture Specification  
**Version:** 1.0  
**Date:** 2026-08-11

---

## 1. Purpose

The Sāra system is a reusable case-study presentation engine.

Each Sāra case study is defined primarily as **structured JSON content** and rendered by a shared HTML + JavaScript engine.

The same semantic content must be capable of being presented through multiple visual designs called **variants**.

### Core principle

> **Content is data. Structure is semantic. Presentation is a variant.**

A variant may change:

- visual composition
- hierarchy
- storytelling pattern
- layout
- interaction
- animation
- information density

A variant must **not change the underlying meaning of the case-study content**.

---

# 2. Design Goals

The architecture must:

1. Keep the Hero section on one canonical design.
2. Allow every major content section to have multiple variants.
3. Allow variants to be switched through JSON configuration.
4. Keep content independent from presentation.
5. Reuse the same renderer infrastructure across all Sāra case studies.
6. Prevent case studies from becoming visually repetitive.
7. Support future variants without rewriting the page engine.
8. Validate that a selected variant can consume the supplied content.
9. Provide safe fallback behaviour for invalid or unavailable variants.
10. Remain lightweight and suitable for GitHub Pages.
11. Preserve a premium, executive-oriented consulting experience.
12. Support mobile-responsive rendering.

---

# 3. Non-Goals

The JSON must **not** become a UI-definition language.

Avoid putting presentation instructions such as:

```json
{
  "columns": 3,
  "cardStyle": "rounded",
  "background": "red",
  "fontSize": 48
}
```

inside case-study content.

Such decisions belong to the variant implementation and shared design system.

---

# 4. Architectural Model

The system has five primary layers:

```text
                    SĀRA CASE STUDY
                           │
                           ▼
                     Content JSON
                           │
                ┌──────────┴──────────┐
                │                     │
          Semantic Content      Presentation Config
                │                     │
                └──────────┬──────────┘
                           ▼
                    Sāra Engine
                           │
                    Variant Registry
                           │
                    Variant Renderer
                           │
                           ▼
                         HTML
                           │
                    CSS / Interaction
                           │
                           ▼
                    Final Webpage
```

### Responsibilities

| Layer | Responsibility |
|---|---|
| JSON | Defines case-study information |
| Schema | Defines valid semantic structure |
| Page configuration | Selects variants |
| Variant Registry | Maps section + variant to renderer |
| Renderer | Converts content into DOM |
| CSS | Provides visual styling |
| JavaScript | Provides interaction and behaviour |
| Hero | Provides fixed Sāra identity |

---

# 5. Fixed vs Variant-Based Architecture

## 5.1 Fixed

The Hero is a canonical Sāra design.

```text
Hero
├── Sāra identifier
├── Title
├── Subtitle
├── Taxonomy
├── Context
└── Hero visual
```

The Hero does not initially participate in the variant system.

This provides consistent Sāra branding across all case studies.

## 5.2 Variant-Based

The remaining major sections may select their own presentation:

```text
Executive Summary
Business Context
Challenge
Solution
Process
Architecture
Impact
Technology
Deliverables
Evidence
Closing CTA
```

Example:

```text
Sāra 0001
│
├── Hero                    → fixed
├── Executive Summary       → impact-strip
├── Challenge               → pain-map
├── Solution                → process-flow
├── Impact                  → before-after
└── Technology              → constellation
```

Another case may use:

```text
Sāra 0002
│
├── Hero                    → fixed
├── Executive Summary       → editorial
├── Challenge               → narrative
├── Solution                → architecture
├── Impact                  → metrics
└── Technology              → stack
```

---

# 6. Semantic Section Model

Section IDs must describe **meaning**, never visual implementation.

### Correct

```json
"executiveSummary": {
  "variant": "impact-strip"
}
```

### Incorrect

```json
"threeColumnCards": {}
```

The first describes what the section means.

The second couples the data model to a specific UI implementation.

---

# 7. Case Study JSON Model

Recommended high-level structure:

```json
{
  "id": "sara-0001",

  "meta": {},

  "hero": {},

  "sections": {

    "executiveSummary": {
      "variant": "impact-strip",
      "content": {}
    },

    "challenge": {
      "variant": "pain-map",
      "content": {}
    },

    "solution": {
      "variant": "process-flow",
      "content": {}
    },

    "impact": {
      "variant": "metrics",
      "content": {}
    }

  }
}
```

---

# 8. Separation of Content and Presentation

Each section should conceptually contain:

```text
Section
├── variant
└── content
```

Example:

```json
{
  "executiveSummary": {
    "variant": "impact-strip",

    "content": {
      "headline": "A complex feasibility process became repeatable.",
      "summary": "The workflow transformed fragmented network analysis into a structured process.",
      "outcomes": [
        "Days → Minutes",
        "Bottleneck removed",
        "Knowledge made repeatable"
      ]
    }
  }
}
```

The content remains unchanged if the design changes:

```json
"variant": "editorial"
```

or:

```json
"variant": "dashboard"
```

Only presentation changes.

---

# 9. Variant Definition

A **variant** is a reusable presentation implementation for a specific semantic section.

Conceptually:

```text
Variant
├── ID
├── Section
├── Required fields
├── Optional fields
├── Renderer
├── CSS
└── Interaction behaviour
```

Example:

```javascript
{
    id: "impact-strip",

    section: "executiveSummary",

    required: [
        "headline",
        "summary",
        "outcomes"
    ],

    optional: [
        "metric",
        "label"
    ],

    render(data) {
        // Build DOM
    }
}
```

---

# 10. Variant Naming Convention

Variant names should describe a **storytelling/presentation concept**, not an HTML structure.

Recommended:

```text
executive-summary
├── editorial
├── impact-strip
├── dashboard
└── statement

challenge
├── narrative
├── pain-map
├── journey
└── friction-grid

solution
├── process-flow
├── architecture
├── transformation
└── capability-map

impact
├── metrics
├── before-after
├── outcome-grid
└── business-results

technology
├── stack
├── constellation
└── workflow
```

Avoid:

```text
three-column
two-column
card-grid
left-image
right-image
```

These describe implementation rather than storytelling.

---

# 11. Variant Registry

All variants should be registered centrally.

Example:

```javascript
VariantRegistry.register(
    "executiveSummary",
    "impact-strip",
    ExecutiveSummaryImpactStrip
);
```

The registry provides a stable lookup layer:

```text
section + variant
       │
       ▼
Variant Registry
       │
       ▼
Renderer
```

This prevents `case-study.js` from containing large conditional chains such as:

```javascript
if (variant === "x") {}
else if (variant === "y") {}
else if (variant === "z") {}
```

---

# 12. Rendering Lifecycle

The page engine should follow this lifecycle:

```text
1. Read URL
       ↓
2. Identify Sāra case
       ↓
3. Load JSON
       ↓
4. Validate case structure
       ↓
5. Render fixed Hero
       ↓
6. Iterate semantic sections
       ↓
7. Read selected variant
       ↓
8. Look up variant in registry
       ↓
9. Validate variant requirements
       ↓
10. Render variant
       ↓
11. Apply shared CSS/design system
       ↓
12. Initialize interactions
       ↓
13. Finalize page
```

---

# 13. Renderer Contract

The renderer should receive semantic content, not the entire case-study page.

Conceptually:

```javascript
renderer.render(section.content, context);
```

Where `context` may include:

```javascript
{
    caseId,
    sectionId,
    variantId,
    theme,
    index
}
```

The renderer should return or mount a DOM element.

---

# 14. Variant Compatibility

Each variant must declare the content it requires.

Example:

```javascript
{
    id: "impact-strip",

    required: [
        "headline",
        "summary",
        "outcomes"
    ],

    optional: [
        "metric"
    ]
}
```

The engine validates the selected variant before rendering.

### Missing required content

If the variant requires:

```text
headline
summary
outcomes
```

but `outcomes` is missing, the engine must not silently fail.

Development mode should show:

```text
Variant Error

Section:
Executive Summary

Variant:
Impact Strip

Missing:
outcomes
```

Production mode should fall back safely.

---

# 15. Fallback Strategy

The system must never allow an invalid variant to destroy the entire case-study page.

Recommended resolution order:

```text
Requested Variant
       │
       ▼
Is it registered?
       │
   ┌───┴───┐
  YES      NO
   │        │
   ▼        ▼
Validate   Default
   │       Variant
   │        │
   ▼        ▼
Render    Validate
              │
              ▼
            Render
```

Recommended hierarchy:

```text
selected variant
        ↓
section default variant
        ↓
global default variant
        ↓
safe renderer
```

---

# 16. Default Variants

Every semantic section should have a canonical default variant.

Example:

```javascript
VariantRegistry.defaults = {
    executiveSummary: "editorial",
    challenge: "narrative",
    solution: "process-flow",
    impact: "metrics",
    technology: "stack"
};
```

This ensures a case study remains functional even when variant configuration is incomplete.

---

# 17. Variant Independence

A variant must be self-contained enough to be moved, replaced or retired without changing:

- JSON content
- Hero implementation
- other section renderers
- case-study URL structure

For example:

```text
executive-summary/impact-strip.js
```

can be replaced by:

```text
executive-summary/dashboard.js
```

without rewriting the Executive Summary content.

---

# 18. Recommended Directory Structure

```text
docs/
│
├── case-study.html
│
└── assets/
    │
    ├── data/
    │   ├── sara-0001.json
    │   ├── sara-0002.json
    │   └── ...
    │
    └── js/
        └── case-study/
            │
            ├── case-study.js
            ├── renderer.js
            ├── registry.js
            ├── validator.js
            └── utils.js
            │
            ├── hero/
            │   └── hero.js
            │
            └── variants/
                │
                ├── executive-summary/
                │   ├── editorial.js
                │   ├── impact-strip.js
                │   ├── dashboard.js
                │   └── statement.js
                │
                ├── challenge/
                │   ├── narrative.js
                │   ├── pain-map.js
                │   └── journey.js
                │
                ├── solution/
                │   ├── process-flow.js
                │   ├── architecture.js
                │   └── transformation.js
                │
                ├── impact/
                │   ├── metrics.js
                │   ├── before-after.js
                │   └── outcome-grid.js
                │
                └── technology/
                    ├── stack.js
                    ├── constellation.js
                    └── workflow.js
```

---

# 19. Shared Design System

Variants must not independently invent the entire visual language.

They should consume shared design tokens:

```css
:root {
    --color-primary: #EF4444;
    --color-primary-hover: #DC2626;
    --color-primary-light: #FEE2E2;
    --color-primary-dark: #991B1B;

    --spacing-xs: ...;
    --spacing-sm: ...;
    --spacing-md: ...;
    --spacing-lg: ...;
    --spacing-xl: ...;

    --radius-sm: ...;
    --radius-md: ...;
    --radius-lg: ...;

    --shadow-sm: ...;
    --shadow-md: ...;
}
```

Variants determine **composition**.

The design system determines **visual language**.

This prevents the page from becoming a collection of unrelated mini-websites.

---

# 20. Responsive Contract

Every variant must support:

```text
Desktop
Tablet
Mobile
```

Variants must not rely on fixed dimensions that break on smaller screens.

A variant should define:

```text
Desktop composition
        ↓
Tablet adaptation
        ↓
Mobile composition
```

Mobile may legitimately change composition rather than simply shrink the desktop layout.

Example:

```text
Desktop:
[ Problem ] → [ Analysis ] → [ Solution ]

Mobile:
[ Problem ]
    ↓
[ Analysis ]
    ↓
[ Solution ]
```

---

# 21. Interaction Contract

Interactions belong to variants where they materially improve storytelling.

Possible behaviours:

- hover reveal
- scroll reveal
- metric count-up
- expandable detail
- step progression
- before/after slider
- interactive diagram
- timeline interaction

Interactions must remain:

- optional
- lightweight
- accessible
- usable without JavaScript where practical

No variant should require complex animation merely to communicate basic information.

---

# 22. Accessibility

Every variant must preserve:

- semantic HTML
- heading hierarchy
- readable contrast
- keyboard navigation
- visible focus states
- meaningful `alt` text
- reduced-motion support
- mobile readability

Visual storytelling must never replace the underlying information.

---

# 23. Performance

The architecture is intended for static GitHub Pages hosting.

Variants should therefore:

- avoid unnecessary libraries
- avoid large JavaScript bundles
- lazy-load heavy media
- avoid duplicate dependencies
- reuse CSS
- use native browser capabilities where practical
- avoid rendering unused variants

Only the selected variant should normally be initialized.

---

# 24. Variant Loading Strategy

Preferred:

```text
Case JSON
    ↓
Selected variant
    ↓
Load required renderer
    ↓
Render
```

Avoid loading every possible variant for every page if the number of variants becomes large.

For a small initial implementation, static imports are acceptable.

As the system grows, dynamic imports can be introduced:

```javascript
const renderer = await import(
    `./variants/${sectionId}/${variantId}.js`
);
```

---

# 25. Variant Preview / Design Laboratory

The engine should eventually support a preview mode.

Example:

```text
case-study.html?id=sara-0001&preview=variants
```

Preview interface:

```text
Sāra 0001
────────────────────────────

Executive Summary

○ Editorial
● Impact Strip
○ Dashboard
○ Statement

────────────────────────────

Challenge

● Narrative
○ Pain Map
○ Journey
```

Selecting a variant should update the preview without modifying the source JSON.

This turns the case-study engine into a reusable **design laboratory**.

---

# 26. Variant Configuration Modes

The architecture should support two modes.

## Case-specific configuration

The JSON explicitly selects variants:

```json
{
  "executiveSummary": {
    "variant": "impact-strip"
  }
}
```

## Development preview override

A URL parameter or development control temporarily overrides the JSON:

```text
?variant=dashboard
```

or:

```text
?preview=variants
```

Preview overrides must not modify production content.

---

# 27. Section Ordering

Variant configuration should not control semantic ordering unless explicitly required.

Preferred:

```json
{
  "sections": {
    "executiveSummary": {},
    "challenge": {},
    "solution": {},
    "impact": {}
  }
}
```

The engine defines the canonical order.

If future case studies require different section order, introduce a separate semantic ordering field rather than encoding order inside variants.

---

# 28. Optional Section Handling

Not every Sāra must contain every possible section.

The engine should support:

```text
Section exists
    ↓
render

Section absent
    ↓
skip cleanly
```

For example, if no architecture exists:

```text
Hero
Executive Summary
Challenge
Solution
Impact
Technology
```

No empty architecture placeholder should appear.

---

# 29. Media Handling

Media should remain semantic.

Example:

```json
{
  "media": {
    "type": "image",
    "src": "...",
    "alt": "...",
    "caption": "..."
  }
}
```

The variant determines whether that media becomes:

- hero image
- side illustration
- gallery
- diagram
- full-width visual
- before/after comparison

The JSON should not dictate its exact placement.

---

# 30. Variant Composition

A variant may internally contain reusable subcomponents.

Example:

```text
Executive Summary
        │
        └── Impact Strip
              ├── Headline
              ├── Summary
              └── Outcome Metrics
```

Reusable components may include:

```text
Metric
Badge
Quote
Stat
Timeline
Step
Media
Tag
Callout
Divider
```

This gives us:

```text
Semantic Section
        ↓
Variant
        ↓
Reusable Components
        ↓
Design System
```

---

# 31. Avoid Variant Explosion

Not every visual difference deserves a new variant.

Create a new variant only when the **storytelling composition** changes materially.

### Do not create a variant for:

- different spacing
- different accent colour
- different border
- minor typography changes
- small responsive adjustments

### Create a variant when:

- information hierarchy changes
- visual narrative changes
- interaction model changes
- composition changes
- reading pattern changes
- business story is communicated differently

---

# 32. Example: Executive Summary

One semantic input:

```json
{
  "headline": "A complex process became repeatable.",
  "summary": "Fragmented network analysis was converted into a structured feasibility workflow.",
  "outcomes": [
    "Days → Minutes",
    "Bottleneck removed",
    "Knowledge captured"
  ]
}
```

Possible variants:

### Editorial

Narrative-first presentation.

### Impact Strip

Outcome-first presentation.

### Dashboard

Metric-first presentation.

### Statement

Single high-impact transformation message.

The underlying JSON remains the same.

---

# 33. Example: Challenge

One semantic input:

```json
{
  "headline": "Feasibility analysis was slow and fragmented.",
  "painPoints": [
    "Manual path mapping",
    "Capacity constraints checked repeatedly",
    "Knowledge concentrated with one person"
  ]
}
```

Possible variants:

```text
Narrative
Pain Map
Journey
Friction Grid
```

---

# 34. Example: Solution

One semantic input can support:

```text
Process Flow
Architecture
Transformation
Capability Map
```

The solution remains the same.

Only the way the user understands it changes.

---

# 35. Case Study Design Philosophy

Sāra pages should avoid becoming:

> “Wikipedia pages with nicer CSS.”

Variants exist to make the same business story **visually engaging and memorable**.

Each variant should answer:

> “What is the clearest and most compelling way to communicate this information to an executive?”

The design should remain:

- premium
- spacious
- business-focused
- visually intentional
- easy to scan
- technically credible
- restrained rather than decorative

---

# 36. Testing Requirements

Every variant should be tested against:

### Content

- complete data
- missing optional data
- missing required data
- long text
- short text
- empty arrays

### Devices

- desktop
- tablet
- mobile

### Accessibility

- keyboard
- screen-reader semantics
- reduced motion
- contrast

### Browser

- current Chrome
- current Edge
- current Safari where practical
- Firefox where practical

### Failure modes

- invalid JSON
- unavailable variant
- missing media
- missing section
- failed dynamic import

---

# 37. Development Checklist

Before adding a new variant:

- [ ] Semantic section already exists.
- [ ] Existing variants cannot satisfy the storytelling need.
- [ ] Variant name describes presentation concept.
- [ ] Required content fields are defined.
- [ ] Optional fields are defined.
- [ ] Renderer is registered.
- [ ] Default/fallback behaviour works.
- [ ] Desktop layout works.
- [ ] Mobile layout works.
- [ ] Accessibility checked.
- [ ] Reduced-motion behaviour checked.
- [ ] Long-content behaviour checked.
- [ ] Missing-data behaviour checked.
- [ ] Performance checked.

---

# 38. Recommended Initial Variant Set

Do not build dozens of variants immediately.

Start with a deliberately small library.

## Executive Summary

```text
editorial
impact-strip
dashboard
```

## Challenge

```text
narrative
pain-map
```

## Solution

```text
process-flow
architecture
```

## Impact

```text
metrics
before-after
```

## Technology

```text
stack
workflow
```

This provides enough variety to prove the architecture without creating unnecessary implementation debt.

---

# 39. Future Variant Library

Once the engine is stable, additional variants can include:

```text
Executive Summary
├── editorial
├── impact-strip
├── dashboard
├── statement
└── snapshot

Challenge
├── narrative
├── pain-map
├── journey
├── friction-grid
└── root-cause

Solution
├── process-flow
├── architecture
├── transformation
├── capability-map
└── operating-model

Impact
├── metrics
├── before-after
├── outcome-grid
├── business-results
└── waterfall

Technology
├── stack
├── constellation
├── workflow
├── architecture
└── capability-map

Evidence
├── gallery
├── comparison
├── annotated-image
├── timeline
└── case-artifact
```

---

# 40. Architectural Invariant

The following rule must remain true throughout the lifetime of the Sāra engine:

```text
Changing a variant must never require rewriting the case-study content.
```

And:

```text
Changing case-study content must never require rewriting a variant.
```

If either becomes false, the architecture has become too tightly coupled.

---

# 41. Final Architecture

The intended system is:

```text
                    ┌───────────────────────┐
                    │      Sāra JSON        │
                    │                       │
                    │ Semantic Case Data    │
                    │ + Variant Selection   │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │    Schema Validator   │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │     Sāra Engine       │
                    └───────────┬───────────┘
                                │
               ┌────────────────┴────────────────┐
               │                                 │
               ▼                                 ▼
       ┌───────────────┐                ┌────────────────┐
       │ Fixed Hero    │                │ Variant        │
       │ Renderer      │                │ Registry       │
       └───────────────┘                └───────┬────────┘
                                                │
                                                ▼
                                      ┌────────────────────┐
                                      │ Section Renderer   │
                                      └─────────┬──────────┘
                                                │
                                                ▼
                                      ┌────────────────────┐
                                      │ Shared Components  │
                                      └─────────┬──────────┘
                                                │
                                                ▼
                                      ┌────────────────────┐
                                      │ Design System/CSS  │
                                      └─────────┬──────────┘
                                                │
                                                ▼
                                      ┌────────────────────┐
                                      │ Responsive HTML    │
                                      └────────────────────┘
```

---

# 42. One-Line Definition

> **Sāra is a data-driven case-study engine where one semantic JSON case can be transformed into multiple executive-quality experiences by switching section-level presentation variants.**

This architecture should be treated as the baseline specification before implementing additional Sāra variants.
