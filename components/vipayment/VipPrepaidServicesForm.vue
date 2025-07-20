<template>
  <div class="prepaid-services-container">
    <!-- Search and Filter -->
    <div class="search-filter-section">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari layanan prepaid..."
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
      
      <select v-model="selectedCategory" class="category-filter">
        <option value="">Semua Kategori</option>
        <option value="pulsa">Pulsa</option>
        <option value="data">Paket Data</option>
        <option value="pln">PLN</option>
        <option value="voucher">Voucher</option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading loading-lg"></div>
      <p class="loading-text">Memuat layanan prepaid...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <p class="error-text">{{ error }}</p>
      <button @click="fetchServices" class="retry-btn">Coba Lagi</button>
    </div>

    <!-- Services Grid -->
    <div v-else-if="filteredServices.length" class="services-grid">
      <div 
        v-for="service in filteredServices" 
        :key="service.code" 
        class="service-card"
        @click="selectService(service)"
      >
        <div class="service-header">
          <h3 class="service-name">{{ service.name }}</h3>
          <span :class="[
            'service-status',
            service.status === 'available' ? 'status-available' : 'status-unavailable'
          ]">
            {{ formatStatus(service.status) }}
          </span>
        </div>
        
        <div class="service-details">
          <div class="service-price">
            <span class="price-label">Harga:</span>
            <span class="price-value">{{ formatPrice(service.price.basic) }}</span>
          </div>
          
          <div v-if="service.category" class="service-category">
            <span class="category-badge">{{ service.category }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results -->
    <div v-else class="no-results">
      <p class="no-results-text">
        {{ searchQuery ? `Tidak ada layanan yang ditemukan untuk "${searchQuery}"` : 'Tidak ada layanan tersedia' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFormatters } from '~/composables/useFormatters'
import { useServiceCache } from '~/composables/useServiceCache'

const emit = defineEmits(['service-selected'])

const { formatPrice, formatStatus } = useFormatters()
const { fetchServicesWithCache } = useServiceCache()

const services = ref([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const selectedCategory = ref('')

const filteredServices = computed(() => {
  let filtered = services.value
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(service => 
      service.name.toLowerCase().includes(query) ||
      service.code.toLowerCase().includes(query)
    )
  }
  
  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(service => 
      service.category === selectedCategory.value
    )
  }
  
  return filtered
})

function clearSearch() {
  searchQuery.value = ''
}

function selectService(service) {
  emit('service-selected', service)
}

async function fetchServices() {
  loading.value = true
  error.value = ''
  try {
    const data = await fetchServicesWithCache('prepaid', 'available')
    services.value = data.data || []
  } catch (e) {
    error.value = 'Gagal memuat layanan prepaid'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchServices()
})
</script>

<style scoped>
.prepaid-services-container {
  padding: 1rem;
}

.search-filter-section {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  margin-bottom: 1.5rem;
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
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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

.category-filter {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  font-size: 0.875rem;
  outline: none;
  min-width: 150px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-filter:hover {
  border-color: #a7b7c7;
  transform: translateY(-2px);
}

.category-filter:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.loading-container, .error-container {
  text-align: center;
  padding: 3rem 1rem;
}

.loading-text {
  margin-top: 1rem;
  color: #64748b;
}

.error-text {
  color: #ef4444;
  margin-bottom: 1rem;
}

.retry-btn {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background-color: #2563eb;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.service-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.service-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px) scale(1.01);
  background: linear-gradient(45deg, #e0f2fe, #bfdbfe);
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.service-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  line-height: 1.4;
}

.service-status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
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

.service-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-price {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.price-label {
  font-size: 0.75rem;
  color: #64748b;
}

.price-value {
  font-size: 1rem;
  font-weight: 600;
  color: #3b82f6;
}

.category-badge {
  background-color: #f1f5f9;
  color: #475569;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.no-results {
  text-align: center;
  padding: 3rem 1rem;
}

.no-results-text {
  color: #64748b;
  font-size: 0.875rem;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .search-filter-section {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
  }
  
  .service-card {
    padding: 1rem;
  }
  
  .service-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .service-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .prepaid-services-container {
    padding: 0.75rem;
  }
  
  .service-name {
    font-size: 0.875rem;
  }
  
  .search-input {
    font-size: 0.8rem;
    padding: 0.625rem 1rem 0.625rem 2.25rem;
  }
}
</style>
