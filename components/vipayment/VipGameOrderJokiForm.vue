<template>
  <div class="form-container">
    <h3>Order Joki Game</h3>
    <form @submit.prevent="orderJoki">
      <input v-model="payload" placeholder="JSON payload order joki" />
      <button type="submit" :disabled="loading">Order Joki</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="result">
      <h4>Result:</h4>
      <pre>{{ result }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const payload = ref('')
const result = ref(null)
const error = ref('')
const loading = ref(false)

const orderJoki = async () => {
  loading.value = true
  error.value = ''
  result.value = null
  try {
    const parsed = JSON.parse(payload.value)
    const { data } = await useFetch('/vipayment/game/order/joki', {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'POST',
      body: parsed
    })
    result.value = data.value
  } catch (e) {
    error.value = 'Gagal order joki atau payload tidak valid.'
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
input {
  margin-right: 8px;
  width: 60%;
  padding: 8px;
}
.error {
  color: red;
}
</style>
