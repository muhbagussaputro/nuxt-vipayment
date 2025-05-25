<template>
  <div class="form-container">
    <h3>Cek Nickname Game</h3>
    <form @submit.prevent="checkNickname">
      <button type="submit" :disabled="loading">Cek Nickname</button>
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
const result = ref(null)
const error = ref('')
const loading = ref(false)

const checkNickname = async () => {
  loading.value = true
  error.value = ''
  result.value = null
  try {
    const { data } = await useFetch('/vipayment/game/nickname', {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'POST',
      body: {
        code: 'mobile-legends',
        target: '129393765',
        additional_target: '2651'
      }
    })
    result.value = data.value
  } catch (e) {
    error.value = 'Gagal cek nickname atau payload tidak valid.'
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
