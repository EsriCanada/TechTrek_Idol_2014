define([
		'dojo/_base/declare',
		"dijit/_WidgetBase",
  		"dijit/_TemplatedMixin",
  		"dijit/_WidgetsInTemplateMixin",
  		"dijit/layout/ContentPane",
		'esri/dijit/Directions',
		'esri/tasks/RouteParameters',
		'dojo/on',
		'dojo/_base/lang',
		'dojo/_base/array',
		"dojo/Evented",
		"dojo/query",
		"dojo/dom-construct",
		"dojo/dom-class",
		'esri/geometry/Point',
		'esri/geometry/mathUtils',
		'./RouteAnalyzer',
		"dojo/text!./template/template.html",
	],
	function(declare,_WidgetBase,_TemplatedMixin,_WidgetsInTemplateMixin,ContentPane,Directions, RouteParameters, on, lang, array,
		Evented,query,domConstruct, domClass, Point, mathUtils, RouteAnalyzer,template) {
		return declare([ContentPane,_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,Evented],
		{
			templateString:template,
			title:"",
			baseClass: "widget_EvRouter_ui",
			_dijitDirections:null,
			_routeTaskUrl:"http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
			_locatorUrl:"http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
			
			_analyzer: null,
			_vehicleRange:0,
			_chargingStationsLayer: null,
			_chargingStationsLayerIsUpdating: false,
			_directionsWaitingToBeAnalyzed: null,
			postCreate: function() {
				this.inherited(arguments);
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
				
				this._analyzer = new RouteAnalyzer();
				

				this._dijitDirections = new Directions({
					map: this.map,
					showTravelModesOption:false,
					showMilesKilometersOption:false,
					showReturnToStartOption:false,
					geocoderOptions: this.config.geocoderOptions,
					routeParams: routeParams,
					routeTaskUrl: this.config.routeTaskUrl,
					dragging:false
				}, this.directionController);

				this._dijitDirections.startup();
				on(this._dijitDirections, "directions-start", lang.hitch(this, "processDirectionStartEvent"));
				on(this._dijitDirections, "directions-finish", lang.hitch(this, "processDirectionFinishEvent"));
				
				// Find the ChargingStations feature layer
				var fLayer = null;
				array.forEach(this.map.graphicsLayerIds, lang.hitch(this, function(item) {
					if (item.lastIndexOf("ChargingStations", 0) === 0) {
						console.log("Found the ChargingStations feature layer.");
						fLayer = this.map.getLayer(item);
					}
				}));
				
				this._chargingStationsLayer = fLayer;
				
				// Listen to events where the charging stations layer is reloading content
				on( this._chargingStationsLayer, "update-start", lang.hitch( this, "chargingStationsUpdateStartEvent" ));
				on( this._chargingStationsLayer, "update-end", lang.hitch( this, "chargingStationsUpdateEndEvent" ));
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
				
				// Need to wait a bit, to let featurelayer updates happen b/c of zoom
				console.log("Starting wait.");
				var me = this;
				setTimeout( function() {
					console.log("Wait over!");
					
					if (me._analyzer.status == "READY") {
						console.log("Analyzing returned directions...");
						me._analyzer.range = me._vehicleRange; 
						if (evt.result && evt.result.routeResults && evt.result.routeResults[0]) {

							me._analyzer.chargingStationLayer = me._chargingStationsLayer;
							me._directionsWaitingToBeAnalyzed = evt.result.routeResults[0].directions;
						
							if (me._chargingStationsLayerIsUpdating == false) {
								me.doAnalysis();
							}
							
						}
						
					}
					else {
						console.log("Stops added, trimming...");
						if (evt.result && evt.result.routeResults && evt.result.routeResults[0]) {

							me._analyzer.chargingStationLayer = me._chargingStationsLayer;
							me._directionsWaitingToBeAnalyzed = evt.result.routeResults[0].directions;
						
							if (me._chargingStationsLayerIsUpdating == false) {
								me.doTrim();
							}
						}
						//me._analyzer.status = "READY";
						//me.addLabels();
						//me.emit('analysis_completed', {data:true});
					}
				}, 1000);
			},
			
			doAnalysis: function() {
				var additionalStops = this._analyzer.analyze(this._directionsWaitingToBeAnalyzed);
				this._directionsWaitingToBeAnalyzed = null;
				
				array.forEach(additionalStops, lang.hitch( this, function(item) {
					this._dijitDirections.addStop(item.stop, item.index);
				}));
				if (this._analyzer.status == "READY") {
					this.addLabels();
					this.emit('analysis_completed', {data:true});
				}
				if (this._analyzer.status	 == "RERUNNING") {
					this._dijitDirections.getDirections();
				}
				if (this._analyzer.status == "ERROR") {
					// Take whatever action at this point to alert the user
					//alert("Boom!");
					this.clearDirections();
					this.addError();
					this.emit('analysis_completed', {data:false});
					this._analyzer.status = "READY"; // Reset
				}
				
			},
			doTrim: function() {
				var removedStops = this._analyzer.trimRoute(this._directionsWaitingToBeAnalyzed);
				this._directionsWaitingToBeAnalyzed = null;
				
				var rerunDirections = removedStops.length > 0;
				
				while (removedStops.length > 0) {
					var stopIndexToRemove = removedStops.pop();
					this._dijitDirections.removeStop( stopIndexToRemove );
				}
				
				if ( rerunDirections ) {
					this._analyzer.status == "RERUNNING";
					this._dijitDirections.getDirections();
				}
				else {
					this._analyzer.status = "READY";
					this.addLabels();
					this.emit('analysis_completed', {data:true});
				}
			},
			chargingStationsUpdateStartEvent: function() {
				console.log("ChargingStations layer update start");
				this._chargingStationsLayerIsUpdating = true;
			},
			
			chargingStationsUpdateEndEvent: function() {
				console.log("ChargingStations layer update end");
				this._chargingStationsLayerIsUpdating = false;
				if (this._directionsWaitingToBeAnalyzed != null) {
					this.doAnalysis();						
				}
			},
			runRoute:function(start,end,vehicleRange)
			{
				this.clearDirections();
				this._dijitDirections.addStop(start);
    			this._dijitDirections.addStop(end);
    			this._vehicleRange = vehicleRange;
    			this._dijitDirections.getDirections();
			},
			clearDirections:function(removeStops)
			{
				this._dijitDirections.reset();
				this._dijitDirections.clearDirections();
				this._dijitDirections.removeStops();
					
				
				domClass.add(this.directionError, "hidden"); 
					
				this._analyzer.status = "READY";
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
			},
			addError:function()
			{
   				domClass.remove(this.directionError, "hidden"); 
   				
			}
		});
});