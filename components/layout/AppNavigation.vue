<template>
  <nav class="app-navigation">
    <div class="nav-container">
      <div class="nav-brand">
        <NuxtLink to="/" class="brand-link">
          <span class="brand-text">VIPayment</span>
        </NuxtLink>
      </div>
      
      <div class="nav-menu" :class="{ 'nav-menu-open': isMenuOpen }">
        <NuxtLink 
          v-for="item in navigationItems" 
          :key="item.path"
          :to="item.path" 
          class="nav-link"
          @click="closeMenu"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          {{ item.label }}
        </NuxtLink>
      </div>
      
      <div class="nav-actions">
        <button class="search-btn" @click="toggleSearch">
          🔍
        </button>
        <NuxtLink to="/profile" class="profile-btn">
          👤
        </NuxtLink>
        <button class="menu-toggle" @click="toggleMenu">
          <span class="hamburger"></span>
          <span class="hamburger"></span>
          <span class="hamburger"></span>
        </button>
      </div>
    </div>
    
    <!-- Search Overlay -->
    <div v-if="isSearchOpen" class="search-overlay" @click="closeSearch">
      <div class="search-container" @click.stop>
        <input 
          ref="searchInput"
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari game, layanan, atau promo..."
          class="search-input"
          @keyup.enter="performSearch"
        />
        <button class="search-close" @click="closeSearch">✕</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
const isMenuOpen = ref(false)
const isSearchOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

const navigationItems = [
  { path: '/', label: 'Beranda', icon: '🏠' },
  { path: '/game', label: 'Game', icon: '🎮' },
  { path: '/prepaid', label: 'Pulsa & Data', icon: '📱' },
  { path: '/promotion', label: 'Promo', icon: '🎁' },
]

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value
  if (isSearchOpen.value) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
}

const closeSearch = () => {
  isSearchOpen.value = false
  searchQuery.value = ''
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    // Implement search logic
    console.log('Searching for:', searchQuery.value)
    closeSearch()
  }
}

// Close menu on route change
watch(() => useRoute().path, () => {
  closeMenu()
  closeSearch()
})
</script>

<style scoped>
.app-navigation {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

.nav-brand {
  flex-shrink: 0;
}

.brand-link {
  text-decoration: none;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #3b82f6;
  background: #eff6ff;
}

.nav-icon {
  font-size: 1.125rem;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-btn,
.profile-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  background: #f1f5f9;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  color: #64748b;
  font-size: 1.125rem;
}

.search-btn:hover,
.profile-btn:hover {
  background: #e2e8f0;
  color: #3b82f6;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger {
  width: 1.5rem;
  height: 2px;
  background: #64748b;
  transition: all 0.3s;
}

.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 5rem;
  z-index: 1000;
}

.search-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 1rem;
}

.search-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  font-size: 1.125rem;
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  outline: none;
}

.search-close {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #64748b;
}

@media (max-width: 768px) {
  .nav-menu {
    position: fixed;
    top: 4rem;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
  }
  
  .nav-menu-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .nav-link {
    width: 100%;
    justify-content: flex-start;
  }
  
  .menu-toggle {
    display: flex;
  }
}
</style>