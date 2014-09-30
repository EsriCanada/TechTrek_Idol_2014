/* global define */

/**
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
define([], function() {

  /**
   * Public
   */

  PathLoader = function(el) {

    this.el = el;
    // clear stroke
    this.el.style.strokeDasharray = this.el.style.strokeDashoffset = this.el.getTotalLength();

  };

  PathLoader.prototype._draw = function(val) {

    this.el.style.strokeDashoffset = this.el.getTotalLength() * (1 - val);

  };

  PathLoader.prototype.setProgress = function(val, callback) {

    this._draw(val);
    if (callback && typeof callback === 'function') {
      // give it a time (ideally the same like the transition time) so that the last progress increment animation is still visible.
      setTimeout(callback, 500);
    }

  };

  PathLoader.prototype.setProgressFn = function(fn) {

    if (typeof fn === 'function') {
      fn(this);
    }

  };

  return {

    PathLoader: PathLoader

  };

});

