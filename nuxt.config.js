export default{
  telemetry: false,
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
  env: {
    mapsApiKey: process.env.MAPS_API_KEY
  },
  publicRuntimeConfig:{
    auth: {
      cookieName: 'idToken',
      clientId: process.env.OAUTH_CLIENT_ID
    },
    algolia: {
      appId: process.env.ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_API_KEY
    },
    cloudinary: {
      apiKey: process.env.CLOUDINARY_API_KEY
    },
    stripe: {
      public: process.env.STRIPE_PUBLIC
    }
  },
  privateRuntimeConfig:{
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
    }
  },
  plugins: [
    '@/plugins/maps.client',
    '@/plugins/auth.client',
    '@/plugins/dataAPI',
    '@/plugins/vCalendar.client',
    '@/plugins/stripe.client'
  ],
  modules: [
    '@/modules/auth',
    '@/modules/algolia',
    '@/modules/stripe',
    '@/modules/cloudinary',
    '@nuxtjs/cloudinary'
  ],
  buildModules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
  ],
  cloudinary:{
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET
  },
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
    }
  },
}