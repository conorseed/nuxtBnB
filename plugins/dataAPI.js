import { unWrap, getErrorResponse } from '@/utils/fetchUtils'

export default function( { $config }, inject){
  const appId = $config.public.algolia.appId
  const apiKey = $config.public.algolia.apiKey
  const headers = {
    'X-Algolia-API-Key': apiKey,
    'X-Algolia-Application-Id': appId
  }
  const apiBase = `https://${appId}-dsn.algolia.net/1`

  inject('dataApi', {
    getHome,
    getHomes,
    getReviewsByHomeId,
    getUserByHomeId,
    getHomesByLocation
  })

  async function getHome(homeId){
    try {
      return unWrap(
        await fetch(`${apiBase}/indexes/homes/${homeId}`, { headers })
      )
    } catch (error) {
      return getErrorResponse(error)
    }
  }

  async function getReviewsByHomeId(homeId){
    try {
      const query = {
        filters: `homeId:${homeId}`,
        hitsPerPage: 6,
        attributesToHighlight: []
      }
      return unWrap(
        await fetch(`${apiBase}/indexes/reviews/query`, { 
          headers,
          method: 'POST',
          body: JSON.stringify(query)
        })
      )
    } catch (error) {
      return getErrorResponse(error)
    }
  }

  async function getUserByHomeId(homeId){
    try {
      const query = {
        filters: `homeId:${homeId}`,
        attributesToHighlight: []
      }
      return unWrap(
        await fetch(`${apiBase}/indexes/users/query`, { 
          headers,
          method: 'POST',
          body: JSON.stringify(query)
        })
      )
    } catch (error) {
      return getErrorResponse(error)
    }
  }

  async function getHomesByLocation({lat, lng, start = 0, end = 0, radiusInMeters = 20000}){
    try {
      const query = {
        aroundLatLng: `${lat},${lng}`,
        aroundRadius: radiusInMeters,
        hitsPerPage: 10,
        attributesToHighlight: []
      }
      if(start && end){
        const days = []
        for(var day = parseInt(start);day <= parseInt(end); day += 86400){
          days.push(`availability:${day}`)
        }
        query.filters = days.join(' AND ')
      }
      
      return unWrap(
        await fetch(`${apiBase}/indexes/homes/query`, { 
          headers,
          method: 'POST',
          body: JSON.stringify(query)
        })
      )
    } catch (error) {
      return getErrorResponse(error)
    }
  }

  async function getHomes(){
    try {
      const query = {
        hitsPerPage: 3,
        attributesToHighlight: []
      }
      return unWrap(
        await fetch(`${apiBase}/indexes/homes/query`, { 
          headers,
          method: 'POST',
          body: JSON.stringify(query)
        })
      )
    } catch (error) {
      return getErrorResponse(error)
    }
  }

}