/* global define */

define(
  [

    "jquery",
    "leaflet",
    "moment",
    "meld",
    "modules/find-days",
    "esri-leaflet",
    "esri-leaflet-geocoder",
    "leaflet-markers",
    "leaflet-locate"

  ], function(

    $,
    L,
    Moment,
    meld,
    days

  ) {

    /**
     * Private
     */

    var _eventsToggled = [],
    _priceFilter = "",
    _sourceFilter = "",
    _typeFilter,
    _allFilters = [],
    _curFeature,

    _constructFinalArray = function() {

      var array = [];

      if (_priceFilter !== "") {
        array.push(_priceFilter);
      }
      if (_sourceFilter !== "") {
        array.push(_sourceFilter);
      }
      if (_typeFilter !== "") {
        array.push(_typeFilter);
      }

      return array;

    },

    _constructFinalQuery = function(array, delimiter) {

      var where;

      if (array.length === 0) {
        where = "1 = 0";
        return where;
      }

      where = "(" + array.join(delimiter) + ")";

      return where;

    },

    _setWhereFilter = function() {

      var where = _constructFinalQuery(_allFilters, ") AND (");
      this.eventLayer.setWhere(where);
      this.eventLayer._update();

    },

    _checkArray = function(array, type) {

      var i = array.indexOf(type);
      if (i !== -1) {
        array.splice(i, 1);
      } else {
        array.push(type);
      }

    },

    _constructTypeQuery = function(array, field, delimiter) {

      var where,
      whereArray = [];

      if (array.length === 0) {
        where = "1 = 0";
        return where;
      }

      array.forEach(function(el) {
        whereArray.push(field + " = '" + el + "'");
      });

      where = whereArray.join(delimiter);

      return where;

    },

    _setPriceFilter = function(price, field) {

      var filter;

      switch(price) {
        case "all":
          filter = "";
          break;
        case "priced":
           filter = field + " > 0";
           break;
        case "free":
          filter = field + " = 0";
          break;
        case "unknown":
          filter = field + " = -1";
          break;
      }

      return filter;


    },

    _setSourceFilter = function(array, source, field) {

      var filter;

      if (source === array[0]) {
        filter = "";
        return filter;
      }

      array.forEach(function(el) {
        if (source === el) {
          filter = field + " = '" + el + "'";
        }
      });

      return filter;

    },

    _setNeighbourhoodBounds = function(neighbourhood, field, url, map) {

      var query = L.esri.Tasks.query(url),
      where = field + " like '%" + neighbourhood + "%'";

      query.where(where).bounds(function(error, bounds) {
        if (error) {
          console.log(error);
          return;
        }
        map.fitBounds(bounds);
      });

    },

    _getTime = function(time) {

      var st = new Moment(),
      et,
      range = [];

      switch(time) {

        case "today":
          et = new Moment().endOf('day');
          break;

        case "tomorrow":
          st = new Moment().add("days", 1).startOf('day');
          et = new Moment().add("days", 1).endOf('day');
          break;

        case "week":
          et = days.getThisWeekEnd();
          break;

        case "weekend":
          var temp = days.getThisFriday();
          if (st.diff(temp) > 0) {
            st = temp;
          }
          et = days.getThisWeekEnd();
          break;

        case "nextweek":
          st = days.getNextWeekStart();
          et = days.getNextWeekEnd();
          break;

      }

      range.push(st._d);
      range.push(et._d);
      return range;

    },

    _changeFilter = function(e, filter) {

      e.preventDefault();
      var classString = e.target.className.toString();
      var searchClass = "." + classString.replace(" core-selected", "").replace(/ /g, ".");

      if ($(searchClass)[0].checked) {
        var label = searchClass.split("-").pop();

        switch(filter) {

          case this.config.priceTypes.field:
            _priceFilter = _setPriceFilter(label, filter);
            _allFilters = _constructFinalArray.call(this);
            break;

          case this.config.sourceTypes.field:
            _sourceFilter = _setSourceFilter(this.config.sourceTypes.source, label, filter);
            _allFilters = _constructFinalArray.call(this);
            break;

          case this.config.timeField:
            var range = _getTime(label);
            // Michael found that setting options manually worked better for setting time range than setTimeRange method
            this.eventLayer.options.from = range[0];
            this.eventLayer.options.to = range[1];
            console.log(range);

        }

        _setWhereFilter.call(this);
      }

    },

    _initMap = function() {

      var map = L.map('map', this.config.map.settings)
        .setView(this.config.map.view.center, this.config.map.view.zoom)
        .addControl(L.control.zoom(this.config.zoomControl));

      return map;

    },

    _initGeocoder = function() {

      // Create the geocoding control and add it to the map
      var searchControl = new L.esri.Controls.Geosearch();
      // Add geocoderControl to navbar instead of map
      searchControl._map = this.map;

      var geocoderDiv = searchControl.onAdd(this.map);
      $(".geocoder")[0].appendChild(geocoderDiv);

      meld.after(searchControl, "clear", function() {
        $(".toolbar-header").removeClass("geocoder-toggled");
      });

    },

    _initGeolocate = function() {

      var lc = new L.control.locate(this.config.locateControl).addTo(this.map);

      this.map.on('startfollowing', function() {
        this.map.on('dragstart', lc.stopFollowing);
      }.call(this));
      this.map.on('stopfollowing', function() {
        this.map.off('dragstart', lc.stopFollowing);
      }.call(this));

    },

    _initDates = function() {

      var today = new Moment().format("dddd");

      switch(today) {

        case "Saturday":
          $(".radio-button-week").addClass("no-display");
          break;

        case "Sunday":
          $(".radio-button-week").addClass("no-display");
          $(".radio-button-weekend").addClass("no-display");
          break;

      }

    },

    _constructModalPopup = function(props) {

      var body = [],
      title = props.name,
      categoryContainerClass = "modal-category-container",
      categoryTextClass = "modal-category-text",
      bodyClass = "popup-body modal-main",
      detailsClass = "modal-details",
      labelClass = "modal-label",
      descClass = "modal-description",
      // var detailsClass = "modal-details";
      iconClass = "modal-icon-text " + this.config.markers[props.category].prefix + " " + this.config.markers[props.category].prefix + "-" + this.config.markers[props.category].icon + " fa-2x",
      iconDivClass = "modal-icon modal-icon-" + props.category,
      sd = new Moment(props.startTime).format("dddd MMMM DD, YYYY"),
      ed = new Moment(props.endTime).format("dddd MMMM DD, YYYY"),
      date = sd,
      st = new Moment(props.startTime).format("h:mm a"),
      et = new Moment(props.endTime).format("h:mm a"),
      defaultStart = new Moment(props.startTime).startOf("day").format("h:mm a"),
      defaultEnd = new Moment(props.endTime).endOf("day").format("h:mm a"),
      time = st + " to " + et,
      price = props.price;
      if (ed !== sd) {
        date = sd + " to " + ed;
      }
      if (st === defaultStart && et === defaultEnd) {
        time = "";
      } else if (st !== defaultStart && et === defaultEnd) {
        time = st;
      }

      $(".modal-title")[0].innerHTML = title;
      // body.push("<div>");
      body.push("<div class='" + categoryContainerClass + "'>");
      body.push("<div class='" + iconDivClass + "'>");
      body.push("<i class='" + iconClass + "'></i>");
      body.push("</div>");
      body.push("<span class='" + categoryTextClass + "'>" + props.category.capitalize() + "</span>");
      body.push("</div>");
      if (props.img && props.img.length > 0) {
        var imgClass = "popup-img",
        img = "<img src='" + props.img + "' class='" + imgClass + "'></img>";
        body.push(img);
      }
      body.push("<div class='" + bodyClass + "'>");
      body.push("<div class='" + detailsClass + "'>");
      body.push("<i class='fa fa-calendar'></i>&nbsp;&nbsp;" + date + "<br />");
      if (time !== "") {
        body.push("<i class='fa fa-clock-o'></i>&nbsp;&nbsp;" + time + "<br />");
      }
      body.push("<i class='fa fa-map-marker'></i>&nbsp;&nbsp;&nbsp;" + props.venue + "<br />");
      if (price > 0) {
        body.push("<i class='fa fa-money'></i>&nbsp;$" + price.toFixed(2) + "<br />");
      } else if (price === 0) {
        body.push("<i class='fa fa-money'></i>&nbsp;Free<br />");
      }
      body.push("<span class='" + labelClass + "'>" +  this.config.sourceTypes.field.capitalize() + ":&nbsp;&nbsp;<a href='"+ props.url_ + "' target='_blank'>" + props.source + "</a></span><br />");
      body.push("</div>");
      body.push("<div class='" + descClass + "'>" + props.desc_ + "</div>");
      body.push("</div>");
      // body.push("</div>");

      var html = body.join("");

      $("#feature-info")[0].innerHTML = html;

    },

    _setAboutModal = function() {

      var imgClass = "about-img",
      imgContainerClass = "about-img-container",
      detailsClass = "about-details",
      img = "<div class='" + imgContainerClass + "'><img src='" + this.config.about.img + "' class ='" + imgClass + "'></img></div>",
      body = [];
      $(".modal-title")[0].innerHTML = img;
      body.push("<div class = '" + detailsClass + "'>");
      body.push(this.config.about.desc);
      body.push("</div>");

      var html = body.join("");

      $("#feature-info")[0].innerHTML = html;

    },

    /**
     * Public
     */

    onToggleType = function(e) {

      var classString = e.target.className.toString().replace(" core-selected", "");
      var type = classString.split("-").pop();
      _checkArray(_eventsToggled, type);
      _typeFilter = _constructTypeQuery(_eventsToggled, this.config.eventTypes.field, " OR ");
      _allFilters = _constructFinalArray.call(this);
      _setWhereFilter.call(this);

    },

    onChangePrice = function(e) {

      _changeFilter.call(this, e, this.config.priceTypes.field);

    },

    onChangeSource = function(e) {

      _changeFilter.call(this, e, this.config.sourceTypes.field);

    },

    onChangeTime = function(e) {

      _changeFilter.call(this, e, this.config.timeField);

    },

    onSelectNeighbourhood = function(e) {

      var neighbourhood = e.target.innerHTML;
      // // Polymer hack
      // if (classList.__impl4cf1e782hg__) {
      //   classList = classList.__impl4cf1e782hg__;
      // }
      // var searchClass = classList[classList.length - 1],
      // neighbourhood = searchClass.replace(/__/g, "''").replace(/-/g, " ").replace(/_/g, "-");
      _setNeighbourhoodBounds(neighbourhood, this.config.neighbourhoods.field, this.config.neighbourhoodLayerUrl, this.map);

    },

    onToggleGeocoder = function() {

      $(".geocoder-control").click();
      $(".toolbar-header").addClass("geocoder-toggled");

    },

    onOpenPopup = function(e) {

      _curFeature = e.popup._source.feature;

    },

    onExpandPopup = function() {

      var props = _curFeature.properties;
      _constructModalPopup.call(this, props);
      this.map.closePopup();
      $('#feature-modal').modal('show');

    },

    onCloseModal = function() {

      $('#feature-modal').modal('hide');

    },

    onShowAbout = function() {

      this.map.closePopup();
      _setAboutModal.call(this);
      $('#feature-modal').modal('show');

    },

    init = function(config) {

      this.config = $.extend(this.config, config);
      _eventsToggled = this.config.eventTypes.category;
      this.map = _initMap.call(this);
      _initGeocoder.call(this);
      _initGeolocate.call(this);
      _initDates.call(this);
      this.eventLayer = this.config.map.settings.layers[0];
      _typeFilter = _constructTypeQuery(_eventsToggled, this.config.eventTypes.field, " OR ");
      _allFilters = _constructFinalArray.call(this);
      _setWhereFilter.call(this);

    };

    return {

      config: {},
      map: null,
      eventLayer: null,
      init: init,
      onToggleType: onToggleType,
      onChangePrice: onChangePrice,
      onChangeSource: onChangeSource,
      onChangeTime: onChangeTime,
      onSelectNeighbourhood: onSelectNeighbourhood,
      onToggleGeocoder: onToggleGeocoder,
      onOpenPopup: onOpenPopup,
      onCloseModal: onCloseModal,
      onExpandPopup: onExpandPopup,
      onShowAbout: onShowAbout

    };

  }
);
