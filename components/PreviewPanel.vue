<template>
  <div class="preview-panel">
    <!-- Error Display using @nuxt/ui UAlert -->
    <UAlert
      v-if="error"
      color="red"
      variant="solid"
      title="XML Parsing Error"
      :description="error"
      icon="i-heroicons-exclamation-triangle"
      class="error-alert"
    />

    <!-- Loading State -->
    <div v-else-if="isLoading" class="loading-state">
      <p>Parsing XML...</p>
    </div>

    <!-- Preview Rendering with Zoom Transform -->
    <div
      v-else-if="parsedData && templateComponent"
      class="preview-container"
      :style="containerStyle"
    >
      <component :is="templateComponent" :data="parsedData" />
    </div>

    <!-- Placeholder State (no data) -->
    <div v-else class="placeholder-state">
      <p>No content to preview. Please provide valid XML.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Component } from 'vue'
import { useXmlParser } from '~/composables/useXmlParser'
import { getCurrentTemplate } from '~/composables/useTemplate'
import type { ParsedData } from '~/composables/useXmlParser'

// Ensure this component only runs on the client side (DOMParser is browser-only)
defineOptions({
  name: 'PreviewPanel',
})

/**
 * PreviewPanel Component
 *
 * Integration point combining XML parser (MVP 2) and template system (MVP 3).
 * Provides real-time preview of XML content with error handling and zoom support.
 *
 * Props:
 * - xmlContent: XML string to parse and render
 * - zoom: Zoom level for scaling (default: 1, range: 0.75 - 1.5)
 */

interface Props {
  xmlContent: string
  zoom?: number
}

const props = withDefaults(defineProps<Props>(), {
  zoom: 1,
})

// Reactive state
const parsedData = ref<ParsedData | undefined>(undefined)
const error = ref<string | undefined>(undefined)
const isLoading = ref(false)
const templateComponent = ref<Component | undefined>(undefined)

// Get composables
const { parseXml } = useXmlParser()

// Computed style for zoom transform
const containerStyle = computed(() => ({
  transform: `scale(${props.zoom})`,
  transformOrigin: 'top left',
}))

/**
 * Parse XML and update component state
 * Handles all parsing errors gracefully with user-friendly messages
 */
function updatePreview() {
  // Reset state
  isLoading.value = true
  error.value = undefined
  parsedData.value = undefined
  templateComponent.value = undefined

  try {
    // Get the current template component
    templateComponent.value = getCurrentTemplate()

    // Parse XML content
    const result = parseXml(props.xmlContent)

    if (result.success && result.data) {
      // Success: update parsed data
      parsedData.value = result.data
      error.value = undefined
    }
    else {
      // Parsing failed: show user-friendly error
      error.value = result.error || 'Unknown parsing error occurred'
      parsedData.value = undefined
    }
  }
  catch (err) {
    // Catch any unexpected errors (e.g., template not found)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    error.value = `Preview error: ${errorMessage}`
    parsedData.value = undefined
  }
  finally {
    isLoading.value = false
  }
}

// Watch for changes to xmlContent and re-parse automatically
watch(
  () => props.xmlContent,
  () => {
    updatePreview()
  },
  { immediate: true },
)
</script>

<style scoped>
.preview-panel {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: var(--color-gray-50);
  padding: 1rem;
}

.error-alert {
  margin-bottom: 1rem;
}

.loading-state,
.placeholder-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--color-gray-600);
}

.preview-container {
  width: fit-content;
  min-width: 100%;
  /* Ensure zoom transform doesn't clip content */
  padding-bottom: 2rem;
}
</style>
