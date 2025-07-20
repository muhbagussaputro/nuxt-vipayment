<template>
  <div class="profile-header">
    <div class="profile-avatar">
      <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
      <div v-else class="avatar-placeholder">
        {{ user.name?.charAt(0)?.toUpperCase() }}
      </div>
    </div>
    <div class="profile-info">
      <h2 class="profile-name">{{ user.name || 'User' }}</h2>
      <p class="profile-email">{{ user.email || 'user@example.com' }}</p>
      <div class="profile-stats">
        <div class="stat">
          <span class="stat-value">{{ user.totalTransactions || 0 }}</span>
          <span class="stat-label">Transaksi</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ formatPrice(user.totalSpent || 0) }}</span>
          <span class="stat-label">Total Belanja</span>
        </div>
      </div>
    </div>
    <button class="edit-profile-btn" @click="$emit('edit')">
      Edit Profile
    </button>
  </div>
</template>

<script setup>
const { formatPrice } = useFormatters()

defineProps({
  user: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['edit'])
</script>

<style scoped>
.profile-header {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #1e293b;
}

.profile-email {
  color: #64748b;
  margin-bottom: 1rem;
}

.profile-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
  color: #3b82f6;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
}

.edit-profile-btn {
  margin-left: auto;
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.edit-profile-btn:hover {
  background: #2563eb;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .edit-profile-btn {
    margin-left: 0;
  }
}
</style>