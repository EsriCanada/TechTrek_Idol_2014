/* global define */

define(
  [

    "jquery",
    "controllers/map-controller",
    "mmenu"

  ], function(

    $,
    mapCtrl

  ) {

    /**
     * Private
     */

    var _onShowAbout = function() {

      mapCtrl.onShowAbout();

    },


    _onToggleType = function(e) {

      mapCtrl.onToggleType(e);

    },

    _onChangePrice = function(e) {

      mapCtrl.onChangePrice(e);

    },

    _onChangeTime = function(e) {

      mapCtrl.onChangeTime(e);

    },

    _onChangeSource = function(e) {

      mapCtrl.onChangeSource(e);

    },

    _onToggleGeocoder = function() {

      mapCtrl.onToggleGeocoder();

    },

    _onSelectNeighbourhood = function(e) {

      mapCtrl.onSelectNeighbourhood(e);

    },

    _registerEventListeners = function() {

      this.mmenu.on("closed.mm", function() {
        $("#menu .mm-panel").first().trigger("open.mm");
      });
      $(".menu-button").click(function() {
        $("#menu").trigger("open.mm");
      });
      $(".menu-about").on("click", _onShowAbout);
      $(".menu-toggle").on("change", _onToggleType);
      $(".menu-radio-time").on("change", _onChangeTime);
      $(".menu-radio-price").on("change", _onChangePrice);
      $(".menu-radio-source").on("change", _onChangeSource);
      $(".search-button").on("click", _onToggleGeocoder);
      $(".menu-select").on("click", _onSelectNeighbourhood);

    },

    /**
     * Public
     */

    init = function(config) {

      this.config = $.extend(this.config, config);
      if (!this.mmenu) {
        this.mmenu = $("#menu").mmenu(this.config.mmenu.settings);
      }
      this.mmenu.removeClass("no-display");

      _registerEventListeners.call(this);

    };

    return {

      config: {},
      mmenu: null,
      init: init

    };
  }
);
