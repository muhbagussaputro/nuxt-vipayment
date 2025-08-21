import { ref } from 'vue'

export const useServiceCache = () => {
  // Cache storage
  const serviceCache = ref(new Map())
  const cacheTimeout = 5 * 60 * 1000 // 5 minutes

  // Get cache key
  const getCacheKey = (type, value, status) => {
    return `${type}_${value}_${status || 'all'}`
  }

  // Check if cache is valid
  const isCacheValid = (timestamp) => {
    return Date.now() - timestamp < cacheTimeout
  }

  // Fetch services with cache
  const fetchServicesWithCache = async (filterType, filterValue, filterStatus = 'available') => {
    const cacheKey = getCacheKey(filterType, filterValue, filterStatus)
    const cached = serviceCache.value.get(cacheKey)

    // Return cached data if valid
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data
    }

    // Fetch new data
    try {
      const config = useRuntimeConfig()
      const response = await $fetch('/vipayment/game/services', {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: {
          filter_type: filterType,
          filter_value: filterValue,
          filter_status: filterStatus
        }
      })

      // Extract data array from response structure { result, data, message }
      const serviceData = response.result && response.data ? response : { data: [] }

      // Cache the result
      serviceCache.value.set(cacheKey, {
        data: serviceData,
        timestamp: Date.now()
      })

      return serviceData
    } catch (error) {
      console.error('Error fetching services:', error)
      throw error
    }
  }

  // Clear cache for specific key
  const clearCache = (filterType, filterValue, filterStatus) => {
    const cacheKey = getCacheKey(filterType, filterValue, filterStatus)
    serviceCache.value.delete(cacheKey)
  }

  // Clear all cache
  const clearAllCache = () => {
    serviceCache.value.clear()
  }

  // Get cache size
  const getCacheSize = () => {
    return serviceCache.value.size
  }

  return {
    fetchServicesWithCache,
    clearCache,
    clearAllCache,
    getCacheSize
  }
} 