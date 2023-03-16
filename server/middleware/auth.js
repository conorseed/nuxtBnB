import { OAuth2Client } from 'google-auth-library'

export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig();
  const req = event.req;
  const res = event.res;

  if (!event.req.url.includes("/api/")) return;

  const cookies = parseCookies(event)
  const idToken = cookies[config.public.auth.cookieName]

  if (!idToken) return rejectHit(res)

  const ticket = await getUser(idToken, config)

  if (!ticket) return rejectHit(res)

  req.identity = {
    id: ticket.sub,
    email: ticket.email,
    name: ticket.name,
    image: ticket.picture
  }
});

async function getUser(idToken, config){
  const client = new OAuth2Client(config.public.auth.clientId)
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: config.public.auth.clientId
    })
    return ticket.getPayload()
  } catch (error) {
    console.error(error)
  }
}

function rejectHit(res){
  res.statusCode = 401
  res.end()
}