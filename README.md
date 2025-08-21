# VIPayment - Top Up Game & Voucher Platform

Platform web untuk layanan top up game dan voucher digital dengan proses cepat, aman, dan terpercaya.

## 🚀 Teknologi

- **Framework**: Nuxt.js 3.17.3
- **UI Framework**: TailwindCSS 6.14.0
- **Language**: Vue 3 Composition API + TypeScript
- **Deployment**: Netlify (Static Site Generation)

## 📁 Struktur Project

```
nuxt-vipayment/
├── components/           # Komponen Vue yang terorganisir
│   ├── common/          # Komponen umum (Header, dll)
│   ├── game/            # Komponen untuk fitur game
│   ├── prepaid/         # Komponen untuk layanan pulsa
│   ├── home/            # Komponen homepage
│   ├── product/         # Komponen produk
│   ├── profile/         # Komponen profile user
│   └── promotion/       # Komponen promosi
├── composables/         # Vue composables
│   ├── useFormatters.js # Format currency, date, status
│   ├── usePaymentGateway.js # Payment integration
│   ├── useResponsive.js # Responsive utilities
│   └── useServiceCache.js # Service data caching
├── pages/               # Halaman aplikasi (file-based routing)
│   ├── index.vue        # Homepage
│   ├── game/           
│   │   └── [slug].vue   # Dynamic route untuk detail game
│   ├── game.vue         # Halaman testing form game
│   ├── prepaid.vue      # Halaman testing form prepaid
│   ├── profile.vue      # Halaman profile user
│   └── promotion.vue    # Halaman promosi
├── public/              # Static assets
│   └── images/          # Gambar game dan layanan
├── assets/              
│   └── css/            
│       └── main.css     # Global CSS utilities
├── types/               # TypeScript definitions
├── docs/                # Dokumentasi project
└── server/              # Server configuration

## 🛠️ Development

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build untuk Production
```bash
npm run build
npm run generate  # untuk static site
```

### Preview Production Build
```bash
npm run preview
```

## 🌐 Environment Variables

Buat file `.env` di root project:

```env
NUXT_PUBLIC_API_BASE=http://localhost:8000
```

## 📱 Fitur Utama

1. **Top Up Game**
   - Mobile Legends, Free Fire, PUBG Mobile, dll
   - Form pembelian dengan nickname detection
   - Multiple payment methods

2. **Layanan Prepaid**
   - Pulsa & Paket Data
   - Multiple operator support
   - Quick checkout process

3. **Profile Management**
   - User information
   - Transaction history
   - Settings

4. **Promotion System**
   - Banner promosi
   - Discount cards
   - Special offers

## 🏗️ Komponen Struktur

### Common Components
- `AppHeader.vue` - Header navigasi utama

### Game Components
- `GameModal.vue` - Modal untuk memilih service game
- `GameBuyForm.vue` - Form pembelian game
- `GameServicesForm.vue` - Form untuk testing API services
- dll

### Prepaid Components
- `PrepaidServicesForm.vue` - List layanan prepaid
- `PrepaidOrderForm.vue` - Form order pulsa/data
- `PrepaidCheckForm.vue` - Cek status transaksi

### Composables
- `useFormatters` - Utility untuk format harga, tanggal, dan status
- `usePaymentGateway` - Integration dengan payment gateway
- `useResponsive` - Helper untuk responsive design
- `useServiceCache` - Caching untuk data service API

## 🔄 Update History

### Latest Update
- ✅ Reorganisasi struktur folder komponen
- ✅ Cleanup file yang tidak digunakan
- ✅ Pemindahan dokumentasi ke folder `docs/`
- ✅ Penambahan TypeScript definitions
- ✅ Optimasi import paths
- ✅ Fix composables yang masih digunakan

## 📝 Notes

- Project menggunakan static site generation untuk performa optimal
- API endpoint perlu dikonfigurasi sesuai environment
- Semua gambar game sudah dioptimasi untuk web

## 🤝 Contributing

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Project ini bersifat private dan confidential.
