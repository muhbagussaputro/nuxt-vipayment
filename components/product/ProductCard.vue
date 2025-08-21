<template>
  <div class="product-card" @click="$emit('select', product)">
    <div class="product-image">
      <img :src="product.image" :alt="product.name" />
      <div v-if="product.discount" class="discount-badge">
        -{{ product.discount }}%
      </div>
    </div>
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>
      <div class="product-price">
        <span v-if="product.originalPrice" class="original-price">
          {{ formatPrice(product.originalPrice) }}
        </span>
        <span class="current-price">
          {{ formatPrice(product.price) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
const { formatPrice } = useFormatters()

defineProps({
  product: {
    type: Object,
    required: true
  }
})

defineEmits(['select'])
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.discount-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #ef4444;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.product-info {
  padding: 1rem;
}

.product-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.product-description {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.original-price {
  text-decoration: line-through;
  color: #94a3b8;
  font-size: 0.875rem;
}

.current-price {
  color: #3b82f6;
  font-weight: 600;
  font-size: 1.125rem;
}
</style>