<template>
  <div class="form-container" v-motion-slide-visible-bottom>
    <h3 class="form-title">Buat Pesanan Prepaid</h3>
    <p class="form-description">Lengkapi form untuk membuat pesanan layanan prepaid</p>
    
    <form @submit.prevent="createOrder" class="order-form" v-motion-slide-visible-bottom :delay="100">
      <div class="form-grid">
        <div class="form-group">
          <label for="service-code">Kode Layanan *</label>
          <input 
            id="service-code"
            v-model="orderData.code" 
            type="text" 
            placeholder="Masukkan kode layanan"
            class="form-input"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="target">Target/Nomor Tujuan *</label>
          <input 
            id="target"
            v-model="orderData.target" 
            type="text" 
            placeholder="Masukkan nomor tujuan"
            class="form-input"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="quantity">Jumlah</label>
          <input 
            id="quantity"
            v-model.number="orderData.quantity" 
            type="number" 
            min="1"
            placeholder="1"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="additional-data">Data Tambahan</label>
          <input 
            id="additional-data"
            v-model="orderData.additional_data" 
            type="text" 
            placeholder="Data tambahan (opsional)"
            class="form-input"
          />
        </div>
      </div>
      
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
            <span class="payment-label">🏦 Transfer Bank / E-Wallet</span>
          </label>
          
          <label class="payment-option">
            <input 
              type="radio" 
              value="xendit" 
              v-model="orderData.payment_method"
              class="payment-radio"
            />
            <span class="payment-label">💳 Kartu Kredit / Debit</span>
          </label>
          
          <label class="payment-option">
            <input 
              type="radio" 
              value="tripay" 
              v-model="orderData.payment_method"
              class="payment-radio"
            />
            <span class="payment-label">🏪 Convenience Store</span>
          </label>
        </div>
        
        <div class="payment-gateway-notice">
          <span class="notice-icon">ℹ️</span>
          <span class="notice-text">Setelah pembayaran berhasil, pesanan akan otomatis diproses ke VIPayment</span>
        </div>
      </div>
      
      <div class="form-actions" v-motion-slide-visible-bottom :delay="300">
        <button type="button" @click="resetForm" class="reset-btn">
          Reset Form
        </button>
        <button type="submit" :disabled="loading || !isFormValid" class="submit-btn">
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? 'Memproses...' : 'Buat Pesanan' }}
        </button>
      </div>
    </form>
    
    <div v-if="error" class="error-message" v-motion-slide-visible-bottom :delay="400">
      <span class="error-icon">⚠️</span>
      {{ error }}
    </div>
    
    <div v-if="orderResult" class="success-message" v-motion-slide-visible-bottom :delay="500">
      <span class="success-icon">✅</span>
      <div class="success-content">
        <h4>Pesanan Berhasil Dibuat!</h4>
        <div class="order-details">
          <p><strong>ID Transaksi:</strong> {{ orderResult.data?.trxid }}</p>
          <p><strong>Status:</strong> {{ orderResult.data?.status }}</p>
          <p><strong>Pesan:</strong> {{ orderResult.message }}</p>
        </div>
        <button @click="checkOrderStatus" class="status-btn">
          Cek Status Pesanan
        </button>
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
  quantity: 1,
  additional_data: '',
  payment_method: 'midtrans'
})

const loading = ref(false)
const error = ref('')
const orderResult = ref(null)

const emit = defineEmits(['order-created'])

const isFormValid = computed(() => {
  return orderData.value.code.trim() && 
         orderData.value.target.trim() && 
         orderData.value.payment_method
})

const createOrder = async () => {
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
    console.error('Error creating prepaid order:', e)
    error.value = 'Gagal membuat pesanan. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

const handlePaymentGateway = async () => {
  try {
    // Prepare order data for payment gateway
    const gatewayOrderData = {
      amount: 50000, // You might want to fetch actual price
      service_code: orderData.value.code,
      service_name: `Prepaid Service - ${orderData.value.code}`,
      target: orderData.value.target,
      additional_target: '',
      quantity: orderData.value.quantity,
      additional_data: orderData.value.additional_data,
      customer_name: 'Customer',
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
    quantity: 1,
    additional_data: '',
    payment_method: 'midtrans'
  }
  error.value = ''
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
    
    const { data } = await useFetch('/vipayment/prepaid/status', {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'POST',
      body: requestBody
    })
    
    // Update order result dengan status terbaru
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

.order-form {
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
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
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
  gap: 16px;
  flex-wrap: wrap;
}

.payment-option {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}
.payment-option:hover {
  border-color: #3b82f6;
  background-color: #e0f2fe;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.payment-radio {
  margin: 0;
}

.payment-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
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

.reset-btn {
  background-color: #64748b;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.reset-btn:hover {
  background-color: #475569;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.submit-btn {
  background-color: #3b82f6;
  color: white;
  padding: 10px 20px;
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
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}

.success-message {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
  padding: 20px;
  border-radius: 12px;
  margin-top: 24px;
}

.success-content h4 {
  margin: 0 0 12px 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.order-details {
  margin: 16px 0;
  padding: 12px;
  background: #dcfce7;
  border-radius: 8px;
}

.order-details p {
  margin: 4px 0;
  font-size: 0.9rem;
}

.status-btn {
  background: #059669;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 12px;
}

.status-btn:hover {
  background: #047857;
}

.error-icon,
.success-icon {
  font-size: 1.2rem;
}
</style>