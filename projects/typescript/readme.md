# TypeScript

## [Evaluate](../readme.md)

## Introduction

from http://typescriptlang.org/docs/handbook/typescript-from-scratch.html#typescript-a-static-type-checker

> **TypeScript: A Static Type Checker**
>
> We said earlier that some languages wouldn’t allow those buggy programs to run at all. Detecting errors in code without running it is referred to as _static checking_. Determining what’s an error and what’s not based on the kinds of values being operated on is known as static _type_ checking.
>
> TypeScript checks a program for errors before execution, and does so based on the _kinds of values_, making it a _static type checker_.

from https://developer.mozilla.org/en-US/docs/Glossary/TypeScript

> TypeScript is a programming language that adds [static type checking](https://developer.mozilla.org/en-US/docs/Glossary/Static_typing) to JavaScript.
>
> TypeScript is a superset of JavaScript, meaning that everything available in JavaScript is also available in TypeScript, and that every JavaScript program is a syntactically legal TypeScript program. Also, the runtime behavior of TypeScript and JavaScript is identical.
>
> However, TypeScript adds compile time type checking, implementing rules about how different types can be used and combined. This catches a wide variety of programming errors that in JavaScript are only encountered at runtime.

## Project Design

### Tasks

### Feature Coverage

#### Types

| Feature                          | Used |
| -------------------------------- | ---- |
| Basics (string, number, boolean) | ✅    |
| Arrays                           | ✅    |
| Functions                        | ✅    |
| Object                           | ✅    |
| Union Types                      | ✅    |
| Type Aliases                     | ✅    |
| Interfaces                       | ✅    |
| Type Assertions                  | ✅    |
| Literal Types                    | ✅    |
| Null and Undefined               | ✅    |
| Enums                            |      |
| Less Common Primitives           |      |

#### Narrowing

| Feature                     | Used |
| --------------------------- | ---- |
| Equality narrowing          | ✅    |
| The `in` operator narrowing |      |
| `instanceof` narrowing      |      |
| Assignments                 |      |
| Control flow analysis       |      |
| Using type predicates       | ✅    |
| Discriminated unions        |      |
| `never` type                | ✅    |
| Exhaustiveness checking     |      |

#### Functions

| Feature                        | Used |
| ------------------------------ | ---- |
| Function Type Expressions      | ✅    |
| Call Signatures                |      |
| Construct Signatures           |      |
| Generic Functions              | ✅    |
| Optional Parameters            | ✅    |
| Function Overloads             |      |
| Declaring `this` in a Function |      |
| Rest Parameters and Arguments  | ✅    |
| Parameter Destructuring        |      |

#### Object Types

| Feature                | Used |
| ---------------------- | ---- |
| Quick Reference        | ✅    |
| Property Modifiers     |      |
| Excess Property Checks |      |
| Extending Types        | ✅    |
| Intersection Types     |      |
| Generic Object Types   |      |

#### Type Manipulation

| Feature                | Used |
| ---------------------- | ---- |
| Generics               | ✅    |
| Keyof Type Operator    | ✅    |
| Typeof Type Operator   |      |
| Indexed Access Types   |      |
| Conditional Types      | ✅    |
| Mapped Types           | ✅    |
| Template Literal Types | ✅    |

#### Classes

| Feature                        | Used |
| ------------------------------ | ---- |
| Class Members                  |      |
| Class Heritage                 |      |
| Member Visibility              |      |
| Static Members                 |      |
| `static` Blocks in Classes     |      |
| Generic Classes                |      |
| `this` at Runtime in Classes   |      |
| `this` Types                   |      |
| Parameter Properties           |      |
| Class Expressions              |      |
| Constructor Signatures         |      |
| `abstract` Classes and Members |      |

## Reference

- https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html
- https://developer.mozilla.org/en-US/docs/Glossary/TypeScript
- https://www.typescriptlang.org/docs/handbook/intro.html
