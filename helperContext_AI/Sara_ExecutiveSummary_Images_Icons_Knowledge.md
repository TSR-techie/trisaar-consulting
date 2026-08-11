# Sāra Executive Summary — Images & Icons Knowledge Reference

**Project:** TriSaar Consulting  
**System:** Sāra Case Study Engine  
**Scope:** Executive Summary section (all variants)  
**Status:** Knowledge Reference  
**Version:** 1.0  
**Date:** 2026-08-11

---

## 1. Purpose

This document defines how to supply and update **icons** and **images** for the Executive Summary on each new Sāra **without changing the semantic JSON structure**.

Core rule:

> **Case content stays semantic. Icons are named tokens. Images are per-Sāra assets resolved by `caseId`. Variants decide presentation.**

Do **not** encode layout instructions in JSON (for example `leftImage`, `cardStyle`, `columns`).

---

## 2. Separation of Concerns

| Concern | Where it lives | Changes when |
|---|---|---|
| Story content (titles, pillars, metrics, steps, bottom line) | `docs/assets/data/{caseId}.json` | New case narrative |
| Icon **names** (which symbol to use) | JSON `icon` fields | Different meaning / metaphor |
| Icon **SVG artwork** | `docs/assets/js/icons.js` | New symbol needed globally |
| Raster / photo / illustration assets | `docs/assets/images/{caseId}/` | Per-case visuals |
| How icons/images are composed on screen | Executive Summary variant JS/CSS | New or updated variant |

Switching Executive Summary design only requires:

```json
"variant": "executive-brief"
```

(or `executive-flow`, `executive-flow-lite`, `executive-overview`)

Content fields stay the same.

---

## 3. Current Executive Summary Variants

| Variant ID | Visual density | Uses named icons from JSON | Uses per-Sāra image slots |
|---|---|---|---|
| `executive-flow` | Dense Challenge → Solution → Impact panels | Yes | No (decorative CSS only today) |
| `executive-flow-lite` | Open flow + checklist | Yes | No |
| `executive-overview` | Narrative + At a glance / How it works panel | Yes | No |
| `executive-brief` | Cards + process + KPI strip | Yes | **Yes (target convention)** |

All variants share one semantic content model under `sections[].data` for `component: "executiveSummary"`.

---

## 4. Icons — Dynamic Per Sāra

### 4.1 How icons work

1. JSON stores an **icon token** (string key), not SVG markup.
2. `docs/assets/js/icons.js` maps that key to an SVG string.
3. Variant renderers call `icon(name, className)`.

Example from case JSON:

```json
{
  "key": "challenge",
  "label": "Challenge",
  "icon": "people",
  "title": "Feasibility lived as tribal knowledge."
}
```

Metric / step examples:

```json
{ "icon": "duration", "value": "Days → Minutes", "label": "Cycle time reduced" }
{ "icon": "code", "text": "Automate with Office Scripts" }
```

### 4.2 Where icons appear in Executive Summary content

Typical icon fields on the shared content model:

```text
data.pillars[].icon
data.pillars[].points[].icon
data.pillars[].steps[].icon
data.pillars[].metrics[].icon
data.bottomLine.icon
data.bottomLine.cta.icon
data.meta[].icon
```

A Sāra may omit optional icon fields. Missing keys fall back to the default icon in `icons.js` (currently `document`).

### 4.3 Process — reuse an existing icon for a new Sāra

1. Open `docs/assets/js/icons.js` and confirm the key exists (for example `gear`, `chart`, `shield`).
2. In the new case JSON, set the `icon` string to that key.
3. No JS or CSS change required.
4. Preview the case: `case-study.html?id={caseId}`.

### 4.4 Process — add a brand-new icon symbol

Use this only when no existing key fits.

1. Design a simple 24×24 stroke SVG consistent with existing icons.
2. Add a new key to `ICONS` in `docs/assets/js/icons.js`:

