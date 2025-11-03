<template>
  <div class="xml-editor-wrapper" :style="{ height: height, width: width }">
    <MonacoEditor
      v-model="editorContent"
      class="monaco-editor-container"
      :options="editorOptions"
      :lang="language"
      theme="vs-dark"
      @mount="handleEditorMount"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import type { editor } from 'monaco-editor'

// Props definition for v-model support and customization
interface Props {
  modelValue: string
  height?: string
  width?: string
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: '100%',
  width: '100%',
  readonly: false
})

// Emits for v-model two-way binding and error handling
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'error': [error: string]
}>()

// Editor state
const editorContent = ref(props.modelValue)
const editorInstance = ref<editor.IStandaloneCodeEditor | null>(null)
const language = ref('xml')

// Monaco Editor configuration
const editorOptions = computed(() => ({
  // Basic editor features
  automaticLayout: true,
  lineNumbers: 'on' as const,
  readOnly: props.readonly,

  // XML-specific formatting
  tabSize: 2,
  insertSpaces: true,
  autoIndent: 'full' as const,

  // Editor behavior
  wordWrap: 'on' as const,
  minimap: {
    enabled: true,
    maxColumn: 120
  },

  // XML language features
  folding: true,
  foldingStrategy: 'indentation' as const,
  bracketPairColorization: {
    enabled: true
  },

  // Scrolling and rendering
  scrollBeyondLastLine: false,
  renderWhitespace: 'selection' as const,

  // Font and display
  fontSize: 14,
  fontFamily: 'Consolas, "Courier New", monospace',
  lineHeight: 21,

  // Accessibility
  accessibilitySupport: 'auto' as const,

  // Suggest and IntelliSense
  quickSuggestions: {
    other: true,
    comments: false,
    strings: true
  },
  suggestOnTriggerCharacters: true,
  acceptSuggestionOnEnter: 'on' as const,

  // Auto-closing
  autoClosingBrackets: 'languageDefined' as const,
  autoClosingQuotes: 'languageDefined' as const,
  autoSurround: 'languageDefined' as const
}))

// Watch for prop changes and update editor content
watch(() => props.modelValue, (newValue) => {
  if (newValue !== editorContent.value) {
    editorContent.value = newValue
  }
})

// Watch for editor content changes and emit to parent
watch(editorContent, (newValue) => {
  emit('update:modelValue', newValue)
})

// Handle editor mount event
const handleEditorMount = (editor: editor.IStandaloneCodeEditor) => {
  editorInstance.value = editor

  // Ensure XML language is set
  const model = editor.getModel()
  if (model) {
    // Monaco automatically handles XML syntax highlighting
    // when language is set to 'xml'
  }
}

// Cleanup on component unmount
onBeforeUnmount(() => {
  if (editorInstance.value) {
    editorInstance.value.dispose()
    editorInstance.value = null
  }
})

// Expose editor instance for advanced usage if needed
defineExpose({
  getEditor: () => editorInstance.value
})
</script>

<style scoped>
.xml-editor-wrapper {
  position: relative;
  overflow: hidden;
}

.monaco-editor-container {
  height: 100%;
  width: 100%;
}
</style>
