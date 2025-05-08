# web-bench-svg

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

We will create a minimal draw application. Typical draw features are:

1. Shapes: Line, Rectangle, Ellipse, Circle, Polyline, Polygon, Path, Text
2. Common Property: LineWidth, Color
3. Operations: Move, Rotate, Zoom, Delete, Copy, Fill

### Tasks

1. Draw Line
2. Draw Rect
3. Draw Circle
4. Draw Ellipse
5. Delete Shape
6. Fill Shape
7. Copy Shape
8. Minimal Line and Rect
9. Minimal Circle and Ellipse
10. Draw Triangle
11. Draw Trapezoid
12. Draw Hexagon
13. Draw Curve (Path)
14. Draw Polyline
15. Draw Text
16. Move Shape
17. Shortcuts
18. Rotate Shape
19. Zoom Shape
20. Combined Action

### Feature Coverage

| SVG Tags                 | Used |
| ------------------------ | ---- |
| Shapes & Path            | -    |
| `<rect>`               | ✅   |
| `<circle>`             | ✅   |
| `<ellipse>`            | ✅   |
| `<line>`               | ✅   |
| `<polyline>`           | ✅   |
| `<polygon>`            | ✅   |
| `<path>`               | ✅   |
| Text                     | -    |
| `<text>`               | ✅   |
| `<tspan>`              | ❌   |
| `<textPath>`           | ❌   |
| Document Structure       | -    |
| `<svg>`                | ✅   |
| `<g>`                  |      |
| `<defs>`               |      |
| `<symbol>`             |      |
| `<use>`                |      |
| `<title>`              |      |
| `<desc>`               |      |
| `<switch>`             |      |
| `<a>`                  |      |
| `<view>`               |      |
| Embedded Content         |      |
| `<image>`              |      |
| `<foreignObject>`      |      |
| Animation (SMIL)         |      |
| `<animate>`            |      |
| `  <animateMotion>`    |      |
| `  <animateTransform>` |      |
| `  <set>`              |      |
| Styles                   |      |
| `<linearGradient>`     |      |
| `<radialGradient>`     |      |
| `<pattern>`            |      |
| `<marker>`             |      |
| `<filter>`             |      |
| `<clipPath>`           |      |
| `<mask>`               |      |
| color                    | ✅   |
| transform                | ✅   |
| transform-origin         | ✅   |
| fill                     | ✅   |
| fill-rule                | ❌   |
| fill-opacity             | ❌   |
| stroke                   | ✅   |
| stroke-width             | ✅   |
| stroke-linecap           |      |
| stroke-linejoin          |      |
| stroke-miterlimit        |      |
| stroke-dasharray         |      |
| stroke-dashoffset        |      |
| stroke-opacity           |      |

## Reference

- [W3C -SVG 2](https://svgwg.org/svg2-draft/Overview.html)
- [MDN - SVG Reference](https://developer.mozilla.org/en-US/docs/Web/SVG)
  - [MDN - SVG Animation](https://developer.mozilla.org/en-US/docs/Web/SVG/SVG_animation_with_SMIL)
- [MDN - SVG Tutorial](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Basic_Shapes)
- [CSS-Tricks - SVG Tutorial](https://css-tricks.com/using-svg/)
