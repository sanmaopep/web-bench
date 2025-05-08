# web-bench-vite

## Tasks

1. Initialize project
2. Add path alias
3. Global variable replacement
4. SPA history fallback
5. Browser compatibility
6. Proxy
7. Using images
8. Using CSS/Less/CSS Modules
9. Using TypeScript
10. Using React/Vue
11. Hide sourcemap files
12. Remove all console.log call expressions
13. Extract licenses into standalone file
14. In-memory virtual module
15. Support mock in dev server
16. Compress images
17. Support importing compiled HTML from markdown files
18. Support importing frontmatter from markdown files
19. Handle assets resolving inside markdown files
20. Add i18n feature for markdown file

## Features

104 config items in total

### Shared Options (33)

| Config Item                           | Coverage |
|---------------------------------------|----------|
| root                                  | no      |
| base                                  | ✅      |
| mode                                  | no      |
| define                                | ✅      |
| plugins                               | ✅      |
| publicDir                             | no      |
| cacheDir                              | no      |
| resolve.alias                         | ✅      |
| resolve.dedupe                        | no      |
| resolve.conditions                    | no      |
| resolve.mainFields                    | no      |
| resolve.extensions                    | no      |
| resolve.preserveSymlinks              | no      |
| html.cspNonce                         | no      |
| css.modules                           | no      |
| css.postcss                           | no      |
| css.preprocessorOptions               | no      |
| css.preprocessorOptions[extension].additionalData | no      |
| css.preprocessorMaxWorkers            | no      |
| css.devSourcemap                      | no      |
| css.transformer                       | no      |
| css.lightningcss                      | no      |
| json.namedExports                     | no      |
| json.stringify                        | no      |
| esbuild                               | no      |
| assetsInclude                         | no      |
| logLevel                              | no      |
| customLogger                          | no      |
| clearScreen                           | no      |
| envDir                                | no      |
| envPrefix                             | no      |
| appType                               | no      |
| future                                | no      |

### Server Options (18)

| Config Item                           | Coverage |
|---------------------------------------|----------|
| server.host                           | ✅      |
| server.allowedHosts                   | no      |
| server.port                           | ✅      |
| server.strictPort                     | no      |
| server.https                          | no      |
| server.open                           | no      |
| server.proxy                          | ✅      |
| server.cors                           | no      |
| server.headers                        | no      |
| server.hmr                            | no      |
| server.warmup                         | no      |
| server.watch                          | no      |
| server.middlewareMode                 | no      |
| server.fs.strict                      | no      |
| server.fs.allow                       | no      |
| server.fs.deny                        | no      |
| server.origin                         | no      |
| server.sourcemapIgnoreList            | no      |

### Build Options (27)

| Config Item                                               | Coverage |
|-----------------------------------------------------------|----------|
| build.target                                              | ✅      |
| build.modulePreload                                       | no      |
| build.polyfillModulePreload                               | no      |
| build.outDir                                              | ✅      |
| build.assetsDir                                           | no      |
| build.assetsInlineLimit                                   | no      |
| build.cssCodeSplit                                        | no      |
| build.cssTarget                                           | no      |
| build.cssMinify                                           | no      |
| build.sourcemap                                           | ✅      |
| build.rollupOptions                                       | ✅      |
| build.commonjsOptions                                     | no      |
| build.dynamicImportVarsOptions                            | no      |
| build.lib                                                 | no      |
| build.manifest                                            | no      |
| build.ssrManifest                                         | no      |
| build.ssr                                                 | no      |
| build.emitAssets                                          | no      |
| build.ssrEmitAssets                                       | no      |
| build.minify                                              | no      |
| build.terserOptions                                       | no      |
| build.write                                               | no      |
| build.emptyOutDir                                         | no      |
| build.copyPublicDir                                       | no      |
| build.reportCompressedSize                                | no      |
| build.chunkSizeWarningLimit                               | no      |
| build.watch                                               | no      |

### Preview Options (9)

| Config                        | Coverage |
|-------------------------------|----------|
| preview.host                  | no      |
| preview.allowedHosts          | no      |
| preview.port                  | no      |
| preview.strictPort            | no      |
| preview.https                 | no      |
| preview.open                  | no      |
| preview.proxy                 | no      |
| preview.cors                  | no      |
| preview.headers               | no      |

### Dep Optimization Options (8)

| Config Item                              | Coverage |
|------------------------------------------|----------|
| optimizeDeps.entries                     | no      |
| optimizeDeps.exclude                     | no      |
| optimizeDeps.include                     | no      |
| optimizeDeps.esbuildOptions              | no      |
| optimizeDeps.force                       | no      |
| optimizeDeps.holdUntilCrawlEnd           | no      |
| optimizeDeps.disabled                    | no      |
| optimizeDeps.needsInterop                | no      |

### SSR Options (6)

| Config Item                          | Coverage |
|--------------------------------------|----------|
| ssr.external                         | no      |
| ssr.noExternal                       | no      |
| ssr.target                           | no      |
| ssr.resolve.conditions               | no      |
| ssr.resolve.externalConditions       | no      |
| ssr.resolve.mainFields               | no      |

### Worker Options (3)

| Config Item            | Coverage |
|------------------------|----------|
| worker.format          | no      |
| worker.plugins         | no      |
| worker.rollupOptions   | no      |