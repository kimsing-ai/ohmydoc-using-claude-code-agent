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
            XML Parser Demo
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Component demo page for MVP 2 - XML Parser testing with native DOMParser API
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

          <!-- Validation Error -->
          <UAlert
            v-if="validationError"
            color="red"
            variant="solid"
            title="Validation Error"
            :description="validationError"
            :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'white', variant: 'link', padded: false }"
            @close="validationError = null"
          />

          <!-- Parse Success Message -->
          <UAlert
            v-if="parseSuccess"
            color="green"
            variant="soft"
            title="Parse Successful"
            description="XML has been successfully parsed into structured data"
            :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'green', variant: 'link', padded: false }"
            @close="parseSuccess = false"
          />

          <!-- XML Input Section -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                XML Input
              </label>
              <div class="flex gap-2">
                <UButton
                  color="gray"
                  variant="soft"
                  size="xs"
                  :disabled="isLoading"
                  @click="loadSample"
                >
                  Reload Sample
                </UButton>
                <UButton
                  color="gray"
                  variant="soft"
                  size="xs"
                  @click="clearInput"
                >
                  Clear
                </UButton>
              </div>
            </div>
            <UTextarea
              v-model="xmlInput"
              :rows="15"
              placeholder="Paste XML content here or load the sample..."
              class="font-mono text-sm"
            />
          </div>

          <!-- Parse Button -->
          <div class="flex justify-center">
            <UButton
              color="primary"
              size="lg"
              :disabled="!xmlInput.trim() || isLoading"
              icon="i-heroicons-play"
              @click="handleParse"
            >
              Parse XML
            </UButton>
          </div>

          <!-- Parsed Data Output -->
          <div v-if="parsedData">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Parsed Data (JSON)
            </label>
            <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
              <pre class="text-xs font-mono text-gray-800 dark:text-gray-200">{{ formattedJson }}</pre>
            </div>
          </div>

          <!-- Instructions -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                How to Use
              </h3>
            </template>
            <div class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>1. Sample XML:</strong> Click "Reload Sample" to load the default cover letter XML</p>
              <p><strong>2. Edit XML:</strong> Modify the XML in the textarea to test different structures</p>
              <p><strong>3. Parse:</strong> Click "Parse XML" to transform XML into structured data</p>
              <p><strong>4. View Results:</strong> See the parsed JSON data below the button</p>
              <p><strong>5. Test Validation:</strong> Try invalid XML (missing tags, unclosed elements) to see error handling</p>
            </div>
          </UCard>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ParsedData } from '~/composables/useXmlParser'

// Debug page for XML Parser (MVP 2)
// This page demonstrates the useXmlParser composable in isolation

useHead({
  title: 'XML Parser Demo - OhMyDoc',
})

const { parseXml } = useXmlParser()

// Reactive state
const xmlInput = ref('')
const parsedData = ref<ParsedData | null>(null)
const validationError = ref<string | null>(null)
const parseSuccess = ref(false)
const isLoading = ref(false)

// Format JSON for display with proper indentation
const formattedJson = computed(() => {
  if (!parsedData.value) return ''
  return JSON.stringify(parsedData.value, null, 2)
})

// Load sample XML from /public/samples/cover-letter.xml
async function loadSample() {
  isLoading.value = true
  validationError.value = null
  parseSuccess.value = false

  try {
    const response = await fetch('/samples/cover-letter.xml')

    if (!response.ok) {
      throw new Error(`Failed to load sample: ${response.status} ${response.statusText}`)
    }

    const xmlContent = await response.text()
    xmlInput.value = xmlContent

    // Automatically parse the loaded sample
    handleParse()
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    validationError.value = `Failed to load sample XML: ${errorMessage}`
  }
  finally {
    isLoading.value = false
  }
}

// Clear input and reset state
function clearInput() {
  xmlInput.value = ''
  parsedData.value = null
  validationError.value = null
  parseSuccess.value = false
}

// Handle parse button click
function handleParse() {
  validationError.value = null
  parseSuccess.value = false
  parsedData.value = null

  if (!xmlInput.value.trim()) {
    validationError.value = 'Please provide XML content to parse'
    return
  }

  const result = parseXml(xmlInput.value)

  if (result.success && result.data) {
    parsedData.value = result.data
    parseSuccess.value = true
  }
  else {
    validationError.value = result.error || 'Unknown parsing error occurred'
  }
}

// Load sample XML on component mount
onMounted(() => {
  loadSample()
})
</script>
