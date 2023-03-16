export default ({$config}, inject)=>{
  let isLoaded = false
  let waiting = []
  
  window.initGoogleMaps = init
  addScript()

  inject('maps', {
    showMap,
    makeAutoComplete
  })
  
  function addScript(){
    const script = document.createElement('script')
    script.src = 'https://maps.googleapis.com/maps/api/js?key='+$config.public.mapsApiKey+'&libraries=places&callback=initGoogleMaps'
    script.async = true
    document.head.appendChild(script)
  }

  function init(){
    isLoaded = true
    waiting.forEach(item => {
      if(typeof item.fn === 'function'){
        item.fn(...item.arguments)
      }
    })
    waiting = []
  }

  function makeAutoComplete({ input, types=['(cities)'] }){
    if(!isLoaded){
      waiting.push({
        fn: makeAutoComplete,
        arguments
      })
      return
    }
    const autoComplete = new window.google.maps.places.Autocomplete(input, {
      types
    })
    autoComplete.addListener('place_changed', () => {
      const place = autoComplete.getPlace()
      input.dispatchEvent(new CustomEvent('changed', {detail: place}))
    })
  }

  function showMap(canvas, lat, lng, markers = null){
    if(!isLoaded){
      waiting.push({
        fn: showMap,
        arguments
      })
      return
    }
    const position = new window.google.maps.LatLng(lat, lng)
    const mapOptions = {
      zoom: 18,
      center: position,
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi.business',
          elementType: 'labels.icon',
          stylers:[{visibility: 'off'}]
        }
      ]
    }
    const map = new window.google.maps.Map(canvas, mapOptions)
    
    if(!markers){
      const marker = new window.google.maps.Marker({position, clickable: false})
      marker.setMap(map) 
      return
    }

    const bounds = new window.google.maps.LatLngBounds
    markers.forEach(item => {
      const position = new window.google.maps.LatLng(item.lat, item.lng)
      const marker = new window.google.maps.Marker({
        position,
        label: {
          text: `$${item.pricePerNight}`,
          className: `marker home-${item.id}`
        },
        icon: '/images/transparent.png',
        clickable: false
      })
      marker.setMap(map)
      bounds.extend(position)
    })
    map.fitBounds(bounds)
  }
}