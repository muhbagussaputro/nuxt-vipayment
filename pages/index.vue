<template>
  <div class="container">
    <h1 class="main-title">Pilih Layanan Game</h1>
    <div class="game-grid">
      <div v-for="game in games" :key="game.slug" class="game-card" @click="openGameModal(game.slug)">
        <img :src="game.img" :alt="game.name" class="game-img" />
        <div class="game-name">{{ game.name }}</div>
      </div>
    </div>

    
    <!-- MODAL LAYANAN GAME -->
    <VipGameModal
      :show="showModal"
      :slug="selectedGameSlug"
      :gameName="selectedGameName"
      @close="closeModal"
    />
    
    <CheckNicknameForm
      :show="showCheckNicknameModal"
      @close="closeCheckNicknameModal"
    />

    <VipGameNicknameForm
      :show="showNicknameModal"
      @close="closeNicknameModal"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import VipGameModal from '~/components/vipayment/VipGameModal.vue'
import VipGameNicknameForm from '~/components/vipayment/VipGameNicknameForm.vue'
import CheckNicknameForm from '~/components/getapi/CheckNicknameForm.vue'
const router = useRouter()

const games = [
  { name: 'Free Fire', slug: 'free-fire', img: '/images/freefire.png' },
  { name: 'Free Fire Max', slug: 'free-fire-max', img: '/images/freefiremax.png' },
  { name: 'Genshin Impact', slug: 'genshin-impact', img: '/images/genshinimpact.png' },
  { name: 'Honor of Kings Global', slug: 'honor-of-kings-global', img: '/images/honorofkings.png' },
  { name: 'Mobile Legends (Global)', slug: 'mobile-legends-global', img: '/images/mobilelegendsglobal.png' },
  { name: 'Mobile Legends A', slug: 'mobile-legends-a', img: '/images/mobilelegendsA.png' },
  { name: 'Mobile Legends B', slug: 'mobile-legends-b', img: '/images/mobilelegendsB.png' },
  { name: 'Mobile Legends Gift', slug: 'mobile-legends-gift', img: '/images/mobilelegendsgift.png' },
  { name: 'Mobile Legends Vilog', slug: 'mobile-legends-vilog', img: '/images/mobilelegendvilog.png' },
  { name: 'Tower of Fantasy', slug: 'tower-of-fantasy', img: '/images/towerfantasy.png' },
  { name: 'PUBG Mobile (GLOBAL)', slug: 'pubg-mobile-global', img: '/images/pubgmobileglobal.png' },
  { name: 'PUBG Mobile (ID)', slug: 'pubg-mobile-id', img: '/images/pubgmobileid.png' },
  { name: 'PUBG : New State Mobile', slug: 'pubg-new-state-mobile', img: '/images/pubgnewstatemobile.png' },
  { name: 'League of Legends', slug: 'league-of-legends', img: '/images/leagueoflegends.png' },
  { name: 'EA SPORTS FC Mobile', slug: 'ea-sports-fc-mobile', img: '/images/easport.png' },
  { name: 'Steam Wallet Code', slug: 'steam-wallet-code', img: '/images/steam.png' },
  { name: 'Voucher Roblox', slug: 'voucher-roblox', img: '/images/roblox.png' },
  { name: 'Voucher Garena Shell', slug: 'voucher-garena-shell', img: '/images/garenashell.png' },
  { name: 'WETV Premium', slug: 'wetv-premium', img: '/images/wetv.png' },
  { name: 'Netflix Premium', slug: 'netflix-premium', img: '/images/netflix.png' },
  { name: 'Viu Premium', slug: 'viu-premium', img: '/images/viu.png' },
]

const showModal = ref(false)
const selectedGameSlug = ref(null)
const selectedGameName = ref(null)

const gameSlugToName = (slug) => {
  const map = {
    'free-fire': 'Free Fire',
    'free-fire-max': 'Free Fire Max',
    'genshin-impact': 'Genshin Impact',
    'honor-of-kings-global': 'Honor of Kings Global',
    'mobile-legends-global': 'Mobile Legends (Global)',
    'mobile-legends-a': 'Mobile Legends A',
    'mobile-legends-b': 'Mobile Legends B',
    'mobile-legends-gift': 'Mobile Legends Gift',
    'mobile-legends-vilog': 'Mobile Legends Vilog',
    'tower-of-fantasy': 'Tower of Fantasy',
    'pubg-mobile-global': 'PUBG Mobile (GLOBAL)',
    'pubg-mobile-id': 'PUBG Mobile (ID)',
    'pubg-new-state-mobile': 'PUBG : New State Mobile',
    'league-of-legends': 'League of Legends',
    'ea-sports-fc-mobile': 'EA SPORTS FC Mobile',
    'steam-wallet-code': 'Steam Wallet Code',
    'voucher-roblox': 'Voucher Roblox',
    'voucher-garena-shell': 'Voucher Garena Shell',
    'wetv-premium': 'WETV Premium',
    'netflix-premium': 'Netflix Premium',
    'viu-premium': 'Viu Premium',
  }
  return map[slug] || slug
}

function openGameModal(slug) {
  selectedGameSlug.value = slug
  selectedGameName.value = gameSlugToName(slug)
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedGameSlug.value = null
  selectedGameName.value = null
}

</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  z-index: 50;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(30,41,59,0.33);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(60,60,100,0.18);
  padding: 32px 28px 22px 28px;
  max-width: 620px;
  width: 98vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modalIn 0.17s cubic-bezier(.4,2,.6,1) both;
}
@keyframes modalIn {
  0% { transform: translateY(40px) scale(0.95); opacity: 0; }
  100% { transform: none; opacity: 1; }
}
.modal-close {
  position: absolute;
  top: 12px;
  right: 18px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #64748b;
  cursor: pointer;
  transition: color 0.2s;
  z-index: 2;
}
.modal-close:hover {
  color: #ef4444;
}
.modal-loading, .modal-error, .empty {
  text-align: center;
  color: #64748b;
  margin: 24px 0;
}
.modal-error {
  color: #f43f5e;
}

.container {
  max-width: 1100px;
  margin: 40px auto;
  text-align: center;
  padding: 0 12px;
}
.main-title {
  font-size: 2rem;
  margin-bottom: 32px;
}
.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 28px 24px;
  margin-top: 10px;
}
.game-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px 0 rgba(60,60,100,0.08);
  border: 1px solid #e5e7eb;
  padding: 12px 8px 10px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.15s;
}
.game-card:hover {
  box-shadow: 0 8px 24px 0 rgba(60,60,100,0.15);
  transform: translateY(-2px) scale(1.03);
  border-color: #93c5fd;
}
.game-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 10px;
  background: #f3f4f6;
}
.game-name {
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  margin-top: 2px;
}
</style>
