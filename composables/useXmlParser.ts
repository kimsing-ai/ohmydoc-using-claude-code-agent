/**
 * XML Parser Composable
 *
 * Provides XML parsing functionality using browser's native DOMParser API.
 * Zero dependencies approach for fast, simple XML parsing (DECISIONS.md Decision 6).
 */

// TypeScript interfaces matching the XML schema from docs/sample/cover-letter.xml

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
}

export interface ContactInformation {
  phone: string
  email: string
}

export interface Applicant {
  name: string
  address: Address
  contactInformation: ContactInformation
}

export interface Achievement {
  text: string
}

export interface Experience {
  employer: string
  achievements: Achievement[]
}

export interface Letter {
  salutation: string
  introduction: string
  experienceSection: Experience[]
  motivation: string
  closing: string
  signature: string
}

export interface Recipient {
  position: string
  company: string
  address: Address
}

export interface ParsedData {
  formatStyle?: string
  applicant: Applicant
  date: string
  recipient: Recipient
  letter: Letter
}

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface ParseResult {
  success: boolean
  data?: ParsedData
  error?: string
}

/**
 * Helper function to safely extract text content from an XML element
 */
function getTextContent(element: Element | null, tagName: string, parentName: string = 'document'): string {
  if (!element) {
    throw new Error(`Missing required element: ${tagName} in ${parentName}`)
  }
  const node = element.querySelector(tagName)
  if (!node) {
    throw new Error(`Missing required element: ${tagName} in ${parentName}`)
  }
  return node.textContent?.trim() || ''
}

/**
 * Parse address element (reusable for applicant and recipient addresses)
 */
function parseAddress(addressElement: Element | null, context: string): Address {
  if (!addressElement) {
    throw new Error(`Missing address element in ${context}`)
  }

  return {
    street: getTextContent(addressElement, 'street', `${context} address`),
    city: getTextContent(addressElement, 'city', `${context} address`),
    state: getTextContent(addressElement, 'state', `${context} address`),
    zipCode: getTextContent(addressElement, 'zipCode', `${context} address`),
  }
}

/**
 * Validate XML for well-formedness and basic schema requirements
 *
 * @param xmlString - XML string to validate
 * @returns ValidationResult with isValid flag and optional error message
 */
export function validateXml(xmlString: string): ValidationResult {
  if (!xmlString || xmlString.trim() === '') {
    return {
      isValid: false,
      error: 'XML input is empty. Please provide valid XML content.',
    }
  }

  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml')

  // Check for parser errors
  const parserError = xmlDoc.querySelector('parsererror')
  if (parserError) {
    // Extract meaningful error message from parsererror element
    const errorText = parserError.textContent || 'Unknown XML parsing error'

    // Provide user-friendly error messages for common issues
    if (errorText.includes('unclosed tag') || errorText.includes('Opening and ending tag mismatch')) {
      return {
        isValid: false,
        error: 'XML has unclosed or mismatched tags. Please check that all opening tags have corresponding closing tags.',
      }
    }
    if (errorText.includes('Unexpected end of file') || errorText.includes('premature end of data')) {
      return {
        isValid: false,
        error: 'XML is incomplete. The document appears to end unexpectedly.',
      }
    }
    if (errorText.includes('invalid character') || errorText.includes('not well-formed')) {
      return {
        isValid: false,
        error: 'XML contains invalid characters or syntax. Please check for special characters that need to be escaped.',
      }
    }

    return {
      isValid: false,
      error: `XML parsing error: ${errorText}`,
    }
  }

  // Check for root element
  const root = xmlDoc.documentElement
  if (!root || root.tagName !== 'applicationDocument') {
    return {
      isValid: false,
      error: 'Invalid XML structure. Root element must be <applicationDocument>.',
    }
  }

  // Check for required top-level elements
  const requiredElements = ['applicant', 'date', 'recipient', 'letter']
  for (const elementName of requiredElements) {
    if (!root.querySelector(elementName)) {
      return {
        isValid: false,
        error: `Missing required element: <${elementName}>. All application documents must include applicant, date, recipient, and letter sections.`,
      }
    }
  }

  return { isValid: true }
}

/**
 * Parse XML string into structured data object
 *
 * @param xmlString - XML string to parse
 * @returns ParseResult with success flag, parsed data, or error message
 */
export function parseXml(xmlString: string): ParseResult {
  try {
    // First validate the XML
    const validation = validateXml(xmlString)
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
      }
    }

    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml')
    const root = xmlDoc.documentElement

    // Extract formatStyle attribute (optional)
    const formatStyle = root.getAttribute('formatStyle') || undefined

    // Parse applicant section
    const applicantElement = root.querySelector('applicant')
    if (!applicantElement) {
      throw new Error('Missing required element: applicant')
    }

    const applicant: Applicant = {
      name: getTextContent(applicantElement, 'name', 'applicant'),
      address: parseAddress(applicantElement.querySelector('address'), 'applicant'),
      contactInformation: {
        phone: getTextContent(applicantElement, 'contactInformation phone', 'applicant'),
        email: getTextContent(applicantElement, 'contactInformation email', 'applicant'),
      },
    }

    // Parse date
    const date = getTextContent(root, 'date')

    // Parse recipient section
    const recipientElement = root.querySelector('recipient')
    if (!recipientElement) {
      throw new Error('Missing required element: recipient')
    }

    const recipient: Recipient = {
      position: getTextContent(recipientElement, 'position', 'recipient'),
      company: getTextContent(recipientElement, 'company', 'recipient'),
      address: parseAddress(recipientElement.querySelector('address'), 'recipient'),
    }

    // Parse letter section
    const letterElement = root.querySelector('letter')
    if (!letterElement) {
      throw new Error('Missing required element: letter')
    }

    // Parse experiences
    const experienceElements = letterElement.querySelectorAll('experienceSection experience')
    const experiences: Experience[] = Array.from(experienceElements).map((expElement) => {
      const employer = expElement.querySelector('employer')?.textContent?.trim() || ''
      const achievementElements = expElement.querySelectorAll('achievements achievement')
      const achievements: Achievement[] = Array.from(achievementElements).map(ach => ({
        text: ach.textContent?.trim() || '',
      }))

      return {
        employer,
        achievements,
      }
    })

    const letter: Letter = {
      salutation: getTextContent(letterElement, 'salutation', 'letter'),
      introduction: getTextContent(letterElement, 'introduction', 'letter'),
      experienceSection: experiences,
      motivation: getTextContent(letterElement, 'motivation', 'letter'),
      closing: getTextContent(letterElement, 'closing', 'letter'),
      signature: getTextContent(letterElement, 'signature', 'letter'),
    }

    const parsedData: ParsedData = {
      formatStyle,
      applicant,
      date,
      recipient,
      letter,
    }

    return {
      success: true,
      data: parsedData,
    }
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred during parsing'
    return {
      success: false,
      error: `Failed to parse XML: ${errorMessage}`,
    }
  }
}

/**
 * Composable function to use XML parser in Vue components
 */
export function useXmlParser() {
  return {
    parseXml,
    validateXml,
  }
}
