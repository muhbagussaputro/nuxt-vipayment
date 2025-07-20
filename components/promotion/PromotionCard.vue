<template>
  <div class="promotion-card">
    <div class="card-image">
      <img v-if="promotion.image" :src="promotion.image" :alt="promotion.title" />
      <div v-else class="image-placeholder">
        <span class="placeholder-icon">🎁</span>
      </div>
      <DiscountBadge v-if="promotion.discount" :discount="promotion.discount" class="discount-badge" />
    </div>
    
    <div class="card-content">
      <h3 class="promotion-title">{{ promotion.title }}</h3>
      <p class="promotion-description">{{ promotion.description }}</p>
      
      <div class="promotion-details">
        <div class="validity">
          <span class="validity-label">Berlaku hingga:</span>
          <span class="validity-date">{{ formatDate(promotion.validUntil) }}</span>
        </div>
        
        <div v-if="promotion.minPurchase" class="min-purchase">
          <span class="min-purchase-label">Min. pembelian:</span>
          <span class="min-purchase-amount">{{ formatPrice(promotion.minPurchase) }}</span>
        </div>
      </div>
      
      <div class="card-actions">
        <button 
          class="claim-btn"
          :disabled="isExpired || promotion.claimed"
          @click="handleClaim"
        >
          {{ getButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import DiscountBadge from './DiscountBadge.vue'

const { formatPrice, formatDate } = useFormatters()

const props = defineProps({
  promotion: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['claim'])

const isExpired = computed(() => {
  return new Date() > new Date(props.promotion.validUntil)
})

const getButtonText = computed(() => {
  if (props.promotion.claimed) return 'Sudah Diklaim'
  if (isExpired.value) return 'Expired'
  return 'Klaim Sekarang'
})

const handleClaim = () => {
  if (!isExpired.value && !props.promotion.claimed) {
    emit('claim', props.promotion)
  }
}
</script>

<style scoped>
.promotion-card {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.promotion-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 3rem;
}

.discount-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.card-content {
  padding: 1.5rem;
}

.promotion-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.promotion-description {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.promotion-details {
  margin-bottom: 1.5rem;
}

.validity,
.min-purchase {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.validity-label,
.min-purchase-label {
  font-size: 0.75rem;
  color: #64748b;
}

.validity-date,
.min-purchase-amount {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e293b;
}

.claim-btn {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.claim-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.claim-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .card-image {
    height: 150px;
  }
  
  .card-content {
    padding: 1rem;
  }
  
  .promotion-title {
    font-size: 1.125rem;
  }
}
</style>