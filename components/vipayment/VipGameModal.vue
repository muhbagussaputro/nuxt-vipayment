<template>
  <div>
    <div v-if="show && !selectedService" class="modal-backdrop" @click.self="close">
      <div class="modal-content">
        <button class="modal-close" @click="close">×</button>
        <div v-if="loading" class="modal-loading">Loading layanan game...</div>
        <div v-else-if="error" class="modal-error">{{ error }}</div>
        <div v-else-if="services && services.data && services.data.length">
          <h4 class="mb-2 font-semibold text-lg">Daftar Layanan Game:</h4>
          <div v-if="gameName" class="game-title mb-6">Untuk game <span>{{ gameName }}</span></div>
          <div class="vip-card-grid">
            <div v-for="(item, idx) in services.data" :key="item.code" class="vip-card-wrapper">
              <div class="vip-card" @click="toggleBuyForm(item.code)">
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
              <VipGameBuyForm
                v-if="openedServiceCode === item.code"
                :service="{
                  ...item,
                  gameName: props.gameName,
                  gameSlug: props.slug
                }"
                @close="closeBuyForm"
                @success="onBuySuccess"
              />
            </div>
          </div>
        </div>
        <div v-else-if="services && (!services.data || !services.data.length)" class="empty">Tidak ada layanan ditemukan.</div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import VipGameBuyForm from '~/components/vipayment/VipGameBuyForm.vue'
const props = defineProps({
  show: Boolean,
  slug: String,
  gameName: String,
})
const emit = defineEmits(['close'])

const services = ref(null)
const loading = ref(false)
const error = ref('')
const openedServiceCode = ref(null)
const selectedService = ref(null)

watch(() => props.show, async (val) => {
  if (val && props.slug) {
    await fetchServices()
  }
  if (!val) {
    services.value = null
    error.value = ''
    selectedService.value = null
  }
})
watch(() => props.slug, async (val) => {
  if (props.show && val) {
    await fetchServices()
  }
})

async function fetchServices() {
  loading.value = true
  error.value = ''
  services.value = null
  try {
    const { data } = await useFetch('/vipayment/game/services', {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'POST',
      body: {
        filter_type: 'game',
        filter_value: props.gameName,
        filter_status: 'available'
      }
    })
    services.value = data.value
  } catch (e) {
    error.value = 'Gagal mengambil layanan game.'
  } finally {
    loading.value = false
  }
}

function close() {
  emit('close')
}

function toggleBuyForm(code) {
  openedServiceCode.value = (openedServiceCode.value === code) ? null : code
}

function closeBuyForm() {
  openedServiceCode.value = null
}

function onBuySuccess(data) {
  console.log('Transaksi berhasil:', data)
}

function formatPrice(price) {
  if (typeof price !== 'number') return '-';
  return price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).replace('IDR', 'Rp');
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  z-index: 50;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(30,41,59,0.33);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(60,60,100,0.18);
  padding: 32px 28px 22px 28px;
  max-width: 620px;
  width: 98vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modalIn 0.17s cubic-bezier(.4,2,.6,1) both;
}
@keyframes modalIn {
  0% { transform: translateY(40px) scale(0.95); opacity: 0; }
  100% { transform: none; opacity: 1; }
}
.modal-close {
  position: absolute;
  top: 12px;
  right: 18px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #64748b;
  cursor: pointer;
  transition: color 0.2s;
  z-index: 2;
}
.modal-close:hover {
  color: #ef4444;
}
.modal-loading, .modal-error, .empty {
  text-align: center;
  color: #64748b;
  margin: 24px 0;
}
.modal-error {
  color: #f43f5e;
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
  margin-left: 8px;
}
.vip-badge-available {
  background: #e0f2fe;
  color: #0284c7;
}
.vip-badge-unavailable {
  background: #fee2e2;
  color: #dc2626;
}
.vip-price-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  font-size: 1rem;
}
.vip-icon {
  font-size: 1.15em;
}
.vip-price {
  font-weight: 600;
  color: #0ea5e9;
}
.game-title span {
  color: #0ea5e9;
  font-weight: 600;
}
.mb-2 { margin-bottom: 0.5rem; }
.mb-6 { margin-bottom: 1.5rem; }
</style>
