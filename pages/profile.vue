<template>
  <div>
    <AppHeader />
    <main class="profile-page">
      <div class="container">
        <ProfileHeader :user="user" @edit="openEditModal" />
        
        <div class="profile-content">
          <div class="profile-sidebar">
            <nav class="profile-nav">
              <button 
                v-for="tab in tabs" 
                :key="tab.id"
                :class="['nav-item', { active: activeTab === tab.id }]"
                @click="activeTab = tab.id"
              >
                {{ tab.label }}
              </button>
            </nav>
          </div>
          
          <div class="profile-main">
            <ProfileInfo v-if="activeTab === 'info'" :user="user" />
            <TransactionHistory v-else-if="activeTab === 'transactions'" :transactions="transactions" />
            <ProfileSettings v-else-if="activeTab === 'settings'" :user="user" @update="updateUser" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import AppHeader from '~/components/common/AppHeader.vue'
import ProfileHeader from '~/components/profile/ProfileHeader.vue'
import ProfileInfo from '~/components/profile/ProfileInfo.vue'
import TransactionHistory from '~/components/profile/TransactionHistory.vue'
import ProfileSettings from '~/components/profile/ProfileSettings.vue'

const activeTab = ref('info')

const tabs = [
  { id: 'info', label: 'Informasi' },
  { id: 'transactions', label: 'Riwayat Transaksi' },
  { id: 'settings', label: 'Pengaturan' }
]

const user = ref({
  name: 'John Doe',
  email: 'john@example.com',
  totalTransactions: 25,
  totalSpent: 1500000
})

const transactions = ref([])

const openEditModal = () => {
  // Open edit profile modal
}

const updateUser = (userData) => {
  user.value = { ...user.value, ...userData }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.profile-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.profile-nav {
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-item {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: none;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 0.5rem;
}

.nav-item:hover {
  background: #f1f5f9;
}

.nav-item.active {
  background: #3b82f6;
  color: white;
}

.profile-main {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr;
  }
  
  .profile-nav {
    display: flex;
    overflow-x: auto;
    gap: 0.5rem;
  }
  
  .nav-item {
    white-space: nowrap;
    margin-bottom: 0;
  }
}
</style>