<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-content">
      <button class="modal-close transition-all duration-200 hover:scale-125 hover:text-red-500" @click="close">×</button>
      <h3 class="mb-4 font-bold text-lg">{{ step === 'form' ? 'Pembelian Layanan Game' : (step === 'confirm' ? 'Konfirmasi Pembayaran' : 'Pesanan Berhasil') }}</h3>

      <Transition name="fade-slide" mode="out-in">
        <!-- Form Input Step -->
        <VipGameInputForm
          v-if="step === 'form'"
          :service="service"
          :active-game="activeGame"
          :has-additional-field="hasAdditionalField"
          :data-no="dataNo"
          :data-zone="dataZone"
          :server="server"
          :additional-data="additionalData"
          :nickname="nickname"
          :quantity="quantity"
          :loading="loading"
          :error="error"
          :get-additional-target="getAdditionalTarget"
          @update:data-no="dataNo = $event"
          @update:data-zone="dataZone = $event"
          @update:server="server = $event"
          @update:additional-data="additionalData = $event"
          @update:quantity="quantity = $event"
          @submit="goToConfirm"
        />

      <!-- Konfirmasi Pembayaran Step -->
      <VipGamePaymentConfirm
        v-else-if="step === 'confirm'"
        :service="service"
        :data-no="dataNo"
        :has-additional-target="hasAdditionalField && !!getAdditionalTarget()"
        :additional-field-label="activeGame?.additionalField?.label || ''"
        :additional-target="getAdditionalTarget()"
        :nickname="nickname"
        :need-quantity="service.need_quantity"
        :quantity="quantity"
        :need-additional="service.need_additional"
        :additional-data="additionalData"
        :selected-payment="selectedPayment"
        :loading="loading"
        :error="error"
        @back="backToForm"
        @submit="handlePaymentGateway"
        @payment-gateway="handlePaymentGateway"
        @payment-selected="selectedPayment = $event"
      />

      <!-- Success Step -->
      <VipGameSuccessReceipt
        v-else-if="step === 'success'"
        :order-data="orderResult?.data"
        :service-name="service.name"
        :target="dataNo"
        :additional-target="getAdditionalTarget()"
        :additional-field-label="activeGame?.additionalField?.label"
        :nickname="nickname"
        :price="service.price.basic"
        :message="orderResult?.message"
        @close="close"
        @download="downloadReceipt"
        @check-status="checkTransactionStatus"
      />
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import VipGameInputForm from './VipGameInputForm.vue'
import VipGamePaymentConfirm from './VipGamePaymentConfirm.vue'
import VipGameSuccessReceipt from './VipGameSuccessReceipt.vue'

// Import payment gateway composable
const { createPaymentOrder, redirectToPayment } = usePaymentGateway()

const props = defineProps({
  service: { type: Object, required: true },
  show: Boolean
})

// Debug props data yang diterima
console.log('Received props.service:', props.service)
onMounted(() => {
  console.log('Mounted - Service Data:', props.service)
  if (props.service) {
    console.log('   - code:', props.service.code)
    console.log('   - slug:', props.service.slug)
    console.log('   - name:', props.service.name)
    // Cek juga hasil normalisasi
    console.log('   - normalized key:', normalizeGameKey(props.service.slug || props.service.code))
    console.log('   - hasAdditionalField:', hasAdditionalField.value)
    if (hasAdditionalField.value) {
      console.log('   - additionalField:', activeGame.value.additionalField)
    }
  }
})
const emit = defineEmits(['close','success'])

// Multi-step flow
const step = ref('form') // form -> confirm -> success
const selectedPayment = ref('midtrans')
const orderResult = ref(null)

const dataNo = ref('')
const dataZone = ref('')
const server = ref('')
const nickname = ref('')
const quantity = ref(1)
const additionalData = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

