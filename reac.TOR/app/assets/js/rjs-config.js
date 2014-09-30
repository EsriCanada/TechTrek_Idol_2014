require.config({
  waitSeconds: 200,
  paths: {
    // Components
    "d3": "../components/d3/d3",
    "esri-leaflet": "../components/esri-leaflet/dist/esri-leaflet-src",
    "esri-leaflet-clustered-feature-layer": "../components/esri-leaflet/dist/builds/clustered-feature-layer/esri-leaflet-clustered-feature-layer",
    "esri-leaflet-geocoder": "../components/esri-leaflet-geocoder/dist/esri-leaflet-geocoder",
    "fastclick": "../components/fastclick/lib/fastclick",
    "jquery": "../components/jquery/dist/jquery",
    "leaflet": "../components/leaflet/dist/leaflet",
    "leaflet-locate": "../components/leaflet.locatecontrol/src/L.Control.Locate",
    "leaflet-marker-cluster": "../components/leaflet.markercluster/dist/leaflet.markercluster",
    "leaflet-markers": "../components/Leaflet.awesome-markers/dist/leaflet.awesome-markers",
    "meld": "../components/meld/meld",
    "mmenu": "../components/jQuery.mmenu/src/js/jquery.mmenu.min.all",
    "moment": "../components/moment/moment",
    "mixpanel": "../components/mixpanel/mixpanel",
    "platform": "../components/platform/platform.js",
    // App modules
    "controllers": "controllers",
    "modules": "modules",
    "services": "services",
    "views": "views"
  },
  shim: {
    "jquery": {
      exports: "$"
    },
    "mmenu": {
      deps: ["jquery"]
    },
    "mixpanel": {
      exports: "mixpanel"
    },
    "leaflet": {
      exports: "L"
    },
    "leaflet-locate": {
      deps: ["leaflet"]
    },
    "leaflet-marker-cluster": {
      deps: ["leaflet"]
    },
    "esri-leaflet": {
      deps: ["leaflet"]
    },
    "esri-leaflet-clustered-feature-layer": {
      deps: ["leaflet", "leaflet-marker-cluster", "esri-leaflet"]
    },
    "esri-leaflet-geocoder": {
      deps: ["leaflet", "esri-leaflet"]
    },
    "leaflet-markers": {
      deps: ["leaflet"]
    }
  },
  packages: []
});

require(
  [

    "jquery",
    "modules/preloader",
    "controllers/app-controller"

  ], function(

    $,
    preloader,
    appCtrl

  ) {

    // document.addEventListener('polymer-ready', function() {
    //   require(["modules/bootstrap-modal"], function() {
    //     console.log('loaded modals');
    //   });
    // });
    preloader.init();
    appCtrl.init();

  }
);
