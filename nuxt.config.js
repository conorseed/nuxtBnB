import { defineNuxtConfig } from "@nuxt/bridge"

export default defineNuxtConfig({
  nitro:{
    routeRules: {
      '/admin': {
          ssr: false,
      }
    },
  },
  components: true,
  head: {
    titleTemplate: 'Nuxt BnB | %s',
    htmlAttrs: {
      lang: 'en'
    },
    meta:[{
      charset: "utf-8"
    }]
  },
  router:{
    prefetchLinks: false
  },
  runtimeConfig:{
    algolia: {
      appId: process.env.ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_ADMIN_KEY
    },
    cloudinary: {
      apiSecret: process.env.CLOUDINARY_SECRET
    },
    stripe: {
      public: process.env.STRIPE_PUBLIC,
      secret: process.env.STRIPE_SECRET
    },
    public: {
      rootUrl: process.env.NODE_ENV === 'production' ? 'https://nuxt-bn-b-sooty.vercel.app' : 'http://localhost:3000',
      mapsApiKey: process.env.MAPS_API_KEY,
      auth: {
        cookieName: 'idToken',
        clientId: process.env.OAUTH_CLIENT_ID
      },
      algolia: {
        appId: process.env.ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_API_KEY
      },
      cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY
      },
      stripe: {
        public: process.env.STRIPE_PUBLIC
      }
    }
  },
  plugins: [
    '@/plugins/maps.client',
    '@/plugins/dataAPI',
    '@/plugins/auth.client',
    '@/plugins/vCalendar.client',
    '@/plugins/stripe.client'
  ],
  buildModules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
  ],
  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/'+process.env.CLOUDINARY_CLOUD_NAME+'/image/upload/'
    }
  },
  css: ['~/assets/sass/app.scss'],
  build: {
    extractCSS: true,
    loaders: {
        limit: 0,
    },
    transpile: ['iron-webcrypto'],
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
  },
})