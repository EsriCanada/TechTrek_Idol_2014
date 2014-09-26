define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dijit/layout/ContentPane",
  "dojo/dom-construct",
  "dojo/dom-style",
  "dojo/_base/lang",
  "dojo/topic",
  "dojo/request",
  "dojo/json",
  "dojo/Evented",
  'dojo/on',
  'dojo/_base/array',
  "dojo/query",
  'esri/dijit/Directions',
  'esri/tasks/RouteParameters',
  'esri/geometry/Point',
  'esri/geometry/mathUtils',
  "esri/graphic",
  "esri/layers/GraphicsLayer",
  "esri/symbols/SimpleMarkerSymbol",
  "dojo/text!./template/template.html",
], function(declare,_WidgetBase,_TemplatedMixin,_WidgetsInTemplateMixin,ContentPane,domConstruct,domStyle,lang,topic,request,JSON,Evented,on,
	array,query,Directions,RouteParameters,Point, mathUtils,Graphic,GraphicsLayer,SimpleMarkerSymbol,template){
return declare([ContentPane,_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,Evented], 
	{
		templateString:template,
		title:"",
		baseClass: "widget_EvRouter_ui",
		_dijitDirections:null,
		_routeTaskUrl:"http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
		_locatorUrl:"http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
		_analysisStatus: "READY",
		_vehicleRange:0,
		 graphicsLayer:null,
		postCreate: function() 
    	{
    		this.inherited(arguments);
    		this.createDirectionDigit();
    		/*this.graphicsLayer = new GraphicsLayer({
                id: 'GeoLocationGraphics',
                title: "GPS Location"
            });*/
            this.map.addLayer(this.graphicsLayer);
    	},
    	createDirectionDigit:function()
    	{
    		this.preProcessConfig();
    		var routeParams = new RouteParameters();
    		var routeOptions = this.config.routeOptions;
			if(routeOptions){
				if(routeOptions.directionsLanguage){
					routeParams.directionsLanguage = routeOptions.directionsLanguage;
				}
				routeParams.directionsLengthUnits = routeOptions.directionsLengthUnits;
				routeParams.directionsOutputType = routeOptions.directionsOutputType;
				if(routeOptions.impedanceAttribute){
					routeParams.impedanceAttribute = routeOptions.impedanceAttribute;
				}
			}

    		this._dijitDirections = new Directions({
					map: this.map,
					showTravelModesOption:false,
					showMilesKilometersOption:false,
					showReturnToStartOption:false,
					geocoderOptions: this.config.geocoderOptions,
					routeParams: routeParams,
					routeTaskUrl: this.config.routeTaskUrl,
					dragging:true
			}, this.directionController);

			this._dijitDirections.startup();
			on(this._dijitDirections, "directions-start", lang.hitch(this, "processDirectionStartEvent"));
			on(this._dijitDirections, "directions-finish", lang.hitch(this, "processDirectionFinishEvent"));
    		domStyle.set(this._dijitDirections._optionsButtonNode, "display", "none");
    	},
    	preProcessConfig:function(){
				if(!this.config.routeTaskUrl){
					var routeTaskUrl = this.appConfig && this.appConfig.routeService && this.appConfig.routeService.url;
					this.config.routeTaskUrl = routeTaskUrl||this._routeTaskUrl;
				}
				if(!this.config.locatorUrl){
					var locatorUrl = this.appConfig && this.appConfig.geocodeService && this.appConfig.geocodeService.url;
					this.config.locatorUrl = locatorUrl||this._locatorUrl;
				}
			},
			processDirectionStartEvent:function(evt) {
				console.log("Started finding directions.");
			},
			
			processDirectionFinishEvent:function(evt) {
				console.log("Finished finding directions.");
				if (this._analysisStatus == "READY") {
					console.log("Analyzing returned directions...");
					if (evt.result && evt.result.routeResults && evt.result.routeResults[0]) {
						var range = this._vehicleRange; // km, hard coded for test
						var route = evt.result.routeResults[0].route;
						var directions = evt.result.routeResults[0].directions;
						console.debug(directions);
				
						/*
							We know how long the polyline paths are: they are in the JSON.
							But we are measuring segments in Web Mercator: unreliable.
							Let's measure the line in WM to find out how unreliable our ruler is.
						*/
						var wmLength = this.measureDirectionsLength(directions);
						var realLength = directions.totalLength;
						console.log("Measured length to be " + wmLength + ", real length is " + realLength);
						var distortionFactor = wmLength / realLength;
						console.log("Applying distortion factor of " + distortionFactor);
						
						// Step through features until the accumulated length reaches 90% of range
						var legLength = 0;
						var additionalStopCount = 0;
						var stopCount = 0;
						array.forEach( directions.features, lang.hitch(this, function(item, idx) {
							var polyline = item.geometry;
							if (item.attributes.maneuverType == "esriDMTStop") {
								stopCount++;
							}
							for (var path = 0; path < polyline.paths.length; path++) {
								for (var pt = 0; pt < polyline.paths[path].length - 1; pt++) {
									var point1 = new Point(polyline.paths[path][pt], polyline.spatialReference);
									var point2 = new Point(polyline.paths[path][pt+1], polyline.spatialReference);
									var l = mathUtils.getLength(point1, point2) / distortionFactor;
									legLength += l / 1000; // Translate m into km
									if (legLength > 0.9 * range) {
										// Find the closest charging station, add as stop
										console.log("Will try to find a charging station after " + legLength + " km");
										//var sms = new SimpleMarkerSymbol();
										//var graphic = new Graphic(point2, sms,null);
 										//this.graphicsLayer.add(graphic);
										var stationPoint = this.findChargingStationNearestTo(point2);
										// Add after the most recent stop and previous charging stations
										this._dijitDirections.addStop(stationPoint, 1 + stopCount + additionalStopCount);
										additionalStopCount++;
										legLength = 0;
									}
								}
							}
						}));
				
						// Did we add any stops?
						if (additionalStopCount > 0) {
							// Re-run the route
							console.log("Re-running directions, because we added " + additionalStopCount + " stops");
							this._analysisStatus = "RERUNNING";
							this._dijitDirections.getDirections();
						}
						else {
							console.log("No need to add any stops.");
							this._analysisStatus = "READY";
							//this._dijitDirections.zoomToFullRoute();
							//this.map.setZoom(this.map.getZoom()+1);
							//this.map.setExtent(this.map.extent.expand(1.5));
							this.addLabels();
							this.emit('analysis_completed', {});
						}
					}
				}
				else if(this._analysisStatus == "RERUNNING") {
					//this._dijitDirections.zoomToFullRoute();
					console.log(this.map.getZoom());
					//this.map.setZoom(this.map.getZoom()+1);
					//this.map.setExtent(this.map.extent.expand(1.5));
					this.addLabels();
					this.emit('analysis_completed', {data:true});
				}
				else {
					console.log("No analysis: stops added already.");
					this._analysisStatus = "READY";
					this.addLabels();
					
				}
			},
			measureDirectionsLength: function(directions) {
				var directionsLength = 0;
				array.forEach( directions.features, lang.hitch(this, function(item, idx) {
					var polyline = item.geometry;
					for (var path = 0; path < polyline.paths.length; path++) {
						for (var pt = 0; pt < polyline.paths[path].length - 1; pt++) {
							var point1 = new Point(polyline.paths[path][pt], polyline.spatialReference);
							var point2 = new Point(polyline.paths[path][pt+1], polyline.spatialReference);
							var l = mathUtils.getLength(point1, point2);
							directionsLength += l / 1000; // Translate m into km
						}
					}
				}));
				return directionsLength;
			},
			findChargingStationNearestTo:function(point) {
				var distance = Number.MAX_VALUE;
				var closestStation = null;
				array.forEach(this.map.graphicsLayerIds, lang.hitch(this, function(item) {
					if (item.lastIndexOf("ChargingStations", 0) === 0) {
						console.log("Found the ChargingStations feature layer.");
						var fLayer = this.map.getLayer(item);
						// Loop through features to find the closest
						array.forEach(fLayer.graphics, lang.hitch(this, function(item) {
							var distanceToFeature = mathUtils.getLength(point, item.geometry);
							if (distanceToFeature < distance) {
								closestStation = item;
								distance = distanceToFeature;
							}
						}));
					}
				}));;
				
				console.debug(closestStation);
				return closestStation.geometry;
			},
			runRoute:function(start,end,vehicleRange)
			{
				this.clearDirections();
				this._dijitDirections.addStop(start);
    			this._dijitDirections.addStop(end);
    			this._vehicleRange = vehicleRange;
    			this._dijitDirections.getDirections();
			},
			clearDirections:function()
			{
				this._dijitDirections.reset();
				this._dijitDirections.clearDirections();
				this._dijitDirections.removeStops();
				this._analysisStatus = "READY";
			},
			addLabels:function()
			{
				query(".esriStopGeocoderColumn").forEach(function(node, idx,arr){ 
	           				
	           					var dij = dijit.getEnclosingWidget(node.childNodes[0]);
	           					var address = dij.value;
	           					//dij.destroyRecursive();
	           					var label = domConstruct.create("label",{'class':'addressLabel'});
								label.textContent = label.innerText = address;
								domConstruct.place(label, node);
	           				});
			}
			
    });
});