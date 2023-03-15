export function getApi(algoliaConfig){
  return {
    headers: {
      'X-Algolia-API-Key': algoliaConfig.apiKey,
      'X-Algolia-Application-Id': algoliaConfig.appId
    },
    apiBase: `https://${algoliaConfig.appId}-dsn.algolia.net/1`
  }
}

export function sendJSON(data, res){
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

export function rejectHitBadRequest(res){
  res.statusCode = 400
  res.end()
}

export function hasBadBody(req){
  return !req.body || Object.keys(req.body).length === 0
}