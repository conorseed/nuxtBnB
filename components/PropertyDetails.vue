<template>
  <div class="app-wrapper">
    <div class="app-double-column app-property-details">
      <div>
        <h1>{{ home.title }}</h1>
        <div class="app-flex">
          <div class="app-address">
            {{ home.location.address }} {{ home.location.city }} {{ home.location.state }} {{ home.location.country }}
          </div>
          <div class="app-rating">
            {{ home.reviewValue }} <span>({{ home.reviewCount }})</span>
          </div>
        </div>
        <div class="app-property-details-footer">
            {{ pluralize(home.guests, 'guest') }} &middot;
            {{ pluralize(home.bedrooms, 'room') }} &middot;
            {{ pluralize(home.beds, 'bed') }} &middot;
            {{ pluralize(home.bathrooms, 'bath') }}
          </div>
      </div>
      <div>
        <div class="app-price">
          ${{ home.pricePerNight }}<span> / night</span>
        </div>
        <client-only>
          <template #placeholder>
              <input class="datepicker" />
              <input class="datepicker" />
          </template>

          <date-picker
          v-model="range"
          is-range
          timezone="UTC"
          :min-date='new Date()'
          :modelConfig="{ timeAdjust: '00:00:00' }"
          class="app-search"
          >
          <template v-slot="{ inputValue, inputEvents }">
              <input
                :value="inputValue.start"
                v-on="inputEvents.start"
                class="datepicker"
              />
              <input
                :value="inputValue.end"
                v-on="inputEvents.end"
                class="datepicker"
              />
          </template>
          </date-picker>
        </client-only>
        <button v-if="isLoggedIn" class="app-big-button" @click="checkout">Request to book!</button>
        <button v-else class="app-big-button">Please Login To Book</button>
      </div>
    </div>
  </div>
</template>

<script>
import pluralize from '@/utils/pluralize';

export default{
  props:{
    home: {
      type: Object,
      requried: true
    }
  },
  data(){
    return{
      range: {
        start: null,
        end: null
      }
    }
  },
  computed: {
    isLoggedIn(){
      return this.$store.state.auth.isLoggedIn
    }
  },
  mounted(){
    if(this.$route.query.result == 'success'){
      alert('success')
    }
    if(this.$route.query.result == 'cancel'){
      alert('cancel')
    }
  },
  methods:{
    pluralize,
    checkout(){
      if( !this.range.start || !this.range.end ) return
      const start = this.range.start.getTime() / 1000
      const end = this.range.end.getTime() / 1000

      const payload = {homeId: this.home.objectID, start, end}
      this.$stripe.checkout(payload)
    }
  }
}
</script>

<style scoped>

</style>
