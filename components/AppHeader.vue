<template>
  <UContainer class="py-4 border-b border-gray-200 dark:border-gray-800">
    <div class="flex items-center justify-between">
      <!-- Left action slot for future buttons (Format, Clear, Import - MVP 8) -->
      <div class="flex items-center gap-2">
        <slot name="left-actions" />
      </div>

      <!-- App Title -->
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">
        OhMyDoc
      </h1>

      <!-- Right action slot for future buttons (Export, Zoom - MVPs 7 & 9) -->
      <div class="flex items-center gap-2">
        <slot name="right-actions" />
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
// AppHeader component using @nuxt/ui
// Provides app title and empty action slots for future features
// - Left slot: Format, Clear, Import buttons (MVP 8)
// - Right slot: Export and Zoom buttons (MVPs 7 & 9)
</script>
