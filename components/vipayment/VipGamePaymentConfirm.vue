<template>
  <div class="payment-confirmation">
    <div class="order-summary">
      <div class="summary-row">
        <span class="summary-label">Layanan:</span>
        <span class="summary-value">{{ service.name }}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Nomor/ID Akun:</span>
        <span class="summary-value">{{ dataNo }}</span>
      </div>
      <div v-if="hasAdditionalTarget" class="summary-row">
        <span class="summary-label">{{ additionalFieldLabel }}:</span>
        <span class="summary-value">{{ additionalTarget }}</span>
      </div>
      <div v-if="nickname" class="summary-row">
        <span class="summary-label">Nickname:</span>
        <span class="summary-value highlight">{{ nickname }}</span>
      </div>
      <div v-if="needQuantity && quantity > 0" class="summary-row">
        <span class="summary-label">Jumlah:</span>
        <span class="summary-value">{{ quantity }}</span>
      </div>
      <div v-if="needAdditional && additionalData" class="summary-row">
        <span class="summary-label">Data Tambahan:</span>
        <span class="summary-value">{{ additionalData }}</span>
      </div>
      <div class="summary-row total">
        <span class="summary-label">Total Pembayaran:</span>
        <span class="summary-value highlight">{{ formatPrice(service.price.basic) }}</span>
      </div>
    </div>

    <div class="payment-methods">
      <div class="payment-method-heading">Pilih Metode Pembayaran:</div>
      <div class="payment-method-options">
        <div 
          class="payment-method-option" 
          @click="$emit('payment-selected', 'midtrans')" 
          :class="{selected: selectedPayment === 'midtrans'}"
        >
          <div class="payment-method-info">
            <div class="payment-method-name">🏦 Transfer Bank / E-Wallet</div>
            <div class="payment-method-desc">BCA, BNI, Mandiri, OVO, DANA, GoPay, ShopeePay</div>
            <div class="payment-gateway-badge">Via Midtrans</div>
          </div>
        </div>

        <div 
          class="payment-method-option" 
          @click="$emit('payment-selected', 'xendit')" 
          :class="{selected: selectedPayment === 'xendit'}"
        >
          <div class="payment-method-info">
            <div class="payment-method-name">💳 Kartu Kredit / Debit</div>
            <div class="payment-method-desc">Visa, MasterCard, JCB</div>
            <div class="payment-gateway-badge">Via Xendit</div>
          </div>
        </div>

        <div 
          class="payment-method-option" 
          @click="$emit('payment-selected', 'tripay')" 
          :class="{selected: selectedPayment === 'tripay'}"
        >
          <div class="payment-method-info">
            <div class="payment-method-name">🏪 Convenience Store</div>
            <div class="payment-method-desc">Alfamart, Indomaret</div>
            <div class="payment-gateway-badge">Via TriPay</div>
          </div>
        </div>
      </div>
    </div>

    <div class="payment-gateway-info">
      <div class="gateway-notice">
        <span class="info-icon">ℹ️</span>
        <div class="notice-content">
          <p><strong>Flow Pembayaran</strong></p>
          <p>1. Anda akan diarahkan ke payment gateway yang aman</p>
          <p>2. Setelah pembayaran berhasil, sistem akan otomatis memproses pesanan ke VIPayment</p>
          <p>3. Pesanan akan segera diproses menggunakan saldo VIPayment</p>
        </div>
      </div>
    </div>

    <div v-if="error" class="form-error mt-3">{{ error }}</div>

    <div class="action-buttons">
      <button @click="$emit('back')" class="button-secondary">
        Kembali
      </button>
      <button 
        @click="handlePayment" 
        :disabled="loading || !selectedPayment" 
        class="button-primary"
      >
        <span v-if="loading" class="loader-small"></span>
        <span v-else>{{ getPaymentButtonText() }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  service: { type: Object, required: true },
  dataNo: { type: String, required: true },
  hasAdditionalTarget: { type: Boolean, default: false },
  additionalFieldLabel: { type: String, default: 'Data Tambahan' },
  additionalTarget: { type: String, default: '' },
  nickname: { type: String, default: '' },
  needQuantity: { type: Boolean, default: false },
  quantity: { type: Number, default: 1 },
  needAdditional: { type: Boolean, default: false },
  additionalData: { type: String, default: '' },
  selectedPayment: { type: String, default: 'midtrans' },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' }
})

defineEmits(['back', 'submit', 'payment-selected', 'payment-gateway'])

// Handle payment - all payments go through gateway first
function handlePayment() {
  // All payments must go through payment gateway first
  emit('payment-gateway', props.selectedPayment)
}

function getPaymentButtonText() {
  return 'Lanjut ke Pembayaran'
}

// Format price helper
function formatPrice(price) {
  if (typeof price !== 'number') return '-';
  return price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).replace('IDR', 'Rp');
}
</script>

<style scoped>
/* Payment Confirmation Styles */
.order-summary {
  background: #f8fafc;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}
.summary-row:last-child {
  margin-bottom: 0;
}
.summary-row.total {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #cbd5e1;
  font-weight: 700;
  font-size: 16px;
}
.summary-label {
  color: #64748b;
}
.summary-value {
  font-weight: 500;
  color: #0f172a;
}
.summary-value.highlight {
  color: #3b82f6;
  font-weight: 600;
}
.payment-methods {
  margin-top: 24px;
  margin-bottom: 24px;
}
.payment-method-heading {
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 12px;
}
.payment-method-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.payment-method-option {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}
.payment-method-option:hover {
  border-color: #3b82f6;
  background: #e0f2fe;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}
.payment-method-option.selected {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  background: #eff6ff;
  transform: translateY(-1px);
}
.payment-method-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.payment-method-name {
  font-weight: 600;
  font-size: 15px;
  color: #0f172a;
}
.payment-method-desc {
  font-size: 13px;
  color: #64748b;
}
.payment-method-balance {
  font-size: 12px;
  color: #059669;
  font-weight: 500;
}
.payment-gateway-badge {
  display: inline-block;
  background: #e0e7ff;
  color: #3730a3;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  margin-top: 2px;
  width: fit-content;
}
.payment-gateway-info {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}
.gateway-notice {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.info-icon {
  font-size: 20px;
  margin-top: 2px;
}
.notice-content p {
  margin: 0 0 8px 0;
  font-size: 14px;
  line-height: 1.4;
}
.notice-content p:last-child {
  margin-bottom: 0;
}
.notice-content strong {
  color: #1e40af;
}
.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}
.action-buttons button {
  flex: 1;
}
.button-primary {
  width: 100%;
  padding: 12px 0;
  margin-top: 8px;
  background: #3b82f6;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.button-primary:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
.button-primary[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
  background: #94a3b8;
}
.button-secondary {
  padding: 12px 20px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #475569;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.button-secondary:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
.form-error {
  color: #ef4444;
  margin: 8px 0 12px;
  padding: 10px;
  background-color: #fef2f2;
  border-radius: 6px;
  border-left: 3px solid #ef4444;
  font-size: 0.9rem;
}
.mt-3 {
  margin-top: 12px;
}
.loader-small {
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top: 2px solid #fff;
  width: 14px; height: 14px;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  margin-right: 6px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
