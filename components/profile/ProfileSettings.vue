<template>
  <div class="profile-settings">
    <h3 class="section-title">Pengaturan Profil</h3>
    
    <form @submit.prevent="handleSubmit" class="settings-form">
      <div class="form-section">
        <h4 class="section-subtitle">Informasi Pribadi</h4>
        
        <div class="form-grid">
          <div class="form-group">
            <label for="name" class="form-label">Nama Lengkap</label>
            <input 
              id="name"
              v-model="formData.name" 
              type="text" 
              class="form-input"
              placeholder="Masukkan nama lengkap"
            />
          </div>
          
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              id="email"
              v-model="formData.email" 
              type="email" 
              class="form-input"
              placeholder="Masukkan email"
            />
          </div>
          
          <div class="form-group">
            <label for="phone" class="form-label">Nomor Telepon</label>
            <input 
              id="phone"
              v-model="formData.phone" 
              type="tel" 
              class="form-input"
              placeholder="Masukkan nomor telepon"
            />
          </div>
          
          <div class="form-group">
            <label for="birthDate" class="form-label">Tanggal Lahir</label>
            <input 
              id="birthDate"
              v-model="formData.birthDate" 
              type="date" 
              class="form-input"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="address" class="form-label">Alamat</label>
          <textarea 
            id="address"
            v-model="formData.address" 
            class="form-textarea"
            rows="3"
            placeholder="Masukkan alamat lengkap"
          ></textarea>
        </div>
      </div>
      
      <div class="form-section">
        <h4 class="section-subtitle">Keamanan</h4>
        
        <div class="form-group">
          <label for="currentPassword" class="form-label">Password Saat Ini</label>
          <input 
            id="currentPassword"
            v-model="formData.currentPassword" 
            type="password" 
            class="form-input"
            placeholder="Masukkan password saat ini"
          />
        </div>
        
        <div class="form-grid">
          <div class="form-group">
            <label for="newPassword" class="form-label">Password Baru</label>
            <input 
              id="newPassword"
              v-model="formData.newPassword" 
              type="password" 
              class="form-input"
              placeholder="Masukkan password baru"
            />
          </div>
          
          <div class="form-group">
            <label for="confirmPassword" class="form-label">Konfirmasi Password</label>
            <input 
              id="confirmPassword"
              v-model="formData.confirmPassword" 
              type="password" 
              class="form-input"
              placeholder="Konfirmasi password baru"
            />
          </div>
        </div>
      </div>
      
      <div class="form-section">
        <h4 class="section-subtitle">Notifikasi</h4>
        
        <div class="checkbox-group">
          <label class="checkbox-label">
            <input 
              v-model="formData.emailNotifications" 
              type="checkbox" 
              class="checkbox-input"
            />
            <span class="checkbox-text">Terima notifikasi email</span>
          </label>
          
          <label class="checkbox-label">
            <input 
              v-model="formData.smsNotifications" 
              type="checkbox" 
              class="checkbox-input"
            />
            <span class="checkbox-text">Terima notifikasi SMS</span>
          </label>
          
          <label class="checkbox-label">
            <input 
              v-model="formData.promotionalEmails" 
              type="checkbox" 
              class="checkbox-input"
            />
            <span class="checkbox-text">Terima email promosi</span>
          </label>
        </div>
      </div>
      
      <div class="form-actions">
        <button type="button" class="btn-secondary" @click="resetForm">
          Reset
        </button>
        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update'])

const isLoading = ref(false)

const formData = ref({
  name: props.user.name || '',
  email: props.user.email || '',
  phone: props.user.phone || '',
  birthDate: props.user.birthDate || '',
  address: props.user.address || '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  emailNotifications: props.user.emailNotifications ?? true,
  smsNotifications: props.user.smsNotifications ?? false,
  promotionalEmails: props.user.promotionalEmails ?? true
})

const handleSubmit = async () => {
  if (formData.value.newPassword && formData.value.newPassword !== formData.value.confirmPassword) {
    alert('Password baru dan konfirmasi password tidak cocok')
    return
  }
  
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const updatedData = { ...formData.value }
    delete updatedData.currentPassword
    delete updatedData.newPassword
    delete updatedData.confirmPassword
    
    emit('update', updatedData)
    
    // Reset password fields
    formData.value.currentPassword = ''
    formData.value.newPassword = ''
    formData.value.confirmPassword = ''
    
    alert('Profil berhasil diperbarui!')
  } catch (error) {
    alert('Terjadi kesalahan saat memperbarui profil')
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    name: props.user.name || '',
    email: props.user.email || '',
    phone: props.user.phone || '',
    birthDate: props.user.birthDate || '',
    address: props.user.address || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: props.user.emailNotifications ?? true,
    smsNotifications: props.user.smsNotifications ?? false,
    promotionalEmails: props.user.promotionalEmails ?? true
  }
}
</script>

<style scoped>
.profile-settings {
  max-width: 800px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.section-subtitle {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-section:last-of-type {
  border-bottom: none;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.checkbox-group {
  space-y: 0.75rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-bottom: 0.75rem;
}

.checkbox-input {
  width: 1rem;
  height: 1rem;
  accent-color: #3b82f6;
}

.checkbox-text {
  font-size: 0.875rem;
  color: #374151;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>