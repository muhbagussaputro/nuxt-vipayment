<template>
  <div class="product-filter">
    <div class="filter-section">
      <label class="filter-label">Kategori:</label>
      <select 
        :value="selectedCategory" 
        @change="$emit('update:category', $event.target.value)"
        class="filter-select"
      >
        <option value="all">Semua Kategori</option>
        <option 
          v-for="category in categories" 
          :key="category.value"
          :value="category.value"
        >
          {{ category.label }}
        </option>
      </select>
    </div>
    
    <div class="filter-section" v-if="showPriceRange">
      <label class="filter-label">Harga:</label>
      <select 
        :value="selectedPriceRange" 
        @change="$emit('update:priceRange', $event.target.value)"
        class="filter-select"
      >
        <option value="all">Semua Harga</option>
        <option value="0-50000">Di bawah 50rb</option>
        <option value="50000-100000">50rb - 100rb</option>
        <option value="100000-200000">100rb - 200rb</option>
        <option value="200000-500000">200rb - 500rb</option>
        <option value="500000+">Di atas 500rb</option>
      </select>
    </div>
    
    <div class="filter-section" v-if="showSorting">
      <label class="filter-label">Urutkan:</label>
      <select 
        :value="selectedSort" 
        @change="$emit('update:sort', $event.target.value)"
        class="filter-select"
      >
        <option value="popular">Terpopuler</option>
        <option value="price-low">Harga Terendah</option>
        <option value="price-high">Harga Tertinggi</option>
        <option value="newest">Terbaru</option>
        <option value="rating">Rating Tertinggi</option>
      </select>
    </div>
    
    <button 
      v-if="hasActiveFilters" 
      @click="clearFilters"
      class="clear-filters-btn"
    >
      Reset Filter
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  selectedCategory: {
    type: String,
    default: 'all'
  },
  selectedPriceRange: {
    type: String,
    default: 'all'
  },
  selectedSort: {
    type: String,
    default: 'popular'
  },
  showPriceRange: {
    type: Boolean,
    default: true
  },
  showSorting: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits([
  'update:category',
  'update:priceRange',
  'update:sort',
  'clear-filters'
])

const hasActiveFilters = computed(() => {
  return props.selectedCategory !== 'all' || 
         props.selectedPriceRange !== 'all' || 
         props.selectedSort !== 'popular'
})

const clearFilters = () => {
  emit('update:category', 'all')
  emit('update:priceRange', 'all')
  emit('update:sort', 'popular')
  emit('clear-filters')
}
</script>

<style scoped>
.product-filter {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  transition: border-color 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.clear-filters-btn {
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.clear-filters-btn:hover {
  background: #dc2626;
}

@media (max-width: 768px) {
  .product-filter {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-section {
    justify-content: space-between;
  }
  
  .filter-select {
    flex: 1;
  }
}
</style>