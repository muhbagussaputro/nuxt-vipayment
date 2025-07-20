<template>
  <div>
    <!-- Header -->
    <AppHeader />
    
    <!-- Main Content -->
    <main class="home-page">
      <!-- Hero Section -->
      <HeroSection />
      
      <!-- Featured Promotions -->
      <section class="promotions-section">
        <div class="container">
          <h2 class="section-title">Promosi Terbaru</h2>
          <div class="promotions-grid">
            <PromotionBanner 
              v-for="promotion in featuredPromotions" 
              :key="promotion.id"
              :promotion="promotion" 
              @claim="claimPromotion" 
            />
          </div>
        </div>
      </section>
      
      <!-- Popular Games Section -->
      <section class="games-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Game Populer</h2>
            <NuxtLink to="/game" class="view-all-link">
              Lihat Semua
            </NuxtLink>
          </div>
          
          <!-- Game Categories Filter -->
          <div class="game-filters" v-if="!isMobile">
            <button 
              v-for="category in gameCategories" 
              :key="category.id"
              :class="['filter-btn', { active: activeCategory === category.id }]"
              @click="activeCategory = category.id"
            >
              {{ category.name }}
            </button>
          </div>
          
          <!-- Mobile Category Selector -->
          <select v-if="isMobile" v-model="activeCategory" class="mobile-category-select">
            <option v-for="category in gameCategories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          
          <!-- Games Grid -->
          <div class="games-grid">
            <ProductCard
              v-for="game in filteredGames"
              :key="game.slug"
              :product="game"
              @select="openGameModal"
            />
          </div>
        </div>
      </section>
      
      <!-- Prepaid Services Section -->
      <section class="prepaid-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Layanan Pulsa & Data</h2>
            <NuxtLink to="/prepaid" class="view-all-link">
              Lihat Semua
            </NuxtLink>
          </div>
          
          <div class="prepaid-grid">
            <ProductCard
              v-for="service in prepaidServices"
              :key="service.id"
              :product="service"
              @select="openPrepaidModal"
            />
          </div>
        </div>
      </section>
      
      <!-- Features Section -->
      <section class="features-section">
        <div class="container">
          <h2 class="section-title">Mengapa Pilih VIPayment?</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h3 class="feature-title">Proses Cepat</h3>
              <p class="feature-description">Transaksi diproses dalam hitungan detik</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🔒</div>
              <h3 class="feature-title">Aman & Terpercaya</h3>
              <p class="feature-description">Keamanan data dan transaksi terjamin</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">💰</div>
              <h3 class="feature-title">Harga Terbaik</h3>
              <p class="feature-description">Harga kompetitif dengan promo menarik</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3 class="feature-title">24/7 Support</h3>
              <p class="feature-description">Customer service siap membantu kapan saja</p>
            </div>
          </div>
        </div>
      </section>
    </main>
    
    <!-- Modals -->
    <VipGameModal
      :show="showGameModal"
      :slug="selectedGameSlug"
      :gameName="selectedGameName"
      @close="closeGameModal"
    />
    
    <VipPrepaidServicesForm
      :show="showPrepaidModal"
      :service="selectedPrepaidService"
      @close="closePrepaidModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from '~/components/layout/AppHeader.vue'
import HeroSection from '~/components/home/HeroSection.vue'
import PromotionBanner from '~/components/promotion/PromotionBanner.vue'
import ProductCard from '~/components/product/ProductCard.vue'
import VipGameModal from '~/components/vipayment/VipGameModal.vue'
import VipPrepaidServicesForm from '~/components/vipayment/VipPrepaidServicesForm.vue'

// Composables
const { isMobile, isTablet, isDesktop } = useResponsive()
const { formatPrice } = useFormatters()

// SEO
useHead({
  title: 'VIPayment - Top Up Game & Pulsa Terpercaya',
  meta: [
    { name: 'description', content: 'Platform top up game dan pulsa terpercaya dengan harga terbaik. Proses cepat, aman, dan mudah.' },
    { name: 'keywords', content: 'top up game, pulsa, diamond mobile legends, uc pubg, free fire' }
  ]
})

// State
const activeCategory = ref('all')
const showGameModal = ref(false)
const showPrepaidModal = ref(false)
const selectedGameSlug = ref(null)
const selectedGameName = ref(null)
const selectedPrepaidService = ref(null)

// Game Categories
const gameCategories = [
  { id: 'all', name: 'Semua Game' },
  { id: 'moba', name: 'MOBA' },
  { id: 'battle-royale', name: 'Battle Royale' },
  { id: 'rpg', name: 'RPG' },
  { id: 'streaming', name: 'Streaming' },
  { id: 'voucher', name: 'Voucher' }
]

