// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  runtimeConfig: {
    DB_HOST: process.env.DB_HOST,
  },
}) 