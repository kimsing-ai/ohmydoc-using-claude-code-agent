<template>
  <div class="debug-preview-page">
    <!-- Header -->
    <div class="page-header">
      <h1>Preview Panel Component Debug</h1>
      <p class="subtitle">Testing PreviewPanel with various XML scenarios (MVP 5)</p>
    </div>

    <!-- Controls Section -->
    <div class="controls-section">
      <!-- XML Sample Selector -->
      <div class="control-group">
        <label for="xml-select">Test XML Sample:</label>
        <USelect
          id="xml-select"
          v-model="selectedSample"
          :options="sampleOptions"
          placeholder="Select a test XML sample"
          size="lg"
        />
      </div>

      <!-- Zoom Controls -->
      <div class="control-group">
        <label>Zoom Level:</label>
        <div class="zoom-buttons">
          <UButton
            v-for="level in zoomLevels"
            :key="level"
            :color="currentZoom === level ? 'primary' : 'gray'"
            :variant="currentZoom === level ? 'solid' : 'outline'"
            @click="currentZoom = level"
          >
            {{ (level * 100).toFixed(0) }}%
          </UButton>
        </div>
      </div>
    </div>

    <!-- Parse Status Section -->
    <div class="status-section">
      <h3>Parse Status</h3>
      <div class="status-info">
        <p><strong>Sample:</strong> {{ getSampleDescription(selectedSample) }}</p>
        <p><strong>Status:</strong> {{ parseStatus }}</p>
        <p><strong>Field Count:</strong> {{ fieldCount }}</p>
      </div>
    </div>

    <!-- PreviewPanel Component -->
    <div class="preview-wrapper">
      <h3>Preview Output</h3>
      <ClientOnly>
        <PreviewPanel
          :xml-content="currentXmlContent"
          :zoom="currentZoom"
        />
        <template #fallback>
          <div class="loading-placeholder">
            Loading preview component...
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

defineOptions({
  name: 'DebugPreviewPage',
})

/**
 * Debug Page for PreviewPanel Component (MVP 5)
 *
 * Tests PreviewPanel with various XML scenarios:
 * 1. Valid sample XML
 * 2. Invalid syntax (unclosed tag)
 * 3. Empty XML
 * 4. Missing required fields
 * 5. Extra/unexpected fields
 *
 * Demonstrates error handling, zoom functionality, and reusability for MVP 6.
 */

// Valid sample XML
const validXml = `<applicationDocument formatStyle="modern">
    <applicant>
        <name>Jane Doe</name>
        <address>
            <street>123 Main Street</street>
            <city>Springfield</city>
            <state>IL</state>
            <zipCode>62704</zipCode>
        </address>
        <contactInformation>
            <phone>(555) 123-4567</phone>
            <email>jane.doe@email.com</email>
        </contactInformation>
    </applicant>
    <date>June 15, 2024</date>
    <recipient>
        <position>Hiring Manager</position>
        <company>Brightwave Marketing</company>
        <address>
            <street>789 Market Avenue</street>
            <city>Chicago</city>
            <state>IL</state>
            <zipCode>60601</zipCode>
        </address>
    </recipient>
    <letter>
        <salutation>Dear Hiring Manager,</salutation>
        <introduction>I am writing to express my interest in the Marketing Coordinator position at Brightwave Marketing.</introduction>
        <experienceSection>
            <experience>
                <employer>GreenLeaf Promotions</employer>
                <achievements>
                    <achievement>Managed multiple successful social media campaigns</achievement>
                    <achievement>Contributed to brand development strategies</achievement>
                </achievements>
            </experience>
        </experienceSection>
        <motivation>What excites me most about Brightwave Marketing is your commitment to creative and data-driven strategies.</motivation>
        <closing>Thank you for considering my application.</closing>
        <signature>Jane Doe</signature>
    </letter>
</applicationDocument>`

// Invalid syntax - unclosed tag
const invalidSyntaxXml = `<applicationDocument formatStyle="modern">
    <applicant>
        <name>Jane Doe</name>
        <address>
            <street>123 Main Street</street>
            <city>Springfield</city>
            <state>IL</state>
            <zipCode>62704
        </address>
    </applicant>
    <date>June 15, 2024</date>
</applicationDocument>`

// Empty XML
const emptyXml = ''

