import { ref, onMounted, onUnmounted } from 'vue'

export const useResponsive = () => {
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)

  const updateResponsive = () => {
    const width = window.innerWidth
    isMobile.value = width < 768
    isTablet.value = width >= 768 && width < 1024
    isDesktop.value = width >= 1024
  }

  onMounted(() => {
    updateResponsive()
    window.addEventListener('resize', updateResponsive)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateResponsive)
  })

  return {
    isMobile,
    isTablet,
    isDesktop
  }
} 