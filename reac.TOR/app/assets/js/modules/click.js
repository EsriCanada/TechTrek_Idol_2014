/*global define, document*/

define(
  [

    'fastclick'

  ], function(

    FastClick

  ) {

    var init = function() {

      new FastClick(document.body);

    };

    return {

      init: init

    };
  }
);
