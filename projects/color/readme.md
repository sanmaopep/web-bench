# Web Color

## [Evaluate](../readme.md)

## Introduction

from [W3C - CSS Color Module Level 5](https://drafts.csswg.org/css-color-5/)

> Web developers, design tools and design system developers often use color functions to assist in scaling the design of their component color relations. With the increasing usage of design systems that support multiple platforms and multiple user preferences, like the increased capability of Dark Mode in UI, this becomes even more useful to not need to manually set color, and to instead have a single source from which schemes are calculated.
>
> Currently Sass, calc() on HSL values, or PostCSS is used to do this. However, preprocessors are unable to work on dynamically adjusted colors;

## Project Design

We will create several color palettes with different color modes.

Tasks:

1. RGB Color
2. RGB Color
3. HSL Color
4. LAB Color
5. LCH Color
6. OKLAB Color
7. OKLCH Color
8. HWB Color
9. light-dark()
10. Relative Color
11. Color Contrast
12. HSL Color Pallete
13. HSL Color Pallete
14. HSL Color Pallete
15. ... more

## Feature Coverage

| CSS Property          | Used |
| --------------------- | ---- |
| `color`             | ✅   |
| background-color      | ✅   |
| border-color          | ✅   |
| text-decoration-color |      |
| text-emphasis-color   |      |
| caret-color           |      |
| outline-color         |      |
| box-shadow            | ✅   |
| text-shadow           |      |
| column-rule-color     |      |

| CSS Value     | Used |
| ------------- | ---- |
| #rrggbbaa     | ✅   |
| Named Colors  | ✅   |
| rgb()         | ✅   |
| hsl()         | ✅   |
| hwb()         | ✅   |
| var()         | ✅   |
| lab()         | ✅   |
| lch()         | ✅   |
| oklab()       | ✅   |
| oklch()       | ✅   |
| color()       |      |
| currentColor  |      |
| device-cmyk() |      |
| light-dark()  | ✅   |
| color-mix()   |      |

## Reference

- [CSS Color Module Level 5](https://drafts.csswg.org/css-color-5/)
- [MDN CSS Colors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors)
  - [MDN Reference - color values](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)
  - [MDN -Applying color to HTML elements using CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Applying_color)
  - [WCAG Color Contrast](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Perceivable/Color_contrast)
- [CSS-Tricks Tutorial](https://css-tricks.com/nerds-guide-color-web/)
