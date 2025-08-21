<template>
  <div>
    <div class="card-body mb-4">
      <div class="mb-2"><span class="font-semibold">Layanan:</span> {{ service.name }}</div>
      <div><span class="font-semibold">Harga:</span> <span class="text-primary font-semibold">{{ formatPrice(service.price.basic) }}</span></div>
    </div>
    
    <form @submit.prevent="$emit('submit')" class="space-y-4">
      <div class="form-group" v-motion-slide-visible-left>
        <label for="data_no" class="form-label">
          Nomor/ID Akun <span class="text-error">*</span>
        </label>
        <input 
          id="data_no" 
          v-model="dataNoModel" 
          type="text" 
          required 
          placeholder="Masukkan ID/No Akun"
          class="form-input transition-all duration-200 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>
      
      <!-- Field tambahan dinamis berdasarkan jenis game -->
      <div v-if="hasAdditionalField" class="form-group" v-motion-slide-visible-left :delay="100">
        <label :for="activeGame.additionalField.name" class="form-label">
          {{ activeGame.additionalField.label }} 
          <span v-if="activeGame.additionalField.required" class="text-error">*</span>
        </label>
        
        <!-- Input text untuk Zone ID dll -->
        <input 
          v-if="activeGame.additionalField.type === 'input'" 
          :id="activeGame.additionalField.name" 
          v-model="additionalFieldModel" 
          :required="activeGame.additionalField.required" 
          :placeholder="activeGame.additionalField.placeholder"
          class="form-input transition-all duration-200 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
        
        <!-- Select untuk Server genshin-->
        <select 
          v-if="activeGame.additionalField.type === 'select'" 
          :id="activeGame.additionalField.name" 
          v-model="additionalFieldModel" 
          :required="activeGame.additionalField.required"
          class="form-select transition-all duration-200 focus:border-blue-500 focus:ring focus:ring-blue-200"
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
        class="form-group" v-motion-slide-visible-left :delay="200"
      >
        <label class="form-label">Nickname</label>
        <div class="bg-gray-100 rounded-lg p-3">
          <div v-if="loading" class="flex items-center gap-2 text-secondary">
            <span class="loading"></span> Mengambil nickname...
          </div>
          <div v-else-if="error && !nickname" class="text-error text-sm">{{ error }}</div>
          <div v-else-if="nickname" class="font-semibold text-primary">{{ nickname }}</div>
        </div>
      </div>
      
      <div v-if="service.need_quantity" class="form-group" v-motion-slide-visible-left :delay="300">
        <label for="quantity" class="form-label">Jumlah</label>
        <input 
          id="quantity" 
          v-model.number="quantityModel" 
          type="number" 
          min="1" 
          placeholder="Jumlah pembelian"
          class="form-input transition-all duration-200 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>
      
      <div v-if="service.need_additional" class="form-group" v-motion-slide-visible-left :delay="400">
        <label for="additional_data" class="form-label">Data Tambahan</label>
        <input 
          id="additional_data" 
          v-model="additionalDataModel" 
          type="text" 
          placeholder="Data tambahan (jika ada)"
          class="form-input transition-all duration-200 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>
      
      <div v-if="error" class="bg-error bg-opacity-10 border border-error rounded-lg p-3" v-motion-slide-visible-left :delay="500">
        <p class="text-error text-sm">{{ error }}</p>
      </div>
      
      <button type="submit" :disabled="loading" class="btn btn-primary btn-full transition-all duration-200 hover:scale-105">
        <span v-if="loading" class="loading mr-2"></span>
        {{ loading ? 'Memproses...' : 'Lanjut ke Pembayaran' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFormatters } from '~/composables/useFormatters'

const { formatPrice } = useFormatters()

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
</script>
