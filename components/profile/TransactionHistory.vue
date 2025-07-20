<template>
  <div class="transaction-history">
    <div class="history-header">
      <h3 class="section-title">Riwayat Transaksi</h3>
      <div class="filter-controls">
        <select v-model="selectedFilter" class="filter-select">
          <option value="all">Semua Transaksi</option>
          <option value="success">Berhasil</option>
          <option value="pending">Pending</option>
          <option value="failed">Gagal</option>
        </select>
      </div>
    </div>
    
    <div v-if="filteredTransactions.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <h4>Belum Ada Transaksi</h4>
      <p>Transaksi Anda akan muncul di sini setelah melakukan pembelian.</p>
    </div>
    
    <div v-else class="transaction-list">
      <div 
        v-for="transaction in filteredTransactions" 
        :key="transaction.id"
        class="transaction-item"
      >
        <div class="transaction-icon">
          <img v-if="transaction.gameIcon" :src="transaction.gameIcon" :alt="transaction.gameName" />
          <div v-else class="icon-placeholder">🎮</div>
        </div>
        
        <div class="transaction-details">
          <h4 class="transaction-title">{{ transaction.title }}</h4>
          <p class="transaction-subtitle">{{ transaction.subtitle }}</p>
          <span class="transaction-date">{{ formatDate(transaction.date) }}</span>
        </div>
        
        <div class="transaction-amount">
          <span class="amount">{{ formatPrice(transaction.amount) }}</span>
          <span :class="['status', transaction.status]">{{ getStatusText(transaction.status) }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="filteredTransactions.length > 0" class="pagination">
      <button 
        v-for="page in totalPages" 
        :key="page"
        :class="['page-btn', { active: currentPage === page }]"
        @click="currentPage = page"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup>
const { formatPrice, formatDate } = useFormatters()

const props = defineProps({
  transactions: {
    type: Array,
    default: () => []
  }
})

const selectedFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = 10

// Sample data if no transactions provided
const sampleTransactions = [
  {
    id: 1,
    title: 'Mobile Legends - 275 Diamonds',
    subtitle: 'Top Up Game',
    amount: 75000,
    status: 'success',
    date: new Date('2024-01-15'),
    gameIcon: '/images/mobilelegendsA.png'
  },
  {
    id: 2,
    title: 'Free Fire - 1000 Diamonds',
    subtitle: 'Top Up Game',
    amount: 150000,
    status: 'pending',
    date: new Date('2024-01-14'),
    gameIcon: '/images/freefire.png'
  },
  {
    id: 3,
    title: 'PUBG Mobile - 1800 UC',
    subtitle: 'Top Up Game',
    amount: 250000,
    status: 'failed',
    date: new Date('2024-01-13'),
    gameIcon: '/images/pubgmobileglobal.png'
  }
]

const allTransactions = computed(() => {
  return props.transactions.length > 0 ? props.transactions : sampleTransactions
})

const filteredTransactions = computed(() => {
  let filtered = allTransactions.value
  
  if (selectedFilter.value !== 'all') {
    filtered = filtered.filter(t => t.status === selectedFilter.value)
  }
  
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  
  return filtered.slice(start, end)
})

const totalPages = computed(() => {
  const filtered = selectedFilter.value === 'all' 
    ? allTransactions.value 
    : allTransactions.value.filter(t => t.status === selectedFilter.value)
  
  return Math.ceil(filtered.length / itemsPerPage)
})

const getStatusText = (status) => {
  const statusMap = {
    success: 'Berhasil',
    pending: 'Pending',
    failed: 'Gagal'
  }
  return statusMap[status] || status
}
</script>

<style scoped>
.transaction-history {
  max-width: 800px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  font-size: 0.875rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #64748b;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.transaction-list {
  space-y: 1rem;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  background: white;
  margin-bottom: 1rem;
  transition: all 0.2s;
}

.transaction-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.transaction-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;
}

.transaction-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icon-placeholder {
  width: 100%;
  height: 100%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.transaction-details {
  flex: 1;
}

.transaction-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.transaction-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.25rem 0;
}

.transaction-date {
  font-size: 0.75rem;
  color: #94a3b8;
}

.transaction-amount {
  text-align: right;
}

.amount {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.status {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 500;
}

.status.success {
  background: #dcfce7;
  color: #166534;
}

.status.pending {
  background: #fef3c7;
  color: #92400e;
}

.status.failed {
  background: #fee2e2;
  color: #dc2626;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.page-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover {
  background: #f9fafb;
}

.page-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

@media (max-width: 768px) {
  .history-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .transaction-item {
    flex-direction: column;
    text-align: center;
  }
  
  .transaction-details {
    order: 2;
  }
  
  .transaction-amount {
    order: 3;
    text-align: center;
  }
}
</style>