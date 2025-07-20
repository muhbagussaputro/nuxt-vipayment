<template>
  <div class="text-center p-6">
    <!-- Success Animation -->
    <div class="success-animation mb-6" v-motion-slide-visible-top>
      <div class="checkmark-circle">
        <div class="checkmark-stem"></div>
        <div class="checkmark-kick"></div>
      </div>
    </div>
    
    <h2 class="text-2xl font-bold text-success mb-6" v-motion-slide-visible-top :delay="100">Transaksi Berhasil!</h2>
    
    <!-- Receipt -->
    <div class="card max-w-sm mx-auto mb-6" v-motion-slide-visible-bottom :delay="200">
      <!-- Receipt Header -->
      <div class="card-header text-center">
        <div class="flex items-center justify-center gap-2 mb-2">
          <span class="text-2xl">🎮</span>
          <span class="font-bold text-primary">VIPayment</span>
        </div>
        <div class="text-sm text-secondary">{{ formatDate(new Date()) }}</div>
      </div>

      <!-- Receipt Content -->
      <div class="card-body space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-secondary">ID Transaksi</span>
          <span class="font-mono text-sm font-semibold">{{ orderData?.trxid || '-' }}</span>
        </div>
        
        <div class="border-t border-gray-200"></div>
        
        <div class="flex justify-between">
          <span class="text-secondary">Layanan</span>
          <span class="font-medium">{{ orderData?.service || serviceName }}</span>
        </div>
        
        <div class="flex justify-between">
          <span class="text-secondary">ID Game</span>
          <span class="font-medium">{{ orderData?.data || target }}</span>
        </div>
        
        <div v-if="orderData?.zone || additionalTarget" class="flex justify-between">
          <span class="text-secondary">{{ additionalFieldLabel || 'Zone ID/Server' }}</span>
          <span class="font-medium">{{ orderData?.zone || additionalTarget }}</span>
        </div>
        
        <div v-if="nickname" class="flex justify-between bg-primary bg-opacity-10 p-2 rounded">
          <span class="text-secondary">Nickname</span>
          <span class="font-semibold text-primary">{{ nickname }}</span>
        </div>
        
        <div class="flex justify-between">
          <span class="text-secondary">Status</span>
          <span class="flex items-center gap-2">
            <span class="w-2 h-2 bg-success rounded-full"></span>
            <span class="badge badge-success">{{ formatStatus(orderData?.status || 'waiting') }}</span>
          </span>
        </div>
        
        <div v-if="orderData?.note" class="bg-warning bg-opacity-10 border border-warning rounded p-3">
          <div class="flex gap-2">
            <span>ℹ️</span>
            <span class="text-sm">{{ orderData?.note }}</span>
          </div>
        </div>
        
        <div class="border-t border-dashed border-gray-300"></div>
        
        <div class="flex justify-between">
          <span class="text-secondary">Harga</span>
          <span class="font-medium">{{ formatPrice(orderData?.price || price) }}</span>
        </div>
        
        <div v-if="orderData?.balance !== undefined" class="flex justify-between">
          <span class="text-secondary">Sisa Saldo</span>
          <span class="font-medium">{{ formatPrice(orderData?.balance) }}</span>
        </div>

        <div class="flex justify-between text-lg font-bold bg-gray-50 p-3 rounded">
          <span>Total</span>
          <span class="text-primary">{{ formatPrice(orderData?.price || price) }}</span>
        </div>
      </div>

      <!-- Receipt Footer -->
      <div class="card-footer text-center">
        <p class="text-sm text-success">
          {{ message || 'Pesanan berhasil, pesanan akan diproses segera.' }}
        </p>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex gap-3 justify-center" v-motion-slide-visible-bottom :delay="300">
      <button @click="$emit('download')" class="btn btn-outline btn-sm transition-all duration-200 hover:scale-105">
        <span class="mr-1">⬇️</span> Simpan
      </button>
      <button @click="$emit('check-status')" class="btn btn-outline btn-sm transition-all duration-200 hover:scale-105">
        <span class="mr-1">🔍</span> Cek Status
      </button>
      <button @click="$emit('close')" class="btn btn-primary transition-all duration-200 hover:scale-105">
        Selesai
      </button>
    </div>
  </div>
</template>

<script setup>
import { useFormatters } from '~/composables/useFormatters'

const { formatPrice, formatDate, formatStatus } = useFormatters()

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
</script>

<style scoped>
/* Success Animation */
.success-animation {
  margin: 0 auto;
  width: 80px;
  height: 80px;
}

.checkmark-circle {
  width: 80px;
  height: 80px;
  position: relative;
  border-radius: 50%;
  border: 4px solid #10b981;
  background-color: #f0fdf4;
}

.checkmark-stem {
  position: absolute;
  width: 5px;
  height: 30px;
  background-color: #10b981;
  left: 35px;
  top: 18px;
  transform: rotate(45deg);
  animation: stem-appear 0.3s ease-out;
}

.checkmark-kick {
  position: absolute;
  width: 20px;
  height: 5px;
  background-color: #10b981;
  left: 20px;
  top: 46px;
  transform: rotate(45deg);
  animation: kick-appear 0.3s ease-out 0.2s backwards;
}

@keyframes stem-appear {
  0% { height: 0; opacity: 0; }
  100% { height: 30px; opacity: 1; }
}

@keyframes kick-appear {
  0% { width: 0; opacity: 0; }
  100% { width: 20px; opacity: 1; }
}
</style>
