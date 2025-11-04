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

<style scoped>
/**
 * Modern Template Styles
 *
 * Professional cover letter styling using the design system from PRD.md
 * Color palette (PRD 4.2): --ink: #111, --muted: #555, --accent: #0f6fec
 * Typography (PRD 4.3): --font-body: ui-serif, --font-ui: ui-sans-serif
 *
 * This stylesheet uses ONLY scoped CSS (no @nuxt/ui, no Tailwind utilities)
 * to ensure the template is exportable as standalone HTML.
 */

/* CSS Custom Properties (Design System) */
:root {
  --font-body: ui-serif, Georgia, "Times New Roman", Times, serif;
  --font-ui: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  --max-width: 720px;
  --ink: #111;
  --muted: #555;
  --accent: #0f6fec;
  --gap: 0.9rem;
  --gap-lg: 1.25rem;
  --line: 1.6;
}

/* Base Styles */
* {
  box-sizing: border-box;
}

/* Application Document Container */
.application-document {
  margin: 0 auto;
  max-width: var(--max-width);
  background: #fff;
  color: var(--ink);
  font: 16px/var(--line) var(--font-body);
  padding: 2rem 1rem;
}

/* Application Header */
.application-header {
  display: grid;
  gap: var(--gap);
  margin-bottom: var(--gap-lg);
}

.applicant-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Applicant Name */
.applicant-name {
  font-family: var(--font-ui);
  font-size: clamp(1.4rem, 2vw + 1rem, 2rem);
  line-height: 1.2;
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  color: var(--ink);
}

/* Address Styling */
.applicant-address,
.recipient-address {
  font-style: normal;
  color: var(--muted);
  line-height: 1.5;
  margin: 0;
}

/* Contact Information */
.contact-information {
  font-family: var(--font-ui);
  color: var(--muted);
  margin: 0.25rem 0 0 0;
  font-size: 0.95rem;
}

.contact-information .phone {
  color: inherit;
}

.contact-information .separator {
  margin: 0 0.5rem;
  color: var(--muted);
}

.contact-information .email {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px dotted currentColor;
  transition: color 0.2s ease;
}

.contact-information .email:hover {
  color: var(--accent);
}

/* Document Date */
.document-date {
  margin: var(--gap) 0;
  color: var(--muted);
  font-family: var(--font-ui);
  font-size: 0.95rem;
}

/* Recipient Section */
.recipient {
  margin-top: 0.25rem;
  margin-bottom: var(--gap-lg);
}

.recipient-position {
  margin: 0 0 0.1rem 0;
  font-weight: 600;
  color: var(--ink);
}

.recipient-company {
  margin: 0.1rem 0 0.2rem 0;
  font-family: var(--font-ui);
  color: var(--ink);
}

/* Letter Content */
.letter {
  margin-top: var(--gap-lg);
}

.letter > p {
  margin: 0 0 1rem 0;
  line-height: var(--line);
}

/* Salutation */
.salutation {
  margin-bottom: 1rem;
  font-weight: 500;
}

/* Introduction */
.introduction {
  margin-bottom: 1rem;
}

/* Experience Section */
.experience-section {
  margin: 1rem 0;
}

.experience {
  margin-bottom: 1rem;
}

.experience-employer {
  margin: 0 0 0.25rem 0;
  color: var(--ink);
}

.experience-employer strong {
  font-weight: 600;
}

/* Achievements List */
.achievements {
  margin: 0.25rem 0 1rem 1.5rem;
  padding: 0;
  list-style-type: disc;
}

.achievement {
  margin: 0.2rem 0;
  line-height: var(--line);
  color: var(--ink);
}

/* Motivation */
.motivation {
  margin-bottom: 1rem;
}

/* Closing */
.closing {
  margin-bottom: 1rem;
}

/* Signature */
.signature {
  margin-top: 2.5rem;
  font-weight: 600;
  color: var(--ink);
}

/* Print Optimization */
@media print {
  .application-document {
    padding: 0;
    max-width: none;
    margin: 0 2cm;
  }

  .contact-information .email {
    color: inherit;
    text-decoration: none;
    border-bottom: none;
  }
}

/* Responsive Design */
@media screen and (max-width: 768px) {
  .application-document {
    padding: 1rem 0.75rem;
  }

  .applicant-name {
    font-size: 1.5rem;
  }
}
</style>
