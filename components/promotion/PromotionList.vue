<template>
  <div class="promotion-list">
    <div class="list-header">
      <h2 class="list-title">{{ title }}</h2>
      <div class="list-controls">
        <select v-model="selectedCategory" class="category-filter">
          <option value="all">Semua Kategori</option>
          <option value="game">Game</option>
          <option value="voucher">Voucher</option>
          <option value="cashback">Cashback</option>
        </select>
      </div>
    </div>
    
    <div v-if="filteredPromotions.length === 0" class="empty-state">
      <div class="empty-icon">🎁</div>
      <h3>Tidak Ada Promosi</h3>
      <p>Belum ada promosi yang tersedia untuk kategori ini.</p>
    </div>
    
    <div v-else class="promotion-grid">
      <PromotionCard 
        v-for="promotion in paginatedPromotions" 
        :key="promotion.id"
        :promotion="promotion"
        @claim="handleClaim"
      />
    </div>
    
    <div v-if="totalPages > 1" class="pagination">
      <button 
        v-for="page in totalPages" 
        :key="page"
        :class="['page-btn', { active: currentPage === page }]"
        @click="currentPage = page"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup>
import PromotionCard from './PromotionCard.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Promosi Tersedia'
  },
  promotions: {
    type: Array,
    default: () => []
  },
  itemsPerPage: {
    type: Number,
    default: 6
  }
})

const emit = defineEmits(['claim'])

const selectedCategory = ref('all')
const currentPage = ref(1)

// Sample data if no promotions provided
const samplePromotions = [
  {
    id: 1,
    title: 'Diskon 50% Top Up Game',
    description: 'Dapatkan diskon hingga 50% untuk semua top up game favorit Anda.',
    discount: 50,
    category: 'game',
    validUntil: new Date('2024-02-28'),
    minPurchase: 50000,
    claimed: false,
    image: '/images/mobilelegendsA.png'
  },
  {
    id: 2,
    title: 'Cashback 25% Voucher Digital',
    description: 'Cashback 25% untuk pembelian voucher digital Netflix, Spotify, dan lainnya.',
    discount: 25,
    category: 'voucher',
    validUntil: new Date('2024-03-15'),
    minPurchase: 100000,
    claimed: false,
    image: '/images/netflix.png'
  },
  {
    id: 3,
    title: 'Bonus Diamond Free Fire',
    description: 'Beli 1000 diamond Free Fire, dapatkan bonus 100 diamond gratis.',
    discount: 10,
    category: 'game',
    validUntil: new Date('2024-02-20'),
    minPurchase: 150000,
    claimed: true,
    image: '/images/freefire.png'
  }
]

const allPromotions = computed(() => {
  return props.promotions.length > 0 ? props.promotions : samplePromotions
})

const filteredPromotions = computed(() => {
  if (selectedCategory.value === 'all') {
    return allPromotions.value
  }
  return allPromotions.value.filter(p => p.category === selectedCategory.value)
})

const totalPages = computed(() => {
  return Math.ceil(filteredPromotions.value.length / props.itemsPerPage)
})

const paginatedPromotions = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return filteredPromotions.value.slice(start, end)
})

const handleClaim = (promotion) => {
  emit('claim', promotion)
}

// Reset page when category changes
watch(selectedCategory, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.promotion-list {
  max-width: 1200px;
  margin: 0 auto;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.list-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.category-filter {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  font-size: 0.875rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.promotion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.page-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover {
  background: #f9fafb;
}

.page-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .promotion-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>