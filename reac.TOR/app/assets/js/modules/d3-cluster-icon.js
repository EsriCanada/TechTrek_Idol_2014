/* global define, document, window */

// Credit to http://bl.ocks.org/gisminister/10001728

define(
  [

    "d3",
    "jquery",
    "leaflet"

  ], function(

    d3,
    $,
    L

  ) {

    /**
     * Private
     */

    var _serializeXmlNode = function(xmlNode) {

      // polymer hack
      if (xmlNode.__impl4cf1e782hg__) {
        xmlNode = xmlNode.__impl4cf1e782hg__;
      }
      if (typeof window.XMLSerializer !== "undefined") {
        return (new window.XMLSerializer()).serializeToString(xmlNode);
      } else if (typeof xmlNode.xml !== "undefined") {
        return xmlNode.xml;
      }
      return "";

    },

    /* function that generates a svg markup for the pie chart */
    _bakeThePie = function(options) {

      /*data and valueFunc are required*/
      if (!options.data || !options.valueFunc) {
        return '';
      }
      var data = options.data,
        valueFunc = options.valueFunc,
        r = options.outerRadius?options.outerRadius: 28, //Default outer radius = 28px
        rInner = options.innerRadius?options.innerRadius: r - 10, //Default inner radius = r-10
        strokeWidth = options.strokeWidth?options.strokeWidth: 1, //Default stroke is 1
        pathClassFunc = options.pathClassFunc?options.pathClassFunc: function() {
          return '';
        }, //Class for each path
        pathTitleFunc = options.pathTitleFunc?options.pathTitleFunc: function() {
          return '';
        }, //Title for each path
        pieClass = options.pieClass?options.pieClass: 'marker-cluster-pie', //Class for the whole pie
        pieLabel = options.pieLabel?options.pieLabel: d3.sum(data, valueFunc), //Label for the whole pie
        pieLabelClass = options.pieLabelClass?options.pieLabelClass: 'marker-cluster-pie-label',//Class for the pie label
        origo = (r + strokeWidth), //Center coordinate
        w = origo * 2, //width and height of the svg element
        h = w,
        donut = d3.layout.pie(),
        arc = d3.svg.arc().innerRadius(rInner).outerRadius(r);

      //Create an svg element
      var svg = document.createElementNS(d3.ns.prefix.svg, 'svg');
      //Create the pie chart
      var vis = d3.select(svg)
        .data([data])
        .attr('class', pieClass)
        .attr('width', w)
        .attr('height', h);

      var arcs = vis.selectAll('g.arc')
        .data(donut.value(valueFunc))
        .enter().append('svg:g')
        .attr('class', 'arc')
        .attr('transform', 'translate(' + origo + ',' + origo + ')');

      arcs.append('svg:path')
        .attr('class', pathClassFunc)
        .attr('stroke-width', strokeWidth)
        .attr('d', arc)
        .append('svg:title')
        .text(pathTitleFunc);

      vis.append('text')
        .attr('x', origo)
        .attr('y', origo)
        .attr('class', pieLabelClass)
        .attr('text-anchor', 'middle')
        //.attr('dominant-baseline', 'central')
        /*IE doesn't seem to support dominant-baseline, but setting dy to .3em does the trick*/
        .attr('dy', '.3em')
        .text(pieLabel);

      //Return the svg-markup rather than the actual element
      return _serializeXmlNode(svg);

    },

    /**
     * Public
     */

    defineClusterIcon = function(cluster) {

      var children = cluster.getAllChildMarkers(),
        n = children.length, // Get number of markers in cluster
        strokeWidth = 1, // Set clusterpie stroke width
        r = 35 - 2 * strokeWidth - (n < 10 ? 12:n < 100 ? 8:n < 1000 ? 4:0), //Calculate clusterpie radius...
        iconDim = (r + strokeWidth) * 2, //...and divIcon dimensions (leaflet really wants to know the size)
        data = d3.nest() // Build a dataset for the pie chart
          .key(function(d) {
            return d.feature.properties.category;
          })
          .entries(children, d3.map),
        // bake some svg markup
        html = _bakeThePie({data: data,
          valueFunc: function(d) {
            return d.values.length;
          },
          strokeWidth: 1,
          outerRadius: r,
          innerRadius: -1,
          pieClass: 'cluster-pie',
          pieLabel: n,
          pieLabelClass: 'marker-cluster-pie-label',
          pathClassFunc: function(d) {
            return "category-" + d.data.key;
          },
          pathTitleFunc: function(d) {
            return d.data.key.capitalize() + ' (' + d.data.values.length + ' Event' + (d.data.values.length !== 1 ? 's':'') + ')';
          }
        }),
        // Create a new divIcon and assign the svg markup to the html property
        myIcon = new L.DivIcon({
          html: html,
          className: 'marker-cluster',
          iconSize: new L.Point(iconDim, iconDim)
        });

      return myIcon;

    };

    return {

      defineClusterIcon: defineClusterIcon

    };
  }
);
