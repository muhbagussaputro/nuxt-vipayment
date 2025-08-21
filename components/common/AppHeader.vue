<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo">
          <NuxtLink to="/" class="logo-link">
            <h1 class="logo-text">Layanan Murah</h1>
          </NuxtLink>
        </div>

        <!-- Navigation Desktop -->
        <nav class="nav-desktop" v-if="!isMobile">
          <NuxtLink to="/" class="nav-link" :class="{ active: $route.path === '/' }">
            Home
          </NuxtLink>
          <NuxtLink to="/game" class="nav-link" :class="{ active: $route.path.startsWith('/game') }">
            Game
          </NuxtLink>
          <NuxtLink to="/prepaid" class="nav-link" :class="{ active: $route.path === '/prepaid' }">
            Prepaid
          </NuxtLink>
          <NuxtLink to="/promotion" class="nav-link" :class="{ active: $route.path === '/promotion' }">
            Promosi
          </NuxtLink>
          <NuxtLink to="/profile" class="nav-link" :class="{ active: $route.path === '/profile' }">
            Profile
          </NuxtLink>
        </nav>

        <!-- Mobile Menu Button -->
        <button v-if="isMobile" @click="toggleMobileMenu" class="mobile-menu-btn" :class="{ 'open': showMobileMenu }">
          <span class="hamburger"></span>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <Transition name="slide-fade">
        <nav v-if="isMobile && showMobileMenu" class="nav-mobile">
        <NuxtLink to="/" class="nav-link-mobile" @click="closeMobileMenu">
          Home
        </NuxtLink>
        <NuxtLink to="/game" class="nav-link-mobile" @click="closeMobileMenu">
          Game
        </NuxtLink>
        <NuxtLink to="/prepaid" class="nav-link-mobile" @click="closeMobileMenu">
          Prepaid
        </NuxtLink>
        <NuxtLink to="/promotion" class="nav-link-mobile" @click="closeMobileMenu">
          Promosi
        </NuxtLink>
        <NuxtLink to="/profile" class="nav-link-mobile" @click="closeMobileMenu">
          Profile
        </NuxtLink>
      </nav>
    </Transition>
    </div>
  </header>
</template>

<script setup>
const { isMobile } = useResponsive()
const showMobileMenu = ref(false)

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}
</script>

<style scoped>
.app-header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin: 0;
}

.nav-desktop {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover,
.nav-link.active {
  color: #3b82f6;
}

.mobile-menu-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger {
  display: block;
  width: 1.5rem;
  height: 2px;
  background: #64748b;
  position: relative;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background: #64748b;
  transition: 0.3s;
}

.hamburger::before {
  top: -6px;
}

.hamburger::after {
  bottom: -6px;
}

.mobile-menu-btn.open .hamburger {
  background: transparent;
}

.mobile-menu-btn.open .hamburger::before {
  transform: translateY(6px) rotate(45deg);
}

.mobile-menu-btn.open .hamburger::after {
  transform: translateY(-6px) rotate(-45deg);
}

.nav-mobile {
  border-top: 1px solid #e2e8f0;
  padding: 1rem 0;
}

/* Transition styles */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.nav-link-mobile {
  display: block;
  padding: 0.75rem 0;
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
}

.nav-link-mobile:hover {
  color: #3b82f6;
}
</style>