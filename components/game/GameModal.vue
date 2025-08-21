<template>
  <div>
    <div v-if="show && !selectedService" class="modal-backdrop" @click.self="close">
      <div class="modal-content-responsive" :class="{ 'animate-slide-up-delay': mounted }">
        <button class="modal-close" @click="close">×</button>
        
        <div v-if="loading" class="modal-body text-center">
          <div class="loading loading-lg"></div>
          <p class="mt-4 text-secondary">Loading layanan game...</p>
        </div>
        
        <div v-else-if="error" class="modal-body text-center">
          <p class="text-error">{{ error }}</p>
        </div>
        
        <div v-else-if="services?.data?.length" class="modal-body">
          <h4 class="text-xl font-semibold mb-4">Daftar Layanan Game</h4>
          <div v-if="gameName" class="mb-6">
            <span class="text-secondary">Untuk game </span>
            <span class="text-primary font-semibold">{{ gameName }}</span>
          </div>
          
          <!-- Search Input -->
          <div class="search-container">
            <div class="search-input-wrapper">
              <span class="search-icon">🔍</span>
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Cari layanan..."
                class="search-input"
              />
              <button 
                v-if="searchQuery" 
                @click="clearSearch" 
                class="clear-search"
              >
                ×
              </button>
            </div>
          </div>
          
          <div class="service-container">
            <div 
              v-for="(item, index) in filteredServices" 
              :key="item.code" 
              class="service-item-wrapper"
            >
              <div class="service-card cursor-pointer" @click="toggleBuyForm(item.code)">
                <div class="service-content">
                  <div class="service-name-section">
                    <h5 class="service-title">{{ item.name }}</h5>
                  </div>
                  
                  <div class="service-price-section">
                    <span class="price-icon">💎</span>
                    <span class="price-text">{{ formatPrice(item.price.basic) }}</span>
                  </div>
                  
                  <div class="service-status-section">
                    <span :class="[
                      'status-badge',
                      item.status === 'available' ? 'status-available' : 'status-unavailable'
                    ]">
                      {{ formatStatus(item.status) }}
                    </span>
                  </div>
                </div>
              </div>
              
              <GameBuyForm
                v-if="openedServiceCode === item.code"
                :service="{
                  ...item,
                  gameName: props.gameName,
                  gameSlug: props.slug
                }"
                @close="closeBuyForm"
                @success="onBuySuccess"
              />
            </div>
          </div>
          
          <!-- No Results -->
          <div v-if="filteredServices.length === 0" class="no-results">
            <p class="text-secondary text-center">Tidak ada layanan yang ditemukan untuk "{{ searchQuery }}"</p>
          </div>
        </div>
        
        <div v-else class="modal-body text-center">
          <p class="text-secondary">Tidak ada layanan ditemukan.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useServiceCache } from '~/composables/useServiceCache'
import { useFormatters } from '~/composables/useFormatters'
import GameBuyForm from '~/components/game/GameBuyForm.vue'

const props = defineProps({
  show: Boolean,
  slug: String,
  gameName: String,
})
const emit = defineEmits(['close'])

const { fetchServicesWithCache } = useServiceCache()
const { formatPrice, formatStatus } = useFormatters()

const services = ref(null)
const loading = ref(false)
const error = ref('')
const openedServiceCode = ref(null)
const selectedService = ref(null)
const searchQuery = ref('')
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})

// Computed property for filtered services
const filteredServices = computed(() => {
  if (!services.value?.data || !searchQuery.value) {
    return services.value?.data || []
  }
  
  const query = searchQuery.value.toLowerCase()
  return services.value.data.filter(item => 
    item.name.toLowerCase().includes(query) ||
    item.code.toLowerCase().includes(query)
  )
})

function clearSearch() {
  searchQuery.value = ''
}

watch(() => props.show, async (val) => {
  if (val && props.slug) {
    await fetchServices()
  }
  if (!val) {
    services.value = null
    error.value = ''
    selectedService.value = null
    searchQuery.value = ''
  }
})

watch(() => props.slug, async (val) => {
  if (props.show && val) {
    await fetchServices()
  }
})

async function fetchServices() {
  loading.value = true
  error.value = ''
  services.value = null
  try {
    const data = await fetchServicesWithCache(props.gameName, 'available')
    services.value = data
  } catch (e) {
    error.value = 'Gagal mengambil layanan game.'
  } finally {
    loading.value = false
  }
}

function close() {
  emit('close')
}

function toggleBuyForm(code) {
  openedServiceCode.value = (openedServiceCode.value === code) ? null : code
}

function closeBuyForm() {
  openedServiceCode.value = null
}

function onBuySuccess(data) {
  console.log('Transaksi berhasil:', data)
}
</script>

<style scoped>
/* Animation classes to replace v-motion */
.animate-slide-up {
  animation: slideUp 0.6s ease-out forwards;
}

.animate-slide-up-delay {
  animation: slideUp 0.6s ease-out 0.1s forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-content-responsive {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
  animation: slideIn 0.2s ease;
  width: 95vw;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
}

/* Search Styles */
.search-container {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  padding-bottom: 1rem;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: #64748b;
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
  transform: translateY(-2px);
}

.clear-search {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.clear-search:hover {
  background-color: #f1f5f9;
  color: #ef4444;
}

.service-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.service-item-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.service-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.service-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px) scale(1.01);
  background: linear-gradient(45deg, #e0f2fe, #bfdbfe);
}

.service-content {
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  align-items: center;
  min-height: 60px;
}

.service-name-section {
  min-width: 0;
}

.service-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: #3b82f6;
  line-height: 1.3;
  word-wrap: break-word;
  overflow-wrap: break-word;
  margin: 0;
}

.service-price-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  justify-content: center;
}

.price-icon {
  font-size: 1.1rem;
}

.price-text {
  font-weight: 600;
  color: #3b82f6;
  font-size: 0.9rem;
}

.service-status-section {
  display: flex;
  justify-content: flex-end;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
}

.status-available {
  background-color: #d1fae5;
  color: #065f46;
}

.status-unavailable {
  background-color: #fee2e2;
  color: #991b1b;
}

.no-results {
  padding: 2rem;
  text-align: center;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .modal-content-responsive {
    width: 98vw;
    margin: 0.5rem;
    max-width: calc(100vw - 1rem);
  }
  
  .service-content {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    text-align: center;
    padding: 0.875rem;
  }
  
  .service-name-section {
    order: 1;
  }
  
  .service-price-section {
    order: 2;
    justify-content: center;
  }
  
  .service-status-section {
    order: 3;
    justify-content: center;
  }
  
  .service-title {
    font-size: 0.875rem;
    text-align: center;
  }
  
  .price-text {
    font-size: 0.875rem;
  }
  
  .search-input {
    font-size: 0.8rem;
    padding: 0.625rem 1rem 0.625rem 2.25rem;
  }
}

/* Tablet */
@media (min-width: 641px) and (max-width: 768px) {
  .modal-content-responsive {
    width: 90vw;
    max-width: 700px;
  }
  
  .service-content {
    grid-template-columns: 2fr 1fr auto;
    gap: 0.875rem;
  }
  
  .service-title {
    font-size: 0.9rem;
  }
}

/* Small screens */
@media (max-width: 480px) {
  .service-content {
    padding: 0.75rem;
  }
  
  .service-title {
    font-size: 0.8rem;
  }
  
  .price-text {
    font-size: 0.8rem;
  }
  
  .status-badge {
    font-size: 0.65rem;
    padding: 0.2rem 0.5rem;
  }
}
</style>
