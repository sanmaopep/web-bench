# @web-bench/esmodule

## [Evaluate](../readme.md)

## Introduction

From [v8 - JavaScript modules](https://v8.dev/features/modules)

> JS modules (also known as “ES modules” or “ECMAScript modules”) are a major new feature, ... All of these module systems have one thing in common: they allow you to import and export stuff. JavaScript now has standardized syntax for exactly that. Within a module, you can use the `export` keyword to export just about anything.

From [MDN - Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

> All modern browsers support module features natively without needing transpilation. It can only be a good thing — browsers can optimize loading of modules, making it more efficient than having to use a library and do all of that extra client-side processing and extra round trips.

From [ECMAScript Modules in Node.js](https://nodejs.org/api/esm.html)

> Modules are defined using a variety of import and export statements.

## Feature Coverage

| Feature                      | Used |
| ---------------------------- | ---- |
| export/import named          | ✅   |
| export/import default        | ✅   |
| import as (rename)           | ✅   |
| import * as namespace       | ✅   |
| Dynamic import()             | ✅   |
| globalThis                   | ✅   |
| Top-level await              | ✅   |
| import css                   | ✅   |
| import json                  | ✅   |
| import.meta                  | ✅   |
| import map                   | ✅   |
| `<script type="module" />` | ✅   |
| `<script nomodule />`      | -    |
| `<script defer />`         | -    |
| nodejs esm                   | ✅   |
| nodejs cjs                   | ✅   |

## Project Design

### Tasks

1. Export/Import Named Function
2. Export/Import Namespace
3. Export/Import Default
4. Export/Import Class
5. Export/Import SubClass
6. globalThis
7. Dynamic Import
8. Refactor
9. Refactor
10. Import JSON
11. Import CSS
12. Aggregating
13. Nodejs (Task 13-15)
14. Top-level await
15. Nodejs ESM & CJS
16. Import Map
17. Import Map Dir
18. Nodejs JSON Module
19. Nodejs Data URL
20. Multi Dynamic Import

## Reference

- [ECMAScript Language Specification](https://tc39.es/ecma262/#sec-modules)
- *[v8 - JavaScript modules](https://v8.dev/features/modules)*
  - https://v8.dev/features/top-level-await
- [ECMAScript Modules in Node.js](https://nodejs.org/api/esm.html)
- [MDN - Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [ES Modules - Cheatsheets](https://michaelcurrin.github.io/dev-cheatsheets/cheatsheets/javascript/general/modules/es-modules.html)
