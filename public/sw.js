var CACHE_NAME = 'first-app-v1';
var CACHE_DYNAMIC = 'first-app-dinamic-v1';
var urlsToCache = [    
    '/',    
    '/index.html',
    '/src/css/app.css',
    '/src/css/feed.css',
    '/src/css/help.css',
    '/src/js/app.js',
    '/src/js/feed.js'
]

self.addEventListener('install', function(event) {
    console.log('soy el service worker');    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then (function (cache) {
                return cache.addAll( urlsToCache );
            },  function (err){
                // luego de , va a ser lo que se realiza si es rejected, es lo mismo que 
                // poner .catch despues
                console.log(err);
            })
    );
    self.skipWaiting();
    
});


self.addEventListener('activate', function(event){
    console.log("activanding");
    
    event.waitUntil(
        caches.keys()
            .then(function(keyList) {
            //trabajamos con todas las keys de la cache
            //nombres de cada cache
                return Promise.all(keyList.map(function(key) {
                    if (key != CACHE_NAME && key != CACHE_DYNAMIC){
                    //si no es la misma que la que estamos queriendo usar actualmente
                        console.log('[SW] Removing old cache version', key);
                        return caches.delete(key);
                        //la borramos para evitar incosistencias
                        //entonces siempre se va a trabajar con la ultima
                    }
                }))

            })
    )

    return self.clients.claim();
})

self.addEventListener('fetch', function(event) {
    console.log('Fetch en curso....', event);
    event.respondWith(
        caches.match(event.request)
            .then( function(response) {
                if (response) {
                    return response;
                } else {
                    return fetch(event.request)
                    //en esta parte online haria el fetch
                        .then( function (res){
                        //de tener exito y salir por el resolve del fetch
                            return caches.open(CACHE_DYNAMIC)
                            //va a abrir la cache dinamica
                                .then( function (cache) {
                                //y va a almacenar la url de la request y su response
                                    cache.put(event.request.url, res.clone());
                                    return res;
                                })
                        })
                        .catch( function (err) {
                        //va a salir por este catch cuando intente hacer el fetch y se este offline
                        //tambien podria llegar a entrar por algun error en un put
                            console.log('err');
                        })
                }                            
            })
        
            
    )
});