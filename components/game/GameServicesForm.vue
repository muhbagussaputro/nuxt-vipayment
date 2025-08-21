<template>
  <div class="form-container" :class="{ 'animate-slide-up': mounted }">
    <h3>Get Game Services</h3>
    <form @submit.prevent="fetchServices" class="flex gap-2 items-center mb-4" :class="{ 'animate-slide-up-delay': mounted }">
      <select v-model="selectedGame" class="vip-select">
        <option>Mobile Legends a</option>
        <option>Mobile Legends b</option>
        <option>Mobile Legends (Global)</option>
        <option>Free Fire</option>
        <option>Free Fire Max</option>
        <option>PUBG Mobile (GLOBAL)</option>
        <option>PUBG Mobile (ID)</option>
        <option>PUBG : New State Mobile</option>
        <option>League of Legends</option>
        <option>Genshin Impact</option>
        <option>EA SPORTS FC Mobile</option>
        <option>Honor of Kings Global</option>
        <option>Steam Wallet Code</option>
        <option>Voucher Roblox</option>
        <option>Voucher Garena Shell</option>
        <option>WETV Premium</option>
        <option>Netflix Premium</option>
        <option>Viu Premium</option>
        
        <!-- Tambah game lain di sini -->
      </select>
      <button type="submit" :disabled="loading">Lihat Layanan Game</button>
    </form>
    <div v-if="error" class="error" :class="{ 'animate-slide-up-delay-2': mounted }">{{ error }}</div>
    <div v-if="loading" class="flex justify-center items-center py-8" :class="{ 'animate-slide-up-delay-2': mounted }">
      <span>Loading layanan game...</span>
    </div>
    <div v-else-if="services && services.data && services.data.length" :class="{ 'animate-slide-up-delay-2': mounted }">
      <h4 class="mb-2 font-semibold text-lg">Daftar Layanan Game:</h4>
      <div v-if="selectedGame" class="game-title mb-6">Untuk game <span>{{ selectedGame }}</span></div>
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
    <div v-else-if="services && (!services.data || !services.data.length)" class="py-8 text-center text-gray-400" :class="{ 'animate-slide-up-delay-2': mounted }">
      Tidak ada layanan yang ditemukan.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const services = ref(null)
const error = ref('')
const loading = ref(false)
const selectedGame = ref('')
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
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
        filter_value: selectedGame.value,
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
</script>

<style scoped>
/* Animation classes to replace v-motion */
.animate-slide-up {
  animation: slideUp 0.6s ease-out forwards;
}

.animate-slide-up-delay {
  animation: slideUp 0.6s ease-out 0.1s forwards;
  opacity: 0;
  transform: translateY(20px);
}

.animate-slide-up-delay-2 {
  animation: slideUp 0.6s ease-out 0.2s forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-container {
  margin-bottom: 32px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}
.error {
  color: red;
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
.vip-card-body {
  margin-bottom: 14px;
}
.vip-row {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-size: 0.98rem;
}
.vip-icon {
  margin-right: 6px;
  font-size: 1.1em;
}
.vip-label {
  color: #6b7280;
  min-width: 60px;
  margin-right: 4px;
  font-weight: 500;
}
.vip-value {
  color: #111827;
  font-weight: 600;
}
.vip-card-prices {
  margin-top: 10px;
  border-top: 1px dashed #e5e7eb;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.vip-price-row {
  font-size: 1.01rem;
  display: flex;
  align-items: center;
  gap: 8px;
}
.vip-price {
  font-weight: 700;
  color: #ea580c;
}
.vip-select {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.vip-select:hover {
  border-color: #93c5fd; /* blue-300 */
  box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.45); /* blue-300 with opacity */
}

.vip-select:focus {
  outline: none;
  border-color: #60a5fa; /* blue-400 */
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.6); /* blue-400 with opacity */
}

.vip-select {
  background: #fff;
  color: #1e293b;
}
.game-title {
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 18px;
  margin-top: -6px;
}

.vip-card-grid {
  margin-top: 0;
}

.vip-card-header {
  gap: 10px;
}

button[type="submit"] {
  background: #2563eb;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.3s ease;
}

button[type="submit"]:hover:not(:disabled) {
  background: #1d4ed8; /* blue-700 */
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

button[type="submit"]:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.45); /* blue-600 with opacity */
}

button[type="submit"]:disabled {
  background: #93c5fd;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>
