<template>
  <div v-if="show" class="modal-backdrop" @click.self="$emit('close')">
    <div :class="modalClasses">
      <button class="modal-close" @click="$emit('close')">×</button>
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  }
})

defineEmits(['close'])

const modalClasses = computed(() => {
  const baseClasses = 'modal-content-responsive'
  const sizeClasses = {
    sm: 'modal-sm',
    md: 'modal-md', 
    lg: 'modal-lg',
    xl: 'modal-xl'
  }
  return `${baseClasses} ${sizeClasses[props.size]}`
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
  padding: 1rem;
}

.modal-content-responsive {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
  animation: slideIn 0.2s ease;
  max-height: 90vh;
  overflow-y: auto;
  width: 100%;
}

.modal-sm { max-width: 400px; }
.modal-md { max-width: 600px; }
.modal-lg { max-width: 900px; }
.modal-xl { max-width: 1200px; }

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  z-index: 10;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background-color: #f1f5f9;
  color: #ef4444;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(1rem) scale(0.95); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

@media (max-width: 640px) {
  .modal-backdrop {
    padding: 0.5rem;
  }
  
  .modal-content-responsive {
    width: 100%;
    max-width: none;
  }
}
</style>