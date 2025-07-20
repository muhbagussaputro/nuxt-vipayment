<template>
  <button 
    :class="[
      'base-button',
      variant,
      size,
      {
        'loading': loading,
        'disabled': disabled,
        'full-width': fullWidth
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <LoadingSpinner v-if="loading" class="button-spinner" />
    <slot v-else />
  </button>
</template>

<script setup>
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (!props.loading && !props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.base-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Sizes */
.base-button.sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.base-button.md {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.base-button.lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

/* Variants */
.base-button.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.base-button.primary:hover:not(.disabled):not(.loading) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.base-button.secondary {
  background: #f8fafc;
  color: #1e293b;
  border: 1px solid #e2e8f0;
}

.base-button.secondary:hover:not(.disabled):not(.loading) {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.base-button.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.base-button.success:hover:not(.disabled):not(.loading) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.base-button.danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.base-button.danger:hover:not(.disabled):not(.loading) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.base-button.warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.base-button.warning:hover:not(.disabled):not(.loading) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.base-button.ghost {
  background: transparent;
  color: #667eea;
  border: 1px solid transparent;
}

.base-button.ghost:hover:not(.disabled):not(.loading) {
  background: rgba(102, 126, 234, 0.1);
  border-color: #667eea;
}

/* States */
.base-button.disabled,
.base-button.loading {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.base-button.full-width {
  width: 100%;
}

.button-spinner {
  width: 1rem;
  height: 1rem;
}
</style>