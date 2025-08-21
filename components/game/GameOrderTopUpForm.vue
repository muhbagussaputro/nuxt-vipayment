<template>
  <div class="form-container" v-motion-slide-visible-bottom>
    <h3 class="form-title">Order Top-Up Game</h3>
    <p class="form-description">Buat pesanan top-up untuk berbagai game dengan mudah dan cepat</p>
    
    <form @submit.prevent="createTopUpOrder" class="topup-form">
      <div class="form-grid">
        <div class="form-group">
          <label for="service-code">Kode Layanan *</label>
          <input 
            id="service-code"
            v-model="orderData.code" 
            type="text" 
            placeholder="Contoh: mobile-legends-diamond"
            class="form-input"
            required
          />
          <small class="input-hint">Masukkan kode layanan game yang ingin di top-up</small>
        </div>
        
        <div class="form-group">
          <label for="target-id">ID Akun Game *</label>
          <input 
            id="target-id"
            v-model="orderData.target" 
            type="text" 
            placeholder="Masukkan ID akun game"
            class="form-input"
            required
            @input="debounceNicknameCheck"
          />
        </div>
        
        <div class="form-group">
          <label for="additional-target">Info Tambahan</label>
          <input 
            id="additional-target"
            v-model="orderData.additional_target" 
            type="text" 
            placeholder="Zone ID / Server (jika diperlukan)"
            class="form-input"
            @input="debounceNicknameCheck"
          />
          <small class="input-hint">Zone ID untuk Mobile Legends, Server untuk Genshin Impact, dll.</small>
        </div>
        
        <div class="form-group">
          <label for="quantity">Jumlah</label>
          <input 
            id="quantity"
            v-model.number="orderData.quantity" 
            type="number" 
            min="1"
            max="999"
            placeholder="1"
            class="form-input"
          />
        </div>
      </div>
      
      <!-- Nickname Display -->
      <div v-if="nickname" class="nickname-section" v-motion-slide-visible-bottom :delay="100">
        <div class="nickname-info">
          <span class="nickname-icon">🎮</span>
          <div class="nickname-details">
            <span class="nickname-label">Nickname Ditemukan:</span>
            <span class="nickname-value">{{ nickname }}</span>
          </div>
        </div>
      </div>
      
      <!-- Payment Method Selection -->
      <div class="payment-section" v-motion-slide-visible-bottom :delay="200">
        <h4 class="section-title">Metode Pembayaran</h4>
        <div class="payment-methods">
          <label class="payment-option">
            <input 
              type="radio" 
              value="midtrans" 
              v-model="orderData.payment_method"
              class="payment-radio"
            />
            <span class="payment-content">
              <span class="payment-icon">🏦</span>
              <span class="payment-text">
                <strong>Transfer Bank / E-Wallet</strong>
                <small>BCA, BNI, Mandiri, OVO, DANA, GoPay</small>
              </span>
            </span>
          </label>
          <label class="payment-option">
            <input 
              type="radio" 
              value="xendit" 
              v-model="orderData.payment_method"
              class="payment-radio"
            />
            <span class="payment-content">
              <span class="payment-icon">💳</span>
              <span class="payment-text">
                <strong>Kartu Kredit / Debit</strong>
                <small>Visa, MasterCard, JCB</small>
              </span>
            </span>
          </label>
          <label class="payment-option">
            <input 
              type="radio" 
              value="tripay" 
              v-model="orderData.payment_method"
              class="payment-radio"
            />
            <span class="payment-content">
              <span class="payment-icon">🏪</span>
              <span class="payment-text">
                <strong>Convenience Store</strong>
                <small>Alfamart, Indomaret</small>
              </span>
            </span>
          </label>
        </div>
        
        <div class="payment-gateway-notice">
          <span class="notice-icon">ℹ️</span>
          <span class="notice-text">Setelah pembayaran berhasil, pesanan akan otomatis diproses ke VIPayment</span>
        </div>
      </div>
      
      <div class="form-actions" v-motion-slide-visible-bottom :delay="300">
        <button type="button" @click="resetForm" class="reset-btn">
          <span class="reset-icon">🔄</span>
          Reset Form
        </button>
        <button type="submit" :disabled="loading || !isFormValid" class="submit-btn">
          <span v-if="loading" class="loading-spinner"></span>
          <span v-else class="submit-icon">🛒</span>
          {{ loading ? 'Memproses...' : 'Buat Pesanan' }}
        </button>
      </div>
    </form>
    
    <div v-if="error" class="error-message" v-motion-slide-visible-bottom :delay="400">
      <span class="error-icon">⚠️</span>
      {{ error }}
    </div>
    
    <div v-if="orderResult" class="success-message" v-motion-slide-visible-bottom :delay="400">
      <span class="success-icon">✅</span>
      <div class="success-content">
        <h4>Pesanan Top-Up Berhasil Dibuat!</h4>
        <div class="order-summary">
          <div class="summary-row">
            <span class="summary-label">ID Transaksi:</span>
            <span class="summary-value">{{ orderResult.data?.trxid }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Status:</span>
            <span :class="['status-badge', getStatusClass(orderResult.data?.status)]">
              {{ getStatusText(orderResult.data?.status) }}
            </span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Target:</span>
            <span class="summary-value">{{ orderData.target }}</span>
          </div>
          <div v-if="nickname" class="summary-row">
            <span class="summary-label">Nickname:</span>
            <span class="summary-value">{{ nickname }}</span>
          </div>
        </div>
        <div class="order-actions">
          <button @click="checkOrderStatus" class="status-btn" :disabled="loading">
            Cek Status Pesanan
          </button>
          <button @click="createNewOrder" class="new-order-btn">
            Buat Pesanan Baru
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Import payment gateway composable
const { createPaymentOrder, redirectToPayment } = usePaymentGateway()

const orderData = ref({
  code: '',
  target: '',
  additional_target: '',
  quantity: 1,
  payment_method: 'midtrans'
})

const loading = ref(false)
const error = ref('')
const orderResult = ref(null)
const nickname = ref('')
const nicknameLoading = ref(false)

let debounceTimeout = null

const emit = defineEmits(['order-created'])

const isFormValid = computed(() => {
  return orderData.value.code.trim() && 
         orderData.value.target.trim() && 
         orderData.value.payment_method &&
         orderData.value.quantity > 0
})

const debounceNicknameCheck = () => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  nickname.value = ''
  
  debounceTimeout = setTimeout(async () => {
    if (orderData.value.target.trim()) {
      await checkNickname()
    }
  }, 1000)
}

