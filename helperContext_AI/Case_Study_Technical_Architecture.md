\# TriSaar Consulting Website

\## Technical Architecture — Dynamic Case Study Engine



Version: 1.0



Status: Planned



\---



\# Vision



The Case Study Engine is the core content platform powering TriSaar Consulting's consulting portfolio.



Unlike traditional portfolio websites where every project has its own HTML page, TriSaar will use a \*\*single reusable presentation engine\*\* capable of rendering unlimited case studies from structured JSON data.



The objective is to separate:



\- Content

\- Presentation

\- Styling

\- Interaction



allowing the website to scale from a handful of projects to hundreds without duplicating HTML.



\---



\# Core Design Principles



\## 1. Content First



Case studies are content.



Not webpages.



Every case study should exist independently of its presentation as a json file.



\---



\## 2. Reusable Presentation



The website should never require creating a new HTML page for a new case study.



Adding a new Sāra should require only:



\- Writing content

\- Adding images

\- Creating JSON



Nothing else.



The structure and visuals will be managed in HTML, CSS and Javascript



\---



\## 3. Modular Components



The page should be assembled from reusable components.



Examples



Hero



↓



Executive Summary



↓



Business Challenge



↓



Architecture



↓



Dashboard



↓



Business Impact



↓



Roadmap



↓



Lessons Learned



↓



Consultant Notebook



Each component is independent.



\---



\## 4. Executive Experience



The website is designed primarily for decision makers.



The objective is not to maximize reading.



The objective is to maximize engagement.



Every section should answer



> "Why should I keep scrolling?"



\---



\# Overall Architecture



```



Browser



↓



case-study.html



↓



case-study.js



↓



Loads JSON



↓



Builds Components



↓



Applies Theme



↓



Interactive Experience



```



\---





\# Routing



The website should support URLs similar to



```

/case-study.html?id=sara-0001

```



or eventually



```

/case-studies/sara-0001

```



The router reads the ID and loads the corresponding JSON.



\---



\# Rendering Pipeline



```

Read URL



↓



Load JSON



↓



Validate



↓



Determine Theme



↓



Build Component List



↓



Choose Variants



↓



Render HTML



↓



Initialize Animations



↓



Ready

```



\---



\# Component System



Every visible section is an independent component.



Example



```

Hero



Executive Summary



Business Context



Challenge



Objectives



Architecture



Dashboard



Business Impact



Lessons



Notebook



Downloads



Footer

```



Each component owns



\- HTML

\- CSS

\- JavaScript



independently.



\---



\# Variant System



Every component supports multiple visual styles.



The purpose is preventing every Sāra from looking identical.



Example



```

Hero



├── Executive



├── Split Illustration



├── Full Width



├── Product Reveal



├── Minimal



└── Immersive



```



Challenge



```

Timeline



Cards



Story



Journey



Quote



Comparison



```



Architecture



```

Pipeline



Layered



Network



Hub



Flow



Tree



Circular



Platform



```



Impact



```

Metric Cards



Before After



Animated Counters



Executive KPIs



Charts



Scorecards



```



Roadmap



```

Horizontal Timeline



Vertical Timeline



Milestones



Product Roadmap



Journey



```



Notebook



```

Notebook



Sticky Notes



Journal



Letter



Callout



```



\---



\# Theme Engine



Every Sāra defines a presentation profile.



Example



```

Operations



Analytics



Automation



AI



Strategy



Finance



Supply Chain



Executive



```



The selected theme controls



\- Typography

\- Colors

\- Section spacing

\- Preferred variants

\- Animations

\- Icons

\- Illustration style



without changing the underlying content.



\---



\# JSON Structure



Every case study follows a common schema.



```

Case Study



↓



Metadata



↓



Presentation



↓



Sections



↓



Assets



↓



Downloads

```



The renderer consumes the schema and builds the page.



\---



\# Section Configuration



Every section declares



\- component

\- variant

\- data



Example



```

Challenge



Variant



↓



Timeline



↓



Timeline Data

```



or



```

Challenge



↓



Cards



↓



Card Data

```



The renderer automatically loads the correct component.



\---



\# Presentation Engine



The engine decides



\- section width

\- animation

\- spacing

\- background

\- transition



instead of every section manually defining them.



This creates a consistent experience.



\---



\# Responsive Layout



Desktop



\- Two-column layouts

\- Sticky navigation

\- Floating table of contents

\- Large illustrations



Tablet



\- Mixed layout

\- Reduced spacing

\- Adaptive cards



Mobile



\- Single column

\- Swipeable cards

\- Collapsible diagrams

\- Touch-first interactions



\---



\# Animation Principles



Animations should support storytelling.



Never distract. Stay Professional



Examples



\- Fade-in

\- Slide

\- Scale

\- Counter animation

\- Progress timeline

\- Hover elevation

\- Connection drawing

\- Scroll reveal



Avoid



\- Flashing

\- Excessive parallax

\- Long delays

\- Auto-playing distractions



\---



\# Assets



Each Sāra owns its own assets.



Examples



Architecture diagrams



Dashboard screenshots



Workflow illustrations



Synthetic datasets



Downloadable files



PDF documentation



The page references only its own assets.



\---



\# Navigation



The page should include



\- Sticky progress indicator

\- Floating table of contents

\- Previous Sāra

\- Next Sāra

\- Back to Case Studies

\- Related Sāras



\---



\# Performance Goals



Initial load should be lightweight.



Lazy load



\- images

\- diagrams

\- downloads

\- videos



Only load assets when needed.



Animations should initialize only after content becomes visible.



\---



\# Accessibility



The engine should support



\- keyboard navigation

\- semantic HTML

\- high contrast

\- reduced motion

\- screen readers

\- descriptive alt text



\---



\# SEO



Every case study should generate



Unique



\- Title

\- Description

\- Open Graph tags

\- Twitter cards

\- Structured Data

\- Canonical URL



The page should be indexable independently.



\---



\# Future Markdown Pipeline



Long-term, the website should not require manually creating JSON.



Future workflow



```

Markdown



↓



Python Compiler



↓



Schema Validation



↓



JSON



↓



Website

```



Markdown remains the source of truth.



The website consumes generated JSON.



\---



\# Long-Term Vision



The Case Study Engine is not intended to display static documentation.



It is intended to function as a \*\*consulting storytelling platform\*\*.



Every Sāra should feel like a carefully crafted executive presentation rather than a technical report.



The platform should balance:



\- business storytelling

\- visual engagement

\- technical credibility

\- scalability

\- maintainability



allowing TriSaar Consulting to publish an unlimited number of consulting engagements while preserving a premium, executive-grade reading experience.



The goal is that visitors remember \*\*how the story felt\*\*, not just what technologies were used.

