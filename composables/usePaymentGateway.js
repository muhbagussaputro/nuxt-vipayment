import { ref } from 'vue'

export const usePaymentGateway = () => {
  const loading = ref(false)
  const error = ref('')
  
  // Create payment gateway order
  const createPaymentOrder = async (paymentMethod, orderData) => {
    loading.value = true
    error.value = ''
    
    try {
      // Prepare payment gateway request
      const paymentRequest = {
        gateway: paymentMethod,
        amount: orderData.amount,
        order_id: `VIPAY-${Date.now()}`,
        customer_details: {
          first_name: orderData.customer_name || 'Customer',
          email: orderData.customer_email || 'customer@vipayment.com',
          phone: orderData.customer_phone || '081234567890'
        },
        item_details: {
          id: orderData.service_code,
          name: orderData.service_name,
          quantity: orderData.quantity || 1,
          price: orderData.amount
        },
        callback_data: {
          service_code: orderData.service_code,
          target: orderData.target,
          additional_target: orderData.additional_target,
          quantity: orderData.quantity,
          additional_data: orderData.additional_data
        }
      }
      
      // Call payment gateway creation API
      const response = await $fetch('/payment/create', {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'POST',
        body: paymentRequest
      })
      
      if (!response || !response.payment_url) {
        throw new Error('Gagal membuat pembayaran. Silakan coba lagi.')
      }
      
      return response
      
    } catch (e) {
      console.error('Payment gateway error:', e)
      error.value = e.message || 'Gagal membuat pembayaran'
      throw e
    } finally {
      loading.value = false
    }
  }
  
  // Redirect to payment gateway
  const redirectToPayment = (paymentUrl) => {
    // Open payment gateway in new window or redirect current window
    if (process.client) {
      window.open(paymentUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes')
    }
  }
  
  // Process payment gateway callback
  const processCallback = async (callbackData) => {
    loading.value = true
    error.value = ''
    
    try {
      // Verify payment status from gateway
      const verificationResponse = await $fetch('/payment/verify', {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'POST',
        body: {
          order_id: callbackData.order_id,
          transaction_id: callbackData.transaction_id,
          gateway: callbackData.gateway
        }
      })
      
      if (verificationResponse.status === 'success') {
        // Payment verified, now process the actual order
        const orderResponse = await processVipaymentOrder(verificationResponse.callback_data)
        return orderResponse
      } else {
        throw new Error('Pembayaran gagal atau belum selesai')
      }
      
    } catch (e) {
      console.error('Payment callback error:', e)
      error.value = e.message || 'Gagal memverifikasi pembayaran'
      throw e
    } finally {
      loading.value = false
    }
  }
  
  // Process order to vipayment after payment success
  const processVipaymentOrder = async (orderData) => {
    try {
      let endpoint = ''
      let body = {}
      
      // Determine endpoint based on service type
      if (orderData.service_code.includes('prepaid')) {
        endpoint = '/vipayment/prepaid/order'
        body = {
          code: orderData.service_code,
          target: orderData.target,
          quantity: orderData.quantity || 1,
          additional_data: orderData.additional_data || ''
        }
      } else {
        endpoint = '/vipayment/game/order/topup'
        body = {
          service: orderData.service_code,
          data_no: orderData.target,
          data_zone: orderData.additional_target || ''
        }
        
        if (orderData.quantity && orderData.quantity > 1) {
          body.quantity = orderData.quantity
        }
        
        if (orderData.additional_data) {
          body.additional_data = orderData.additional_data
        }
      }
      
      // Convert to URL-encoded format for vipayment API
      const urlEncodedBody = new URLSearchParams(body).toString()
      
      const response = await $fetch(endpoint, {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlEncodedBody
      })
      
      if (!response || response.result === false) {
        throw new Error(response?.message || 'Gagal memproses pesanan ke vipayment')
      }
      
      return response
      
    } catch (e) {
      console.error('Vipayment order error:', e)
      throw e
    }
  }
  
  // Check payment status
  const checkPaymentStatus = async (orderId) => {
    loading.value = true
    error.value = ''
    
    try {
      const response = await $fetch('/payment/status', {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'POST',
        body: { order_id: orderId }
      })
      
      return response
      
    } catch (e) {
      console.error('Payment status check error:', e)
      error.value = e.message || 'Gagal mengecek status pembayaran'
      throw e
    } finally {
      loading.value = false
    }
  }
  
  return {
    loading,
    error,
    createPaymentOrder,
    redirectToPayment,
    processCallback,
    processVipaymentOrder,
    checkPaymentStatus
  }
} 