// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Compatibility date for Nitro
  compatibilityDate: '2024-11-01',
  
  // Runtime config
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE
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
    '@nuxtjs/tailwindcss'
  ],
  
  // Build configuration
  build: {
    transpile: ['vue-toastification']
  },
  
  // Vite configuration
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router']
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
  
  // Router configuration
  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },
  
  // CSS
  css: [
    '~/assets/css/main.css'
  ]
})