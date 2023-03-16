import Cookies from 'js-cookie'
import { unWrap } from '@/utils/fetchUtils'

export default ( { $config, store }, inject) => {
  const loaded = false

  window.auth = parseUser
  parseUser(null)

  inject('auth', {
    signOut
  })

  function addScript(){
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client?onload=initAuth'
    script.async = true
    document.head.appendChild(script)
  }

  async function parseUser(response){
    try {
      
      if(response){
        // Set cookie
        const token = response.credential
        Cookies.set($config.public.auth.cookieName, token, {
          expires: 1 / 24,
          sameSite: "Lax",
        })
      }
      // make sure cookie exists
      if(!Cookies.get($config.public.auth.cookieName)){
        if(!loaded) addScript()
        return
      }

      // get user
      const res = await unWrap( await fetch('/api/user') )
      const user = res.json
      
      // store user
      await store.commit('auth/user', {
        fullName: user.name,
        profileUrl: user.image
      })
      
    } catch (e) {
      console.log('Error', e)
    }
  }

  function signOut(){
    if(!loaded) addScript()
    Cookies.remove($config.public.auth.cookieName)
    store.commit('auth/user', null)
  }
}