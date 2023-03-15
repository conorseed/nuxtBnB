import stripeLib from 'stripe'
import getApis from '../algolia/apis'
import { rejectHitBadRequest, sendJSON } from '../helpers'
import { getErrorResponse } from '../../utils/fetchUtils'

export default function(){
  const algoliaConfig = this.options.privateRuntimeConfig.algolia
  const apis = getApis(algoliaConfig)
  const cloudName = this.options.cloudinary.cloudName
  const stripe = stripeLib(this.options.privateRuntimeConfig.stripe.secret)

  this.nuxt.hook('render:setupMiddleware', (app)=>{
    app.use('/api/stripe/create-session', createSession)
  })

  async function createSession(req,res){
    try {
      const body = req.body
      console.log(body)
      if(!body || !body.homeId || !body.start || !body.end || body.start >= body.end){
        return rejectHitBadRequest(res)
      }

      const homeResponse = await apis.homes.get({id: body.homeId})
      if(!homeResponse.ok) return getErrorResponse(homeResponse.json)
      const home = homeResponse.json
      const nights = (body.end - body.start) / 86400
      console.log(home, nights)

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `http://localhost:3000/home/${body.homeId}?result=success`,
        cancel_url: `http://localhost:3000/home/${body.homeId}?result=cancel`,
        line_items: [{
          quantity: 1,
          price_data: {
            currency: 'NZD',
            unit_amount: home.pricePerNight * nights * 100,
            product_data:{
              name: 'Reservation for ' + home.title,
              images: [`https://res.cloudinary.com/${cloudName}/image/upload/${home.images[0]}`]
            }
          }
        }]
      })

      sendJSON({ id: session.id }, res)
    } catch (error) {
      return getErrorResponse(error)
    }
  }
}