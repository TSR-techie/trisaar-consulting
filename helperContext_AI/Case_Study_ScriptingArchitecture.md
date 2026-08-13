# Architecture Overview

## 1. `renderer.js`

### Purpose

This is the orchestrator.

It doesn't know how to build a Hero.

It doesn't know how to build a Timeline.

It simply knows:

> "Read the JSON and ask the correct component to build itself."

Think of it as the project manager.

---

## 2. `component-registry.js`

This is the directory of your website.

Imagine the renderer asking:

> Hero? Where is Hero?

The registry answers:

> Hero? It's here.

### Example

```js
export const ComponentRegistry = {
    hero,
    executiveSummary,
    timeline,
    challenge,
    outcome
};