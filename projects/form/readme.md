# web-bench-form

## [Evaluate](../readme.md)

## Introduction

from [WHATWG HTML Spec](https://html.spec.whatwg.org/multipage/forms.html)

> A form is a component of a web page that has form controls, such as text, buttons, checkboxes, range, or color picker controls. A user can interact with such a form, providing data that can then be sent to the server for further processing (e.g. returning the results of a search or calculation).

from [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)

> The `<form>` HTML element represents a document section containing interactive controls for submitting information.

## Project Design

We will create a classic survey form to collect data.

Typical features are:

1. Survey page with controls
2. Types of questions

### Tasks

1. Question
2. Single-Selection Question
3. Multiple-Selection Question
4. Open-Ended Question (Text)
5. Rating Question (Stars)
6. Ranking Question
7. NPS Question (0-10)
8. Likert Question (Matrix)
9. Question Contents
10. Drag Question
11. SingleSelectionQuestion Validation
12. NpsQuestion, LikertQuestion, RatingQuestion Validation
13. OpenQuestion Validation
14. MultiSelectionQuestion Validation
15. Survey class
16. Question Sequence
17. DataQuestion and Validation
18. Single Select Mode
19. Shuffle Options
20. Export

### Feature Coverage

| Form & Controls | Used |
| --------------- | ---- |
| `<form>`      | ✅   |
| `<button>`    | ✅   |
| `<fieldset>`  | ✅   |
| `<legend>`   | ✅   |
| `<input>`     | ✅   |
| -- type: text   | ✅   |
| -- type: hidden | ✅   |
| -- type: date   | ✅   |
| -- type: number | ✅   |
| -- type: tel   | ✅   |
| -- type: email | ✅   |
| -- type: url   | ✅   |
| `<output>`    | -    |
| `<select>`    | ✅   |
| `<textarea>`  | ✅   |

| JS API                           | Used |
| -------------------------------- | ---- |
| HTMLFormElement                  | ✅   |
| HTMLFormElement.checkValidity()  | ✅   |
| HTMLFormElement.reportValidity() | ✅   |
| HTMLFormElement.reset()          | -    |
| HTMLFormElement.submit()         | ✅   |
| HTMLFormElement.elements         | -    |
| HTMLFormElement.action           | ✅   |
| HTMLFormElement.enctype          | -    |
| HTMLFormElement.autocomplete     | -    |
| HTMLFormElement.target           | ✅   |

## Reference

- [WHATWG - Living Standard](https://html.spec.whatwg.org/multipage/forms.html)
  - [Input](https://html.spec.whatwg.org/multipage/input.html#the-input-element)
- [MDN - Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
  - [HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement)
- [MDN - Tutorials](https://developer.mozilla.org/en-US/docs/Learn/Forms)
- [CSS-Tricks - Tutorial](https://css-tricks.com/tips-for-creating-great-web-forms/)
  - https://css-tricks.com/accessible-forms-with-pseudo-classes/
  - https://css-tricks.com/form-validation-part-1-constraint-validation-html/
