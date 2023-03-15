import Cookies from 'js-cookie'
import { unwrap } from '@/utils/fetchUtils'

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
        Cookies.set($config.auth.cookieName, token, {
          expires: 1 / 24,
          sameSite: "Lax",
        })
      }
      // make sure cookie exists
      if(!Cookies.get($config.auth.cookieName)){
        if(!loaded) addScript()
        return
      }

      // get user
      const res = await unwrap( await fetch('/api/user') )
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
    Cookies.remove($config.auth.cookieName)
    store.commit('auth/user', null)
  }
}