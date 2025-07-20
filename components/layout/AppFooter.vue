<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">Layanan Murah</h3>
          <p class="footer-description">
            Platform pembayaran digital terpercaya untuk top-up game dan layanan digital lainnya.
          </p>
          <div class="social-links">
            <a href="#" class="social-link">📘</a>
            <a href="#" class="social-link">📷</a>
            <a href="#" class="social-link">🐦</a>
            <a href="#" class="social-link">📺</a>
          </div>
        </div>
        
        <div class="footer-section">
          <h4 class="section-title">Layanan</h4>
          <ul class="footer-links">
            <li><a href="/game">Top-up Game</a></li>
            <li><a href="/prepaid">Pulsa & Data</a></li>
            <li><a href="/promotion">Promo</a></li>
            <li><a href="#">Voucher</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4 class="section-title">Bantuan</h4>
          <ul class="footer-links">
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Cara Pembayaran</a></li>
            <li><a href="#">Hubungi Kami</a></li>
            <li><a href="#">Status Transaksi</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4 class="section-title">Perusahaan</h4>
          <ul class="footer-links">
            <li><a href="#">Tentang Kami</a></li>
            <li><a href="#">Karir</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Kemitraan</a></li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">
            © {{ currentYear }} VIPayment. Semua hak dilindungi.
          </p>
          <div class="footer-bottom-links">
            <a href="#">Syarat & Ketentuan</a>
            <a href="#">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.app-footer {
  background: #1e293b;
  color: white;
  margin-top: auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 2rem;
  padding: 3rem 0;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #3b82f6;
}

.footer-description {
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.social-links {
  display: flex;
  gap: 0.75rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: #334155;
  border-radius: 0.5rem;
  text-decoration: none;
  font-size: 1.25rem;
  transition: all 0.2s;
}

.social-link:hover {
  background: #3b82f6;
  transform: translateY(-2px);
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #3b82f6;
}

.footer-bottom {
  border-top: 1px solid #334155;
  padding: 1.5rem 0;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  color: #94a3b8;
  margin: 0;
}

.footer-bottom-links {
  display: flex;
  gap: 1.5rem;
}

.footer-bottom-links a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.footer-bottom-links a:hover {
  color: #3b82f6;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>