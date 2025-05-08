# web-bench-svg-solar

## [Evaluate](../readme.md)

## Introduction

from [W3C](https://svgwg.org/svg2-draft/Overview.html):

> SVG is a language for describing two-dimensional graphics.
>
> SVG drawings can be interactive and dynamic. Animations can be defined and triggered either declaratively (i.e., by embedding SVG animation elements in SVG content) or via scripting.

from [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG):

> Scalable Vector Graphics (SVG) is an XML-based markup language for describing two-dimensional based vector graphics.
>
> As such, it's a text-based, open Web standard for describing images that can be rendered cleanly at any size and are designed specifically to work well with other web standards including CSS, DOM, JavaScript, and SMIL. SVG is, essentially, to graphics what HTML is to text.

## Project Design

We will create a minimal Solar System to cover SVG document structures (e.g. `<g>`, `<defs>`, `<use>`...), animation and more styled elements (`<marker>`, `<xxGradient>`...) and attributes (stroke-*).

### Tasks

1. Prepare SVG
2. Star-Planets System
3. Planet Orbit
4. Planet
5. Planet color `linearGradient`
6. Planets Revolution (elliptical orbit)
7. Planet-Satellites System
8. Satellite color `radialGradient`
9. Satellite Revolution (elliptical orbit)
10. Backward to Star-Planets
11. Details Panel
12. Highlight Sub-bodies
13. Click Sub-bodies
14. Planet Ring
15. Orbit Tail
16. Config Orbit
17. Config Recent Orbit
18. Config Orbital Speed
19. Generate Background
20. Generate Comet

### Feature Coverage

Including [Project svg](../svg/readme.md) features.

| SVG Tags               | Used |
| ---------------------- | ---- |
| Shapes & Path          | -    |
| `<rect>`             | ✅   |
| `<circle>`           | ✅   |
| `<ellipse>`          | ✅   |
| `<line>`             | ✅   |
| `<polyline>`         | ✅   |
| `<polygon>`          | ✅   |
| `<path>`             | ✅   |
| Text                   | -    |
| `<text>`             | ✅   |
| `<tspan>`            | ❌   |
| `<textPath>`         | ❌   |
| Document Structure     | -    |
| `<svg>`              | ✅   |
| `<g>`                | ✅   |
| `<defs>`             | ✅   |
| `<symbol>`           | ✅   |
| `<use>`              | ✅   |
| `<title>`            | ✅   |
| `<desc>`             | ❌   |
| `<switch>`           | ❌   |
| `<a>`                | ❌   |
| `<view>`             | ❌   |
| Embedded Content       | -    |
| `<image>`            | ✅   |
| `<foreignObject>`    | ✅   |
| Animation (SMIL)       | -    |
| `<animate>`          | ❌   |
| `<animateMotion>`    | ✅   |
| `  <mpath>`          | ✅   |
| `<animateTransform>` | ❌   |
| `<set>`              | ❌   |
| Styles                 | -    |
| `<linearGradient>`   | ✅   |
| `<radialGradient>`   | ✅   |
| `<pattern>`          | ❌   |
| `<marker>`           | ❌   |
| `<filter>`           | ❌   |
| `<clipPath>`         | ✅   |
| `<mask>`             | ❌   |
| color                  | ✅   |
| transform              | ✅   |
| transform-origin       | ✅   |
| fill                   | ✅   |
| fill-rule              | ❌   |
| fill-opacity           | ✅   |
| stroke                 | ✅   |
| stroke-width           | ✅   |
| stroke-linecap         | ❌   |
| stroke-linejoin        | ❌   |
| stroke-miterlimit      | ❌   |
| stroke-dasharray       | ✅   |
| stroke-dashoffset      | ✅   |
| stroke-opacity         | ✅   |

## Reference

- [W3C -SVG 2](https://svgwg.org/svg2-draft/Overview.html)
- [MDN - SVG Reference](https://developer.mozilla.org/en-US/docs/Web/SVG)
  - [MDN - SVG Animation](https://developer.mozilla.org/en-US/docs/Web/SVG/SVG_animation_with_SMIL)
- [MDN - SVG Tutorial](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Basic_Shapes)
- https://en.wikipedia.org/wiki/Solar_System