```js
mySymbol: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75">...</svg>`,
```

3. Reference `"icon": "mySymbol"` in the Sāra JSON where needed.
4. Prefer shared keys across cases so the icon library does not explode.

### 4.5 Icon naming rules

- Use lowercase kebab-case or single camelToken names consistent with the registry (`arrow-circle`, `people`, `duration`).
- Names describe **meaning**, not color or size (`shield`, not `redShieldLarge`).
- Color and size are controlled by variant CSS (`.summary-pillar-icon`, `.summary-brief-card-icon`, etc.).

### 4.6 Current icon registry (baseline)

Maintain this list when adding keys. At time of writing, `icons.js` includes:

```text
client, people, person, duration, scales, gear, flow, grid, code,
shield, check, chart, outcome, technology, dataset, confidentiality,
document, book, star, quote, arrow-circle, industry, network, github
```

---

## 5. Images — Dynamic Per Sāra (Case Folder Convention)

### 5.1 Principle

Do **not** hardcode Sāra-specific image paths inside variant CSS for production use.

Resolve images from the active case id:

```text
docs/assets/images/{caseId}/{slot-filename}
```

Examples:

```text
docs/assets/images/sara-0001/executive-brief-hero.png
docs/assets/images/sara-0002/executive-brief-hero.png
docs/assets/images/sara-0001/executive-brief-media-back.png
docs/assets/images/sara-0002/executive-brief-media-back.png
docs/assets/images/sara-0001/executive-brief-media-front.png
docs/assets/images/sara-0002/executive-brief-media-front.png
```

The JSON content structure does not need new image fields for this convention to work.

### 5.2 Engine requirement — pass `caseId` into variants

The page loader already knows the case id (`?id=sara-0001`). Variants receive that id at render time.

Implemented contract:

```js
component.render(section, context)

// context includes at minimum:
{
  caseId  // e.g. "sara-0001"
}
```

Image URL helper pattern (in `executiveSummary.js`):

```js
function caseAsset(caseId, filename) {
  return `./docs/assets/images/${caseId}/${filename}`;
}
```

`renderer.js` passes `{ caseId: id }` into every section renderer. Missing image files fall back to decorative placeholders via `img` `error` handlers.

### 5.3 Executive Brief — standard image slots

For `variant: "executive-brief"`, use these filenames under each case folder:

| Slot ID | Filename | Used for | Required |
|---|---|---|---|
| `executive-brief-hero` | `executive-brief-hero.png` | Header right illustration | Recommended |
| `executive-brief-media-back` | `executive-brief-media-back.png` | How it works collage background | Recommended |
| `executive-brief-media-front` | `executive-brief-media-front.png` | How it works collage foreground | Recommended |

### 5.4 Other Executive Summary variants

`executive-flow`, `executive-flow-lite`, and `executive-overview` currently emphasize icons + typography. If a future revision adds imagery:

1. Define a **named slot** and stable filename.
2. Document it in this file.
3. Resolve via `{caseId}` folder + `context.caseId`.
4. Keep JSON structure unchanged unless media becomes semantic content (see §7).

### 5.5 Process — add images for a new Sāra

1. Create the case data file: `docs/assets/data/sara-00XX.json` (copy structure from `sara-0001.json`).
2. Create the asset folder:

```text
docs/assets/images/sara-00XX/
```

3. Export optimized assets into the slot filenames in §5.3.
4. Set Executive Summary variant as needed:

```json
"component": "executiveSummary",
"variant": "executive-brief"
```

5. Update icon tokens in JSON if the story metaphors differ (§4).
6. Preview: `case-study.html?id=sara-00XX`.
7. Verify missing-image fallback still looks acceptable.

### 5.6 Process — replace images on an existing Sāra

1. Overwrite files in `docs/assets/images/{caseId}/` with the same filenames.
2. Hard-refresh the browser (cache bust if needed by renaming only when filename must change).
3. Prefer keeping filenames stable so no code change is required.
4. If a filename must change, update the slot map in the brief renderer **and** this knowledge file.

### 5.7 Asset guidelines

- Prefer WebP or optimized PNG/JPEG for GitHub Pages.
- Hero illustration: roughly square or landscape; keep subject clear at ~240–320px display width.
- Process collage: background can be atmospheric; foreground should read as “tool / dashboard / workbook.”
- Provide meaningful `alt` text in the renderer (from convention defaults or optional JSON media later).
- Do not commit huge unoptimized originals.

### 5.8 Fallback behaviour

When a slot file is missing:

1. Prefer a silent decorative fallback (current CSS board / media placeholders), **or**
2. Hide the media frame entirely if empty space is cleaner.

Never break the whole case study page because one image 404s.

---

## 6. Recommended Folder Layout

```text
docs/assets/
├── data/
│   ├── sara-0001.json
│   ├── sara-0002.json
│   └── ...
├── images/
│   ├── sara-0001/
│   │   ├── executive-brief-hero.png
│   │   ├── executive-brief-media-back.png
│   │   └── executive-brief-media-front.png
│   ├── sara-0002/
│   │   ├── executive-brief-hero.png
│   │   ├── executive-brief-media-back.png
│   │   └── executive-brief-media-front.png
│   └── CaseStudy_ExecutiveSummary_*.png   # design references only
├── js/
│   └── icons.js
└── modules/executive-summary/
    ├── executiveSummary.js
    └── executiveSummary.css
