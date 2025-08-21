<template>
  <div>
    <AppHeader />
    <main class="promotion-page">
      <div class="container">
        <h1 class="page-title">Promosi & Penawaran</h1>
        
        <!-- Featured Promotion -->
        <PromotionBanner 
          v-if="featuredPromotion" 
          :promotion="featuredPromotion" 
          @claim="claimPromotion" 
        />
        
        <!-- Promotion List -->
        <div class="promotion-grid">
          <PromotionCard 
            v-for="promotion in promotions" 
            :key="promotion.id" 
            :promotion="promotion" 
            @claim="claimPromotion"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import AppHeader from '~/components/common/AppHeader.vue'
import PromotionBanner from '~/components/promotion/PromotionBanner.vue'
import PromotionCard from '~/components/promotion/PromotionCard.vue'

// Sample data - replace with actual API calls
const featuredPromotion = ref({
  id: 1,
  type: 'FLASH SALE',
  title: 'Diskon Besar-besaran!',
  description: 'Dapatkan diskon hingga 50% untuk semua produk game favorit Anda.',
  discount: '50% OFF',
  validUntil: new Date('2024-12-31'),
  backgroundImage: '/images/promo-bg.jpg'
})

const promotions = ref([
  // Add more promotions here
])

const claimPromotion = (promotion) => {
  // Handle promotion claim
  console.log('Claiming promotion:', promotion)
}
</script>

<style scoped>
.promotion-page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1e293b;
}

.promotion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}
</style>