/* global define */

define(
  [

    "jquery",
    "controllers/map-controller"

  ], function(

    $,
    mapCtrl

  ) {

    /**
     * Private
     */

    var _onOpenPopup = function(e) {

      mapCtrl.onOpenPopup(e);

    },

    _onCloseModal = function() {

      mapCtrl.onCloseModal();

    },

    _onExpandPopup = function() {

      mapCtrl.onExpandPopup();

    },

    _registerEventListeners = function() {

      this.eventLayer.on("popupopen", _onOpenPopup);
      $("#map").on("click", ".popup-info", _onExpandPopup);
      $(".modal-close").on("click", _onCloseModal);

    },

    /**
     * Public
     */

    init = function(config) {

      this.config = $.extend(this.config, config);
      this.eventLayer = this.config.map.settings.layers[0];

      _registerEventListeners.call(this);

    };

    return {

      config: {},
      eventLayer: null,
      init: init

    };
  }
);
