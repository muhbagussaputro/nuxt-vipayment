<template>
  <div class="profile-info-container">
    <h3 class="section-title">Informasi Profil</h3>
    
    <div class="info-grid">
      <div class="info-item">
        <label class="info-label">Nama Lengkap</label>
        <p class="info-value">{{ user.name || 'Belum diisi' }}</p>
      </div>
      
      <div class="info-item">
        <label class="info-label">Email</label>
        <p class="info-value">{{ user.email || 'Belum diisi' }}</p>
      </div>
      
      <div class="info-item">
        <label class="info-label">Nomor Telepon</label>
        <p class="info-value">{{ user.phone || 'Belum diisi' }}</p>
      </div>
      
      <div class="info-item">
        <label class="info-label">Tanggal Lahir</label>
        <p class="info-value">{{ formatDate(user.birthDate) || 'Belum diisi' }}</p>
      </div>
      
      <div class="info-item">
        <label class="info-label">Alamat</label>
        <p class="info-value">{{ user.address || 'Belum diisi' }}</p>
      </div>
      
      <div class="info-item">
        <label class="info-label">Bergabung Sejak</label>
        <p class="info-value">{{ formatDate(user.joinDate) || 'Tidak diketahui' }}</p>
      </div>
    </div>
    
    <div class="account-stats">
      <h4 class="stats-title">Statistik Akun</h4>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🛒</div>
          <div class="stat-content">
            <span class="stat-number">{{ user.totalTransactions || 0 }}</span>
            <span class="stat-label">Total Transaksi</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <span class="stat-number">{{ formatPrice(user.totalSpent || 0) }}</span>
            <span class="stat-label">Total Belanja</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-content">
            <span class="stat-number">{{ user.loyaltyPoints || 0 }}</span>
            <span class="stat-label">Poin Loyalitas</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { formatPrice, formatDate } = useFormatters()

defineProps({
  user: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style scoped>
.profile-info-container {
  max-width: 800px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-item {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: #f8fafc;
}

.info-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.info-value {
  font-size: 1rem;
  color: #1e293b;
  margin: 0;
}

.account-stats {
  margin-top: 2rem;
}

.stats-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0.75rem;
  color: white;
}

.stat-icon {
  font-size: 2rem;
}

.stat-content {
  flex: 1;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 1rem;
  }
}
</style>