// Missing required fields (no applicant section)
const missingFieldsXml = `<applicationDocument>
    <date>June 15, 2024</date>
    <recipient>
        <position>Hiring Manager</position>
        <company>Brightwave Marketing</company>
        <address>
            <street>789 Market Avenue</street>
            <city>Chicago</city>
            <state>IL</state>
            <zipCode>60601</zipCode>
        </address>
    </recipient>
    <letter>
        <salutation>Dear Hiring Manager,</salutation>
        <introduction>This is missing the applicant section.</introduction>
        <experienceSection></experienceSection>
        <motivation>Testing error handling.</motivation>
        <closing>Thank you.</closing>
        <signature>Test User</signature>
    </letter>
</applicationDocument>`

// Extra unexpected fields
const extraFieldsXml = `<applicationDocument formatStyle="modern">
    <applicant>
        <name>Jane Doe</name>
        <title>Software Engineer</title>
        <favoriteColor>Blue</favoriteColor>
        <address>
            <street>123 Main Street</street>
            <city>Springfield</city>
            <state>IL</state>
            <zipCode>62704</zipCode>
        </address>
        <contactInformation>
            <phone>(555) 123-4567</phone>
            <email>jane.doe@email.com</email>
            <website>https://janedoe.com</website>
        </contactInformation>
    </applicant>
    <date>June 15, 2024</date>
    <recipient>
        <position>Hiring Manager</position>
        <company>Brightwave Marketing</company>
        <address>
            <street>789 Market Avenue</street>
            <city>Chicago</city>
            <state>IL</state>
            <zipCode>60601</zipCode>
        </address>
    </recipient>
    <letter>
        <salutation>Dear Hiring Manager,</salutation>
        <introduction>This document has extra fields that are not in the schema.</introduction>
        <experienceSection>
            <experience>
                <employer>Test Company</employer>
                <achievements>
                    <achievement>Test achievement</achievement>
                </achievements>
            </experience>
        </experienceSection>
        <motivation>Testing with additional unexpected fields.</motivation>
        <closing>Thank you.</closing>
        <signature>Jane Doe</signature>
    </letter>
</applicationDocument>`

// Sample options for dropdown
const sampleOptions = [
  { value: 'valid', label: '✓ Valid Sample XML' },
  { value: 'invalid-syntax', label: '✗ Invalid Syntax (Unclosed Tag)' },
  { value: 'empty', label: '✗ Empty XML' },
  { value: 'missing-fields', label: '✗ Missing Required Fields' },
  { value: 'extra-fields', label: '+ Extra/Unexpected Fields' },
]

// Zoom levels
const zoomLevels = [0.75, 1, 1.25, 1.5]

// Reactive state
const selectedSample = ref('valid')
const currentZoom = ref(1)

// Computed XML content based on selected sample
const currentXmlContent = computed(() => {
  switch (selectedSample.value) {
    case 'valid':
      return validXml
    case 'invalid-syntax':
      return invalidSyntaxXml
    case 'empty':
      return emptyXml
    case 'missing-fields':
      return missingFieldsXml
    case 'extra-fields':
      return extraFieldsXml
    default:
      return validXml
  }
})

// Computed parse status (simplified - actual parsing is in PreviewPanel)
const parseStatus = computed(() => {
  const sample = selectedSample.value
  if (sample === 'valid' || sample === 'extra-fields') {
    return '✓ Success'
  }
  return '✗ Error'
})

// Computed field count (simplified estimation)
const fieldCount = computed(() => {
  const sample = selectedSample.value
  switch (sample) {
    case 'valid':
      return '~20 fields'
    case 'invalid-syntax':
      return 'N/A (Parse Error)'
    case 'empty':
      return '0 fields'
    case 'missing-fields':
      return 'N/A (Missing Required)'
    case 'extra-fields':
      return '~25 fields (includes extra)'
    default:
      return 'Unknown'
  }
})

// Helper function to get sample description
function getSampleDescription(sample: string): string {
  const option = sampleOptions.find(opt => opt.value === sample)
  return option?.label || 'Unknown'
}
</script>

<style scoped>
.debug-preview-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-gray-900);
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1rem;
  color: var(--color-gray-600);
}

.controls-section {
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.control-group {
  margin-bottom: 1.5rem;
}

.control-group:last-child {
  margin-bottom: 0;
}

.control-group label {
  display: block;
  font-weight: 600;
  color: var(--color-gray-700);
  margin-bottom: 0.5rem;
}

.zoom-buttons {
  display: flex;
  gap: 0.5rem;
}

.status-section {
  background: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.status-section h3 {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--color-gray-900);
  margin-bottom: 1rem;
}

.status-info p {
  margin-bottom: 0.5rem;
  color: var(--color-gray-700);
}

.preview-wrapper {
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
  padding: 1.5rem;
  min-height: 400px;
}

.preview-wrapper h3 {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--color-gray-900);
  margin-bottom: 1rem;
}

.loading-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--color-gray-600);
}
</style>
