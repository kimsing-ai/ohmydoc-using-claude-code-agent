<template>
  <div class="container mx-auto p-8">
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <UButton
          to="/"
          color="gray"
          variant="ghost"
          icon="i-heroicons-arrow-left"
        >
          Back to Home
        </UButton>
      </div>

      <UCard>
        <template #header>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            XML Parser Demo
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Component demo page for MVP 2 - XML Parser testing
          </p>
        </template>

        <div class="space-y-4">
          <p class="text-gray-700 dark:text-gray-300">
            This page will demonstrate XML parsing functionality in MVP 2.
          </p>

          <UAlert
            color="blue"
            variant="soft"
            title="Coming Soon"
            description="XML parser component will be implemented in MVP 2"
          />
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// Debug page for XML Parser (MVP 2)
// This page demonstrates the useXmlParser composable in isolation

useHead({
  title: 'XML Parser Demo - OhMyDoc'
});
</script>
