var dojoConfig, jimuConfig;

/*global apiUrl, weinreUrl, yepnope, path, getPolyfills, loadingCallback, debug */

(function(argument) {
  var resources = [];
  if (debug) {
    resources.push(weinreUrl);
  }

  if(!apiUrl){
    console.error('no apiUrl.');
  }else if(!path) {
    console.error('no path.');
  } else {
    /*jshint unused:false*/
    dojoConfig = {
      parseOnLoad: false,
      async: true,
      tlmSiblingOfDojo: false,

      has: {
        'extend-esri': 1
      },
      packages: [{
        name: "widgets",
        location: path + "widgets"
      }, {
        name: "jimu",
        location: path + "jimu.js"
      }, {
        name: "themes",
        location: path + "themes"
      }]
    };

    jimuConfig = {
      loadingId: 'main-loading',
      mainPageId: 'main-page',
      layoutId: 'jimu-layout-manager',
      mapId: 'map'
    };

    resources = resources.concat([
      path + 'libs/storejs/json.js',
      path + 'libs/storejs/store.js',
      path + 'libs/odometer.js',
      path + 'widgets/Demo/css/odometer.css',
      apiUrl + 'js/dojo/dojo/resources/dojo.css',
      apiUrl + 'js/dojo/dijit/themes/claro/claro.css',
      apiUrl + 'js/esri/css/esri.css',
      path + 'jimu.js/css/jimu.css'
    ]);

    var loaded = 0;
    yepnope({
      load: resources,
      callback: function(url) {
        loaded++;

        if (typeof loadingCallback === 'function') {
          loadingCallback(url, loaded, resources.length);
        }
      },
      complete: function() {
        yepnope({
          load: apiUrl,
          complete: function() {
            continueLoad();

            function continueLoad(){
              if(typeof require === 'undefined'){
                if (window.console){
                  console.log('Waiting for API loaded.');
                }
                setTimeout(continueLoad, 100);
                return;
              }
              yepnope(getPolyfills("", function() {
                require(['jimu/main'], function(jimuMain) {
                  loadingCallback('jimu', resources.length + 1, resources.length);
                  jimuMain.initApp();
                });
              }));
            }
          }
        });
      }
    });
  }
})();