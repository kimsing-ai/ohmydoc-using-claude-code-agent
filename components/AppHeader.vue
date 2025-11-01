<template>
  <header>
    <UContainer class="py-4">
      <div class="flex items-center justify-between">
        <!-- Left action slot (for Format, Clear, Import buttons - MVP 8) -->
        <div class="flex items-center gap-2" data-testid="header-left-actions">
          <slot name="left-actions" />
        </div>

        <!-- App Title -->
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          OhMyDoc
        </h1>

        <!-- Right action slot (for Export and Zoom buttons - MVP 7 & 9) -->
        <div class="flex items-center gap-2" data-testid="header-right-actions">
          <slot name="right-actions" />
        </div>
      </div>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
// AppHeader component using @nuxt/ui
// Empty action slots will be populated in future MVPs:
// - left-actions: Format, Clear, Import buttons (MVP 8)
// - right-actions: Export (MVP 7), Zoom (MVP 9)
</script>
