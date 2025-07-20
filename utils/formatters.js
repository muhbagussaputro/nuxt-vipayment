// Utility functions untuk formatting
export const formatPrice = (price, withMargin = true) => {
  if (typeof price !== 'number') return '-'
  
  // Tambahkan margin keuntungan 7% jika diperlukan
  const finalPrice = withMargin ? price * 1.07 : price
  
  return finalPrice.toLocaleString('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).replace('IDR', 'Rp')
}

export const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatStatus = (status) => {
  const statusMap = {
    'available': 'Tersedia',
    'unavailable': 'Tidak Tersedia',
    'pending': 'Menunggu',
    'success': 'Berhasil',
    'failed': 'Gagal'
  }
  return statusMap[status] || status
}