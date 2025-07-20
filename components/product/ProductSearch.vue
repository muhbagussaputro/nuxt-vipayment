<template>
  <div class="product-search">
    <div class="search-container">
      <div class="search-input-wrapper">
        <input 
          v-model="searchQuery"
          type="text" 
          :placeholder="placeholder"
          class="search-input"
          @input="handleSearch"
          @keyup.enter="performSearch"
          @focus="showSuggestions = true"
          @blur="hideSuggestions"
        />
        <button class="search-btn" @click="performSearch">
          🔍
        </button>
        <button 
          v-if="searchQuery" 
          class="clear-btn" 
          @click="clearSearch"
        >
          ✕
        </button>
      </div>
      
      <div v-if="showSuggestionsDropdown && suggestions.length > 0" class="suggestions">
        <div 
          v-for="suggestion in suggestions" 
          :key="suggestion.id"
          class="suggestion-item"
          @click="selectSuggestion(suggestion)"
        >
          <div class="suggestion-icon">
            <img v-if="suggestion.image" :src="suggestion.image" :alt="suggestion.name" />
            <span v-else class="icon-placeholder">{{ suggestion.type === 'game' ? '🎮' : '📱' }}</span>
          </div>
          <div class="suggestion-content">
            <span class="suggestion-name">{{ suggestion.name }}</span>
            <span class="suggestion-type">{{ suggestion.category }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="showRecentSearches && recentSearches.length > 0 && !searchQuery" class="recent-searches">
      <h4 class="recent-title">Pencarian Terakhir</h4>
      <div class="recent-items">
        <button 
          v-for="search in recentSearches" 
          :key="search"
          class="recent-item"
          @click="setSearch(search)"
        >
          {{ search }}
          <span class="recent-remove" @click.stop="removeRecentSearch(search)">✕</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  placeholder: {
    type: String,
    default: 'Cari game, layanan, atau produk...'
  },
  showSuggestions: {
    type: Boolean,
    default: true
  },
  showRecentSearches: {
    type: Boolean,
    default: true
  },
  debounceMs: {
    type: Number,
    default: 300
  }
})

const emit = defineEmits(['search', 'suggestion-select'])

const searchQuery = ref('')
const suggestions = ref([])
const recentSearches = ref([])
const searchTimeout = ref(null)
const showSuggestionsDropdown = ref(false)

// Sample suggestions data
const sampleSuggestions = [
  { id: 1, name: 'Mobile Legends', category: 'MOBA Game', type: 'game', image: '/images/mobilelegendsA.png' },
  { id: 2, name: 'Free Fire', category: 'Battle Royale', type: 'game', image: '/images/freefire.png' },
  { id: 3, name: 'PUBG Mobile', category: 'Battle Royale', type: 'game', image: '/images/pubgmobileglobal.png' },
  { id: 4, name: 'Genshin Impact', category: 'RPG Game', type: 'game', image: '/images/genshinimpact.png' },
  { id: 5, name: 'Roblox', category: 'Sandbox Game', type: 'game', image: '/images/roblox.png' },
  { id: 6, name: 'Netflix', category: 'Streaming', type: 'voucher', image: '/images/netflix.png' },
  { id: 7, name: 'Steam Wallet', category: 'Gaming Platform', type: 'voucher', image: '/images/steam.png' },
  { id: 8, name: 'Telkomsel', category: 'Pulsa & Data', type: 'prepaid', image: null },
  { id: 9, name: 'Indosat', category: 'Pulsa & Data', type: 'prepaid', image: null },
  { id: 10, name: 'XL Axiata', category: 'Pulsa & Data', type: 'prepaid', image: null }
]

// Load recent searches from localStorage
onMounted(() => {
  const saved = localStorage.getItem('vipayment-recent-searches')
  if (saved) {
    try {
      recentSearches.value = JSON.parse(saved)
    } catch (error) {
      console.error('Error parsing recent searches:', error)
      recentSearches.value = []
    }
  }
})

