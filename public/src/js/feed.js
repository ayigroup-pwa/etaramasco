var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

var url = 'https://httpbin.org/ip';

fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function (data) {
    console.log('From cloud', data);
  });

if ('caches' in window) {
  caches.match(url)
    .then(function (response) {
      if (response) {
        return response.json();
      }
    })
    .then(function (data) {
      console.log('From cache', data);
    });
}

// el fetch al cloud y la busqueda del fetch en la cache ocurren al mismo tiempo
// si esta en la cache, primero se va a encontrar de la cache, de no estarlo se va a cachear con el fetch del sw cuando se haga el fetch desde el feed
// y luego se cacheara. desde ese momento se va a recuperar primero de la cache. 