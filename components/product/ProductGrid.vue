<template>
  <div class="product-grid">
    <div class="grid-header" v-if="showHeader">
      <h3 class="grid-title">{{ title }}</h3>
      <div class="grid-controls">
        <ProductFilter 
          v-if="showFilter"
          :categories="categories"
          :selected-category="selectedCategory"
          @update:category="$emit('update:category', $event)"
        />
        <div class="view-toggle">
          <button 
            :class="['view-btn', { active: viewMode === 'grid' }]"
            @click="$emit('update:viewMode', 'grid')"
          >
            ⊞
          </button>
          <button 
            :class="['view-btn', { active: viewMode === 'list' }]"
            @click="$emit('update:viewMode', 'list')"
          >
            ☰
          </button>
        </div>
      </div>
    </div>
    
    <div 
      :class="[
        'products-container',
        viewMode === 'list' ? 'list-view' : 'grid-view'
      ]"
    >
      <ProductCard 
        v-for="product in products" 
        :key="product.id"
        :product="product"
        :view-mode="viewMode"
        @click="$emit('product-click', product)"
      />
    </div>
    
    <div v-if="products.length === 0" class="empty-state">
      <div class="empty-icon">🔍</div>
      <h4>Tidak ada produk ditemukan</h4>
      <p>Coba ubah filter atau kata kunci pencarian Anda</p>
    </div>
    
    <div v-if="showLoadMore && hasMore" class="load-more">
      <button class="load-more-btn" @click="$emit('load-more')" :disabled="loading">
        {{ loading ? 'Memuat...' : 'Muat Lebih Banyak' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import ProductCard from './ProductCard.vue'
import ProductFilter from './ProductFilter.vue'

defineProps({
  products: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: 'Produk'
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showFilter: {
    type: Boolean,
    default: true
  },
  categories: {
    type: Array,
    default: () => []
  },
  selectedCategory: {
    type: String,
    default: 'all'
  },
  viewMode: {
    type: String,
    default: 'grid'
  },
  showLoadMore: {
    type: Boolean,
    default: false
  },
  hasMore: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits([
  'update:category',
  'update:viewMode',
  'product-click',
  'load-more'
])
</script>

<style scoped>
.product-grid {
  width: 100%;
}

.grid-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.grid-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.grid-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.view-toggle {
  display: flex;
  background: #f1f5f9;
  border-radius: 0.5rem;
  padding: 0.25rem;
}

.view-btn {
  padding: 0.5rem;
  background: none;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  color: #64748b;
  transition: all 0.2s;
}

.view-btn.active {
  background: white;
  color: #3b82f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.products-container.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.products-container.list-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #64748b;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.load-more {
  text-align: center;
  margin-top: 2rem;
}

.load-more-btn {
  padding: 0.75rem 2rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.load-more-btn:hover:not(:disabled) {
  background: #2563eb;
}

.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .grid-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .grid-controls {
    justify-content: space-between;
  }
  
  .products-container.grid-view {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>