<template>
  <div class="form-container">
    <h3 class="form-title">Order Joki Game</h3>
    <p class="form-description">Pesan layanan joki untuk meningkatkan rank atau menyelesaikan misi game</p>
    
    <form @submit.prevent="createJokiOrder" class="joki-form">
      <div class="form-row">
        <div class="form-group">
          <label for="service-code">Kode Layanan *</label>
          <input v-model="orderData.code" type="text" placeholder="Contoh: ml-rank-mythic" class="form-input" required />
        </div>
        <div class="form-group">
          <label for="target-id">ID Akun *</label>
          <input v-model="orderData.target" type="text" placeholder="ID akun game" class="form-input" required />
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="login-method">Email/Username *</label>
          <input v-model="orderData.email" type="text" placeholder="Email atau username akun" class="form-input" required />
        </div>
        <div class="form-group">
          <label for="password">Password *</label>
          <input v-model="orderData.password" type="password" placeholder="Password akun" class="form-input" required />
        </div>
      </div>
      
      <div class="form-group">
        <label for="request">Permintaan Khusus</label>
        <textarea v-model="orderData.request" placeholder="Jelaskan target rank atau misi yang diinginkan" class="form-textarea" rows="3"></textarea>
      </div>
      
      <div class="security-warning">
        <span class="warning-icon">🔒</span>
        <div class="warning-text">
          <strong>Keamanan Data</strong>
          <p>Data login Anda akan dienkripsi dan hanya digunakan untuk layanan joki. Kami menjamin kerahasiaan akun Anda.</p>
        </div>
      </div>
      
      <div class="form-actions">
        <button type="button" @click="resetForm" class="reset-btn">Reset</button>
        <button type="submit" :disabled="loading || !isFormValid" class="submit-btn">
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? 'Memproses...' : 'Pesan Joki' }}
        </button>
      </div>
    </form>
    
    <div v-if="error" class="error-message">⚠️ {{ error }}</div>
    
    <div v-if="orderResult" class="success-message">
      <h4>✅ Pesanan Joki Berhasil!</h4>
      <div class="order-info">
        <p><strong>ID Transaksi:</strong> {{ orderResult.data?.trxid }}</p>
        <p><strong>Status:</strong> {{ orderResult.data?.status }}</p>
        <p>Tim joki akan segera memproses permintaan Anda. Estimasi pengerjaan akan diberikan via WhatsApp.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const orderData = ref({
  code: '',
  target: '',
  email: '',
  password: '',
  request: ''
})

const loading = ref(false)
const error = ref('')
const orderResult = ref(null)

const emit = defineEmits(['order-created'])

const isFormValid = computed(() => {
  return orderData.value.code.trim() && 
         orderData.value.target.trim() && 
         orderData.value.email.trim() && 
         orderData.value.password.trim()
})

const createJokiOrder = async () => {
  if (!isFormValid.value) {
    error.value = 'Harap lengkapi semua field yang wajib diisi'
    return
  }
  
  loading.value = true
  error.value = ''
  orderResult.value = null
  
  try {
    const { data } = await useFetch('/vipayment/game/order/joki', {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'POST',
      body: orderData.value
    })
    
    orderResult.value = data.value
    emit('order-created', data.value)
    
  } catch (e) {
    console.error('Error creating joki order:', e)
    error.value = 'Gagal membuat pesanan joki. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  orderData.value = { code: '', target: '', email: '', password: '', request: '' }
  error.value = ''
  orderResult.value = null
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

@media (max-width: 640px) {
  .form-row { grid-template-columns: 1fr; }
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

.form-input, .form-textarea {
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.security-warning {
  background: #fef3c7;
  border: 1px solid #fbbf24;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
}

.warning-icon {
  font-size: 1.5rem;
}

.warning-text strong {
  color: #d97706;
  font-size: 0.9rem;
}

.warning-text p {
  margin: 4px 0 0 0;
  font-size: 0.8rem;
  color: #92400e;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.reset-btn,
.submit-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn {
  background-color: #e5e7eb;
  color: #374151;
  border: none;
}

.reset-btn:hover {
  background-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.submit-btn {
  background-color: #2563eb;
  color: #fff;
  border: none;
}

.submit-btn:hover:not(:disabled) {
  background-color: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.submit-btn:disabled {
  background-color: #93c5fd;
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

.success-message h4 {
  margin: 0 0 12px 0;
  font-size: 1.1rem;
}

.order-info p {
  margin: 6px 0;
  font-size: 0.9rem;
}
</style>
