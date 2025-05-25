 <template>
  <div class="payment-form">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Memproses permintaan pembayaran...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>Terjadi Kesalahan</h3>
      <p>{{ error }}</p>
      <button @click="resetForm" class="btn-retry">Coba Lagi</button>
    </div>
    
    <div v-else-if="paymentUrl" class="payment-redirect">
      <h3>Pembayaran Siap</h3>
      <p>Anda akan diarahkan ke halaman pembayaran iPaymu.</p>
      <p class="info-text">Setelah pembayaran berhasil, pesanan Anda akan diproses otomatis.</p>
      <button @click="redirectToPayment" class="btn-pay">Lanjutkan ke Pembayaran</button>
      <p class="reference-id">ID Transaksi: {{ referenceId }}</p>
    </div>
    
    <div v-else class="form-container">
      <h2>Detail Pembayaran</h2>
      
      <div class="order-summary">
        <h3>Ringkasan Pesanan</h3>
        <div class="product-info">
          <div class="product-name">{{ productInfo.name }}</div>
          <div class="product-price">{{ formatPrice(productInfo.price) }}</div>
        </div>
        <div class="destination-info">
          <div class="label">{{ getDestinationLabel(productInfo.type) }}</div>
          <div class="value">{{ productInfo.destination }}</div>
        </div>
        <div v-if="productInfo.server" class="server-info">
          <div class="label">Server</div>
          <div class="value">{{ productInfo.server }}</div>
        </div>
      </div>
      
      <form @submit.prevent="submitPayment" class="customer-form">
        <h3>Informasi Pelanggan</h3>
        
        <div class="form-group">
          <label for="name">Nama Lengkap</label>
          <input 
            id="name"
            v-model="customer.name"
            type="text"
            placeholder="Masukkan nama lengkap"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="customer.email"
            type="email"
            placeholder="Masukkan email valid"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="phone">Nomor HP</label>
          <input 
            id="phone"
            v-model="customer.phone"
            type="tel"
            placeholder="Contoh: 081234567890"
            required
          />
        </div>
        
        <div class="payment-notice">
          <p>
            <strong>Catatan:</strong> Pembayaran akan diproses melalui iPaymu terlebih dahulu.
            Setelah pembayaran berhasil, pesanan Anda akan langsung diproses di VIPayment.
          </p>
        </div>
        
        <button type="submit" class="btn-submit" :disabled="loading">
          Lanjutkan ke Pembayaran
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import paymentGateway from '~/server/utils/payment-gateway'

const props = defineProps({
  productInfo: {
    type: Object,
    required: true
  }
})

const router = useRouter()

// Form state
const customer = ref({
  name: '',
  email: '',
  phone: ''
})

// Payment process state
const loading = ref(false)
const error = ref(null)
const paymentUrl = ref(null)
const sessionId = ref(null)
const referenceId = ref(null)

// Methods
const getDestinationLabel = (type) => {
  switch (type) {
    case 'game':
      return 'ID Game';
    case 'prepaid':
      return 'Nomor Telepon';
    default:
      return 'Tujuan';
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

const submitPayment = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Prepare order data for payment gateway
    const orderData = {
      product: {
        name: props.productInfo.name,
        type: props.productInfo.type,
        code: props.productInfo.code,
        destination: props.productInfo.destination,
        server: props.productInfo.server || null
      },
      customer: customer.value,
      price: props.productInfo.price,
      token: localStorage.getItem('auth_token') || null // Include auth token if available
    }
    
    // Create payment via the gateway service (iPaymu first)
    const result = await paymentGateway.createPayment(orderData)
    
    if (result.success) {
      // Store payment information
      paymentUrl.value = result.paymentUrl
      sessionId.value = result.sessionId
      referenceId.value = result.referenceId
      
      // Store order reference in localStorage for status checking
      localStorage.setItem('current_order_id', result.referenceId)
    } else {
      throw new Error(result.message || 'Gagal membuat sesi pembayaran')
    }
  } catch (err) {
    error.value = err.message || 'Terjadi kesalahan saat memproses pembayaran'
    console.error('Payment error:', err)
  } finally {
    loading.value = false
  }
}

const redirectToPayment = () => {
  if (paymentUrl.value) {
    // Open payment URL in the same tab
    window.location.href = paymentUrl.value
  }
}

const resetForm = () => {
  error.value = null
  paymentUrl.value = null
  sessionId.value = null
  referenceId.value = null
}
</script>

<style scoped>
.payment-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  text-align: center;
  padding: 30px;
  background-color: #fee2e2;
  border-radius: 8px;
  margin: 20px 0;
}

.error-icon {
  font-size: 32px;
  margin-bottom: 10px;
}

.form-container h2 {
  margin-bottom: 24px;
  text-align: center;
  font-size: 1.5rem;
}

.order-summary {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
}

.order-summary h3 {
  margin-bottom: 16px;
  font-size: 1.2rem;
  color: #334155;
}

.product-info {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 12px;
  margin-bottom: 12px;
}

.product-name {
  font-weight: 600;
}

.product-price {
  font-weight: 600;
  color: #3b82f6;
}

.destination-info, .server-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.label {
  color: #64748b;
}

.customer-form {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.customer-form h3 {
  margin-bottom: 16px;
  font-size: 1.2rem;
  color: #334155;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #334155;
}

input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.payment-notice {
  margin: 20px 0;
  padding: 12px;
  background-color: #f0f9ff;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
}

.btn-submit, .btn-pay, .btn-retry {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover, .btn-pay:hover {
  background-color: #2563eb;
}

.btn-retry {
  background-color: #6b7280;
}

.btn-retry:hover {
  background-color: #4b5563;
}

.payment-redirect {
  text-align: center;
  padding: 30px;
  background-color: #f0f9ff;
  border-radius: 8px;
  margin: 20px 0;
  border: 1px solid #bae6fd;
}

.payment-redirect h3 {
  margin-bottom: 12px;
  color: #0369a1;
}

.info-text {
  margin-bottom: 20px;
  color: #64748b;
}

.reference-id {
  margin-top: 16px;
  font-size: 14px;
  color: #64748b;
}
</style>
