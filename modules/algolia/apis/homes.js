import fetch from 'node-fetch'
import { getApi } from '../../helpers'
import { unwrap, getErrorResponse } from '../../../utils/fetchUtils'

export default (algoliaConfig) => {
  const { headers, apiBase } = getApi(algoliaConfig)

  return{
    create: async ({ id, payload }) => {
      try {
        // sort availablity
        const availability = []
        payload.availabilityRanges.forEach(range => {
          const start = new Date(range.start).getTime() / 1000
          const end = new Date(range.end).getTime() / 1000
          for(var day = start; day <= end; day += 86400 ){
            availability.push(day)
          }
        })

        delete payload.availabilityRanges
        payload.availability = availability
        
        // uploaded
        return unwrap(
          await fetch(`${apiBase}/indexes/homes/${id}`, { 
            headers,
            method: 'PUT',
            body: JSON.stringify(payload)
          })
        )
      } catch (error) {
        return getErrorResponse(error)
      }
    },

    delete: async ({ id }) => {
      try {
        return unwrap(
          await fetch(`${apiBase}/indexes/homes/${id}`, { 
            headers,
            method: 'DELETE'
          })
        )
      } catch (error) {
        return getErrorResponse(error)
      }
    },

    get: async ({ id }) => {
      try {
        return unwrap(
          await fetch(`${apiBase}/indexes/homes/${id}`, { 
            headers
          })
        )
      } catch (error) {
        return getErrorResponse(error)
      }
    },

    getByUserId: async ({ userId }) => {
      try {
        const query = {
          filters: `userId:${userId}`,
          attributesToRetrieve: [
            'objectID',
            'title'
          ],
          attributesToHighlight: []
        }
        return unwrap(
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
}