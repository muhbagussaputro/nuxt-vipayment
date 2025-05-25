<template>
  <div class="form-container">
    <h3>Get Prepaid Services</h3>
    <form @submit.prevent="fetchServices">
      <button type="submit" :disabled="loading">Lihat Layanan</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="services">
      <h4>Daftar Layanan:</h4>
      <pre>{{ services }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const services = ref(null)
const error = ref('')
const loading = ref(false)

const fetchServices = async () => {
  loading.value = true
  error.value = ''
  services.value = null
  try {
    // Ganti BASE_URL_API sesuai kebutuhan
    const { data } = await useFetch('/vipayment/prepaid/services', {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'POST',
    })
    services.value = data.value
  } catch (e) {
    error.value = 'Gagal mengambil layanan.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-container {
  margin-bottom: 32px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}
.error {
  color: red;
}
</style>
