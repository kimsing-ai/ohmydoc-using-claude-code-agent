<template>
  <div class="container mx-auto p-8">
    <div class="max-w-2xl mx-auto text-center">
      <h2 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Welcome to OhMyDoc
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        XML-to-HTML real-time transformer application
      </p>
      <div class="space-y-4">
        <UCard>
          <template #header>
            <h3 class="text-xl font-semibold">Debug Pages</h3>
          </template>
          <div class="space-y-2">
            <UButton
              to="/debug/parser"
              color="primary"
              variant="soft"
              block
            >
              XML Parser Demo
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Main application page
// This will be replaced with the dual-panel editor/preview in MVP 6
</script>