// Debounce untuk pengecekan nickname
let debounceTimeout = null
watch([dataNo, dataZone, server], () => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(async () => {
    nickname.value = ''
    error.value = ''
    // Validasi input
    if (!dataNo.value) return
    if (hasAdditionalField.value && !getAdditionalTarget()) return
    
    loading.value = true
    try {
      const requestBody = {
        code: code.value,
        target: dataNo.value,
        additional_target: getAdditionalTarget()
      }
      const urlEncodedBody = new URLSearchParams(requestBody).toString()
      const data = await $fetch('/vipayment/game/nickname', {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedBody
      })
      // Penanganan response string/object
      if (typeof data === 'string') {
        nickname.value = data.replace(/^[\[|\]]$/g, '').trim()
        return
      }
      if (typeof data === 'object' && (data.nickname || data.data)) {
        const nick = data.nickname || data.data
        nickname.value = nick.replace(/^[\[|\]]$/g, '').trim()
        return
      }
      error.value = 'Nickname tidak ditemukan.'
    } catch (e) {
      error.value = 'Gagal mengambil nickname.'
    } finally {
      loading.value = false
    }
  }, 1200) // debounce 1.2 detik
})

// Definisi game dan persyaratan input
const gameConfig = {
  // Mobile Legends dengan berbagai variasi nama
  'mobile-legends': {
    code: 'mobile-legends',
    additionalField: {
      type: 'input',
      name: 'zone',
      label: 'Zone ID',
      placeholder: 'Masukkan Zone ID',
      required: true
    }
  },
  'mobile-legends-a': {
    code: 'mobile-legends',
    additionalField: {
      type: 'input',
      name: 'zone',
      label: 'Zone ID',
      placeholder: 'Masukkan Zone ID',
      required: true
    }
  },
  'mobilelegends': {
    code: 'mobile-legends',
    additionalField: {
      type: 'input',
      name: 'zone',
      label: 'Zone ID',
      placeholder: 'Masukkan Zone ID',
      required: true
    }
  },
  'ml': {
    code: 'mobile-legends',
    additionalField: {
      type: 'input',
      name: 'zone',
      label: 'Zone ID',
      placeholder: 'Masukkan Zone ID',
      required: true
    }
  },
  // Genshin Impact dengan berbagai variasi nama
  'genshin-impact': {
    code: 'genshin-impact',
    additionalField: {
      type: 'select',
      name: 'server',
      label: 'Server',
      required: true,
      options: [
        { value: '', label: 'Pilih Server' },
        { value: 'os_asia', label: 'Asia' },
        { value: 'os_usa', label: 'USA' },
        { value: 'os_euro', label: 'Europe' },
        { value: 'os_cht', label: 'TW, HK, MO' }
      ]
    }
  },
  'genshin': {
    code: 'genshin-impact',
    additionalField: {
      type: 'select',
      name: 'server',
      label: 'Server',
      required: true,
      options: [
        { value: '', label: 'Pilih Server' },
        { value: 'os_asia', label: 'Asia' },
        { value: 'os_usa', label: 'USA' },
        { value: 'os_euro', label: 'Europe' },
        { value: 'os_cht', label: 'TW, HK, MO' }
      ]
    }
  },
  'genshinimpact': {
    code: 'genshin-impact',
    additionalField: {
      type: 'select',
      name: 'server',
      label: 'Server',
      required: true,
      options: [
        { value: '', label: 'Pilih Server' },
        { value: 'os_asia', label: 'Asia' },
        { value: 'os_usa', label: 'USA' },
        { value: 'os_euro', label: 'Europe' },
        { value: 'os_cht', label: 'TW, HK, MO' }
      ]
    }
  },
  // Games lainnya
  'league-of-legends-wild-rift': {
    code: 'league-of-legends-wild-rift'
  },
  'free-fire': {
    code: 'free-fire'
  },
  'free-fire-max': {
    code: 'free-fire-max'
  }
}

