<template>
  <section class="featured-services">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Layanan Unggulan</h2>
        <p class="section-subtitle">
          Nikmati berbagai layanan digital terpercaya dengan harga terbaik
        </p>
      </div>
      
      <div class="services-grid">
        <div 
          v-for="(service, index) in featuredServices" 
          :key="service.id"
          class="service-card"
          @click="navigateToService(service)"
          v-motion-slide-visible-bottom
          :delay="index * 100" 
        >
          <div class="service-icon">
            <span class="icon">{{ service.icon }}</span>
          </div>
          <div class="service-content">
            <h3 class="service-title">{{ service.title }}</h3>
            <p class="service-description">{{ service.description }}</p>
            <div class="service-stats">
              <span class="stat">
                <span class="stat-icon">⭐</span>
                {{ service.rating }}
              </span>
              <span class="stat">
                <span class="stat-icon">👥</span>
                {{ service.users }}+ pengguna
              </span>
            </div>
          </div>
          <div class="service-badge" v-if="service.badge">
            {{ service.badge }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const featuredServices = [
  {
    id: 1,
    title: 'Top-up Game',
    description: 'Top-up diamond, UC, dan mata uang game lainnya dengan mudah dan aman',
    icon: '🎮',
    rating: '4.9',
    users: '100K',
    badge: 'Populer',
    path: '/game'
  },
  {
    id: 2,
    title: 'Pulsa & Paket Data',
    description: 'Isi pulsa dan beli paket data semua operator dengan harga terjangkau',
    icon: '📱',
    rating: '4.8',
    users: '250K',
    badge: null,
    path: '/prepaid'
  },
  {
    id: 3,
    title: 'Voucher Digital',
    description: 'Beli voucher Google Play, Steam, dan platform digital lainnya',
    icon: '🎫',
    rating: '4.7',
    users: '75K',
    badge: 'Baru',
    path: '/voucher'
  },
  {
    id: 4,
    title: 'Streaming & Entertainment',
    description: 'Berlangganan Netflix, Spotify, dan layanan streaming favorit',
    icon: '🎬',
    rating: '4.6',
    users: '50K',
    badge: null,
    path: '/streaming'
  }
]

const navigateToService = (service) => {
  navigateTo(service.path)
}
</script>

<style scoped>
.featured-services {
  padding: 4rem 0;
  background: #f8fafc;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.service-card {
  position: relative;
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}

.service-card:hover {
  transform: translateY(-8px) rotate(2deg);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.service-card:hover .service-title,
.service-card:hover .service-description,
.service-card:hover .stat,
.service-card:hover .stat-icon {
  color: white;
}

.service-icon {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.icon {
  font-size: 2rem;
}

.service-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.service-description {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.service-stats {
  display: flex;
  gap: 1rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #64748b;
}

.stat-icon {
  font-size: 1rem;
}

.service-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .featured-services {
    padding: 2rem 0;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>