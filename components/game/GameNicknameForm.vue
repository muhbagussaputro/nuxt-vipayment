<template>
  <div class="form-container" v-motion-slide-visible-bottom>

    <h3 class="form-title">Cek Nickname Game</h3>
    <p class="form-description">Periksa nickname akun game dengan memasukkan ID dan informasi tambahan</p>
    
    <form @submit.prevent="checkNickname" class="nickname-form">
      <div class="form-grid">
        <div class="form-group">
          <label for="game-code">Kode Game *</label>
          <select id="game-code" v-model="formData.code" class="form-select" required>
            <option value="">Pilih Game</option>
            <option value="mobile-legends">Mobile Legends</option>
            <option value="free-fire">Free Fire</option>
            <option value="genshin-impact">Genshin Impact</option>
            <option value="pubg-mobile">PUBG Mobile</option>
            <option value="honor-of-kings">Honor of Kings</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="target-id">ID Akun *</label>
          <input 
            id="target-id"
            v-model="formData.target" 
            type="text" 
            placeholder="Masukkan ID akun game"
            class="form-input"
            required
          />
        </div>
        
        <div class="form-group" v-if="needsAdditionalTarget">
          <label for="additional-target">{{ getAdditionalLabel() }} *</label>
          <input 
            v-if="getAdditionalType() === 'input'"
            id="additional-target"
            v-model="formData.additional_target" 
            type="text" 
            :placeholder="getAdditionalPlaceholder()"
            class="form-input"
            required
          />
          <select 
            v-else
            id="additional-target"
            v-model="formData.additional_target" 
            class="form-select"
            required
          >
            <option value="">{{ getAdditionalPlaceholder() }}</option>
            <option v-for="option in getServerOptions()" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
      
      <button type="submit" :disabled="loading || !isFormValid" class="submit-btn">
        <span v-if="loading" class="loading-spinner"></span>
        {{ loading ? 'Mengecek...' : 'Cek Nickname' }}
      </button>
    </form>
    
    <div v-if="error" class="error-message">
      <span class="error-icon">⚠️</span>
      {{ error }}
    </div>
    
    <div v-if="nicknameResult" class="result-container">
      <div class="result-header">
        <span class="success-icon">✅</span>
        <h4>Nickname Ditemukan!</h4>
      </div>
      
      <div class="nickname-display">
        <div class="nickname-info">
          <span class="nickname-label">Nickname:</span>
          <span class="nickname-value">{{ displayNickname }}</span>
        </div>
        <div class="account-info">
          <div class="info-row">
            <span class="info-label">Game:</span>
            <span class="info-value">{{ getGameName(formData.code) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">ID Akun:</span>
            <span class="info-value">{{ formData.target }}</span>
          </div>
          <div v-if="formData.additional_target" class="info-row">
            <span class="info-label">{{ getAdditionalLabel() }}:</span>
            <span class="info-value">{{ formData.additional_target }}</span>
          </div>
        </div>
      </div>
      
      <div class="result-actions">
        <button @click="clearForm" class="clear-btn">
          Cek Lagi
        </button>
        <button @click="copyNickname" class="copy-btn">
          <span class="copy-icon">📋</span>
          Copy Nickname
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const formData = ref({
  code: '',
  target: '',
  additional_target: ''
})

const loading = ref(false)
const error = ref('')
const nicknameResult = ref(null)

const emit = defineEmits(['nickname-found'])

const gameConfig = {
  'mobile-legends': {
    name: 'Mobile Legends',
    needsAdditional: true,
    additionalType: 'input',
    additionalLabel: 'Zone ID',
    additionalPlaceholder: 'Masukkan Zone ID'
  },
  'genshin-impact': {
    name: 'Genshin Impact', 
    needsAdditional: true,
    additionalType: 'select',
    additionalLabel: 'Server',
    additionalPlaceholder: 'Pilih Server'
  },
  'free-fire': {
    name: 'Free Fire',
    needsAdditional: false
  },
  'pubg-mobile': {
    name: 'PUBG Mobile',
    needsAdditional: false
  },
  'honor-of-kings': {
    name: 'Honor of Kings',
    needsAdditional: false
  }
}

const needsAdditionalTarget = computed(() => {
  return gameConfig[formData.value.code]?.needsAdditional || false
})

const isFormValid = computed(() => {
  const hasRequiredFields = formData.value.code && formData.value.target
  if (!needsAdditionalTarget.value) return hasRequiredFields
  return hasRequiredFields && formData.value.additional_target
})

const displayNickname = computed(() => {
  if (!nicknameResult.value) return ''
  
  // Handle different response formats
  let nickname = ''
  if (typeof nicknameResult.value === 'string') {
    nickname = nicknameResult.value
  } else if (nicknameResult.value.nickname) {
    nickname = nicknameResult.value.nickname
  } else if (nicknameResult.value.data) {
    nickname = nicknameResult.value.data
  }
  
  // Clean up the nickname
  return nickname.replace(/^[\[|\]]$/g, '').trim()
})

const getGameName = (code) => {
  return gameConfig[code]?.name || code
}

const getAdditionalLabel = () => {
  return gameConfig[formData.value.code]?.additionalLabel || 'Info Tambahan'
}

const getAdditionalType = () => {
  return gameConfig[formData.value.code]?.additionalType || 'input'
}

const getAdditionalPlaceholder = () => {
  return gameConfig[formData.value.code]?.additionalPlaceholder || 'Masukkan info tambahan'
}

const getServerOptions = () => {
  if (formData.value.code === 'genshin-impact') {
    return [
      { value: 'os_asia', label: 'Asia' },
      { value: 'os_usa', label: 'USA' },
      { value: 'os_euro', label: 'Europe' },
      { value: 'os_cht', label: 'TW, HK, MO' }
    ]
  }
  return []
}

const checkNickname = async () => {
  if (!isFormValid.value) {
    error.value = 'Harap lengkapi semua field yang wajib diisi'
    return
  }
  
  loading.value = true
  error.value = ''
  nicknameResult.value = null
  
  try {
    const requestBody = {
      code: formData.value.code,
      target: formData.value.target,
      additional_target: formData.value.additional_target || ''
    }
    
    const data = await $fetch('/vipayment/game/nickname', {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(requestBody).toString()
    })
    
    if (!data) {
      throw new Error('Nickname tidak ditemukan')
    }
    
    nicknameResult.value = data
    emit('nickname-found', {
      nickname: displayNickname.value,
      game: formData.value.code,
      target: formData.value.target,
      additional_target: formData.value.additional_target
    })
    
  } catch (e) {
    console.error('Error checking nickname:', e)
    error.value = 'Gagal mengecek nickname. Pastikan ID akun dan informasi tambahan benar.'
  } finally {
    loading.value = false
  }
}

const clearForm = () => {
  formData.value = {
    code: '',
    target: '',
    additional_target: ''
  }
  nicknameResult.value = null
  error.value = ''
}

const copyNickname = async () => {
  try {
    await navigator.clipboard.writeText(displayNickname.value)
    alert('Nickname berhasil disalin!')
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = displayNickname.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('Nickname berhasil disalin!')
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

.nickname-form {
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

.form-input,
.form-select {
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.submit-btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
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
  margin-bottom: 20px;
}

.result-container {
  margin-top: 32px;
  padding: 24px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.result-header h4 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #166534;
}

.nickname-display {
  margin-bottom: 20px;
}

.nickname-info {
  background: #ffffff;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #d1fae5;
  margin-bottom: 16px;
  text-align: center;
}

.nickname-label {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 4px;
}

.nickname-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #059669;
}

.account-info {
  background: #dcfce7;
  padding: 12px 16px;
  border-radius: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.info-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  font-size: 0.875rem;
  color: #1f2937;
  font-weight: 600;
}

.result-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.clear-btn,
.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  border: 1px solid;
}

.clear-btn {
  background: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
}

.clear-btn:hover {
  background: #e5e7eb;
}

.copy-btn {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.copy-btn:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.success-icon,
.error-icon,
.copy-icon {
  font-size: 1.2rem;
}
</style>
