<template>
  <section class="popular-games">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Game Populer</h2>
        <p class="section-subtitle">
          Top-up game favorit dengan proses cepat dan harga terbaik
        </p>
      </div>
      
      <div class="games-container">
        <div class="games-grid">
          <div 
            v-for="(game, index) in popularGames" 
            :key="game.id"
            class="game-card"
            @click="selectGame(game)"
            v-motion-slide-visible-bottom
            :delay="index * 100"
          >
            <div class="game-image">
              <img :src="game.image" :alt="game.name" />
              <div class="game-overlay">
                <span class="play-icon">▶️</span>
              </div>
            </div>
            <div class="game-info">
              <h3 class="game-name">{{ game.name }}</h3>
              <p class="game-category">{{ game.category }}</p>
              <div class="game-stats">
                <span class="rating">
                  ⭐ {{ game.rating }}
                </span>
                <span class="players">
                  👥 {{ game.players }}
                </span>
              </div>
              <div class="price-range">
                Mulai dari {{ formatPrice(game.minPrice) }}
              </div>
            </div>
            <div v-if="game.discount" class="discount-badge">
              -{{ game.discount }}%
            </div>
          </div>
        </div>
        
        <div class="view-all">
          <NuxtLink to="/game" class="view-all-btn transition-transform duration-300 hover:translate-x-2">
            Lihat Semua Game
            <span class="arrow">→</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { formatPrice } = useFormatters()

const popularGames = [
  {
    id: 1,
    name: 'Mobile Legends',
    category: 'MOBA',
    image: '/images/mobilelegendsA.png',
    rating: '4.9',
    players: '100M+',
    minPrice: 15000,
    discount: 10
  },
  {
    id: 2,
    name: 'Free Fire',
    category: 'Battle Royale',
    image: '/images/freefire.png',
    rating: '4.8',
    players: '80M+',
    minPrice: 12000,
    discount: null
  },
  {
    id: 3,
    name: 'PUBG Mobile',
    category: 'Battle Royale',
    image: '/images/pubgmobileglobal.png',
    rating: '4.7',
    players: '75M+',
    minPrice: 16000,
    discount: 15
  },
  {
    id: 4,
    name: 'Genshin Impact',
    category: 'RPG',
    image: '/images/genshinimpact.png',
    rating: '4.6',
    players: '60M+',
    minPrice: 20000,
    discount: null
  },
  {
    id: 5,
    name: 'Honor of Kings',
    category: 'MOBA',
    image: '/images/honorofkings.png',
    rating: '4.5',
    players: '50M+',
    minPrice: 18000,
    discount: 5
  },
  {
    id: 6,
    name: 'Roblox',
    category: 'Sandbox',
    image: '/images/roblox.png',
    rating: '4.4',
    players: '45M+',
    minPrice: 14000,
    discount: null
  }
]

const selectGame = (game) => {
  navigateTo(`/game/${game.name.toLowerCase().replace(/\s+/g, '-')}`)
}
</script>

<style scoped>
.popular-games {
  padding: 4rem 0;
  background: white;
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

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.game-card {
  position: relative;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.game-card:hover {
  transform: translateY(-8px) rotate(-1deg);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.game-image {
  position: relative;
  width: 100%;
  height: 150px;
  overflow: hidden;
}

.game-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.game-card:hover .game-image img {
  transform: scale(1.05);
}

.game-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.game-card:hover .game-overlay {
  opacity: 1;
}

.play-icon {
  font-size: 2rem;
  color: white;
}

.game-info {
  padding: 1.5rem;
}

.game-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.game-category {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.game-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.rating,
.players {
  font-size: 0.75rem;
  color: #64748b;
}

.price-range {
  font-size: 0.875rem;
  font-weight: 600;
  color: #3b82f6;
}

.discount-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: #ef4444;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.view-all {
  text-align: center;
}

.view-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.2s;
}

.view-all-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.arrow {
  transition: transform 0.2s;
}

.view-all-btn:hover .arrow {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .popular-games {
    padding: 2rem 0;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .games-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
</style>