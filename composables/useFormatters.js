export const useFormatters = () => {
  // Format price to Indonesian Rupiah
  const formatPrice = (price) => {
    if (typeof price !== 'number') return '-'
    return price.toLocaleString('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).replace('IDR', 'Rp')
  }

  // Format date to Indonesian format
  const formatDate = (date) => {
    if (!date) return '-'
    const d = new Date(date)
    if (isNaN(d.getTime())) return '-'
    
    return d.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Format status to Indonesian
  const formatStatus = (status) => {
    const statusMap = {
      'available': 'Tersedia',
      'unavailable': 'Tidak Tersedia',
      'pending': 'Menunggu',
      'success': 'Berhasil',
      'failed': 'Gagal',
      'processing': 'Diproses',
      'completed': 'Selesai',
      'cancelled': 'Dibatalkan'
    }
    
    return statusMap[status?.toLowerCase()] || status || '-'
  }

  return {
    formatPrice,
    formatDate,
    formatStatus
  }
}