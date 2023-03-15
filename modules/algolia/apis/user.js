import fetch from 'node-fetch'
import { getApi } from '../../helpers'
import { unwrap, getErrorResponse } from '../../../utils/fetchUtils'

export default (algoliaConfig) => {
  const { headers, apiBase } = getApi(algoliaConfig)

  return{
    create: async ({ identity, payload }) => {
      try {
        return unwrap(
          await fetch(`${apiBase}/indexes/users/${identity.id}`, { 
            headers,
            method: 'PUT',
            body: JSON.stringify(payload)
          })
        )
      } catch (error) {
        return getErrorResponse(error)
      }
    },

    getById: async ({userId}) => {
      try {
        return unwrap(
          await fetch(`${apiBase}/indexes/users/${userId}`, { 
            headers
          })
        )
      } catch (error) {
        return getErrorResponse(error)
      }
    },

    assignHome: async function({ identity, homeId }){
      try {
        const payload = (await this.getById({userId: identity.id}) ).json
        payload.homeId.push(homeId)
        this.create({identity, payload})
      } catch (error) {
        return getErrorResponse(error)
      }
    },

    removeHome: async function({ identity, homeId }){
      try {
        const payload = (await this.getById({userId: identity.id}) ).json
        payload.homeId = payload.homeId.filter(id => id != homeId)
        this.create({identity, payload})
      } catch (error) {
        return getErrorResponse(error)
      }
    }
  }
}