import { ref, readonly } from 'vue'

export const useLoadingState = () => {
  const isLoading = ref(false)
  const loadingMessage = ref('')
  
  const setLoading = (loading, message = '') => {
    isLoading.value = loading
    loadingMessage.value = message
  }
  
  const withLoading = async (asyncFunction, message = 'Memuat...') => {
    setLoading(true, message)
    try {
      const result = await asyncFunction()
      return result
    } finally {
      setLoading(false)
    }
  }
  
  return {
    isLoading: readonly(isLoading),
    loadingMessage: readonly(loadingMessage),
    setLoading,
    withLoading
  }
} 