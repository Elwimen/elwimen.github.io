# elwimen.github.io

Personal portfolio site. Vanilla HTML/CSS/ES6 modules — no build step, no frameworks.

## Structure

```
index.html          single-page portfolio
css/
  variables.css     design tokens
  reset.css         base reset
  layout.css        container, grids, z-index stack
  components.css    cards, tags, stats, publication ref
  sections.css      section padding, tools list, footer, CRT overlay
  animations.css    scroll reveal, status dot pulse
js/
  main.js           entry point
  topo-background.js  procedural SVG topographic background
  scroll-reveal.js  IntersectionObserver scroll reveal with stagger
```

## Background

The topographic background is generated procedurally on each page load — Catmull-Rom splines with harmonic radius variation across three foci distributed over the full document height. Phases are randomised on every visit.

## Development

Open `index.html` directly in a browser, or serve locally:

```sh
python3 -m http.server
```

Changes to CSS and JS take effect on page reload — no compilation needed.
