<template>
  <div class="app">
    <div class="app-container">
      <div class="app-hero">
        <h2>
          - Settle in somewhere new. Discover stays to live, work, or just relax.
        </h2>
      </div>
    </div>
    <SectionPremiumListings />
    <SectionRecentlyAdded class="app-background-grey" :homes="homes" />
    <SectionMore />
  </div>
</template>

<script>
export default{
  head: {
    title: 'Home',
    meta: [{
      name: 'description',
      content: 'NuxtBnB is an AirBnB app that uses Nuxt, Cloudinary, Stripe, Google Maps and Algolia.',
      hid: 'description'
    }]
  },
  async asyncData({$dataApi}){
    const homes = (await $dataApi.getHomes()).json.hits
    return{
      homes
    }
  },
  created(){
    
  }
}
</script>

<style scoped>

</style>