// Fungsi normalisasi slug/code agar konsisten dengan key di gameConfig
function normalizeGameKey(key) {
  // Tambahkan console log untuk tracking
  console.log('Original Key:', key)
  
  if (!key) return ''
  
  // Handling berbagai format nama game
  let normalized = key.toString().trim().toLowerCase()
    .replace(/_/g, '-')
    .replace(/\s+/g, '-') // Ubah spasi jadi dash
    .replace(/[^a-z0-9-]/g, '') // Hapus semua karakter selain huruf, angka, dan dash
  
  // Handle kasus khusus untuk mobile legends dan genshin impact
  if (normalized.includes('mobile') || normalized.includes('ml')) {
    if (normalized.includes('legend')) {
      console.log('Terdeteksi Mobile Legends:', normalized, '→ mobile-legends')
      return 'mobile-legends'
    }
  }
  
  if (normalized.includes('genshin')) {
    console.log('Terdeteksi Genshin Impact:', normalized, '→ genshin-impact')
    return 'genshin-impact'
  }
  
  console.log('Normalized Key:', normalized)
  return normalized
}

// Mendapatkan konfigurasi game aktif
const activeGame = computed(() => {
  // Prioritaskan gameSlug dari modal terlebih dahulu
  const gameSlug = props.service.gameSlug || ''
  const gameName = props.service.gameName || ''
  
  console.log('Game Info:', {
    gameSlug, 
    gameName, 
    serviceCode: props.service.code,
    serviceSlug: props.service.slug
  })
  
  // Coba identifikasi berdasarkan nama game dulu
  if (gameName) {
    const gameLower = gameName.toLowerCase()
    if (gameLower.includes('mobile legends')) {
      console.log('Identified by name: mobile-legends')
      return gameConfig['mobile-legends']
    }
    if (gameLower.includes('genshin impact')) {
      console.log('Identified by name: genshin-impact')
      return gameConfig['genshin-impact']
    }
  }
  
  // Jika tidak, normalisasi dari slug/code
  let gameKey = normalizeGameKey(gameSlug || props.service.slug || props.service.code)
  console.log('Game key from service:', gameKey)
  
  // Jika masih tidak ditemukan, coba pemeriksaan manual
  if (!gameConfig[gameKey]) {
    // Cek Mobile Legends
    if ((gameKey.includes('mobile') || gameKey.includes('ml') || gameKey.includes('mole')) && 
        (gameKey.includes('legend') || gameKey.includes('lg'))) {
      gameKey = 'mobile-legends'
    }
    // Cek Genshin Impact
    else if (gameKey.includes('genshin') || gameKey.includes('gensin')) {
      gameKey = 'genshin-impact'
    }
  }
  
  return gameConfig[gameKey] || { code: gameKey }
})

// Shortcut untuk kode game
const code = computed(() => activeGame.value.code)

// Cek apakah game memerlukan field tambahan
const hasAdditionalField = computed(() => !!activeGame.value.additionalField)

// Computed property untuk v-model field tambahan
defineExpose({ dataZone, server, additionalData })
const additionalFieldModel = computed({
  get() {
    if (!hasAdditionalField.value) return ''
    const field = activeGame.value.additionalField
    if (field.name === 'zone') return dataZone.value
    if (field.name === 'server') return server.value
    return additionalData.value
  },
  set(val) {
    if (!hasAdditionalField.value) return
    const field = activeGame.value.additionalField
    if (field.name === 'zone') dataZone.value = val
    else if (field.name === 'server') server.value = val
    else additionalData.value = val
  }
})

// Mendapatkan nilai additional target berdasarkan jenis game
const getAdditionalTarget = () => {
  if (!hasAdditionalField.value) return ''
  const field = activeGame.value.additionalField
  if (field.name === 'zone') return dataZone.value
  if (field.name === 'server') return server.value
  return additionalData.value
}

