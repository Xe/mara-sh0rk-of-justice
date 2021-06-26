self.addEventListener("install", function(event) {
  event.waitUntil(preLoad());
});

var preLoad = function(){
  console.log("Installing web app");
  return caches.open("offline-1").then(function(cache) {
    console.log("caching index and important routes");
      return cache.addAll([
          "/",
          "/css/style.css",
          "/js/GameBoyCore.js",
          "js/GameBoyIO.js",
          "js/other/XAudioJS.swf",
          "js/other/XAudioServer.js",
          "js/other/XAudioServerMediaStreamWorker.js",
          "js/other/base64.js",
          "js/other/controls.js",
          "js/other/mobile.js",
          "js/other/resampler.js",
          "js/other/resize.js",
          "js/other/swfobject.js",
          "rom/game.gb"
      ]);
  });
};

self.addEventListener("fetch", function(event) {
  event.respondWith(checkResponse(event.request).catch(function() {
    return returnFromCache(event.request);
  }));
  event.waitUntil(addToCache(event.request));
});

var checkResponse = function(request){
  return new Promise(function(fulfill, reject) {
    fetch(request).then(function(response){
      if(response.status !== 404) {
        fulfill(response);
      } else {
        reject();
      }
    }, reject);
  });
};

var addToCache = function(request){
  return caches.open("offline-1").then(function (cache) {
    return fetch(request).then(function (response) {
      console.log(response.url + " was cached");
      return cache.put(request, response);
    });
  });
};

var returnFromCache = function(request){
  return caches.open("offline-1").then(function (cache) {
    return cache.match(request).then(function (matching) {
     if(!matching || matching.status == 404) {
       return cache.match("offline.html");
     } else {
       return matching;
     }
    });
  });
};
