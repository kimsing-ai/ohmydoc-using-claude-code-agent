<template>
  <div class="container mx-auto p-8">
    <div class="max-w-6xl mx-auto">
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
            Monaco XML Editor Demo
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Component demo page for MVP 4 - Testing XmlEditor component with Monaco editor
          </p>
        </template>

        <div class="space-y-6">
          <!-- Loading State -->
          <UAlert
            v-if="isLoading"
            color="blue"
            variant="soft"
            title="Loading Sample XML"
            description="Fetching sample cover letter from /samples/cover-letter.xml..."
          />

          <!-- Load Error -->
          <UAlert
            v-if="loadError"
            color="red"
            variant="solid"
            title="Load Error"
            :description="loadError"
            :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'white', variant: 'link', padded: false }"
            @close="loadError = null"
          />

          <!-- Editor Controls -->
          <div class="flex justify-between items-center">
            <div class="flex gap-2">
              <UButton
                color="gray"
                variant="soft"
                size="sm"
                :disabled="isLoading"
                icon="i-heroicons-arrow-path"
                @click="loadSample"
              >
                Reset to Sample
              </UButton>
              <UButton
                color="gray"
                variant="soft"
                size="sm"
                icon="i-heroicons-trash"
                @click="clearEditor"
              >
                Clear
              </UButton>
            </div>
          </div>

          <!-- Monaco Editor Component -->
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <XmlEditor
              v-model="editorContent"
              height="500px"
              @error="handleEditorError"
            />
          </div>

          <!-- Editor Statistics -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Editor Statistics
              </h3>
            </template>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div class="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {{ statistics.lineCount }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Lines
                </div>
              </div>
              <div class="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div class="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {{ statistics.characterCount }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Characters
                </div>
              </div>
              <div class="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div class="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {{ statistics.wordCount }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Words
                </div>
              </div>
            </div>
          </UCard>

          <!-- Editor Features Status -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Monaco Editor Features
              </h3>
            </template>
            <div class="space-y-2 text-sm">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="text-green-500" />
                <span class="text-gray-700 dark:text-gray-300">XML Syntax Highlighting</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="text-green-500" />
                <span class="text-gray-700 dark:text-gray-300">Line Numbers</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="text-green-500" />
                <span class="text-gray-700 dark:text-gray-300">Auto-Indentation</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="text-green-500" />
                <span class="text-gray-700 dark:text-gray-300">Auto-Closing Tags</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="text-green-500" />
                <span class="text-gray-700 dark:text-gray-300">Bracket Matching</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="text-green-500" />
                <span class="text-gray-700 dark:text-gray-300">IntelliSense / Code Completion</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle" class="text-green-500" />
                <span class="text-gray-700 dark:text-gray-300">v-model Two-Way Binding</span>
              </div>
            </div>
          </UCard>

          <!-- Instructions -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                How to Use
              </h3>
            </template>
            <div class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>1. Sample XML:</strong> Sample XML is loaded automatically on page load</p>
              <p><strong>2. Edit Content:</strong> Type in the editor to see real-time statistics updates (demonstrates v-model reactivity)</p>
              <p><strong>3. XML Features:</strong> Test XML-specific features like auto-closing tags, syntax highlighting, and bracket matching</p>
              <p><strong>4. Reset:</strong> Click "Reset to Sample" to reload the original sample XML</p>
              <p><strong>5. Clear:</strong> Click "Clear" to start with an empty editor</p>
              <p><strong>6. Observe:</strong> Notice how statistics update in real-time as you type, demonstrating v-model two-way binding</p>
            </div>
          </UCard>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// Debug page for XmlEditor Component (MVP 4)
// This page demonstrates the XmlEditor component in isolation
// Tests: v-model binding, XML features, editor statistics

useHead({
  title: 'Monaco XML Editor Demo - OhMyDoc',
})

// Reactive state
const editorContent = ref('')
const isLoading = ref(false)
const loadError = ref<string | null>(null)
const sampleXml = ref('')

// Editor statistics computed from content
const statistics = computed(() => {
  const content = editorContent.value

  return {
    lineCount: content ? content.split('\n').length : 0,
    characterCount: content.length,
    wordCount: content.trim() ? content.trim().split(/\s+/).length : 0
  }
})

// Load sample XML from /public/samples/cover-letter.xml
async function loadSample() {
  isLoading.value = true
  loadError.value = null

  try {
    const response = await fetch('/samples/cover-letter.xml')

    if (!response.ok) {
      throw new Error(`Failed to load sample: ${response.status} ${response.statusText}`)
    }

    const xmlContent = await response.text()
    sampleXml.value = xmlContent
    editorContent.value = xmlContent
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    loadError.value = `Failed to load sample XML: ${errorMessage}`
  }
  finally {
    isLoading.value = false
  }
}

// Clear editor content
function clearEditor() {
  editorContent.value = ''
  loadError.value = null
}

// Handle editor errors
function handleEditorError(error: string) {
  loadError.value = error
}

// Load sample XML on component mount
onMounted(() => {
  loadSample()
})
</script>
