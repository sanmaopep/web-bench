# web-bench-svg-chart

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

We will create a minimal Chart project to cover SVG basic shapes, document structures (e.g. `<g>`, `<defs>`, `<use>`...), animation and  more style elements (`<marker>`, `<pattern>`, `<filter>`..) and attributes (stroke-*).

### Tasks

1. Prepare Data
2. Chart SVG
3. LineChart Polylines
4. Axes
5. Axes Labels
6. Grids
7. Legends
8. Points
9. Data Labels
10. Smooth Lines
11. Tooltips
12. Scatter Chart
13. Click Legend
14. Step Chart
15. Area Chart
16. Bar Chart
17. Bar Chart DataLabel
18. Bar Chart Tooltip
19. Pie Chart
20. Pie Chart DataLabel

### Feature Coverage

Including [Project svg-solar](../svg-solar/readme.md) features.

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
| `<animateTransform>` | ✅   |
| `<set>`              | ❌   |
| Styles                 | -    |
| `<linearGradient>`   | ✅   |
| `<radialGradient>`   | ✅   |
| `<pattern>`          | ❌   |
| `<marker>`           | ✅   |
| `<filter>`           | ❌   |
| `<clipPath>`         | ✅   |
| `<mask>`             | ✅   |
| color                  | ✅   |
| transform              | ✅   |
| transform-origin       | ✅   |
| fill                   | ✅   |
| fill-rule              | ❌   |
| fill-opacity           | ✅   |
| stroke                 | ✅   |
| stroke-width           | ✅   |
| stroke-linecap         | ✅   |
| stroke-linejoin        | ✅   |
| stroke-miterlimit      | ❌   |
| stroke-dasharray       | ✅   |
| stroke-dashoffset      | ✅   |
| stroke-opacity         | ✅   |

## Reference

- [W3C -SVG 2](https://svgwg.org/svg2-draft/Overview.html)
- [MDN - SVG Reference](https://developer.mozilla.org/en-US/docs/Web/SVG)

  - [MDN - SVG Animation](https://developer.mozilla.org/en-US/docs/Web/SVG/SVG_animation_with_SMIL)
- [MDN - SVG Tutorial](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Basic_Shapes)
- [Chart.js DataStructure](https://www.chartjs.org/docs/latest/general/data-structures.html)
