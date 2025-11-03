/**
 * Template System Composable
 *
 * Provides template selection and management for document rendering.
 * PoC Implementation: Uses code-level template switching via ACTIVE_TEMPLATE constant.
 * (See DECISIONS.md Decision 4: UI dropdown is post-PoC feature)
 */

import type { Component } from 'vue'
import CoverLetterModern from '~/templates/modern/CoverLetterModern.vue'

// Template metadata interface for future extensibility
export interface TemplateMetadata {
  name: string
  displayName: string
  description: string
}

// Template registry type
export interface TemplateRegistry {
  [key: string]: {
    component: Component
    metadata: TemplateMetadata
  }
}

/**
 * ACTIVE_TEMPLATE Constant
 *
 * Change this constant to switch templates in the PoC.
 * Available options: 'modern' (more templates will be added in MVP 11)
 *
 * Example:
 *   const ACTIVE_TEMPLATE = 'modern'  // Uses Modern template
 *   const ACTIVE_TEMPLATE = 'classic' // Uses Classic template (when available)
 */
const ACTIVE_TEMPLATE = 'modern'

/**
 * Template Registry
 *
 * Maps template names to their Vue components and metadata.
 * Templates will be registered here as they are implemented.
 */
const templates: TemplateRegistry = {
  modern: {
    component: CoverLetterModern,
    metadata: {
      name: 'modern',
      displayName: 'Modern',
      description: 'Professional cover letter template with modern styling and clean typography',
    },
  },
  // Additional templates (Classic, Minimal) will be added in MVP 11
}

/**
 * Get the currently active template component
 *
 * @returns The Vue component for the active template
 * @throws Error if the active template is not found in the registry
 */
export function getCurrentTemplate(): Component {
  const templateEntry = templates[ACTIVE_TEMPLATE]

  if (!templateEntry) {
    throw new Error(
      `Template "${ACTIVE_TEMPLATE}" not found. Available templates: ${Object.keys(templates).join(', ')}`
    )
  }

  return templateEntry.component
}

/**
 * Get metadata for the currently active template
 *
 * @returns Template metadata for the active template
 */
export function getCurrentTemplateMetadata(): TemplateMetadata {
  const templateEntry = templates[ACTIVE_TEMPLATE]

  if (!templateEntry) {
    throw new Error(
      `Template "${ACTIVE_TEMPLATE}" not found. Available templates: ${Object.keys(templates).join(', ')}`
    )
  }

  return templateEntry.metadata
}

/**
 * Get all available template names
 *
 * @returns Array of template names
 */
export function getAvailableTemplates(): string[] {
  return Object.keys(templates)
}

/**
 * Get metadata for all available templates
 *
 * @returns Array of template metadata objects
 */
export function getAllTemplateMetadata(): TemplateMetadata[] {
  return Object.values(templates).map(t => t.metadata)
}

/**
 * Composable function to use template system in Vue components
 *
 * @returns Object with template selection functions
 */
export function useTemplate() {
  return {
    getCurrentTemplate,
    getCurrentTemplateMetadata,
    getAvailableTemplates,
    getAllTemplateMetadata,
    activeTemplate: ACTIVE_TEMPLATE,
  }
}