const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    if (searchQuery.value.length > 0) {
      // Filter suggestions based on search query
      suggestions.value = sampleSuggestions.filter(item => 
        item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.value.toLowerCase())
      ).slice(0, 5)
      showSuggestionsDropdown.value = props.showSuggestions
    } else {
      suggestions.value = []
      showSuggestionsDropdown.value = false
    }
  }, props.debounceMs)
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    addToRecentSearches(searchQuery.value.trim())
    emit('search', searchQuery.value.trim())
    hideSuggestions()
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  suggestions.value = []
  showSuggestionsDropdown.value = false
  emit('search', '')
}

const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion.name
  suggestions.value = []
  showSuggestionsDropdown.value = false
  addToRecentSearches(suggestion.name)
  emit('suggestion-select', suggestion)
}

const setSearch = (search) => {
  searchQuery.value = search
  performSearch()
}

const addToRecentSearches = (search) => {
  const searches = recentSearches.value.filter(s => s !== search)
  searches.unshift(search)
  recentSearches.value = searches.slice(0, 5)
  
  try {
    localStorage.setItem('vipayment-recent-searches', JSON.stringify(recentSearches.value))
  } catch (error) {
    console.error('Error saving recent searches:', error)
  }
}

const removeRecentSearch = (search) => {
  recentSearches.value = recentSearches.value.filter(s => s !== search)
  try {
    localStorage.setItem('vipayment-recent-searches', JSON.stringify(recentSearches.value))
  } catch (error) {
    console.error('Error saving recent searches:', error)
  }
}

const hideSuggestions = () => {
  // Delay hiding to allow click events on suggestions
  setTimeout(() => {
    showSuggestionsDropdown.value = false
  }, 150)
}

// Watch for search query changes
watch(searchQuery, (newValue) => {
  if (!newValue) {
    suggestions.value = []
    showSuggestionsDropdown.value = false
  }
})
</script>

<style scoped>
.product-search {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search-container {
  position: relative;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-input-wrapper:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1), 0 4px 12px rgba(0, 0, 0, 0.15);
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  outline: none;
  font-size: 1rem;
  background: transparent;
  color: #1e293b;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-btn {
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.125rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: scale(1.05);
}

.clear-btn {
  position: absolute;
  right: 4rem;
  top: 50%;
  transform: translateY(-50%);
  background: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.clear-btn:hover {
  background: #e2e8f0;
  color: #475569;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  z-index: 50;
  margin-top: 0.5rem;
  overflow: hidden;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f1f5f9;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.suggestion-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  flex-shrink: 0;
}

.suggestion-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icon-placeholder {
  font-size: 1.25rem;
}

.suggestion-content {
  flex: 1;
  min-width: 0;
}

.suggestion-name {
  display: block;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.suggestion-type {
  display: block;
  font-size: 0.875rem;
  color: #64748b;
}

.recent-searches {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.recent-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.recent-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.recent-item:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.recent-remove {
  font-size: 0.75rem;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.recent-item:hover .recent-remove {
  opacity: 1;
}

@media (max-width: 768px) {
  .search-input-wrapper {
    border-radius: 0.5rem;
  }
  
  .search-input {
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
  }
  
  .search-btn {
    padding: 0.875rem 1rem;
    font-size: 1rem;
  }
  
  .clear-btn {
    right: 3.5rem;
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.75rem;
  }
  
  .suggestion-item {
    padding: 0.875rem 1rem;
  }
  
  .suggestion-icon {
    width: 2rem;
    height: 2rem;
  }
  
  .recent-searches {
    padding: 1rem;
    margin-top: 1rem;
  }
  
  .recent-items {
    gap: 0.375rem;
  }
  
  .recent-item {
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  .search-input {
    padding: 0.75rem;
  }
  
  .search-btn {
    padding: 0.75rem;
  }
  
  .clear-btn {
    right: 3rem;
  }
}
</style>