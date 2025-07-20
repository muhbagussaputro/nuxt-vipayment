// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Target: static site generation
  ssr: false,
  target: 'static',
  
  // Compatibility date for Nitro
  compatibilityDate: '2024-11-01',
  
  // Runtime config
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000'
    }
  },
  
  // App configuration
  app: {
    baseURL: '/',
    buildAssetsDir: '/_nuxt/',
    head: {
      title: 'Vipayment - Top Up Game & Voucher',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Top up game dan voucher termurah dan terpercaya' },
        { name: 'theme-color', content: '#2563eb' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' }
      ]
    }
  },
  
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/motion/nuxt'
  ],
  
  // Build configuration
  build: {
    transpile: ['vue-toastification']
  },
  
  // Optimization
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  
  // Vite configuration
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router'],
            ui: ['@nuxtjs/tailwindcss']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['vue', 'vue-router']
    }
  },
  
  // Development configuration
  devtools: { enabled: true },
  
  // Image optimization
  image: {
    quality: 80,
    format: ['webp', 'avif', 'png', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  },
  
  // Performance
  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: false
  },
  
  // Router configuration
  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },
  css: [
    '~/assets/css/main.css'
  ]
})