import { ref, onMounted, onUnmounted } from 'vue'

export const useResponsive = () => {
  const windowWidth = ref(0)
  const isMobile = computed(() => windowWidth.value < 768)
  const isTablet = computed(() => windowWidth.value >= 768 && windowWidth.value < 1024)
  const isDesktop = computed(() => windowWidth.value >= 1024)
  
  const updateWidth = () => {
    windowWidth.value = window.innerWidth
  }
  
  onMounted(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
  })
  
  return {
    windowWidth: readonly(windowWidth),
    isMobile,
    isTablet,
    isDesktop
  }
}