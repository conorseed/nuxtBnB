<template>
  <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
    <div v-for="home in homes" :key="home.objectID">
      <nuxt-link :to="`/home/${home.objectID}`">
        <home-card :home="home" />
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default{
  head: {
    title: 'Home',
    meta: [{
      name: 'description',
      content: 'This is a home page!',
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
