<template>
  <section class="hero-section">
    <div class="container">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title" v-motion-slide-visible-left>Top Up Game & Pulsa Terpercaya</h1>
          <p class="hero-description" v-motion-slide-visible-left :delay="200">
            Dapatkan diamond, UC, dan pulsa dengan harga terbaik dan proses yang cepat.
            Transaksi aman dan terpercaya.
          </p>
          <div class="hero-buttons" v-motion-slide-visible-left :delay="400">
            <NuxtLink to="/game" class="btn btn-primary transition-transform duration-300 hover:scale-105">
              Top Up Game
            </NuxtLink>
            <NuxtLink to="/prepaid" class="btn btn-outline transition-transform duration-300 hover:scale-105">
              Beli Pulsa
            </NuxtLink>
          </div>
        </div>
        <div class="hero-image">
          <div class="hero-card" v-motion-slide-visible-right :delay="600">
            <div class="card-content">
              <h3>Promo Hari Ini</h3>
              <p>Diskon hingga 20% untuk semua game</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  overflow: hidden; /* Ensure no overflow from animations */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-description {
  font-size: 1.125rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary {
  background: white;
  color: #3b82f6;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-outline {
  border: 2px solid white;
  color: white;
}

.btn-outline:hover {
  background: white;
  color: #3b82f6;
}

.hero-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-buttons {
    justify-content: center;
  }
}
</style>