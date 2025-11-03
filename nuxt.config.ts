// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/ui', 'nuxt-monaco-editor'],

  // Monaco Editor Configuration
  monacoEditor: {
    // Configure Monaco settings
    locale: 'en',
  },

  devServer: {
    port: 3002
  }
})