import { ref } from 'vue'

export const usePaymentGateway = () => {
  const paymentLoading = ref(false)
  const paymentError = ref(null)

  // Payment methods configuration
  const paymentMethods = [
    {
      code: 'qris',
      name: 'QRIS',
      icon: '📱',
      fee: 0,
      description: 'Scan QR dengan e-wallet favorit'
    },
    {
      code: 'gopay',
      name: 'GoPay',
      icon: '💚',
      fee: 0,
      description: 'Bayar dengan GoPay'
    },
    {
      code: 'ovo',
      name: 'OVO',
      icon: '💜',
      fee: 0,
      description: 'Bayar dengan OVO'
    },
    {
      code: 'dana',
      name: 'DANA',
      icon: '💙',
      fee: 0,
      description: 'Bayar dengan DANA'
    },
    {
      code: 'shopeepay',
      name: 'ShopeePay',
      icon: '🧡',
      fee: 0,
      description: 'Bayar dengan ShopeePay'
    },
    {
      code: 'bank_transfer',
      name: 'Transfer Bank',
      icon: '🏦',
      fee: 0,
      description: 'Transfer ke rekening bank'
    },
    {
      code: 'virtual_account',
      name: 'Virtual Account',
      icon: '🏧',
      fee: 4000,
      description: 'Bayar melalui VA Bank'
    },
    {
      code: 'credit_card',
      name: 'Kartu Kredit',
      icon: '💳',
      fee: 0,
      description: 'Visa, Mastercard, JCB'
    },
    {
      code: 'convenience_store',
      name: 'Minimarket',
      icon: '🏪',
      fee: 5000,
      description: 'Indomaret, Alfamart'
    }
  ]

  // Create payment order
  const createPaymentOrder = async (orderData) => {
    paymentLoading.value = true
    paymentError.value = null

    try {
      // Simulate API call to create order
      const response = await $fetch('/api/payment/create', {
        method: 'POST',
        body: orderData
      })

      return response
    } catch (error) {
      paymentError.value = error.message || 'Gagal membuat order pembayaran'
      throw error
    } finally {
      paymentLoading.value = false
    }
  }

  // Redirect to payment gateway
  const redirectToPayment = (paymentUrl) => {
    if (paymentUrl) {
      window.location.href = paymentUrl
    }
  }

  // Check payment status
  const checkPaymentStatus = async (orderId) => {
    try {
      const response = await $fetch(`/api/payment/status/${orderId}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Handle payment callback
  const handlePaymentCallback = async (params) => {
    try {
      const response = await $fetch('/api/payment/callback', {
        method: 'POST',
        body: params
      })
      return response
    } catch (error) {
      throw error
    }
  }

  // Calculate total with fee
  const calculateTotal = (amount, paymentMethod) => {
    const method = paymentMethods.find(m => m.code === paymentMethod)
    const fee = method?.fee || 0
    return amount + fee
  }

  // Format payment method display
  const getPaymentMethodDisplay = (code) => {
    const method = paymentMethods.find(m => m.code === code)
    return method || null
  }

  return {
    paymentMethods,
    paymentLoading,
    paymentError,
    createPaymentOrder,
    redirectToPayment,
    checkPaymentStatus,
    handlePaymentCallback,
    calculateTotal,
    getPaymentMethodDisplay
  }
} 