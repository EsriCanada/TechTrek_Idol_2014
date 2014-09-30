/*global Modernizr, define, window, document*/

/**
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */

define(
  [

    "jquery",
    "modules/path-loader"

  ], function(

    $,
    PL

  ) {

    /**
     * Private
     */

    // var _support = {
    //   animations : Modernizr.cssanimations
    // },
    var _container = $(".mm-page")[0],
    _header = $(".pre-header")[0],
    _loader = new PL.PathLoader($(".pre-loader-circle")[0]),
    _animEndEventNames = [
      "webkitAnimationEnd",
      "oAnimationEnd",
      "MSAnimationEnd",
      "animationend"
    ],
    // animation end event name
    // _animEndEventName = _animEndEventNames.WebkitAnimation,

    _noscroll = function() {

      window.scrollTo(0, 0);

    },

    _onEndHeaderAnimation = function(ev) {

      // if (_support.animations) {
        if (ev.target !== _header) {
          return;
        }
        for (var i = _animEndEventNames.length - 1; i >= 0; i--) {
          this.removeEventListener(_animEndEventNames[i], _onEndHeaderAnimation);
        }
        // this.removeEventListener(_animEndEventName, _onEndHeaderAnimation);
      // }

      $(document.body).addClass("layout-switch");
      window.removeEventListener("scroll", _noscroll);
      $(_header).addClass("no-display");

    },

    _simulationFn = function(instance) {

      var progress = 0;
      var interval = setInterval(function() {
        // document.addEventListener('polymer-ready', function() {
        //   console.log('polymer-ready');
        //   progress = 1;
        // });
        progress = Math.min(progress + Math.random() * 0.1, 1);
        instance.setProgress( progress );
        // reached the end
        if( progress === 1 ) {
          $(_container).removeClass("loading");
          $(_container).addClass("loaded");
          clearInterval(interval);

          // if(_support.animations) {
            for (var i = _animEndEventNames.length - 1; i >= 0; i--) {
              _header.addEventListener(_animEndEventNames[i], _onEndHeaderAnimation);
            }
            // _header.addEventListener(_animEndEventName, _onEndHeaderAnimation);
          // } else {
            // _onEndHeaderAnimation();
          // }
        }
      }, 40);

    },

    _startLoading = function() {

      _loader.setProgressFn(_simulationFn);

    },

    _onEndInitialAnimation = function() {

      // if(_support.animations) {
        for (var i = _animEndEventNames.length - 1; i >= 0; i--) {
           this.removeEventListener(_animEndEventNames[i], _onEndInitialAnimation);
        }
        // this.removeEventListener(_animEndEventName, _onEndInitialAnimation);
      // }

      _startLoading();

    },

    /**
     * Public
     */

    init = function() {

      // disable scrolling
      window.addEventListener("scroll", _noscroll);

      // initial animation
      $(_container).addClass("loading");

      // if(_support.animations) {
        for (var i = _animEndEventNames.length - 1; i >= 0; i--) {
          _container.addEventListener(_animEndEventNames[i], _onEndInitialAnimation);
        }
        // _container.addEventListener(_animEndEventName, _onEndInitialAnimation);
      // } else {
        // _onEndInitialAnimation();
      // }

    };

    return {

      init: init

    };
  }
);
