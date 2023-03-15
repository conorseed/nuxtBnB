<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Admin</h1>
    <div class="bg-gray-200 p-2 mb-12">
      <nuxt-link to="/admin/homes">Homes</nuxt-link>
    </div>
    <nuxt-child />
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default{
  head(){
    return{
      title: `Admin`
    }
  },
  asyncData({ $config, redirect }){
    if(!Cookies.get($config.auth.cookieName)){
      redirect('/no-access/')
      return
    }
  }
}
</script>

<style scoped>

</style>
