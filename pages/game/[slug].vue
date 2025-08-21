<template>
  <div class="container">
    <NuxtLink to="/" class="back-link">← Kembali</NuxtLink>
    <h2 class="main-title">Daftar Layanan untuk {{ gameName }}</h2>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="loading" class="loading">Loading layanan...</div>
    <div v-else-if="services && services.data && services.data.length">
      <div class="vip-card-grid">
        <div v-for="item in services.data" :key="item.code" class="vip-card">
          <div class="vip-card-header">
            <span class="vip-card-title">{{ item.name }}</span>
            <div class="vip-price-row">
              <span class="vip-icon">💎</span> 
              <span class="vip-price">{{ formatPrice(item.price.basic)}} </span>
            </div>
            <span :class="['vip-badge', item.status === 'available' ? 'vip-badge-available' : 'vip-badge-unavailable']">
              {{ item.status === 'available' ? 'Tersedia' : 'Tidak Tersedia' }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="services && (!services.data || !services.data.length)" class="empty">Tidak ada layanan ditemukan.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const services = ref(null)
const error = ref('')
const loading = ref(false)
const route = useRoute()
const router = useRouter()

const slug = computed(() => route.params.slug)
const gameName = computed(() => {
  // Mapping slug ke nama game
  const map = {
    'free-fire': 'Free Fire',
    'free-fire-max': 'Free Fire Max',
    'genshin-impact': 'Genshin Impact',
    'honor-of-kings-global': 'Honor of Kings Global',
    'mobile-legends-global': 'Mobile Legends (Global)',
    'mobile-legends-a': 'Mobile Legends A',
    'mobile-legends-b': 'Mobile Legends B',
    'mobile-legends-gift': 'Mobile Legends Gift',
    'mobile-legends-vilog': 'Mobile Legends Vilog',
    'tower-of-fantasy': 'Tower of Fantasy',
    'valorant': 'Valorant',
    'zepeto': 'Zepeto',
    'pubg-mobile-global': 'PUBG Mobile (GLOBAL)',
    'pubg-mobile-id': 'PUBG Mobile (ID)',
    'pubg-new-state-mobile': 'PUBG : New State Mobile',
    'league-of-legends': 'League of Legends',
    'ea-sports-fc-mobile': 'EA SPORTS FC Mobile',
    'steam-wallet-code': 'Steam Wallet Code',
    'voucher-roblox': 'Voucher Roblox',
    'voucher-garena-shell': 'Voucher Garena Shell',
    'wetv-premium': 'WETV Premium',
    'netflix-premium': 'Netflix Premium',
    'viu-premium': 'Viu Premium',
  }
  return map[slug.value] || slug.value
})

function formatPrice(price) {
  if (typeof price !== 'number') return '-';
  return price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).replace('IDR', 'Rp');
}

const fetchServices = async () => {
  loading.value = true
  error.value = ''
  services.value = null
  try {
    const { data } = await useFetch('/vipayment/game/services', {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'POST',
      body: {
        filter_type: 'game',
        filter_value: gameName.value,
        filter_status: 'available'
      }
    })
    // Response memiliki struktur { result: true, data: [...], message: "..." }
    if (data.value && data.value.result && data.value.data) {
      services.value = { data: data.value.data }
    } else {
      services.value = { data: [] }
    }
  } catch (e) {
    error.value = 'Gagal mengambil layanan game.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchServices)
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 40px auto;
  padding: 0 12px;
}
.main-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 18px;
}
.back-link {
  display: inline-block;
  margin: 18px 0 8px 0;
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}
.back-link:hover {
  text-decoration: underline;
}
.error {
  color: #f43f5e;
  text-align: center;
  margin: 24px 0;
}
.loading {
  text-align: center;
  color: #64748b;
  margin: 24px 0;
}
.empty {
  text-align: center;
  color: #64748b;
  margin: 24px 0;
}
.vip-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 12px;
}
.vip-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 18px 0 rgba(0,0,0,0.07), 0 1.5px 6px 0 rgba(0,0,0,0.03);
  border: 1px solid #e5e7eb;
  padding: 24px 20px 18px 20px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s, transform 0.2s;
  position: relative;
}
.vip-card:hover {
  box-shadow: 0 8px 28px 0 rgba(0,0,0,0.13), 0 4px 12px 0 rgba(0,0,0,0.09);
  transform: translateY(-4px) scale(1.02);
}
.vip-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 10px;
}
.vip-card-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #2563eb;
  flex: 1;
  margin-right: 8px;
}
.vip-badge {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 3px 12px;
  border-radius: 12px;
  display: inline-block;
  letter-spacing: 0.5px;
}
.vip-badge-available {
  background: #d1fae5;
  color: #047857;
  border: 1px solid #a7f3d0;
}
.vip-badge-unavailable {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}
.vip-price-row {
  font-size: 1.01rem;
  display: flex;
  align-items: center;
  gap: 8px;
}
.vip-icon {
  margin-right: 6px;
  font-size: 1.1em;
}
.vip-price {
  font-weight: 700;
  color: #ea580c;
}
</style>
