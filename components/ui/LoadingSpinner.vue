<template>
  <div :class="['loading-spinner', size, variant]">
    <div class="spinner"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'white'].includes(value)
  }
})
</script>

<style scoped>
.loading-spinner {
  display: inline-block;
}

.spinner {
  border-radius: 50%;
  border-style: solid;
  animation: spin 1s linear infinite;
}

/* Sizes */
.loading-spinner.sm .spinner {
  width: 1rem;
  height: 1rem;
  border-width: 2px;
}

.loading-spinner.md .spinner {
  width: 1.5rem;
  height: 1.5rem;
  border-width: 2px;
}

.loading-spinner.lg .spinner {
  width: 2rem;
  height: 2rem;
  border-width: 3px;
}

.loading-spinner.xl .spinner {
  width: 3rem;
  height: 3rem;
  border-width: 4px;
}

/* Variants */
.loading-spinner.primary .spinner {
  border-color: #e5e7eb;
  border-top-color: #667eea;
}

.loading-spinner.secondary .spinner {
  border-color: #f3f4f6;
  border-top-color: #6b7280;
}

.loading-spinner.white .spinner {
  border-color: rgba(255, 255, 255, 0.3);
  border-top-color: white;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>