const checkNickname = async () => {
  if (!orderData.value.target.trim()) return
  
  nicknameLoading.value = true
  try {
    const requestBody = {
      code: orderData.value.code || 'auto-detect',
      target: orderData.value.target,
      additional_target: orderData.value.additional_target || ''
    }
    
    const data = await $fetch('/vipayment/game/nickname', {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(requestBody).toString()
    })
    
    if (data) {
      let nicknameValue = ''
      if (typeof data === 'string') {
        nicknameValue = data
      } else if (data.nickname) {
        nicknameValue = data.nickname
      } else if (data.data) {
        nicknameValue = data.data
      }
      
      nickname.value = nicknameValue.replace(/^[\[|\]]$/g, '').trim()
    }
  } catch (e) {
    // Silently fail nickname check - not critical for order
    console.warn('Nickname check failed:', e)
  } finally {
    nicknameLoading.value = false
  }
}

const createTopUpOrder = async () => {
  if (!isFormValid.value) {
    error.value = 'Harap lengkapi semua field yang wajib diisi'
    return
  }
  
  loading.value = true
  error.value = ''
  orderResult.value = null
  
  try {
    // All orders must go through payment gateway first
    await handlePaymentGateway()
    
  } catch (e) {
    console.error('Error creating top-up order:', e)
    error.value = 'Gagal membuat pesanan top-up. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

const handlePaymentGateway = async () => {
  try {
    // Prepare order data for payment gateway
    const gatewayOrderData = {
      amount: 100000, // You might want to fetch actual price
      service_code: orderData.value.code,
      service_name: `Game Top-Up - ${orderData.value.code}`,
      target: orderData.value.target,
      additional_target: orderData.value.additional_target,
      quantity: orderData.value.quantity,
      additional_data: '',
      customer_name: nickname.value || 'Customer',
      customer_email: 'customer@vipayment.com',
      customer_phone: '081234567890'
    }
    
    // Create payment order
    const paymentResponse = await createPaymentOrder(orderData.value.payment_method, gatewayOrderData)
    
    // Redirect to payment gateway
    redirectToPayment(paymentResponse.payment_url)
    
    // Show waiting message
    alert('Anda akan diarahkan ke halaman pembayaran. Setelah pembayaran berhasil, pesanan akan otomatis diproses ke VIPayment.')
    
    // Reset form after redirect
    resetForm()
    
  } catch (e) {
    console.error('Payment gateway error:', e)
    throw e
  }
}

const resetForm = () => {
  orderData.value = {
    code: '',
    target: '',
    additional_target: '',
    quantity: 1,
    payment_method: 'midtrans'
  }
  nickname.value = ''
  error.value = ''
  orderResult.value = null
}

const createNewOrder = () => {
  resetForm()
}

const checkOrderStatus = async () => {
  if (!orderResult.value?.data?.trxid) {
    error.value = 'ID transaksi tidak ditemukan'
    return
  }
  
  try {
    loading.value = true
    error.value = ''
    
    const requestBody = {
      trxid: orderResult.value.data.trxid
    }
    
    const { data } = await useFetch('/vipayment/game/status', {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'POST',
      body: requestBody
    })
    
    if (data.value) {
      orderResult.value = data.value
    }
    
  } catch (e) {
    console.error('Error checking order status:', e)
    error.value = 'Gagal mengecek status pesanan'
  } finally {
    loading.value = false
  }
}

const getStatusClass = (status) => {
  const statusMap = {
    'pending': 'status-pending',
    'processing': 'status-processing',
    'success': 'status-success',
    'failed': 'status-failed',
    'waiting': 'status-waiting'
  }
  return statusMap[status] || 'status-unknown'
}

const getStatusText = (status) => {
  const statusMap = {
    'pending': 'Menunggu',
    'processing': 'Diproses',
    'success': 'Berhasil',
    'failed': 'Gagal',
    'waiting': 'Menunggu Pembayaran'
  }
  return statusMap[status] || status || 'Tidak Diketahui'
}
</script>

<style scoped>
.form-container {
  max-width: 700px;
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

.topup-form {
  margin-bottom: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.form-input {
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-input:focus {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
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

.nickname-section {
  margin-bottom: 24px;
}

.nickname-info {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.nickname-icon {
  font-size: 1.5rem;
}

.nickname-details {
  display: flex;
  flex-direction: column;
}

.nickname-label {
  font-size: 0.875rem;
  color: #0369a1;
  font-weight: 500;
}

.nickname-value {
  font-size: 1.1rem;
  color: #0c4a6e;
  font-weight: 600;
}

.payment-section {
  margin-bottom: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  transition: all 0.2s ease;
}

.payment-option:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.payment-option:hover {
  border-color: #2563eb;
  background: #f8fafc;
}

.payment-radio {
  margin: 0;
}

.payment-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.payment-icon {
  font-size: 1.5rem;
}

.payment-text {
  display: flex;
  flex-direction: column;
}

.payment-text strong {
  font-size: 0.9rem;
  color: #1f2937;
}

.payment-text small {
  font-size: 0.75rem;
  color: #6b7280;
}

.payment-gateway-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 12px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  font-size: 0.875rem;
}

.notice-icon {
  font-size: 16px;
}

.notice-text {
  color: #1e40af;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.reset-btn,
.submit-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.reset-btn:hover, .submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.reset-btn {
  background: #f3f4f6;
  color: #374151;
}

.reset-btn:hover {
  background: #e5e7eb;
}

.submit-btn {
  background: #2563eb;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
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
  margin-top: 16px;
}

.success-message {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
  padding: 24px;
  border-radius: 12px;
  margin-top: 24px;
}

.success-content h4 {
  margin: 0 0 16px 0;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-summary {
  background: #dcfce7;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #bbf7d0;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-label {
  font-size: 0.875rem;
  color: #065f46;
  font-weight: 500;
}

.summary-value {
  font-size: 0.875rem;
  color: #064e3b;
  font-weight: 600;
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
}

.status-pending {
  background: #fef3c7;
  color: #d97706;
}

.status-processing {
  background: #dbeafe;
  color: #2563eb;
}

.status-success {
  background: #d1fae5;
  color: #047857;
}

.status-failed {
  background: #fee2e2;
  color: #dc2626;
}

.status-waiting {
  background: #e0e7ff;
  color: #4338ca;
}

.order-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.status-btn,
.new-order-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
}

.status-btn:hover, .new-order-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.status-btn {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.status-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.status-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.new-order-btn {
  background: #059669;
  color: white;
  border-color: #059669;
}

.new-order-btn:hover {
  background: #047857;
}

.reset-icon,
.submit-icon,
.success-icon,
.error-icon {
  font-size: 1rem;
}
</style>
