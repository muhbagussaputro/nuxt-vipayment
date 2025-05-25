<template>
  <div class="success-container">
    <div class="success-animation">
      <div class="checkmark-circle">
        <div class="checkmark-stem"></div>
        <div class="checkmark-kick"></div>
      </div>
    </div>
    
    <div class="success-title">Transaksi Berhasil!</div>
    <div class="receipt-container">
      <!-- Receipt header -->
      <div class="receipt-header">
        <div class="receipt-logo">
          <span class="receipt-icon">🎮</span> VIPayment
        </div>
        <div class="receipt-date">{{ new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) }}</div>
      </div>

      <!-- Receipt content -->
      <div class="receipt-content">
        <div class="receipt-row">
          <span class="receipt-label">ID Transaksi</span>
          <span class="receipt-value trx-id">{{ orderData?.trxid || '-' }}</span>
        </div>
        <div class="receipt-divider"></div>
        
        <div class="receipt-row">
          <span class="receipt-label">Layanan</span>
          <span class="receipt-value">{{ orderData?.service || serviceName }}</span>
        </div>
        
        <div class="receipt-row">
          <span class="receipt-label">ID Game</span>
          <span class="receipt-value">{{ orderData?.data || target }}</span>
        </div>
        
        <div v-if="orderData?.zone || additionalTarget" class="receipt-row">
          <span class="receipt-label">{{ additionalFieldLabel || 'Zone ID/Server' }}</span>
          <span class="receipt-value">{{ orderData?.zone || additionalTarget }}</span>
        </div>
        
        <div v-if="nickname" class="receipt-row highlight">
          <span class="receipt-label">Nickname</span>
          <span class="receipt-value">{{ nickname }}</span>
        </div>
        
        <div class="receipt-row">
          <span class="receipt-label">Status</span>
          <span class="receipt-value status-badge">
            <span class="status-dot"></span> {{ orderData?.status || 'waiting' }}
          </span>
        </div>
        
        <div v-if="orderData?.note" class="receipt-note">
          <div class="note-icon">ℹ️</div>
          <div>{{ orderData?.note }}</div>
        </div>
        
        <div class="receipt-divider dotted"></div>
        
        <div class="receipt-row">
          <span class="receipt-label">Harga</span>
          <span class="receipt-value">{{ formatPrice(orderData?.price || price) }}</span>
        </div>
        
        <div v-if="orderData?.balance !== undefined" class="receipt-row">
          <span class="receipt-label">Sisa Saldo</span>
          <span class="receipt-value">{{ formatPrice(orderData?.balance) }}</span>
        </div>

        <div class="receipt-total">
          <span class="receipt-label">Total</span>
          <span class="receipt-value">{{ formatPrice(orderData?.price || price) }}</span>
        </div>
      </div>

      <!-- Receipt footer -->
      <div class="receipt-footer">
        <div class="success-message">
          {{ message || 'Pesanan berhasil, pesanan akan diproses segera.' }}
        </div>
      </div>
    </div>
    
    <div class="action-buttons triple">
      <button @click="$emit('download')" class="button-secondary">
        <span class="button-icon">⬇️</span> Simpan
      </button>
      <button @click="$emit('check-status')" class="button-secondary status">
        <span class="button-icon">🔍</span> Cek Status
      </button>
      <button @click="$emit('close')" class="button-primary">
        Selesai
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  orderData: Object,
  serviceName: String,
  target: String,
  additionalTarget: String,
  additionalFieldLabel: String,
  nickname: String,
  price: Number,
  message: String
})

defineEmits(['close', 'download', 'check-status'])

// Format price helper
function formatPrice(price) {
  if (typeof price !== 'number') return '-';
  return price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).replace('IDR', 'Rp');
}
</script>

<style scoped>
/* Success & Receipt Styles */
.success-container {
  text-align: center;
  padding: 10px 0;
}

