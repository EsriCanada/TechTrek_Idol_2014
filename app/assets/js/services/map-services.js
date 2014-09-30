/* global define */

define(
  [

    "jquery",
    "leaflet",
    "moment",
    "modules/d3-cluster-icon",
    "esri-leaflet",
    "esri-leaflet-clustered-feature-layer",
    "leaflet-markers"

  ], function(

    $,
    L,
    Moment,
    clusterIcon

  ) {

    /**
     * Private
     */

    var _createIcons = function() {

      var icons = {
        arts: L.AwesomeMarkers.icon(this.config.markers.arts),
        athletics: L.AwesomeMarkers.icon(this.config.markers.athletics),
        music: L.AwesomeMarkers.icon(this.config.markers.music),
        film: L.AwesomeMarkers.icon(this.config.markers.film),
        community: L.AwesomeMarkers.icon(this.config.markers.community),
        other: L.AwesomeMarkers.icon(this.config.markers.other)
      };

      return (icons);

    },

    _createPopup = function(feature) {

      var body = [],
      props = feature.properties,
      titleClass = "popup-title",
      bodyClass = "popup-body",
      linkClass = "popup-info",
      sd = new Moment(props.startTime).format('dddd MMMM DD, YYYY'),
      ed = new Moment(props.endTime).format('dddd MMMM DD, YYYY'),
      date = sd,
      st = new Moment(props.startTime).format("h:mm a"),
      et = new Moment(props.endTime).format("h:mm a"),
      defaultStart = new Moment(props.startTime).startOf('day').format("h:mm a"),
      defaultEnd = new Moment(props.endTime).endOf('day').format("h:mm a"),
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
      body.push("<span class=" + titleClass + ">{name}</span>");
      body.push("<div class='" + bodyClass + "'>");
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
      if (props.desc_ && props.desc_.length > 1) {
        body.push("<a href='#' class=" + linkClass + ">More Info</a><br />");
      } else {
        body.push("<a href='{url_}' target='_blank'>More Info</a><br />");
      }
      body.push("</div>");
      var template = body.join("");
      var popup = L.Util.template(template, props);
      return popup;

    },

    // _pointToLayer = function (geojson, latlng) {

    //   icons = _createIcons.call(this, this.config);
    //   return L.marker(latlng, {
    //     icon: icons[geojson.properties.category.toLowerCase()]
    //   });

    // },

    _bindPopup = function(layer) {

      layer.bindPopup(function(feature) {
        var popup = _createPopup(feature);
        return popup;
      });

    },

    _initBasemapLayer = function() {

      var basemapLayer = L.esri.basemapLayer(this.config.basemap.type, this.config.basemap.settings);

      return basemapLayer;

    },

    _initEventLayer = function() {

      var st = new Moment(),
      et = new Moment().endOf('day'),

      icons = _createIcons.call(this, this.config),
      eventLayer = L.esri.clusteredFeatureLayer(this.config.eventLayerUrl, {
      // eventLayer = L.esri.featureLayer(this.config.eventLayerUrl, {
        timeField: {
          start: "startTime",
          end: "endTime"
        },
        from: st._d,
        to: et._d,
        timeFilterMode: this.config.timeFilterMode,
        maxClusterRadius: 2 * this.config.d3.rmax,
        iconCreateFunction: clusterIcon.defineClusterIcon,
        pointToLayer: function(geojson, latlng) {
          var type;
          if (icons[geojson.properties.category.toLowerCase()]) {
            type = geojson.properties.category.toLowerCase();

          } else {
            type = "other";
          }
          return L.marker(latlng, {
            icon: icons[type]
          });
        }
      });

      _bindPopup.call(this, eventLayer);

      return eventLayer;

    },

    /**
     * Public
     */

    loadServices = function(config) {

      var layers = [];

      this.config = $.extend(this.config, config);
      this.basemapLayer = _initBasemapLayer.call(this);
      this.eventLayer = _initEventLayer.call(this);

      layers.push(this.eventLayer);
      layers.push(this.basemapLayer);

      return layers;

    };

    return {

      config: {},
      eventLayer: null,
      basemapLayer: null,
      loadServices: loadServices

    };

  }
);
