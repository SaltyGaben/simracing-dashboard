export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/ui',
    'convex-nuxt',
    'nuxt-charts'
  ],
  convex: {
    url: process.env.CONVEX_URL
  },
  devtools: { enabled: true }
})