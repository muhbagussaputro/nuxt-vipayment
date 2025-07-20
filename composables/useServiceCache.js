import { ref, readonly } from 'vue'

const servicesCache = ref(new Map())
const cacheExpiry = ref(new Map())
const CACHE_DURATION = 15 * 60 * 1000 // 15 menit

export const useServiceCache = () => {
  const getCacheKey = (gameName, filterStatus = 'available') => {
    return `${gameName}_${filterStatus}`
  }

  const isExpired = (key) => {
    const expiry = cacheExpiry.value.get(key)
    if (!expiry) return true
    return Date.now() > expiry
  }

  const setCache = (key, data) => {
    servicesCache.value.set(key, data)
    cacheExpiry.value.set(key, Date.now() + CACHE_DURATION)
  }

  const getCache = (key) => {
    if (isExpired(key)) {
      servicesCache.value.delete(key)
      cacheExpiry.value.delete(key)
      return null
    }
    return servicesCache.value.get(key)
  }

  const clearCache = (key = null) => {
    if (key) {
      servicesCache.value.delete(key)
      cacheExpiry.value.delete(key)
    } else {
      servicesCache.value.clear()
      cacheExpiry.value.clear()
    }
  }

  const fetchServicesWithCache = async (gameName, filterStatus = 'available') => {
    const cacheKey = getCacheKey(gameName, filterStatus)
    
    const cachedData = getCache(cacheKey)
    if (cachedData) {
      console.log('📦 Cache hit:', gameName)
      return cachedData
    }

    console.log('🌐 API call:', gameName)
    try {
      const { data } = await useFetch('/vipayment/game/services', {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'POST',
        body: {
          filter_type: 'game',
          filter_value: gameName,
          filter_status: filterStatus
        }
      })
      
      const result = data.value
      setCache(cacheKey, result)
      return result
    } catch (error) {
      throw error
    }
  }

  return {
    servicesCache: readonly(servicesCache),
    fetchServicesWithCache,
    clearCache,
    getCacheKey
  }
}