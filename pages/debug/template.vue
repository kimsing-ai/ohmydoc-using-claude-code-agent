<template>
  <div class="debug-template-page">
    <!-- Page Header with @nuxt/ui -->
    <header class="page-header">
      <UContainer>
        <div class="header-content">
          <h1 class="page-title">Template Renderer Demo</h1>
          <p class="page-description">
            Testing the Modern template with comprehensive sample data.
            This page demonstrates template rendering capabilities in isolation.
          </p>
        </div>
      </UContainer>
    </header>

    <!-- Template Preview Section -->
    <UContainer>
      <div class="template-info">
        <UBadge color="blue" variant="subtle" size="lg">
          Active Template: {{ templateMetadata.displayName }}
        </UBadge>
        <p class="template-description">{{ templateMetadata.description }}</p>
      </div>

      <!-- Render the active template with sample data -->
      <div class="template-preview">
        <component :is="activeTemplateComponent" :data="sampleData" />
      </div>

      <!-- Debug Information -->
      <UCard class="debug-info">
        <template #header>
          <h2 class="debug-title">Debug Information</h2>
        </template>

        <div class="debug-content">
          <div class="debug-section">
            <h3>Template System</h3>
            <ul>
              <li><strong>Active Template:</strong> {{ activeTemplate }}</li>
              <li><strong>Available Templates:</strong> {{ availableTemplates.join(', ') }}</li>
            </ul>
          </div>

          <div class="debug-section">
            <h3>Sample Data Structure</h3>
            <pre class="code-block">{{ JSON.stringify(sampleData, null, 2) }}</pre>
          </div>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { useTemplate } from '~/composables/useTemplate'
import type { ParsedData } from '~/composables/useXmlParser'

/**
 * Debug Template Page
 *
 * This page demonstrates the Modern template rendering with comprehensive
 * sample data covering all template sections and edge cases.
 */

// Get the active template from the template system
const {
  getCurrentTemplate,
  getCurrentTemplateMetadata,
  getAvailableTemplates,
  activeTemplate,
} = useTemplate()

const activeTemplateComponent = getCurrentTemplate()
const templateMetadata = getCurrentTemplateMetadata()
const availableTemplates = getAvailableTemplates()

/**
 * Comprehensive sample data covering all template sections
 *
 * This data structure matches the ParsedData interface from useXmlParser.ts
 * and includes edge cases like:
 * - Long names
 * - Multiple experience entries
 * - Multiple achievements per experience
 * - Various address formats
 */
const sampleData: ParsedData = {
  formatStyle: 'modern',
  applicant: {
    name: 'Jane Doe',
    address: {
      street: '123 Main Street',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704',
    },
    contactInformation: {
      phone: '(555) 123-4567',
      email: 'jane.doe@email.com',
    },
  },
  date: 'June 15, 2024',
  recipient: {
    position: 'Hiring Manager',
    company: 'Brightwave Marketing',
    address: {
      street: '789 Market Avenue',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
    },
  },
  letter: {
    salutation: 'Dear Hiring Manager,',
    introduction:
      'I am writing to express my interest in the Marketing Coordinator position at Brightwave Marketing, as advertised on your company website. With a strong background in digital marketing and a passion for creative storytelling, I am excited about the opportunity to contribute to your team.',
    experienceSection: [
      {
        employer: 'GreenLeaf Promotions',
        achievements: [
          { text: 'Managed multiple successful social media campaigns that increased engagement by 150%' },
          { text: 'Contributed to brand development strategies for 5 major clients' },
          { text: 'Coordinated promotional events with budgets exceeding $50,000' },
        ],
      },
      {
        employer: 'TechStart Solutions',
        achievements: [
          { text: 'Led content marketing initiatives resulting in 200% growth in organic traffic' },
          { text: 'Developed and executed email marketing campaigns with 35% open rates' },
          { text: 'Collaborated with cross-functional teams to launch new product lines' },
        ],
      },
    ],
    motivation:
      'What excites me most about Brightwave Marketing is your commitment to creative and data-driven strategies. I thrive in dynamic environments where collaboration and innovation are valued. Your recent campaign for sustainable brands particularly resonates with my personal values and professional interests.',
    closing:
      'Thank you for considering my application. I welcome the opportunity to further discuss how my skills and experiences align with the needs of your company. I am available for an interview at your earliest convenience and look forward to the possibility of contributing to Brightwave Marketing\'s continued success.',
    signature: 'Jane Doe',
  },
}

// Set page metadata
useHead({
  title: 'Template Demo - ohmydoc',
  meta: [
    {
      name: 'description',
      content: 'Template rendering demonstration page for ohmydoc XML-to-HTML transformer',
    },
  ],
})
</script>

<style scoped>
.debug-template-page {
  min-height: 100vh;
  background: var(--color-gray-50);
  padding-bottom: 4rem;
}

.page-header {
  background: white;
  border-bottom: 1px solid var(--color-gray-200);
  padding: 2rem 0;
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0;
}

.page-description {
  font-size: 1rem;
  color: var(--color-gray-600);
  margin: 0;
  max-width: 600px;
}

.template-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid var(--color-gray-200);
}

.template-description {
  margin: 0;
  color: var(--color-gray-600);
  font-size: 0.95rem;
}

.template-preview {
  background: white;
  border-radius: 0.5rem;
  border: 1px solid var(--color-gray-200);
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.debug-info {
  margin-top: 2rem;
}

.debug-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.debug-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.debug-section h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: var(--color-gray-800);
}

.debug-section ul {
  margin: 0;
  padding-left: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.debug-section li {
  color: var(--color-gray-700);
  font-size: 0.95rem;
}

.code-block {
  background: var(--color-gray-100);
  border: 1px solid var(--color-gray-200);
  border-radius: 0.375rem;
  padding: 1rem;
  overflow-x: auto;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--color-gray-800);
  margin: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .template-preview {
    padding: 1rem;
  }
}
</style>
