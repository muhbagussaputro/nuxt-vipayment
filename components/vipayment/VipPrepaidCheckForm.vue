<template>
  <div class="form-container" v-motion-slide-visible-bottom>
    <h3 class="form-title">Cek Status Prepaid</h3>
    <p class="form-description">Masukkan ID transaksi untuk mengecek status pesanan prepaid</p>
    
    <form @submit.prevent="checkStatus" class="check-form">
      <div class="form-group">
        <label for="transaction-id">ID Transaksi *</label>
        <input 
          id="transaction-id"
          v-model="transactionId" 
          type="text" 
          placeholder="Masukkan ID transaksi"
          class="form-input transition-all duration-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300"
          required
        />
        <small class="input-hint">ID transaksi dapat ditemukan pada konfirmasi pesanan atau email</small>
      </div>
      
      <button type="submit" :disabled="loading || !transactionId.trim()" class="submit-btn transition-all duration-200 hover:scale-105 hover:shadow-lg">
        <span v-if="loading" class="loading-spinner"></span>
        {{ loading ? 'Mengecek...' : 'Cek Status' }}
      </button>
    </form>
    
    <div v-if="error" class="error-message">
      <span class="error-icon">⚠️</span>
      {{ error }}
    </div>
    
    <div v-if="statusResult" class="status-container" v-motion-slide-visible-bottom :delay="100">
      <div class="status-header">
        <h4 class="status-title">Status Transaksi</h4>
        <span :class="['status-badge', getStatusClass(statusResult.data?.status)]">
          {{ getStatusText(statusResult.data?.status) }}
        </span>
      </div>
      
      <div class="status-details">
        <div class="detail-row">
          <span class="detail-label">ID Transaksi:</span>
          <span class="detail-value">{{ statusResult.data?.trxid || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Layanan:</span>
          <span class="detail-value">{{ statusResult.data?.service_name || statusResult.data?.code || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Target:</span>
          <span class="detail-value">{{ statusResult.data?.target || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Harga:</span>
          <span class="detail-value">{{ formatPrice(statusResult.data?.price) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Tanggal Pesanan:</span>
          <span class="detail-value">{{ formatDate(statusResult.data?.created_at) }}</span>
        </div>
        <div v-if="statusResult.data?.sn" class="detail-row">
          <span class="detail-label">Serial Number:</span>
          <span class="detail-value sn-value">{{ statusResult.data.sn }}</span>
        </div>
      </div>
      
      <div v-if="statusResult.message" class="status-message">
        <span class="message-icon">💬</span>
        <p>{{ statusResult.message }}</p>
      </div>
      
      <div class="status-actions">
        <button @click="refreshStatus" class="refresh-btn transition-all duration-200 hover:scale-105 hover:shadow-md" :disabled="loading">
          <span class="refresh-icon">🔄</span>
          Refresh Status
        </button>
        <button v-if="canDownloadReceipt" @click="downloadReceipt" class="download-btn transition-all duration-200 hover:scale-105 hover:shadow-md">
          <span class="download-icon">📄</span>
          Download Struk
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

const canDownloadReceipt = computed(() => {
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
    const requestBody = {
      trxid: transactionId.value.trim()
    }
    
    const { data } = await useFetch('/vipayment/prepaid/status', {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'POST',
      body: requestBody
    })
    
    statusResult.value = data.value
    emit('status-checked', data.value)
    
  } catch (e) {
    console.error('Error checking prepaid status:', e)
    error.value = 'Gagal mengecek status transaksi. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

const refreshStatus = async () => {
  await checkStatus()
}

const getStatusClass = (status) => {
  const statusMap = {
    'pending': 'status-pending',
    'processing': 'status-processing', 
    'success': 'status-success',
    'completed': 'status-success',
    'failed': 'status-failed',
    'cancelled': 'status-cancelled',
    'waiting': 'status-waiting'
  }
  return statusMap[status] || 'status-unknown'
}

const getStatusText = (status) => {
  const statusMap = {
    'pending': 'Menunggu',
    'processing': 'Diproses',
    'success': 'Berhasil',
    'completed': 'Selesai',
    'failed': 'Gagal',
    'cancelled': 'Dibatalkan',
    'waiting': 'Menunggu Pembayaran'
  }
  return statusMap[status] || status || 'Tidak Diketahui'
}

const formatPrice = (price) => {
  if (typeof price !== 'number') return '-'
  return price.toLocaleString('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).replace('IDR', 'Rp')
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

const downloadReceipt = () => {
  // Implementasi download struk
  alert('Struk transaksi akan diunduh!')
  // Di implementasi nyata, bisa menggunakan jsPDF atau html2canvas
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

.check-form {
  margin-bottom: 24px;
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
  background-color: #2563eb;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #1d4ed8; /* blue-700 */
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.submit-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.45); /* blue-600 with opacity */
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
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
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

.status-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.status-badge {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid;
}

.status-pending {
  background: #fef3c7;
  color: #d97706;
  border-color: #fbbf24;
}

.status-processing {
  background: #dbeafe;
  color: #2563eb;
  border-color: #93c5fd;
}

.status-success {
  background: #d1fae5;
  color: #047857;
  border-color: #a7f3d0;
}

.status-failed {
  background: #fee2e2;
  color: #dc2626;
  border-color: #fca5a5;
}

.status-cancelled {
  background: #f3f4f6;
  color: #6b7280;
  border-color: #d1d5db;
}

.status-waiting {
  background: #e0e7ff;
  color: #4338ca;
  border-color: #a5b4fc;
}

.status-unknown {
  background: #f3f4f6;
  color: #6b7280;
  border-color: #d1d5db;
}

.status-details {
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.detail-value {
  font-size: 0.875rem;
  color: #1f2937;
  font-weight: 600;
  text-align: right;
}

.sn-value {
  font-family: monospace;
  background: #f3f4f6;
  padding: 4px 8px;
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
  display: flex;
  align-items: start;
  gap: 8px;
}

.status-message p {
  margin: 0;
  line-height: 1.4;
}

.status-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.refresh-btn {
  background-color: #6b7280;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  background-color: #4b5563; /* gray-700 */
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.refresh-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.45); /* gray-600 with opacity */
}

.refresh-btn:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.download-btn {
  background-color: #2563eb;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.download-btn:hover:not(:disabled) {
  background-color: #1d4ed8; /* blue-700 */
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.download-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.45); /* blue-600 with opacity */
}

.download-btn:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.error-icon,
.message-icon,
.refresh-icon,
.download-icon {
  font-size: 1rem;
}
</style>
