<template>
  <section class="testimonial-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Apa Kata Mereka?</h2>
        <p class="section-subtitle">
          Ribuan pengguna telah mempercayai VIPayment untuk kebutuhan digital mereka
        </p>
      </div>
      
      <div class="testimonials-container">
        <div class="testimonials-grid">
          <div 
            v-for="(testimonial, index) in testimonials" 
            :key="testimonial.id"
            class="testimonial-card"
            :class="{ 'featured': index === 1 }"
          >
            <div class="testimonial-content">
              <div class="quote-icon">"</div>
              <p class="testimonial-text">{{ testimonial.text }}</p>
              <div class="rating">
                <span v-for="star in 5" :key="star" class="star">⭐</span>
              </div>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">
                <img v-if="testimonial.avatar" :src="testimonial.avatar" :alt="testimonial.name" />
                <div v-else class="avatar-placeholder">
                  {{ testimonial.name.charAt(0) }}
                </div>
              </div>
              <div class="author-info">
                <h4 class="author-name">{{ testimonial.name }}</h4>
                <p class="author-title">{{ testimonial.title }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="stats-section">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">1M+</div>
              <div class="stat-label">Pengguna Aktif</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">5M+</div>
              <div class="stat-label">Transaksi Berhasil</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">4.9</div>
              <div class="stat-label">Rating Aplikasi</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">24/7</div>
              <div class="stat-label">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const testimonials = [
  {
    id: 1,
    name: 'Ahmad Rizki',
    title: 'Gamer Profesional',
    text: 'VIPayment sangat memudahkan saya untuk top-up diamond ML. Prosesnya cepat dan harganya kompetitif. Recommended banget!',
    avatar: null
  },
  {
    id: 2,
    name: 'Sari Dewi',
    title: 'Content Creator',
    text: 'Sebagai content creator, saya butuh top-up yang cepat dan terpercaya. VIPayment selalu jadi pilihan utama karena pelayanannya yang excellent.',
    avatar: null
  },
  {
    id: 3,
    name: 'Budi Santoso',
    title: 'Mahasiswa',
    text: 'Harga di VIPayment paling murah dibanding platform lain. Plus ada promo-promo menarik yang bikin hemat budget.',
    avatar: null
  }
]
</script>

<style scoped>
.testimonial-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
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
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.testimonial-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s;
}

.testimonial-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.15);
}

.testimonial-card.featured {
  transform: scale(1.05);
  background: rgba(255, 255, 255, 0.2);
}

.testimonial-content {
  margin-bottom: 1.5rem;
}

.quote-icon {
  font-size: 3rem;
  font-weight: 700;
  opacity: 0.3;
  line-height: 1;
  margin-bottom: 1rem;
}

.testimonial-text {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.rating {
  display: flex;
  gap: 0.25rem;
}

.star {
  font-size: 1rem;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.25rem;
}

.author-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.author-title {
  font-size: 0.875rem;
  opacity: 0.8;
}

.stats-section {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 3rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #fff, #e2e8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .testimonial-section {
    padding: 2rem 0;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
  
  .testimonial-card.featured {
    transform: none;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-number {
    font-size: 2rem;
  }
}
</style>