```

Design mock PNGs at the images root (for example `CaseStudy_ExecutiveSummary_Executive-Brief.png`) are **authoring references**, not runtime case assets.

---

## 7. Optional: Semantic Media in JSON (Later)

If a case needs explicit media control beyond filename convention, add **optional** semantic media without inventing layout JSON:

```json
"data": {
  "media": {
    "hero": {
      "type": "image",
      "src": "./docs/assets/images/sara-0002/executive-brief-hero.png",
      "alt": "Network feasibility decision surface"
    },
    "process": [
      {
        "type": "image",
        "src": "./docs/assets/images/sara-0002/executive-brief-media-back.png",
        "alt": "Energy network context"
      },
      {
        "type": "image",
        "src": "./docs/assets/images/sara-0002/executive-brief-media-front.png",
        "alt": "Excel decision toolkit"
      }
    ]
  }
}
```

Resolution order for a variant:

```text
1. section.data.media.{slot} if present
2. else convention path: images/{caseId}/{slot-filename}
3. else decorative / hidden fallback
```

This keeps structure stable: older Sāras without `media` continue to work.

---

## 8. End-to-End Checklist — New Sāra Executive Summary

Use this checklist for every new case:

### Content

- [ ] Created `docs/assets/data/{caseId}.json`
- [ ] Executive Summary section uses `component: "executiveSummary"`
- [ ] Selected `variant` (`executive-brief` / flow / lite / overview)
- [ ] Pillars, metrics, steps, bottom line, meta filled
- [ ] Icon tokens set to existing registry keys (or new keys added to `icons.js`)

### Images (especially for `executive-brief`)

- [ ] Created `docs/assets/images/{caseId}/`
- [ ] Added `executive-brief-hero.png`
- [ ] Added `executive-brief-media-back.png`
- [ ] Added `executive-brief-media-front.png`
- [ ] Filenames match the slot map in §5.3
- [ ] Assets optimized for web

### Verification

- [ ] `case-study.html?id={caseId}` loads
- [ ] Icons render for pillars / steps / metrics
- [ ] Images resolve for the selected variant (or fallback is acceptable)
- [ ] Mobile layout still works
- [ ] Switching only the `variant` field still works on the same content

---

## 9. Anti-Patterns

Do **not**:

- Hardcode `sara-0001` image paths inside CSS for all cases
- Put raw SVG markup into JSON
- Add presentation fields like `"imagePosition": "top-right"`
- Create a new variant only to change one photograph
- Duplicate the entire icon SVG per case when a shared token works

Do:

- Reuse icon tokens across Sāras
- Drop case images into `{caseId}` folders with stable slot names
- Let variants resolve assets from `caseId` + optional semantic media

---

## 10. Implementation Touchpoints (for engineers)

When wiring convention-based images into code:

| File | Responsibility |
|---|---|
| `docs/assets/js/renderer.js` | Pass `{ caseId, sectionId, variantId }` into `component.render` |
| `docs/assets/modules/executive-summary/executiveSummary.js` | Resolve image slots for `executive-brief` (and future variants) |
| `docs/assets/modules/executive-summary/executiveSummary.css` | Size/crop/overlay presentation only |
| `docs/assets/js/icons.js` | Global icon token registry |
| `docs/assets/data/{caseId}.json` | Icon token names + story content |
| `docs/assets/images/{caseId}/` | Per-case raster assets |

---

## 11. One-Line Operating Rule

> **For each new Sāra: write semantic JSON (including icon names), drop images into `docs/assets/images/{caseId}/` using the Executive Summary slot filenames, and switch presentation only via `variant`.**
