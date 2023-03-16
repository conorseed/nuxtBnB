<template>
  <div>
    <input type="file" accept="image/*" @change="uploadFile">
    <div v-if="error" class="text-red-700">{{ error }}</div>
  </div>
</template>

<script>
import { unWrap } from '@/utils/fetchUtils'

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

        const now = Date.now()

        const fileName = file.name.split('.').slice(0, -1).join('.') + now
        const options = {
          timestamp: now,
          public_id: fileName
        }

        // GET HASH
        const resp = await unWrap(await fetch('/api/cloudinary/signature', {
          method: 'POST',
          body: JSON.stringify(options),
          headers: {
            'Content-Type': 'application/json'
          }
        }))
        const signature = resp.json.signature
        
        // file reader
        const readData = (fileObj) => new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(fileObj)
        })
        const data = await readData(file)

        // upload to cloudinary
        const formData = new FormData()
        formData.append('file', data)
        formData.append('timestamp', now)
        formData.append('public_id', fileName)
        formData.append('api_key', this.$config.public.cloudinary.apiKey)
        formData.append('signature', signature)

        const resp2 = await fetch(`https://api.cloudinary.com/v1_1/${this.$config.public.cloudinary.cloudName}/upload`, {
          method: 'POST',
          body: formData
        })

        const asset = await resp2.json()

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
