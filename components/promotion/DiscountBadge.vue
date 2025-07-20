<template>
  <div :class="['discount-badge', size, type]">
    <span class="discount-text">{{ formattedDiscount }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  discount: {
    type: [Number, String],
    required: true
  },
  type: {
    type: String,
    default: 'percentage', // 'percentage', 'amount', 'text'
    validator: (value) => ['percentage', 'amount', 'text'].includes(value)
  },
  size: {
    type: String,
    default: 'md', // 'sm', 'md', 'lg'
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const { formatPrice } = useFormatters()

const formattedDiscount = computed(() => {
  switch (props.type) {
    case 'percentage':
      return `${props.discount}%`
    case 'amount':
      return formatPrice(props.discount)
    case 'text':
      return props.discount
    default:
      return `${props.discount}%`
  }
})
</script>

<style scoped>
.discount-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  font-weight: 700;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
  position: relative;
  overflow: hidden;
}

.discount-badge::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.discount-badge:hover::before {
  left: 100%;
}

/* Sizes */
.discount-badge.sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  min-width: 2rem;
}

.discount-badge.md {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  min-width: 2.5rem;
}

.discount-badge.lg {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  min-width: 3rem;
}

/* Types */
.discount-badge.percentage {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
}

.discount-badge.amount {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
}

.discount-badge.text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.discount-text {
  position: relative;
  z-index: 1;
}
</style>