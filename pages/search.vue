<template>
  <div class="app-search-results-page">
    <div class="app-search-results">
      
      <div class="app-search-results-listing">
        <h2 class="app-title">Stays in {{ label }}</h2>
        <nuxt-link v-for="home in homes" :key="home.objectID" :to="`/home/${home.objectID}`">
          <home-row class="app-house" :home="home" @mouseover.native="highlightMarker(home.objectID, true)" @mouseout.native="highlightMarker(home.objectID, false)" />
        </nuxt-link>
      </div>

      <div class="app-search-results-map">
        <div class="app-map" ref="map"></div>
      </div>

    </div>
  </div>
</template>

<script>
export default{
  head(){
    return{
      title: `Homes around ${this.label}`
    }
  },
  async asyncData({ query, $dataApi }){

    const data = await $dataApi.getHomesByLocation({lat: query.lat, lng: query.lng, start: query.start, end: query.end})

    return{
      homes: data.json.hits,
      label: query.label,
      lat: query.lat,
      lng: query.lng
    }
  },
  async beforeRouteUpdate(to, from, next){
    const data = await this.$dataApi.getHomesByLocation({lat: to.query.lat, lng: to.query.lng, start: to.query.start, end: to.query.end})
    this.homes = data.json.hits
    this.label = to.query.label
    this.lat = to.query.lat
    this.lng = to.query.lng
    this.updateMap()
    next()
  },
  methods: {
    updateMap(){
      this.$maps.showMap(this.$refs.map, this.lat, this.lng, this.getHomeMarkers())
    },
    getHomeMarkers(){
      if(this.homes.length == 0) return null
      return this.homes.map(home => {
        return {
          ...home._geoloc,
          pricePerNight: home.pricePerNight,
          id: home.objectID
        }
      })
    },
    highlightMarker(homeId, isHighlighted){
      document.getElementsByClassName(`home-${homeId}`)[0]?.classList?.toggle('marker-highlight', isHighlighted)
    }
  },
  mounted(){
    this.updateMap()
  }
}

</script>

<style>
.map-results .marker{
  background: white;
  border: 1px solid lightgray;
  font-weight: bold;
  border-radius: 20px;
  padding: 5px 8px;
  transition: all ease 0.3s;
}
.map-results .marker-highlight{
  color: white !important;
  background-color: black;
  border-color: black;
}
</style>
