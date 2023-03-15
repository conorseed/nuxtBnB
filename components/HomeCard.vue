<template>
  <div>
      <nuxt-img :src="home.images[0]" width="200px" height="150" provider="cloudinary" /><br>
      <h3>{{ home.title }}</h3>
      <p>{{ home.location.address }} {{ home.location.city }} {{ home.location.state }}</p>
      <p>{{ home.guests }} guests</p>
      <p>{{ home.pricePerNight}} / night</p>
  </div>
</template>

<script>
export default{
  props: {
    home: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
