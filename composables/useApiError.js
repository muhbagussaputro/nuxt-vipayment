export const useApiError = () => {
  const formatError = (error) => {
    // Handle different error types
    if (typeof error === 'string') {
      return error
    }
    
    if (error?.data?.message) {
      return error.data.message
    }
    
    if (error?.response?.data?.message) {
      return error.response.data.message
    }
    
    if (error?.message) {
      return error.message
    }
    
    // Network errors
    if (error?.code === 'NETWORK_ERROR' || !navigator.onLine) {
      return 'Koneksi internet bermasalah. Silakan periksa koneksi Anda.'
    }
    
    // Timeout errors
    if (error?.code === 'TIMEOUT' || error?.name === 'TimeoutError') {
      return 'Permintaan memakan waktu terlalu lama. Silakan coba lagi.'
    }
    
    // Server errors
    if (error?.status >= 500) {
      return 'Terjadi masalah pada server. Silakan coba beberapa saat lagi.'
    }
    
    // Client errors
    if (error?.status >= 400 && error?.status < 500) {
      return 'Permintaan tidak valid. Silakan periksa data yang dimasukkan.'
    }
    
    return 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.'
  }
  
  const handleApiCall = async (apiFunction, fallbackMessage = 'Terjadi kesalahan') => {
    try {
      return await apiFunction()
    } catch (error) {
      console.error('API Error:', error)
      throw new Error(formatError(error) || fallbackMessage)
    }
  }
  
  return {
    formatError,
    handleApiCall
  }
} 