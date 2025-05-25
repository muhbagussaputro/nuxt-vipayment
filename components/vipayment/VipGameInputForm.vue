<template>
  <div>
    <div class="mb-4">
      <div><b>Layanan:</b> {{ service.name }}</div>
      <div><b>Harga:</b> {{ formatPrice(service.price.basic) }}</div>
    </div>
    <form @submit.prevent="$emit('submit')">
      <div class="form-group">
        <label for="data_no">Nomor/ID Akun <span class="text-red-500">*</span></label>
        <input 
          id="data_no" 
          v-model="dataNoModel" 
          type="text" 
          required 
          placeholder="Masukkan ID/No Akun" 
        />
      </div>
      
      <!-- Field tambahan dinamis berdasarkan jenis game -->
      <div v-if="hasAdditionalField" class="form-group">
        <label :for="activeGame.additionalField.name">
          {{ activeGame.additionalField.label }} 
          <span v-if="activeGame.additionalField.required" class="text-red-500">*</span>
        </label>
        
        <!-- Input text untuk Zone ID dll -->
        <input 
          v-if="activeGame.additionalField.type === 'input'" 
          :id="activeGame.additionalField.name" 
          v-model="additionalFieldModel" 
          :required="activeGame.additionalField.required" 
          :placeholder="activeGame.additionalField.placeholder" 
        />
        
        <!-- Select untuk Server genshin-->
        <select 
          v-if="activeGame.additionalField.type === 'select'" 
          :id="activeGame.additionalField.name" 
          v-model="additionalFieldModel" 
          :required="activeGame.additionalField.required"
        >
          <option 
            v-for="option in activeGame.additionalField.options" 
            :key="option.value" 
            :value="option.value"
          >{{ option.label }}</option>
        </select>
      </div>
      
      <!-- Nickname loader/error/result -->
      <div 
        v-if="dataNo && (!hasAdditionalField || (hasAdditionalField && getAdditionalTarget()))" 
        class="form-group nickname-box"
      >
        <label>Nickname</label>
        <div v-if="loading" class="nickname-display"><span class="loader"></span> Mengambil nickname...</div>
        <div v-else-if="error && !nickname" class="form-error">{{ error }}</div>
        <div v-else-if="nickname" class="nickname-display">{{ nickname }}</div>
      </div>
      
      <div v-if="service.need_quantity" class="form-group">
        <label for="quantity">Jumlah</label>
        <input 
          id="quantity" 
          v-model.number="quantityModel" 
          type="number" 
          min="1" 
          placeholder="Jumlah pembelian" 
        />
      </div>
      
      <div v-if="service.need_additional" class="form-group">
        <label for="additional_data">Data Tambahan</label>
        <input 
          id="additional_data" 
          v-model="additionalDataModel" 
          type="text" 
          placeholder="Data tambahan (jika ada)" 
        />
      </div>
      
      <div v-if="error" class="form-error">{{ error }}</div>
      
      <button type="submit" :disabled="loading" class="button-primary">
        Lanjut ke Pembayaran
      </button>
    </form>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  service: { type: Object, required: true },
  activeGame: { type: Object, required: true },
  hasAdditionalField: { type: Boolean, required: true },
  dataNo: { type: String, required: true },
  dataZone: { type: String, default: '' },
  server: { type: String, default: '' },
  additionalData: { type: String, default: '' },
  nickname: { type: String, default: '' },
  quantity: { type: Number, default: 1 },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  getAdditionalTarget: { type: Function, required: true }
})

const emit = defineEmits(['update:dataNo', 'update:dataZone', 'update:server', 'update:additionalData', 'update:quantity', 'submit'])

// Computed properties for v-model sync
const dataNoModel = computed({
  get: () => props.dataNo,
  set: (val) => emit('update:dataNo', val)
})

const quantityModel = computed({
  get: () => props.quantity,
  set: (val) => emit('update:quantity', val)
})

const additionalDataModel = computed({
  get: () => props.additionalData,
  set: (val) => emit('update:additionalData', val)
})

// Computed property for additional field v-model
const additionalFieldModel = computed({
  get() {
    if (!props.hasAdditionalField) return ''
    const field = props.activeGame.additionalField
    if (field.name === 'zone') return props.dataZone
    if (field.name === 'server') return props.server
    return props.additionalData
  },
  set(val) {
    if (!props.hasAdditionalField) return
    const field = props.activeGame.additionalField
    if (field.name === 'zone') emit('update:dataZone', val)
    else if (field.name === 'server') emit('update:server', val)
    else emit('update:additionalData', val)
  }
})

// Format price helper
function formatPrice(price) {
  if (typeof price !== 'number') return '-';
  return price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).replace('IDR', 'Rp');
}
</script>

<style scoped>
.form-group {
  margin-bottom: 16px;
}
.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #0f172a;
}
input, select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border 0.2s;
}
input:focus, select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3);
}
input::placeholder {
  color: #94a3b8;
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
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.button-primary:hover {
  background: #2563eb;
}
.button-primary[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
  background: #94a3b8;
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

.nickname-box {
  background-color: #f1f5f9;
  border-radius: 8px;
  padding: 10px 12px;
}
.nickname-display {
  font-weight: 600;
  color: #0f172a;
  background-color: white;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.loader {
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  border-top: 2px solid #60a5fa;
  width: 16px; height: 16px;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  margin-right: 8px;
  vertical-align: middle;
}

.mb-4 {
  margin-bottom: 16px;
}
.text-red-500 {
  color: #ef4444;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