// Games Data
const games = [
  { 
    name: 'Mobile Legends a', 
    slug: 'mobile-legends-a', 
    image: '/images/mobilelegendsA.png',
    category: 'moba',
    price: 15000,
    description: 'Diamond Mobile Legends termurah'
  },
  { 
    name: 'Free Fire', 
    slug: 'free-fire', 
    image: '/images/freefire.png',
    category: 'battle-royale',
    price: 10000,
    description: 'Diamond Free Fire instant'
  },
  { 
    name: 'PUBG Mobile', 
    slug: 'pubg-mobile-global', 
    image: '/images/pubgmobileglobal.png',
    category: 'battle-royale',
    price: 16000,
    description: 'UC PUBG Mobile global'
  },
  { 
    name: 'Genshin Impact', 
    slug: 'genshin-impact', 
    image: '/images/genshinimpact.png',
    category: 'rpg',
    price: 16000,
    description: 'Genesis Crystal Genshin'
  },
  { 
    name: 'Honor of Kings', 
    slug: 'honor-of-kings-global', 
    image: '/images/honorofkings.png',
    category: 'moba',
    price: 15000,
    description: 'Token Honor of Kings'
  },
  { 
    name: 'Netflix Premium', 
    slug: 'netflix-premium', 
    image: '/images/netflix.png',
    category: 'streaming',
    price: 54000,
    description: 'Akun Netflix Premium'
  },
  { 
    name: 'Steam Wallet', 
    slug: 'steam-wallet-code', 
    image: '/images/steam.png',
    category: 'voucher',
    price: 12000,
    description: 'Steam Wallet Code'
  },
  { 
    name: 'Roblox', 
    slug: 'voucher-roblox', 
    image: '/images/roblox.png',
    category: 'voucher',
    price: 12000,
    description: 'Robux Roblox'
  }
]

// Prepaid Services
const prepaidServices = [
  {
    id: 'telkomsel',
    name: 'Telkomsel',
    image: '/images/telkomsel.png',
    price: 5000,
    description: 'Pulsa Telkomsel'
  },
  {
    id: 'xl',
    name: 'XL Axiata',
    image: '/images/xl.png',
    price: 5000,
    description: 'Pulsa XL'
  },
  {
    id: 'indosat',
    name: 'Indosat',
    image: '/images/indosat.png',
    price: 5000,
    description: 'Pulsa Indosat'
  },
  {
    id: 'tri',
    name: 'Tri',
    image: '/images/tri.png',
    price: 5000,
    description: 'Pulsa Tri'
  }
]

// Featured Promotions
const featuredPromotions = [
  {
    id: 1,
    type: 'FLASH SALE',
    title: 'Diskon 20% Semua Game!',
    description: 'Dapatkan diskon hingga 20% untuk top up semua game favorit Anda.',
    discount: '20% OFF',
    validUntil: new Date('2024-12-31'),
    backgroundImage: '/images/promo-bg-1.jpg'
  }
]

// Computed
const filteredGames = computed(() => {
  if (activeCategory.value === 'all') {
    return games.slice(0, isMobile.value ? 4 : 8)
  }
  return games.filter(game => game.category === activeCategory.value).slice(0, isMobile.value ? 4 : 8)
})

// Methods
const openGameModal = (game) => {
  selectedGameSlug.value = game.slug
  selectedGameName.value = game.name
  showGameModal.value = true
}

const closeGameModal = () => {
  showGameModal.value = false
  selectedGameSlug.value = null
  selectedGameName.value = null
}

const openPrepaidModal = (service) => {
  selectedPrepaidService.value = service
  showPrepaidModal.value = true
}

const closePrepaidModal = () => {
  showPrepaidModal.value = false
  selectedPrepaidService.value = null
}

const claimPromotion = (promotion) => {
  // Handle promotion claim
  console.log('Claiming promotion:', promotion)
  // You can add actual promotion claim logic here
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2rem;
  text-align: center;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.view-all-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.view-all-link:hover {
  color: #2563eb;
}

/* Promotions Section */
.promotions-section {
  padding: 4rem 0;
  background: #f8fafc;
}

.promotions-grid {
  display: grid;
  gap: 2rem;
}

/* Games Section */
.games-section {
  padding: 4rem 0;
}

.game-filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  color: #64748b;
}

.filter-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.filter-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.mobile-category-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* Transition styles for games grid */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-active {
  position: absolute;
}

/* Prepaid Section */
.prepaid-section {
  padding: 4rem 0;
  background: #f8fafc;
}

.prepaid-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

/* Features Section */
.features-section {
  padding: 4rem 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.feature-description {
  color: #64748b;
  line-height: 1.6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .section-title {
    font-size: 1.5rem;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .games-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .feature-card {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .games-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .prepaid-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
