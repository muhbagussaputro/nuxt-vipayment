<template>
  <div :class="['base-card', variant, { 'hoverable': hoverable, 'clickable': clickable }]" @click="handleClick">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    
    <div class="card-body">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'bordered', 'shadow', 'elevated'].includes(value)
  },
  hoverable: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>

<style scoped>
.base-card {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.base-card.default {
  border: 1px solid #e5e7eb;
}

.base-card.bordered {
  border: 2px solid #e5e7eb;
}

.base-card.shadow {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.base-card.elevated {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.base-card.hoverable:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.base-card.clickable {
  cursor: pointer;
}

.card-header {
  padding: 1.5rem 1.5rem 0 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.card-body {
  padding: 1.5rem;
}

.card-footer {
  padding: 0 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid #f3f4f6;
}

@media (max-width: 768px) {
  .card-header,
  .card-body,
  .card-footer {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>