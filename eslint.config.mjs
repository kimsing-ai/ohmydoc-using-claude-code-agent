// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  {
    rules: {
      // Disable multi-word-component-names for pages directory (Nuxt pages use file-based routing)
      'vue/multi-word-component-names': ['error', {
        ignores: ['index', 'parser']
      }]
    }
  }
)
