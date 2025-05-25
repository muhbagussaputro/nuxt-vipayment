<template>
    <div class="max-w-md mx-auto mt-10 p-6 rounded-xl shadow bg-white">
      <h2 class="font-bold text-xl mb-4">Cek Nickname Game</h2>
  
      <form @submit.prevent>
        <!-- Pilih Game -->
        <div class="mb-3">
          <label class="block mb-1 font-semibold">Pilih Game</label>
          <select v-model="code" class="w-full border rounded p-2" required>
            <option value="">Pilih Game</option>
            <option v-for="g in games" :key="g.code" :value="g.code">{{ g.label }}</option>
          </select>
        </div>
  
        <!-- Input User ID/No Akun -->
        <div v-if="code" class="mb-3">
          <label class="block mb-1 font-semibold">
            {{ activeGame.inputLabel || 'User ID / No Akun' }}
          </label>
          <input v-model="target" class="w-full border rounded p-2" type="text" :placeholder="activeGame.inputPlaceholder || 'Masukkan User ID/No Akun'" />
        </div>
  
        <!-- Input Tambahan: Zone ID / Server dst -->
        <div v-if="activeGame.needAdditional && code" class="mb-3">
          <label class="block mb-1 font-semibold">
            {{ activeGame.additionalLabel || 'Data Tambahan' }}
          </label>
          <!-- Pilihan Server untuk Genshin Impact -->
          <select
            v-if="code === 'genshin-impact'"
            v-model="additionalTarget"
            class="w-full border rounded p-2"
            required
          >
            <option value="">Pilih Server</option>
            <option value="os_asia">Asia</option>
            <option value="os_usa">USA</option>
            <option value="os_euro">Europe</option>
            <option value="os_cht">TW, HK, MO</option>
          </select>
          <!-- Zone ID untuk ML, input untuk game lain -->
          <input
            v-else
            v-model="additionalTarget"
            class="w-full border rounded p-2"
            type="text"
            :placeholder="activeGame.additionalPlaceholder || 'Masukkan Data Tambahan'"
          />
        </div>
      </form>
  
      <!-- Loader, Error, Result -->
      <div v-if="loading" class="mt-4 text-blue-500 text-sm flex items-center gap-2">
        <span class="loader"></span> Mengambil nickname...
      </div>
      <div v-if="error" class="mt-3 text-red-600">{{ error }}</div>
      <div v-if="nickname && !loading && !error" class="mt-3 bg-green-50 border border-green-300 rounded p-3">
        <div class="text-gray-600">Nickname:</div>
        <div class="font-bold text-lg text-green-700">{{ nickname }}</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, computed } from 'vue'
  import { useFetch, useRuntimeConfig } from '#app'
  
  // Daftar game + mapping kebutuhan input
  const games = [
    { code: 'mobile-legends', label: 'Mobile Legends', needAdditional: true, inputLabel: 'User ID', inputPlaceholder: 'Masukkan User ID', additionalLabel: 'Zone ID', additionalPlaceholder: 'Masukkan Zone ID' },
    { code: 'genshin-impact', label: 'Genshin Impact', needAdditional: true, inputLabel: 'User ID', inputPlaceholder: 'Masukkan User ID', additionalLabel: 'Server', additionalPlaceholder: 'Pilih Server' },
    { code: 'hago', label: 'Hago' },
    { code: 'zepeto', label: 'Zepeto' },
    { code: 'lords-mobile', label: 'Lords Mobile' },
    { code: 'marvel-super-war', label: 'Marvel Super War' },
    { code: 'ragnarok-m-eternal-love-big-cat-coin', label: 'Ragnarok M' },
    { code: 'speed-drifters', label: 'Speed Drifters' },
    { code: 'laplace-m', label: 'Laplace M' },
    { code: 'valorant', label: 'Valorant' },
    { code: 'higgs-domino', label: 'Higgs Domino' },
    { code: 'point-blank', label: 'Point Blank' },
    { code: 'dragon-raja', label: 'Dragon Raja' },
    { code: 'league-of-legends-wild-rift', label: 'LOL: Wild Rift' },
    { code: 'free-fire', label: 'Free Fire' },
    { code: 'free-fire-max', label: 'Free Fire Max' },
    { code: 'tom-and-jerry-chase', label: 'Tom and Jerry: Chase' },
    { code: 'cocofun', label: 'Cocofun' },
    { code: '8-ball-pool', label: '8 Ball Pool' },
    { code: 'auto-chess', label: 'Auto Chess' },
    { code: 'bullet-angel', label: 'Bullet Angel' },
    { code: 'arena-of-valor', label: 'Arena of Valor' },
    { code: 'call-of-duty-mobile', label: 'Call of Duty MOBILE' },
    { code: 'indoplay', label: 'IndoPlay' },
    { code: 'domino-gaple-qiuqiu-boyaa', label: 'Domino Gaple Boyaa Qiuqiu' },
  ]
  
  // Reactive field
  const code = ref('')
  const target = ref('')
  const additionalTarget = ref('')
  const nickname = ref('')
  const loading = ref(false)
  const error = ref('')
  
  // Game aktif yang dipilih
  const activeGame = computed(() => games.find(g => g.code === code.value) || {})
  
  // Reset field ketika game berubah
  watch(code, () => {
    target.value = ''
    additionalTarget.value = ''
    nickname.value = ''
    error.value = ''
  })
  
  // Debounce helper
  let debounceTimeout = null
  // Watch field untuk otomatis fetch nickname
  watch([code, target, additionalTarget], async () => {
    // Debounce agar tidak request terlalu sering
    if (debounceTimeout) clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(async () => {
      error.value = ''
      nickname.value = ''
      // Validasi
      if (!code.value || !target.value) return
      if (activeGame.value.needAdditional && !additionalTarget.value) return
    
      loading.value = true
      try {
      // Log request body
      const requestBody = {
        code: code.value,
        target: target.value,
        additional_target: activeGame.value.needAdditional ? additionalTarget.value : '',
      }
      console.log('Request Body:', requestBody)

      // Format body sebagai URL-encoded string
      const urlEncodedBody = new URLSearchParams(requestBody).toString()
      
      // Gunakan $fetch karena component sudah mounted
      const { data, error: fetchErr } = await $fetch('/vipayment/game/nickname', {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedBody
      })
      
      // Log request yang sudah di-encode
      console.log('Encoded Request:', urlEncodedBody)

      // Log response dan error
      console.log('Response:', data)
      console.log('Error:', fetchErr)
      
      // Tambahkan delay 500ms sebelum menampilkan hasil
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Jika ada error
      if (fetchErr) {
        console.error('API Error:', {
          error: fetchErr,
          response: data
        })
        error.value = 'Gagal mengambil nickname.'
        return
      }
      
      // Jika response string (nickname langsung)
      if (typeof data === 'string') {
        nickname.value = data.replace(/^[\[|\]]$/g, '').trim()
        return
      }
      // Jika response object, ambil dari property nickname/data
      if (typeof data === 'object' && (data.nickname || data.data)) {
        const nick = data.nickname || data.data
        nickname.value = nick.replace(/^[\[|\]]$/g, '').trim()
        return
      }
      // Jika tidak ditemukan
      error.value = 'Nickname tidak ditemukan.'
    } catch (e) {
      error.value = e.message || 'Nickname tidak ditemukan'
    } finally {
      loading.value = false
    }
    }, 1200) // debounce 1200ms
  })
  </script>
  
  <style scoped>
  .loader {
    border: 2px solid #e5e7eb;
    border-radius: 50%;
    border-top: 2px solid #60a5fa;
    width: 16px; height: 16px;
    animation: spin 0.8s linear infinite;
    display: inline-block;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  </style>
  