function close() {
  emit('close')
  // Reset semua nilai form
  dataNo.value = ''
  dataZone.value = ''
  server.value = ''
  nickname.value = ''
  quantity.value = 1
  additionalData.value = ''
  error.value = ''
  success.value = false
  selectedPayment.value = 'balance'
  orderResult.value = null
  step.value = 'form' // Kembali ke langkah awal
}

// Fungsi untuk mengunduh struk transaksi sebagai gambar
function downloadReceipt() {
  // Di implementasi nyata, biasanya menggunakan html2canvas atau cara lain
  // Untuk demo ini, cukup menampilkan pesan sukses
  alert('Struk transaksi telah disimpan di galeri Anda!')
  
  // Contoh implementasi jika menggunakan html2canvas:
  // 1. Tangkap elemen receipt menjadi canvas
  // 2. Konversi canvas menjadi gambar
  // 3. Unduh gambar
  
  /* 
  Contoh kode (memerlukan library html2canvas):
  
  import html2canvas from 'html2canvas'
  
  const receiptElement = document.querySelector('.receipt-container')
  
  html2canvas(receiptElement).then(canvas => {
    const link = document.createElement('a')
    link.download = `VIPayment-${orderResult.value?.data?.trxid || 'receipt'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  })
  */
}

// Fungsi untuk mengecek status transaksi
async function checkTransactionStatus() {
  if (!orderResult.value?.data?.trxid) {
    alert('Tidak dapat menemukan ID transaksi')
    return
  }
  
  const trxId = orderResult.value.data.trxid
  
  try {
    loading.value = true
    
    // Gunakan URLSearchParams untuk format x-www-form-urlencoded
    const urlEncodedBody = new URLSearchParams({ trxid: trxId }).toString()
    
    const statusData = await $fetch('/vipayment/game/status', {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: urlEncodedBody
    })
    
    console.log('Transaction status:', statusData)
    
    // Update orderResult dengan data terbaru
    if (statusData && statusData.result) {
      // Update data transaksi dengan status terbaru
      orderResult.value = statusData
      alert(`Status transaksi: ${statusData.data?.status || 'waiting'}`)
    } else {
      alert('Gagal mendapatkan status transaksi: ' + (statusData.message || 'Status tidak tersedia'))
    }
  } catch (e) {
    console.error('Error checking transaction status:', e)
    alert('Gagal mengecek status transaksi. Silakan coba lagi nanti.')
  } finally {
    loading.value = false
  }
}

function formatPrice(price) {
  if (typeof price !== 'number') return '-';
  return price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).replace('IDR', 'Rp');
}

// Validasi input dan pindah ke halaman konfirmasi
async function goToConfirm() {
  error.value = ''
  loading.value = true
  try {
    // 1. Validasi input
    if (!dataNo.value) {
      throw new Error('Nomor/ID akun wajib diisi.')
    }
    if (hasAdditionalField.value && activeGame.value.additionalField.required && !getAdditionalTarget()) {
      throw new Error(`${activeGame.value.additionalField.label} wajib diisi.`)
    }
    if (props.service.need_quantity && (!quantity.value || quantity.value < 1)) {
      throw new Error('Jumlah pembelian wajib diisi.')
    }
    
    // 2. Ambil nickname jika belum ada
    if (!nickname.value) {
      try {
        // Coba ambil nickname sebelum lanjut ke konfirmasi
        const nicknameResponse = await fetchNickname()
        nickname.value = nicknameResponse
      } catch (nicknameError) {
        console.warn('Gagal mengambil nickname:', nicknameError)
        // Tetap lanjut meskipun gagal ambil nickname
      }
    }
    
    // Pindah ke halaman konfirmasi
    step.value = 'confirm'
  } catch (e) {
    console.error('Validation error:', e)
    error.value = e.message
  } finally {
    loading.value = false
  }
}

// Kembali ke halaman form
function backToForm() {
  step.value = 'form'
  error.value = ''
}

