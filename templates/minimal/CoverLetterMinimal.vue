<template>
  <div class="minimal-document">
    <!-- Applicant Section -->
    <div class="applicant-section">
      <div class="applicant-name">{{ data.applicant.name }}</div>

      <!-- Applicant Address -->
      <div v-if="data.applicant.address" class="applicant-address">
        {{ data.applicant.address.street }}<br>
        {{ data.applicant.address.city }}, {{ data.applicant.address.state }} {{ data.applicant.address.zipCode }}
      </div>

      <!-- Contact Information -->
      <div v-if="data.applicant.contactInformation" class="applicant-contact">
        <span v-if="data.applicant.contactInformation.phone">
          {{ data.applicant.contactInformation.phone }}
        </span>
        <span v-if="data.applicant.contactInformation.phone && data.applicant.contactInformation.email"> · </span>
        <a
          v-if="data.applicant.contactInformation.email"
          :href="`mailto:${data.applicant.contactInformation.email}`"
        >
          {{ data.applicant.contactInformation.email }}
        </a>
      </div>
    </div>

    <!-- Date -->
    <div v-if="data.date" class="document-date">
      {{ data.date }}
    </div>

    <!-- Recipient Section -->
    <div v-if="data.recipient" class="recipient-section">
      <div v-if="data.recipient.position">{{ data.recipient.position }}</div>
      <div v-if="data.recipient.company">{{ data.recipient.company }}</div>
      <div v-if="data.recipient.address" class="recipient-address">
        {{ data.recipient.address.street }}<br>
        {{ data.recipient.address.city }}, {{ data.recipient.address.state }} {{ data.recipient.address.zipCode }}
      </div>
    </div>

    <!-- Letter Content -->
    <div v-if="data.letter" class="letter-content">
      <!-- Salutation -->
      <div v-if="data.letter.salutation" class="salutation">
        {{ data.letter.salutation }}
      </div>

      <!-- Introduction -->
      <div v-if="data.letter.introduction" class="paragraph">
        {{ data.letter.introduction }}
      </div>

      <!-- Experience Section -->
      <div v-if="data.letter.experienceSection && data.letter.experienceSection.length > 0" class="experience-section">
        <div
          v-for="(experience, expIndex) in data.letter.experienceSection"
          :key="expIndex"
          class="experience-block"
        >
          <div v-if="experience.employer" class="employer">
            {{ experience.employer }}
          </div>
          <ul v-if="experience.achievements && experience.achievements.length > 0">
            <li
              v-for="(achievement, achIndex) in experience.achievements"
              :key="achIndex"
            >
              {{ achievement.text }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Motivation -->
      <div v-if="data.letter.motivation" class="paragraph">
        {{ data.letter.motivation }}
      </div>

      <!-- Closing -->
      <div v-if="data.letter.closing" class="paragraph">
        {{ data.letter.closing }}
      </div>

      <!-- Signature -->
      <div v-if="data.letter.signature" class="signature">
        {{ data.letter.signature }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ParsedData } from '~/composables/useXmlParser'

/**
 * Minimal Template Component
 *
 * Renders a cover letter in a clean, minimalist style with simple divs.
 * Uses only standard HTML elements and scoped CSS (no @nuxt/ui components).
 * This ensures the template can be exported as standalone HTML.
 */

interface Props {
  data: ParsedData
}

defineProps<Props>()
</script>

<style scoped>
@import './styles.css';
</style>
