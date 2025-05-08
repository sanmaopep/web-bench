import { defineConfig, presetAttributify, presetWind3, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetAttributify({ /* preset options */}),
    // presetWind3(),
    presetWind4(),
    // ...custom presets
  ],
})