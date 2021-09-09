
var CACHE_STATIC_NAME = 'static-v4';
var CACHE_DYNAMIC_NAME = 'dynamic-v0';
var urlsToCache = [
  '/',
  '/index.html',
  '/src/css/app.css',
  '/src/css/main.css',
  '/src/js/main.js',
  '/src/js/material.min.js',  
  '/offline.html',        
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        cache.addAll(urlsToCache);
      })
  )
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME) {
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

/*
1. Caching strategy => Cache with network fallback.

*/
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function(res) {
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());
                  return res;
                });
            })
            .catch(function(err) {
              console.log('Fetch failed', err);
              return caches.match('/offline.html');
            });
        }
      })
  );
});



/* 
2. Caching strategy => Network only

Fetch events in SW will only succeed when the user is online.

self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch (event.request)
    .catch( function (err) {
      console.log('Error ocurrido', err);
    })
  );
})

*/

/*

3. Caching strategy => Cache only

Fetch events in SW will only succeed when the resource is cached.

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then (function (response) {
        if (response) {
          return response
        } else {
          return caches.match('/offline.html');
        }
      })      
  )
})

*/


/* 
4. Caching strategy => Network, cache fallback

The resource is searched on the network, if the search fails, it is searched in the cache.


self.addEventListener ('fetch', function (event) {
  event.respondWith(
    fetch(event.request)
    //busca el recurso en la internet
      .catch( function() {
      //de fallar por cualquier motivo
          return caches.match(event.request)
          //busca este recurso en la cache
            .then (function (res) {
              //si lo encuentra lo devuelve
              if (res) {
                return res
              } else {
                console.log('Recurso en cache fallback no encontrado')
                return caches.match('/offline.html');
              }
            })
      })
  )
})

*/

/*

5. Caching strategy => Cache, then network

In the "fetch" event of the SW, the network responses will be cached.

self.addEventListener ( 'fetch' , function (event) {
  event.respondWith(    
    fetch(event.request)
    //se realiza el fetch a la network donde el SW actua de proxy
      .then(function (res) {
      //de tener exito el fetch
        return caches.open(CACHE_DYNAMIC_NAME)
          .then(function (cache) {
            //se cachea el recurso en la cache dinamica
            cache.put(event.request.url, res.clone());
            //se cachea con el put (key, value)
            return res;
          })
      })
      .catch(function () {
      //de fallar el fetch del evento que atravezo el SW
            return caches.match(event.request)            
            //busca en la cache para ver si ya esta cacheado el recurso que se necesita
              .then( function (response){
                if (response){
                //si el recurso fue cacheado previamente
                  return response
                }                
                //de no estar se redige al usuario a la pagina de fallback
                return caches.match('/offline.html');
              })
        })
  );
})

*/

/*
6.


self.addEventListener('fetch', function(event) {
  
  var url = event.request.url;
  var pathurl = new URL(url).pathname;
  //guardo el path del evento interceptado por el SW  

  if (event.request.url.indexOf('https://httpbin.org/ip') > -1) {
  //si el evento se encuentra dentro de los recursos especificados que tienen que estar siempre actualizados en cache
    event.respondWith(
      caches.open(CACHE_DYNAMIC_NAME)
        .then(function (cache) {
          return fetch(event.request)
          //realiza el fetch
            .then(function(response){
            //almacena la respuesta en cache dinamica
              cache.put(event.request.url,response.clone());
              return response;
          })
        })
    )
  } else if (urlsToCache.includes(pathurl)) {
    //se fija si el recurso se encuentra dentro de la cache estatica    
      event.respondWith(
        caches.match(pathurl)
      );
  } else {
    //sino va a buscarlo en la cache haciendo fallback con la network
    event.respondWith(
      caches.match(event.request)
        .then(function (res) {
          if (res) {
            return res;
          } else {
            return fetch (event.request)
              .then(function(resp) {
                return caches.open(CACHE_DYNAMIC_NAME)
                  .then(function (cache){
                    cache.put(event.request.url, resp.clone());
                    return resp;
                  })
              })
              .catch(function(){
              //de fallar en el fetch redirecciono a fallbackpage
                return caches.match('/offline.html');
              })
          }
        })
    )
  }
})
*/