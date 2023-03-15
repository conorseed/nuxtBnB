<template>
  <div>
    <input type="file" accept="image/*" @change="uploadFile">
    <div v-if="error" class="text-red-700">{{ error }}</div>
  </div>
</template>

<script>
import { unwrap } from '@/utils/fetchUtils'

export default{
  data(){
    return{
      error: null
    }
  },
  methods:{
    async uploadFile(event){
      
      try {
        const file = event.target.files[0]
        if(!file) return

        const fileName = file.name.split('.').slice(0, -1).join('.') + Date.now()
        const options = {
          timestamp: Date.now(),
          public_id: fileName
        }

        // GET HASH
        const response = await unwrap(await fetch('/api/cloudinary/signature', {
          method: 'POST',
          body: JSON.stringify(options),
          headers: {
            'Content-Type': 'application/json'
          }
        }))
        const signature = response.json.signature
        
        // file reader
        const readData = (fileObj) => new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(fileObj)
        })
        const data = await readData(file)

        // upload to cloudinary
        const asset = await this.$cloudinary.upload(data, {
          ...options,
          apiKey: this.$config.cloudinary.apiKey,
          signature
        })

        if('error' in asset){
          throw new Error('Image couldn\'t be uploaded. Please try again.')
        }

        this.$emit('file-uploaded', asset.public_id)
        this.error = null

      } catch (error) {
        console.error('an error occured: ', error)
        this.error = error
      }
    }
  }
}
</script>

<style scoped>

</style>
