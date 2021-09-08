
var CACHE_STATIC_NAME = 'static-v2';
var CACHE_DYNAMIC_NAME = 'dynamic-v0';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        cache.addAll([
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
        ]);
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
});

/*
1. Caching strategy => Cache with network fallback.


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

*/


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

*/

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