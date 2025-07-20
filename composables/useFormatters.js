import { formatPrice, formatDate, formatStatus } from '~/utils/formatters'

export const useFormatters = () => {
  return {
    formatPrice,
    formatDate,
    formatStatus
  }
}