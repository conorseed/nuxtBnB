<template>
  <div>
    <p v-for="home in homeList" :key="home.objectID">{{ home.title }}: 
      <button class="text-red-800" @click="deleteHome(home.objectID)">Delete</button>
    </p>
    <h2 class="text-xl bold">Add a home</h2>
    <form @submit.prevent="onSubmit" class="form">
      Images:<br>
      <image-uploader @file-uploaded="imageUpdated($event, 0)" />
      <image-uploader @file-uploaded="imageUpdated($event, 1)" />
      <image-uploader @file-uploaded="imageUpdated($event, 2)" />
      <image-uploader @file-uploaded="imageUpdated($event, 3)" />
      <image-uploader @file-uploaded="imageUpdated($event, 4)" />
      Title:<br>
      <input v-model="home.title" type="text" class="w-60">
      Description<br/>
    <textarea v-model="home.description" class="w-104"></textarea><br/>
    Note<br/>
    <textarea v-model="home.note" class="w-104"></textarea><br/>
    Features<br/>
    <input type='text' v-model="home.features[0]" class="w-26"/>
    <input type='text' v-model="home.features[1]" class="w-26"/>
    <input type='text' v-model="home.features[2]" class="w-26"/>
    <input type='text' v-model="home.features[3]" class="w-26"/>
    <input type='text' v-model="home.features[4]" class="w-26"/><br/>
    Price Per Night<br/>
    <input type='number' v-model="home.pricePerNight" class="w-14"/><br/>
    Guests / Rooms / Beds / Baths<br/>
    <input type='number' v-model="home.guests" class="w-14"/>
    <input type='number' v-model="home.bedrooms" class="w-14"/>
    <input type='number' v-model="home.beds" class="w-14"/>
    <input type='number' v-model="home.bathrooms" class="w-14"/><br/>
    <input type="text" ref="locationSelector" autocomplete="off" placeholder="Select a Location" @changed="changed" /><br/>
    Address: <input type='text' v-model="home.location.address" class="w-60"/><br/>
    City: <input type='text' v-model="home.location.city" class="w-26"/><br/>
    State: <input type='text' v-model="home.location.state" class="w-26"/><br/>
    Postal Code: <input type='text' v-model="home.location.postalCode" class="w-26"/><br/>
    Country: <input type='text' v-model="home.location.country" class="w-26"/><br/>
    <date-picker
    v-for="(range, index) in home.availabilityRanges"
    :key="index"
    v-model="home.availabilityRanges[index]"
    is-range
    timezone="UTC"
    :modelConfig="{ timeAdjust: '00:00:00' }"
    >
    <template v-slot="{ inputValue, inputEvents }">
      <div class="flex items-center">
        <input
          :value="inputValue.start"
          v-on="inputEvents.start"
          class="border px-2 py-1 w-32 rounded focus:outline-none focus:border-indigo-300"
        />
        <svg
          class="w-4 h-4 mx-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
        <input
          :value="inputValue.end"
          v-on="inputEvents.end"
          class="border px-2 py-1 w-32 rounded focus:outline-none focus:border-indigo-300"
        />
      </div>
    </template>
    </date-picker>

    <button class="border px-4 py-2 border-gray-400">Add</button>
    </form>
  </div>
</template>

<script>
import { unwrap } from '@/utils/fetchUtils'

export default{
  head(){
    return{
      title: `Admin | Homes`
    }
  },
  data(){
    return{
      homeList: [],
      home: {
        title: '',
        description: '',
        note: '',
        pricePerNight: '',
        guests: '',
        bedrooms: '',
        beds: '',
        bathrooms: '',
        features: ['', '', '', '', ''],
        location: {
          address: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        },
        _geoloc: {
          lat: '',
          lng: ''
        },
        images: [],
        availabilityRanges: [
          {start: '', end: ''},
          {start: '', end: ''}
        ]
      }
    }
  },
  mounted(){
    this.$maps.makeAutoComplete({ input: this.$refs.locationSelector, types: ['address']})
    this.setHomesList()
  },
  methods: {
    async deleteHome(homeId){
      try {
        await fetch(`/api/homes/${homeId}`, {
          method: 'DELETE'
        })
        const index  = this.homeList.findIndex(home => home.objectID == homeId)
        this.homeList.splice(index, 1)
      } catch (error) {
        console.error(error)
      }
    },
    async setHomesList(){
      try {
        const hits = await unwrap( await fetch('/api/homes/user/') )
        this.homeList = hits.json
      } catch (error) {
        console.error(error)
      }
    },
    imageUpdated(imageUrl, index){
      this.home.images[index] = imageUrl
    },  
    changed(event){
      // grab all the details
      const addressParts = event.detail.address_components
      // get address
      const street = this.getAddressPart(addressParts, 'street_number')?.short_name || ''
      const route = this.getAddressPart(addressParts, 'route')?.short_name || ''

      this.home.location.address = `${street} ${route}`
      this.home.location.city = this.getAddressPart(addressParts, 'locality')?.short_name || ''
      this.home.location.state = this.getAddressPart(addressParts, 'administrative_area_level_1')?.long_name || ''
      this.home.location.country = this.getAddressPart(addressParts, 'country')?.short_name || ''
      this.home.location.postalCode = this.getAddressPart(addressParts, 'postal_code')?.short_name || ''

      // get geo
      const geo = event.detail.geometry.location
      this.home._geoloc.lat = geo.lat()
      this.home._geoloc.lng = geo.lng()
    },
    getAddressPart(parts, type){
      return parts.find(part => part.types.includes(type))
    },
    async onSubmit(){
      const response = await unwrap(await fetch('/api/homes', {
        method: 'POST',
        body: JSON.stringify(this.home),
        headers: {
          'Content-Type': 'application/json'
        }
      }))
      this.homeList.push({
        title: this.home.title,
        objectID: response.json.homeId
      })
    }
  }
}
</script>

<style scoped>
.form input,
.form textarea{
  @apply p-1 m-1 bg-gray-200
}
</style>