/* Checkmark Animation */
.success-animation {
  margin: 10px auto 25px;
  position: relative;
  width: 80px;
  height: 80px;
}
.checkmark-circle {
  width: 80px;
  height: 80px;
  position: relative;
  border-radius: 50%;
  box-sizing: content-box;
  border: 4px solid #16a34a;
}
.checkmark-circle::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 74px;
  height: 74px;
  border-radius: 50%;
  background-color: #f0fdf4;
}
.checkmark-stem {
  position: absolute;
  width: 5px;
  height: 30px;
  background-color: #16a34a;
  left: 39px;
  top: 22px;
  transform: rotate(45deg);
  animation: stem-appear 0.3s ease-out;
  transform-origin: left bottom;
}
.checkmark-kick {
  position: absolute;
  width: 20px;
  height: 5px;
  background-color: #16a34a;
  left: 20px;
  top: 50px;
  transform: rotate(45deg);
  animation: kick-appear 0.3s ease-out 0.2s backwards;
  transform-origin: right center;
}
@keyframes stem-appear {
  0% { height: 0; opacity: 0; }
  100% { height: 30px; opacity: 1; }
}
@keyframes kick-appear {
  0% { width: 0; opacity: 0; }
  100% { width: 20px; opacity: 1; }
}

.success-title {
  font-size: 20px;
  font-weight: 700;
  color: #16a34a;
  margin-bottom: 20px;
  animation: fade-slide-in 0.5s ease-out;
}
@keyframes fade-slide-in {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Receipt Styling */
.receipt-container {
  width: 100%;
  max-width: 360px;
  margin: 0 auto 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  overflow: hidden;
  position: relative;
  animation: receipt-appear 0.4s ease-out 0.3s backwards;
}
@keyframes receipt-appear {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

.receipt-header {
  background: #3b82f6;
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.receipt-logo {
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}
.receipt-icon {
  font-size: 20px;
}
.receipt-date {
  font-size: 14px;
  opacity: 0.9;
}

.receipt-content {
  padding: 20px;
}
.receipt-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  align-items: center;
}
.receipt-row.highlight {
  background: #eff6ff;
  margin: 0 -20px 12px;
  padding: 10px 20px;
  border-left: 3px solid #3b82f6;
}
.receipt-label {
  color: #64748b;
  font-weight: 500;
}
.receipt-value {
  color: #0f172a;
  font-weight: 600;
}
.receipt-value.trx-id {
  color: #3b82f6;
  font-family: monospace;
  font-size: 13px;
  letter-spacing: 0.5px;
}

.receipt-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 12px 0 16px;
}
.receipt-divider.dotted {
  background: repeating-linear-gradient(to right, #cbd5e1 0, #cbd5e1 4px, transparent 4px, transparent 8px);
  height: 2px;
  margin: 16px 0;
}

.receipt-total {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 2px solid #e2e8f0;
  margin-top: 16px;
  font-size: 16px;
  font-weight: 700;
}
.receipt-total .receipt-label {
  color: #0f172a;
}
.receipt-total .receipt-value {
  color: #3b82f6;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  background: #fefce8;
  padding: 4px 10px;
  border-radius: 30px;
  font-size: 13px;
  color: #ca8a04;
  gap: 6px;
  font-weight: 600;
}
.status-dot {
  width: 8px;
  height: 8px;
  background: #ca8a04;
  border-radius: 50%;
  display: inline-block;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

.receipt-note {
  background: #f8fafc;
  border-radius: 8px;
  padding: 12px;
  margin: 16px 0;
  font-size: 13px;
  color: #475569;
  display: flex;
  gap: 8px;
  align-items: flex-start;
  line-height: 1.5;
}
.note-icon {
  opacity: 0.8;
  font-size: 16px;
}

.receipt-footer {
  padding: 16px 20px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}
.success-message {
  color: #16a34a;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin: 20px auto 0;
  max-width: 360px;
}
.action-buttons.triple button {
  flex: 1;
  font-size: 13px;
  padding: 10px 0;
}
.button-icon {
  margin-right: 4px;
  font-size: 14px;
}
.button-secondary.status {
  background: #eff6ff;
  color: #3b82f6;
  border-color: #bfdbfe;
}
.button-secondary.status:hover {
  background: #dbeafe;
}
.button-primary {
  background: #3b82f6;
  border: none;
  color: white;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.button-primary:hover {
  background: #2563eb;
}
.button-secondary {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #475569;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.button-secondary:hover {
  background: #e2e8f0;
}
</style>
