# CSS Selector

## [Evaluate](../readme.md)

## Introduction

from [CSS Selectors Level 4](https://drafts.csswg.org/selectors/)

> [Selectors](https://drafts.csswg.org/selectors/#selector) are patterns that match against elements in a tree, and as such form one of several technologies that can be used to select nodes in a document.
>
> They are a core component of CSS (Cascading Style Sheets), which uses Selectors to bind style properties to elements in the document.

## Project Design

We will create a page with complex DOM structure to test different types of selectors and specificities.

Tasks:

1. Type/Class/ID Selector
2. Compound Selector
3. Selector list
4. Combinator
5. Combinator
6. Pseudo Class, DOM Tree
7. Nesting Selector
8. Pseudo Class
9. Pseudo Class
10. Pseudo Element
11. Specificity
12. Specificity
13. Specificity
14. Pseudo Class, Form
15. Pseudo Class, Link
16. Nested Structure
17. :is()
18. :is() Deep Levels
19. :is() Deep Levels
20. :is() Deep Levels

## Feature Coverage

| CSS Selector           | Used |
| ---------------------- | ---- |
| `*`                  | ✅   |
| `E`                  | ✅   |
| `#id`                | ✅   |
| `.class`             | ✅   |
| `E.class1.class2`    | ✅   |
| `sel1, sel2`         | ✅   |
| `E F`                | ✅   |
| `E > F`              | ✅   |
| `E + F`              | ✅   |
| `E ~ F`              | ✅   |
| `E[foo]`             | ✅   |
| `E[foo="bar"]`       | ✅   |
| `E[foo~="bar"]`      | ✅   |
| `E[foo^="bar"]`      | ✅   |
| `E[foo$="bar"]`      | ✅   |
| `E[foo*="bar"]`      | ✅   |
| `E[foo\|="bar"]`      | ✅   |
| `:link`              | ✅   |
| `:visited`           | ✅   |
| `:target`            | ✅   |
| `:active`            | ✅   |
| `:hover`             | ✅   |
| `:focus`             | ✅   |
| `:focus-within`      | ✅   |
| `:enabled`           | ✅   |
| `:disabled`          | ✅   |
| `:default`           | -    |
| `:checked`           | -    |
| `:valid`             | ✅   |
| `:invalid`           | ✅   |
| `:required`          | ✅   |
| `:optional`          | ✅   |
| `:root`              | -    |
| `:empty`             | ✅   |
| `:nth-child(n)`      | ✅   |
| `:nth-last-child(n)` | ✅   |
| `:only-child`        | -    |
| `::before`           | ✅   |
| `::after`            | ✅   |
| `:is()`              | ✅   |
| `:where()`           | -    |
| `:has()`             | ✅   |
| `:not()`             | ✅   |

## Reference

- [CSS Selectors Level 4](https://drafts.csswg.org/selectors/)
- [MDN CSS Selectors Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors)
  - [MDN CSS Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity)
  - [MDN CSS Selector Structure](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors/Selector_structure)
- [MDN CSS Selectors Tutorial](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors/Selectors_and_combinators)
