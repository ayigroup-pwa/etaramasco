  
  if (!window.Promise){
    //Polyfills -> browsers legacy
    window.Promise = Promise;
  }
 
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
    .then ( function (){
      console.log('Service worker register...');
    });
  }

  function pruebaNavigator () {
    var logicalProcessors = window.navigator.hardwareConcurrency;
    console.log(logicalProcessors);
  }

  self.addEventListener('beforeinstallprompt', function (event){
    console.log('beforeinstallprompt fired');
    event.preventDefault();
    defferedPrompt = event;
    return false;
  });

  fetch('https://httpbin.org/ip')
    .then((response) => {
      console.log('Fetch API');
      console.log(response);
      return response.json();
    });
  