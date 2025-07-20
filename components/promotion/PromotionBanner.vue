<template>
  <div class="promotion-banner" :style="{ backgroundImage: `url(${promotion.backgroundImage})` }">
    <div class="banner-overlay"></div>
    <div class="banner-content">
      <div class="promotion-badge">{{ promotion.type }}</div>
      <h2 class="promotion-title">{{ promotion.title }}</h2>
      <p class="promotion-description">{{ promotion.description }}</p>
      <div class="promotion-details">
        <span class="discount">{{ promotion.discount }}</span>
        <span class="validity">Berlaku hingga {{ formatDate(promotion.validUntil) }}</span>
      </div>
      <button class="claim-btn" @click="$emit('claim', promotion)">
        Klaim Sekarang
      </button>
    </div>
  </div>
</template>

<script setup>
const { formatDate } = useFormatters()

defineProps({
  promotion: {
    type: Object,
    required: true
  }
})

defineEmits(['claim'])
</script>

<style scoped>
.promotion-banner {
  position: relative;
  background-size: cover;
  background-position: center;
  border-radius: 1rem;
  overflow: hidden;
  min-height: 300px;
  display: flex;
  align-items: center;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8));
}

.banner-content {
  position: relative;
  z-index: 1;
  color: white;
  padding: 2rem;
  max-width: 500px;
}

.promotion-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.promotion-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.promotion-description {
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.promotion-details {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.discount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fbbf24;
}

.validity {
  font-size: 0.875rem;
  opacity: 0.8;
}

.claim-btn {
  background: white;
  color: #3b82f6;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.claim-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>