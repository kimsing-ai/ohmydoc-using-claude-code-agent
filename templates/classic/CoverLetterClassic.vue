<template>
  <div class="classic-document">
    <!-- Header Table -->
    <table class="header-table">
      <tbody>
        <tr>
          <td class="applicant-section">
            <h1 class="applicant-name">{{ data.applicant.name }}</h1>

            <!-- Applicant Address -->
            <div v-if="data.applicant.address" class="address-block">
              {{ data.applicant.address.street }}<br>
              {{ data.applicant.address.city }}, {{ data.applicant.address.state }} {{ data.applicant.address.zipCode }}
            </div>

            <!-- Contact Information -->
            <div v-if="data.applicant.contactInformation" class="contact-block">
              <span v-if="data.applicant.contactInformation.phone" class="phone">
                {{ data.applicant.contactInformation.phone }}
              </span>
              <span v-if="data.applicant.contactInformation.phone && data.applicant.contactInformation.email"> | </span>
              <a
                v-if="data.applicant.contactInformation.email"
                :href="`mailto:${data.applicant.contactInformation.email}`"
                class="email"
              >
                {{ data.applicant.contactInformation.email }}
              </a>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Date Section -->
    <table class="date-table">
      <tbody>
        <tr>
          <td v-if="data.date" class="document-date">
            {{ data.date }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Recipient Section -->
    <table v-if="data.recipient" class="recipient-table">
      <tbody>
        <tr>
          <td class="recipient-section">
            <div v-if="data.recipient.position" class="recipient-position">{{ data.recipient.position }}</div>
            <div v-if="data.recipient.company" class="recipient-company">{{ data.recipient.company }}</div>
            <div v-if="data.recipient.address" class="recipient-address">
              {{ data.recipient.address.street }}<br>
              {{ data.recipient.address.city }}, {{ data.recipient.address.state }} {{ data.recipient.address.zipCode }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Letter Content -->
    <table v-if="data.letter" class="letter-table">
      <tbody>
        <!-- Salutation -->
        <tr v-if="data.letter.salutation">
          <td class="salutation">
            {{ data.letter.salutation }}
          </td>
        </tr>

        <!-- Introduction -->
        <tr v-if="data.letter.introduction">
          <td class="introduction">
            {{ data.letter.introduction }}
          </td>
        </tr>

        <!-- Experience Section -->
        <tr v-if="data.letter.experienceSection && data.letter.experienceSection.length > 0">
          <td class="experience-section">
            <table class="experience-table">
              <tbody>
                <tr
                  v-for="(experience, expIndex) in data.letter.experienceSection"
                  :key="expIndex"
                >
                  <td class="experience-block">
                    <div v-if="experience.employer" class="experience-employer">
                      <strong>{{ experience.employer }}</strong>
                    </div>
                    <ul v-if="experience.achievements && experience.achievements.length > 0" class="achievements">
                      <li
                        v-for="(achievement, achIndex) in experience.achievements"
                        :key="achIndex"
                        class="achievement"
                      >
                        {{ achievement.text }}
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>

        <!-- Motivation -->
        <tr v-if="data.letter.motivation">
          <td class="motivation">
            {{ data.letter.motivation }}
          </td>
        </tr>

        <!-- Closing -->
        <tr v-if="data.letter.closing">
          <td class="closing">
            {{ data.letter.closing }}
          </td>
        </tr>

        <!-- Signature -->
        <tr v-if="data.letter.signature">
          <td class="signature">
            {{ data.letter.signature }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { ParsedData } from '~/composables/useXmlParser'

/**
 * Classic Template Component
 *
 * Renders a cover letter in a traditional, table-based layout style.
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
