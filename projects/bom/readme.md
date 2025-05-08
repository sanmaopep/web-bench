# @web-bench/bom

## [Evaluate](../readme.md)

## Introduction

BOM (Browser Object Model) is the core part of JavaScript on the web. BOM contains many modern browser features, like Window, Location, History, Navigator, Timer, Dialog and more.

From [MDN - Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) (Window)

> The `Window` interface is home to a variety of functions, namespaces, objects, and constructors which are not necessarily directly associated with the concept of a user interface window.

## Feature Coverage

| Feature                                                       | Used |
| ------------------------------------------------------------- | ---- |
| window                                                        | ✅   |
| -- window.open() / close() / stop() / closed                 | ✅   |
| -- window.top / self  / parent / opener                     | ✅   |
| -- window.alert() / confirm() / prompt()                      | ✅   |
| -- window.postMessage / Event 'message'                       | ✅   |
| -- Event: visibilitychange / document.hidden/visibilityState | ✅   |
| -- Event: beforeunload / unload / load                       | ✅   |
| -- Event: online / offline                                    | ✅   |
| document                                                      | ✅   |
| -- FullScreen                                                 | ✅   |
| -- Selection / Range                                          | ✅   |
| -- Clipboard                                                  | -    |
| -- More                                                       | -    |
| navigation                                                    | ✅   |
| -- canGoBack / canGoForward                                   | ✅   |
| -- currentEntry / entries()                                   | ✅   |
| -- back() / forward() / traverseTo()                          | ✅   |
| -- navigate() / reload()                                      | ✅   |
| -- Event: navigate / currententrychange                       | -    |
| location                                                      | ✅   |
| -- href                                                       | ✅   |
| -- reload / replace / assign                                 | -    |
| history                                                       | ✅   |
| -- length                                                     | -    |
| -- go() / back() / forward()                                  | ✅   |
| -- pushState() / popState() / state                           | -    |
| navigator                                                     | ✅   |
| -- userAgent                                                  | -    |
| -- Geolocation                                                | ✅   |
| -- DeviceMotion                                               | -    |
| -- DeviceOrientation                                          | -    |
| -- More                                                       | -    |

## Project Design

We will create a minimal Document Browser.

### Tasks

1. Doc Browser
2. Topbar
3. Docs & Address
4. Toolbar
5. canGoBack, canGoForward
6. Sync Address and Iframe
7. Doc Reading time
8. beforeunload
9. Theme
10. Doc History
11. Doc History
12. Iframe
13. window.open/top
14. window.close/opener
15. window.open/parent
16. postMessage
17. Event online/offline
18. Geolocation
19. FullScreen
20. Range

## Reference

- [WHATWG HTML Standard](https://html.spec.whatwg.org/multipage/nav-history-apis.html#the-window-object)
- [MDN - Reference](https://developer.mozilla.org/en-US/docs/Web/API/Window#interfaces)
