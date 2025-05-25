// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Target: static site generation
  ssr: false,
  target: 'static',
  
  // Runtime config
  runtimeConfig: {
    public: {
      apiBase: process.env.NODE_ENV === 'production' 
        ? 'https://api.ayotopupin.my.id' 
        : 'http://localhost:8000'
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
        { name: 'description', content: 'Top up game dan voucher termurah dan terpercaya' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  
  // Modules
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  
  // Build configuration
  build: {
    // Add any custom build configurations here
  },
  
  // Vite configuration
  vite: {
    // Add Vite plugins or other configurations
  }
})