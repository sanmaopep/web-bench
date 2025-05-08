# Grid Layout

## [Evaluate](../readme.md)

## Introduction

from https://drafts.csswg.org/css2/#floats

> A float is a box that is shifted to the left or right on the current line. The most interesting characteristic of a float (or "floated" or "floating" box) is that content may flow along its side (or be prohibited from doing so by the [clear](https://drafts.csswg.org/css2/#propdef-clear) property). Content flows down the right side of a left-floated box and down the left side of a right-floated box.

from https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Floats

> Originally for floating images inside blocks of text, the [`float`](https://developer.mozilla.org/en-US/docs/Web/CSS/float) property became one of the most commonly used tools for creating multiple column layouts on webpages. With the advent of flexbox and grid it's now returned to its original purpose.

## Feature Coverage

| CSS Property/Value                                           | Used |
| ------------------------------------------------------------ | ---- |
| [float](https://developer.mozilla.org/en-US/docs/Web/CSS/float) | ✅   |
| -- left                                                      | ✅   |
| -- right                                                    | ✅   |
| -- none                                                     | ✅   |
| -- inline-start                                              | -    |
| -- inline-end                                               | -    |
| [clear](https://developer.mozilla.org/en-US/docs/Web/CSS/clear) | ✅   |
| -- left                                                      | -    |
| -- right                                                    | -    |
| -- both                                                      | ✅   |
| -- none                                                     | ✅   |

## Reference

- [W3C - CSS Level 2 Revision 2](https://drafts.csswg.org/css2/#floats)
- [MDN - Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/float)
- [MDN - Tutorial](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Floats)
- [CSS-Tricks Tutorial](https://css-tricks.com/all-about-floats/)
