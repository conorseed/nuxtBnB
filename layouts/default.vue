<template>
  <div class="app">
    <header class="app-header">
      <nuxt-link to="/" class="app-logo">
        <img src="/images/logo.svg" alt="Nuxt BnB" />
      </nuxt-link>
      <div class="app-search">
        <input type="text" ref="citySearch" @changed="changed" placeholder="Enter a city" />
        <client-only>
          <template #placeholder>
              <input class="datepicker" />
              <span class="-ml-6 mr-2">to</span>
              <input class="datepicker" />
          </template>

          <date-picker
          v-model="range"
          is-range
          timezone="UTC"
          :min-date='new Date()'
          :modelConfig="{ timeAdjust: '00:00:00' }"
          >
          <template v-slot="{ inputValue, inputEvents }">
              <input
                :value="inputValue.start"
                v-on="inputEvents.start"
                class="datepicker"
              />
              <span class="-ml-6 mr-2">to</span>
              <input
                :value="inputValue.end"
                v-on="inputEvents.end"
                class="datepicker"
              />
          </template>
          </date-picker>
        </client-only>
        <button @click="search">
          <img src="/images/icons/search.svg" alt="Search" />
        </button>
      </div>
      <div class="app-user-menu">
        <template v-if="isLoggedIn">
          <img :src="user.profileUrl" :alt="user.name" class="avatar" referrerpolicy="no-referrer" width="48" height="48" />
        </template>
        <div v-show="!isLoggedIn" id="googleButton" class="ml-8">
          <div
            id="g_id_onload"
            :data-client_id="$config.auth.clientId"
            data-auto_select="true"
            data-callback="auth"
          ></div>
          <div
            class="g_id_signin"
            data-type="standard"
            data-shape="circle"
            data-theme="outline"
            data-text="signin"
            data-size="large"
          ></div>
        </div>
      </div>
    </header>
    <nuxt />
  </div>
</template>

<script>
export default {
  data(){
    return{
      location: {
        lat: 0,
        lng: 0,
        label: ''
      },
      range: {
        start: null,
        end: null
      }
    }
  },
  mounted(){
    this.$maps.makeAutoComplete({input: this.$refs.citySearch})
  },
  methods:{
    changed(event){
      const place = event.detail
      if(!place.geometry) return

      this.location.lat = place.geometry.location.lat()
      this.location.lng = place.geometry.location.lng()
      this.location.label = this.$refs.citySearch.value
    },
    search(){
      if(!this.location.label || !this.range.start || !this.range.end) return

      this.$router.push({
        name: 'search',
        query: {
          ...this.location,
          start: this.range.start.getTime() / 1000,
          end: this.range.end.getTime() / 1000
        } 
      })
    }
  },
  computed: {
    user(){
      return this.$store.state.auth.user
    },
    isLoggedIn(){
      return this.$store.state.auth.isLoggedIn
    }
  }
}
</script>

<style scoped>

</style>
