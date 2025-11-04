<template>
  <article class="application-document">
    <!-- Applicant Header Section -->
    <header class="application-header">
      <div class="applicant-info">
        <h1 class="applicant-name">{{ data.applicant.name }}</h1>

        <!-- Applicant Address -->
        <address v-if="data.applicant.address" class="applicant-address">
          {{ data.applicant.address.street }}<br>
          {{ data.applicant.address.city }}, {{ data.applicant.address.state }} {{ data.applicant.address.zipCode }}
        </address>

        <!-- Contact Information -->
        <div v-if="data.applicant.contactInformation" class="contact-information">
          <span v-if="data.applicant.contactInformation.phone" class="phone">
            {{ data.applicant.contactInformation.phone }}
          </span>
          <span v-if="data.applicant.contactInformation.phone && data.applicant.contactInformation.email" class="separator"> | </span>
          <a
            v-if="data.applicant.contactInformation.email"
            :href="`mailto:${data.applicant.contactInformation.email}`"
            class="email"
          >
            {{ data.applicant.contactInformation.email }}
          </a>
        </div>
      </div>
    </header>

    <!-- Document Date -->
    <div v-if="data.date" class="document-date">
      {{ data.date }}
    </div>

    <!-- Recipient Section -->
    <div v-if="data.recipient" class="recipient">
      <p v-if="data.recipient.position" class="recipient-position">{{ data.recipient.position }}</p>
      <p v-if="data.recipient.company" class="recipient-company">{{ data.recipient.company }}</p>
      <address v-if="data.recipient.address" class="recipient-address">
        {{ data.recipient.address.street }}<br>
        {{ data.recipient.address.city }}, {{ data.recipient.address.state }} {{ data.recipient.address.zipCode }}
      </address>
    </div>

    <!-- Letter Content -->
    <main v-if="data.letter" class="letter">
      <!-- Salutation -->
      <p v-if="data.letter.salutation" class="salutation">
        {{ data.letter.salutation }}
      </p>

      <!-- Introduction -->
      <p v-if="data.letter.introduction" class="introduction">
        {{ data.letter.introduction }}
      </p>

      <!-- Experience Section -->
      <div v-if="data.letter.experienceSection && data.letter.experienceSection.length > 0" class="experience-section">
        <div
          v-for="(experience, expIndex) in data.letter.experienceSection"
          :key="expIndex"
          class="experience"
        >
          <p v-if="experience.employer" class="experience-employer">
            <strong>{{ experience.employer }}</strong>
          </p>
          <ul v-if="experience.achievements && experience.achievements.length > 0" class="achievements">
            <li
              v-for="(achievement, achIndex) in experience.achievements"
              :key="achIndex"
              class="achievement"
            >
              {{ achievement.text }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Motivation -->
      <p v-if="data.letter.motivation" class="motivation">
        {{ data.letter.motivation }}
      </p>

      <!-- Closing -->
      <p v-if="data.letter.closing" class="closing">
        {{ data.letter.closing }}
      </p>

      <!-- Signature -->
      <p v-if="data.letter.signature" class="signature">
        {{ data.letter.signature }}
      </p>
    </main>
  </article>
</template>

<script setup lang="ts">
import type { ParsedData } from '~/composables/useXmlParser'

/**
 * Modern Template Component
 *
 * Renders a cover letter in a modern, professional style.
 * Uses only standard HTML elements and scoped CSS (no @nuxt/ui components).
 * This ensures the template can be exported as standalone HTML.
 */

interface Props {
  data: ParsedData
}

defineProps<Props>()
</script>

<style>
/**
 * Modern Template Styles
 *
 * NOTE: This style block does NOT use 'scoped' attribute because Vite/Nuxt
 * does not properly resolve @import paths in scoped style blocks during production builds.
 * However, all classes are namespaced (e.g., .application-document) so they won't
 * conflict with other components. This maintains CSS separation as required by PRD.md.
 */
@import './styles.css';
</style>