// Handle payment gateway flow
async function handlePaymentGateway(paymentMethod) {
  error.value = ''
  loading.value = true
  
  try {
    // Use the selected payment method or the parameter passed
    const gateway = paymentMethod || selectedPayment.value
    
    // Prepare order data for payment gateway
    const orderData = {
      amount: props.service.price.basic,
      service_code: props.service.code,
      service_name: props.service.name,
      target: dataNo.value,
      additional_target: getAdditionalTarget(),
      quantity: props.service.need_quantity ? quantity.value : 1,
      additional_data: props.service.need_additional ? additionalData.value : '',
      customer_name: nickname.value || 'Customer',
      customer_email: 'customer@vipayment.com',
      customer_phone: '081234567890'
    }
    
    // Create payment order
    const paymentResponse = await createPaymentOrder(gateway, orderData)
    
    // Redirect to payment gateway
    redirectToPayment(paymentResponse.payment_url)
    
    // Show waiting message
    alert('Anda akan diarahkan ke halaman pembayaran. Setelah pembayaran berhasil, pesanan akan diproses otomatis ke VIPayment.')
    
    // Close modal for now - in real app you might want to show waiting status
    close()
    
  } catch (e) {
    console.error('Payment gateway error:', e)
    error.value = e.message || 'Gagal membuat pembayaran. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}



// Ambil nickname dari backend
async function fetchNickname() {
  // Persiapkan body request sesuai dengan game
  let body = {
    code: code.value,
    target: dataNo.value,
    additional_target: ''
  }
  
  // Sesuaikan additional_target berdasarkan jenis game
  if (code.value === 'mobile-legends') {
    body.additional_target = dataZone.value
  } else if (code.value === 'genshin-impact') {
    body.additional_target = server.value
  }
  
  const { data, error: fetchErr } = await useFetch('/vipayment/game/nickname', {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body
  })
  
  if (fetchErr.value || !data.value || data.value.result === false) {
    throw new Error(data.value?.message || 'Gagal mengambil nickname.')
  }
  
  return data.value.data || data.value.nickname
}

// Submit topup ke backend
async function submitTopup() {
  // Persiapkan data sesuai format yang diharapkan backend
  const body = {
    service: props.service.code,
    data_no: dataNo.value,
    data_zone: getAdditionalTarget()
  }
  
  // Tambahkan quantity jika diperlukan
  if (props.service.need_quantity && quantity.value > 0) {
    body.quantity = quantity.value
  }
  
  // Tambahkan data tambahan jika ada
  if (props.service.need_additional && additionalData.value) {
    body.additional_data = additionalData.value
  }
  
  console.log('Submitting order with data:', body)
  
  // Convert ke format URL-encoded
  const urlEncodedBody = new URLSearchParams(body).toString()
  
  try {
    // Gunakan $fetch alih-alih useFetch untuk penanganan error yang lebih baik
    const data = await $fetch('/vipayment/game/order/topup', {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: urlEncodedBody
    })
    
    // Log response untuk debugging
    console.log('Order response:', data)
    
    // Cek hasil
    if (!data || data.result === false) {
      throw new Error(data?.message || 'Pembelian gagal. Silakan coba lagi.')
    }
    
    return data
  } catch (error) {
    console.error('Order API error:', error)
    const errorMsg = error.data?.message || error.message || 'Pembelian gagal. Silakan coba lagi.'
    throw new Error(errorMsg)
  }
}

</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  z-index: 60;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(30,41,59,0.33);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(60,60,100,0.18);
  padding: 32px 28px 22px 28px;
  max-width: 450px;
  width: 96vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}
@keyframes modalIn {
  0% { transform: translateY(40px) scale(0.95); opacity: 0; }
  100% { transform: none; opacity: 1; }
}
.modal-close {
  position: absolute;
  right: 15px;
  top: 15px;
  background: none;
  border: none;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  color: #64748b;
}
.mb-4 {
  margin-bottom: 16px;
}

/* Transition styles */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease-in-out;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
