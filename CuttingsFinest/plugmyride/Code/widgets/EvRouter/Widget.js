///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//		http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
		'dojo/_base/declare',
		'jimu/BaseWidget',
		'esri/dijit/Directions',
		'esri/tasks/RouteParameters',
		'dojo/on',
		'dojo/_base/lang',
		'dojo/_base/array',
		'esri/geometry/Point',
		'esri/geometry/mathUtils',
		'./RouteAnalyzer'
	],
	function(declare, BaseWidget, Directions, RouteParameters, on, lang, array, Point, mathUtils, RouteAnalyzer) {
		return declare([BaseWidget], {
			_dijitDirections:null,
			_routeTaskUrl:"http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
			_locatorUrl:"http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
			
			_analyzer: null,
			
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
				this._analyzer.range = 135; // hard coded for demo

				this._dijitDirections = new Directions({
					map: this.map,
					geocoderOptions: this.config.geocoderOptions,
					routeParams: routeParams,
					routeTaskUrl: this.config.routeTaskUrl,
					dragging:true
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
						if (evt.result && evt.result.routeResults && evt.result.routeResults[0]) {

							me._analyzer.chargingStationLayer = me._chargingStationsLayer;
							me._directionsWaitingToBeAnalyzed = evt.result.routeResults[0].directions
						
							if (me._chargingStationsLayerIsUpdating == false) {
								me.doAnalysis();
							}
						}
					}
					else {
						console.log("Stops added, trimming...");
						if (evt.result && evt.result.routeResults && evt.result.routeResults[0]) {

							me._analyzer.chargingStationLayer = me._chargingStationsLayer;
							me._directionsWaitingToBeAnalyzed = evt.result.routeResults[0].directions
						
							if (me._chargingStationsLayerIsUpdating == false) {
								me.doTrim();
							}
						}
					}
				}, 1000);
			},
			
			doAnalysis: function() {
				var additionalStops = this._analyzer.analyze(this._directionsWaitingToBeAnalyzed);
				this._directionsWaitingToBeAnalyzed = null;
				
				array.forEach(additionalStops, lang.hitch( this, function(item) {
					this._dijitDirections.addStop(item.point, item.index);
				}));
				
				if (this._analyzer.status	 == "RERUNNING") {
					this._dijitDirections.getDirections();
				}
				if (this._analyzer.status == "ERROR") {
					// Take whatever action at this point to alert the user
					alert("Boom!");
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
					this._analyzer.status	 == "RERUNNING"
					this._dijitDirections.getDirections();
				}
				else {
					this._analyzer.status = "READY";
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
			}
			
		});
	});