<template>
  <div class="form-container" v-motion-slide-visible-bottom>
    <h3 class="form-title">Cek Status Game Order</h3>
    <p class="form-description">Pantau status pesanan game Anda dengan memasukkan ID transaksi</p>
    
    <form @submit.prevent="checkStatus" class="status-form">
      <div class="form-group">
        <label for="transaction-id">ID Transaksi *</label>
        <input 
          v-model="transactionId" 
          type="text" 
          placeholder="Masukkan ID transaksi"
          class="form-input transition-all duration-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
        />
        <small class="input-hint">ID transaksi dikirim via email/WhatsApp setelah pemesanan</small>
      </div>
      
      <button type="submit" :disabled="loading || !transactionId.trim()" class="submit-btn">
        <span v-if="loading" class="loading-spinner"></span>
        {{ loading ? 'Mengecek...' : 'Cek Status' }}
      </button>
    </form>
    
    <div v-if="error" class="error-message">⚠️ {{ error }}</div>
    
    <div v-if="statusResult" class="status-container" v-motion-slide-visible-bottom :delay="100">
      <div class="status-header">
        <h4>Status Transaksi</h4>
        <span :class="['status-badge', getStatusClass(statusResult.data?.status)]">
          {{ getStatusText(statusResult.data?.status) }}
        </span>
      </div>
      
      <div class="status-details">
        <div class="detail-item">
          <span class="label">ID Transaksi:</span>
          <span class="value">{{ statusResult.data?.trxid || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Layanan:</span>
          <span class="value">{{ statusResult.data?.service_name || statusResult.data?.code || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Target:</span>
          <span class="value">{{ statusResult.data?.target || '-' }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Harga:</span>
          <span class="value">{{ formatPrice(statusResult.data?.price) }}</span>
        </div>
        <div v-if="statusResult.data?.sn" class="detail-item">
          <span class="label">Serial Number:</span>
          <span class="value sn-code">{{ statusResult.data.sn }}</span>
        </div>
      </div>
      
      <div v-if="statusResult.message" class="status-message">
        💬 {{ statusResult.message }}
      </div>
      
      <div class="status-actions">
        <button @click="refreshStatus" class="refresh-btn transition-all duration-200 hover:scale-105">
          🔄 Refresh
        </button>
        <button v-if="canDownload" @click="downloadReceipt" class="download-btn transition-all duration-200 hover:scale-105">
          📄 Download Struk
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const transactionId = ref('')
const loading = ref(false)
const error = ref('')
const statusResult = ref(null)

const emit = defineEmits(['status-checked'])

const canDownload = computed(() => {
  return statusResult.value?.data?.status === 'success' || 
         statusResult.value?.data?.status === 'completed'
})

const checkStatus = async () => {
  if (!transactionId.value.trim()) {
    error.value = 'ID transaksi harus diisi'
    return
  }
  
  loading.value = true
  error.value = ''
  statusResult.value = null
  
  try {
    const { data } = await useFetch('/vipayment/game/status', {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'POST',
      body: { trxid: transactionId.value.trim() }
    })
    
    statusResult.value = data.value
    emit('status-checked', data.value)
    
  } catch (e) {
    console.error('Error checking status:', e)
    error.value = 'Gagal mengecek status. Periksa kembali ID transaksi.'
  } finally {
    loading.value = false
  }
}

const refreshStatus = () => checkStatus()

const getStatusClass = (status) => {
  const map = {
    'pending': 'status-pending',
    'processing': 'status-processing',
    'success': 'status-success',
    'failed': 'status-failed',
    'waiting': 'status-waiting'
  }
  return map[status] || 'status-unknown'
}

const getStatusText = (status) => {
  const map = {
    'pending': 'Menunggu',
    'processing': 'Diproses',
    'success': 'Berhasil',
    'failed': 'Gagal',
    'waiting': 'Menunggu Pembayaran'
  }
  return map[status] || status || 'Tidak Diketahui'
}

const formatPrice = (price) => {
  if (typeof price !== 'number') return '-'
  return price.toLocaleString('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).replace('IDR', 'Rp')
}

const downloadReceipt = () => {
  alert('Struk transaksi akan diunduh!')
}
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 0 auto 32px auto;
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 18px 0 rgba(0,0,0,0.07);
  border: 1px solid #e5e7eb;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.form-description {
  color: #6b7280;
  margin-bottom: 24px;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input-hint {
  display: block;
  margin-top: 4px;
  font-size: 0.75rem;
  color: #6b7280;
}

.submit-btn {
  width: 100%;
  padding: 12px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.submit-btn:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.submit-btn:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 14px 16px;
  border-radius: 8px;
  margin-top: 16px;
}

.status-container {
  margin-top: 32px;
  padding: 24px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.status-header h4 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.status-badge {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 8px;
}

.status-pending { background: #fef3c7; color: #d97706; }
.status-processing { background: #dbeafe; color: #2563eb; }
.status-success { background: #d1fae5; color: #047857; }
.status-failed { background: #fee2e2; color: #dc2626; }
.status-waiting { background: #e0e7ff; color: #4338ca; }
.status-unknown { background: #f3f4f6; color: #6b7280; }

.status-details {
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item .label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.detail-item .value {
  font-size: 0.875rem;
  color: #1f2937;
  font-weight: 600;
}

.sn-code {
  font-family: monospace;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.status-message {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.status-actions {
  display: flex;
  gap: 12px;
}

.refresh-btn, .download-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  border: 1px solid;
}

.refresh-btn {
  background: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
}

.refresh-btn:hover:not(:disabled) {
  background: #e5e7eb;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.download-btn {
  background: #059669;
  color: white;
  border-color: #059669;
}

.download-btn:hover {
  background: #047857;
}
</style>
