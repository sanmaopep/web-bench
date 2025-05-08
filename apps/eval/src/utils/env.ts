import { Model } from '@web-bench/bench-agent'

export function loadEnvForModels(models: Model[]) {
  models.forEach((model) => {
    Object.entries(model).forEach(([key, value]) => {
      const matches = /^\{\{(.*)\}\}$/.exec(value)
      if (matches && process.env[matches[1]]) {
        model[key] = process.env[matches[1]]
      }
    })
  })

  return models
}
