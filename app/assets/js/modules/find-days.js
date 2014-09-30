/*global define*/

define(
  [

    'moment'

  ], function(

    Moment

  ) {


    /**
     * Private
     */


    var _getThisWeekStart = function() {

      var today = new Moment().startOf('day');
      var daystoThisMonday = 0 - (1 - today.isoWeekday());
      var thisMonday = today.subtract('days', daystoThisMonday);

      return thisMonday;

    },

    /**
     * Public
     */

    getNextWeekStart = function() {

      var today = new Moment().startOf('day');
      var daystoMonday = 0 - (1 - today.isoWeekday()) + 7;
      var nextMonday = today.add('days', daystoMonday);

      return nextMonday;

    },

    getNextWeekEnd = function() {

      var nextMonday = getNextWeekStart();
      var nextSunday = nextMonday.add('days', 6).endOf('day');

      return nextSunday;

    },


    getThisWeekEnd = function() {

      var thisMonday = _getThisWeekStart();
      var thisSunday = thisMonday.add('days', 6).endOf('day');

      return thisSunday;

    },

    getThisFriday = function() {

      var thisMonday = _getThisWeekStart();
      var thisFriday = thisMonday.add('days', 4).startOf('day');

      return thisFriday;

    };

    return {

      getNextWeekStart: getNextWeekStart,
      getNextWeekEnd: getNextWeekEnd,
      getThisWeekEnd: getThisWeekEnd,
      getThisFriday: getThisFriday

    };
  }
);
