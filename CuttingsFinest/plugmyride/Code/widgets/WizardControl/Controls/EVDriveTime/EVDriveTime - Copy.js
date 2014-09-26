<<<<<<< .mine
define(['dojo/_base/declare', 'dojo/Deferred', "dojo/Evented", "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dijit/layout/ContentPane", 'esri/dijit/analysis/CreateDriveTimeAreas', "esri/dijit/HomeButton", "esri/dijit/BasemapGallery", "esri/dijit/Legend", 'dojo/on', 'dojo/_base/lang', 'dojo/_base/array', "dojo/number", "dojo/dom-construct", 'esri/geometry/Point', "esri/layers/FeatureLayer", "esri/layers/GraphicsLayer", "esri/graphic", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/SpatialReference", "esri/tasks/FeatureSet", "esri/tasks/BufferParameters", "esri/tasks/GeometryService", "esri/InfoTemplate", "esri/renderers/UniqueValueRenderer","esri/Color", "dojo/text!./template/template.html"], function(declare, Deferred, Evented, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ContentPane, CreateDriveTimeAreas, HomeButton, BasemapGallery, Legend, on, lang, array, number, domConstruct, Point, FeatureLayer, GraphicsLayer, Graphic, SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, SpatialReference, FeatureSet, BufferParameters, GeometryService, InfoTemplate, UniqueValueRenderer,Color, template) {
	return declare([ContentPane, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
		_dijitDriveTimes : null,
		templateString : template,
		title : "",
		baseClass : "widget_EvDriveTime_ui",
		_bufferFeatures:[],
		_inputLayer : null,
		_resultsLayer : null,
		_tempLayer : null,
		_vehicleRange : 0,
		_legendControl : null,
		postCreate : function() {

=======
>>>>>>> .r22
<<<<<<< .mine
			this.inherited(arguments);
			var defaultSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([203, 153, 201, 0.5]), 2), new Color([203, 153, 201, 0.5]));
			var renderer = new UniqueValueRenderer(defaultSymbol, "distance");
			var d= {};
			d.symbol = new SimpleFillSymbol().setColor(new Color([203, 153, 201, 0.5]));
 			renderer.addValue("135", new SimpleFillSymbol().setColor(new Color([203, 153, 201, 0.5])));
          	renderer.addValue("67.5", new SimpleFillSymbol().setColor(new Color([255, 0, 0, 0.5])));
			var featureSet = new FeatureSet();
			featureSet.features = this._bufferFeatures;
=======
define([
		'dojo/_base/declare',
		'dojo/Deferred',
		"dojo/Evented",
		"dijit/_WidgetBase",
  		"dijit/_TemplatedMixin",
  		"dijit/_WidgetsInTemplateMixin",
  		"dijit/layout/ContentPane",
		'esri/dijit/analysis/CreateDriveTimeAreas',
		"esri/dijit/HomeButton",
		"esri/dijit/BasemapGallery",
		"esri/dijit/Legend",
		'dojo/on',
		'dojo/_base/lang',
		'dojo/_base/array',
		"dojo/number",
		"dojo/dom-construct",
		'esri/geometry/Point',
		"esri/layers/FeatureLayer",
		"esri/graphic",
		"esri/renderers/UniqueValueRenderer",
		"esri/symbols/SimpleMarkerSymbol",
		"esri/symbols/SimpleFillSymbol",
		"esri/symbols/SimpleLineSymbol",
		"esri/Color",
		"esri/SpatialReference",
		"esri/tasks/FeatureSet",
		"esri/InfoTemplate",
		"dojo/text!./template/template.html"
	],
	function(declare, Deferred, Evented, _WidgetBase,_TemplatedMixin,_WidgetsInTemplateMixin,ContentPane, CreateDriveTimeAreas, HomeButton, BasemapGallery, Legend, on, lang, array, number,domConstruct, 
		Point,FeatureLayer, Graphic, UniqueValueRenderer, SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, Color, SpatialReference, FeatureSet, InfoTemplate, template) {
		return declare([ContentPane,_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,Evented], {
			_dijitDriveTimes:null,
			templateString:template,
			title:"",
			baseClass: "widget_EvDriveTime_ui",
			_inputLayer:null,
			_resultsLayer:null,
			_vehicleRange:0,
			_legendControl:null,
			postCreate: function() {
				
				this.inherited(arguments);	
				
				/*var layerDefinition = {"geometryType": "esriGeometryPoint","fields": [{ "name": "Id", "type": "esriFieldTypeOID", "alias": "Id" }] };
>>>>>>> .r22

			var layerDefinition = {
				"geometryType" : "esriGeometryPoint",
				"fields" : [{
					"name" : "Id",
					"type" : "esriFieldTypeOID",
					"alias" : "Id"
				}, {
					"name" : "Location",
					"type" : "esriFieldTypeString",
					"alias" : "Location"
				}, {
					"name" : "ToBreak",
					"type" : "esriFieldTypeDouble",
					"alias" : "Location"
				}, {
					"name" : "FromBreak",
					"type" : "esriFieldTypeDouble",
					"alias" : "Location"
				}, {
					"name" : "label",
					"type" : "esriFieldTypeString",
					"alias" : "Location"
				}, {
					"name" : "type",
					"type" : "esriFieldTypeInt",
					"alias" : "Location"
				}]
			};

			

			var featureCollection = {
				"layerDefinition" : layerDefinition,
				"featureSet" : {
					"features" : this._bufferFeatures,
					"geometryType" : "esriGeometryPoint"
				}
			};
			this._tempLayer =new FeatureLayer(featureCollection, {mode: FeatureLayer.MODE_SNAPSHOT});
			this._tempLayer.setRenderer(renderer);
			//this._tempLayer.setInfoTemplate(new InfoTemplate("${Location}", "${FromBreak} km - ${ToBreak} km"));
			this._tempLayer.setOpacity(.5);
			this.map.addLayer(this._tempLayer);

<<<<<<< .mine
		},
		createDriveTimePolys : function() {
=======
				on(this._dijitDriveTimes, "job-result", lang.hitch(this, "parseResult"));
				
				var params = {
  					itemParams: {
    					description: "Item description.",
    					snippet: "A short summary about this item.",
    					tags: "test, test2",
    					typeKeywords: "keyword1, keyword2"
  					},
  					jobParams: {
  						inputLayer: this.inputLayer,
  						breakValues: [(this._vehicleRange/2),this._vehicleRange],
  						breakUnits: "Kilometers"
    					//outputName: "{\"serviceProperties\":{\"name\":\"MyDriveTimeServiceTest\"}}"
  					}
				};
				console.log(new Date().toUTCString());
				this._dijitDriveTimes.execute(params);
			},
			parseResult: function parseResult(result) {
  					this._resultsLayer = new FeatureLayer(result.value.url || result.value);

  					var myRenderer = new UniqueValueRenderer(null, function(feature) { 
    					return (feature.attributes.ToBreak.toString() + feature.attributes.FacilityID.toString());
  					});

  					myRenderer.addValue({value: this._resultsLayer.renderer.infos[0].value.toString() + this._resultsLayer.graphics[0].attributes.FacilityID.toString(), 
  										symbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0,0.5]),2),new Color([255,0,0,0.2])), 
  										label: "Maximum distance for a return trip from start (" + this._resultsLayer.renderer.infos[0].value + " km)",
  										description:""});
  					
  					myRenderer.addValue({value: this._resultsLayer.renderer.infos[1].value.toString() + this._resultsLayer.graphics[1].attributes.FacilityID.toString(), 
  										symbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([203,153,201,0.5]),2),new Color([203,153,201,0.25])), 
  										label: "Maximum distance for a one way trip from start (" + this._resultsLayer.renderer.infos[1].value + " km)",
  										description:""});
>>>>>>> .r22

<<<<<<< .mine
			this._dijitDriveTimes = new CreateDriveTimeAreas({
				map : this.map,
				inputLayer : this.map.getLayer(this.map.graphicsLayerIds[0]),
				returnFeatureCollection : true,
				portalUrl : "http://esrica-psvt.maps.arcgis.com"
=======
  					if (this._resultsLayer.graphics.length > 2)
  					{
  						myRenderer.addValue({value: this._resultsLayer.renderer.infos[0].value.toString() + this._resultsLayer.graphics[2].attributes.FacilityID.toString(), 
  										symbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255,0.5]),2),new Color([0,0,255,0.25])), 
  										label: "Maximum distance for a return trip from destination (" + this._resultsLayer.renderer.infos[0].value + " km)",
  										description:""});

  						myRenderer.addValue({value: this._resultsLayer.renderer.infos[1].value.toString() + this._resultsLayer.graphics[3].attributes.FacilityID.toString(), 
  										symbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([201,153,255,0.5]),2),new Color([201,153,255,0.25])), 
  										label: "Maximum distance for a one way trip from destination (" + this._resultsLayer.renderer.infos[1].value + " km)",
  										description:""});
  					}
  					
  					this._resultsLayer.renderer = myRenderer;

					this._resultsLayer.setInfoTemplate(new InfoTemplate("${Location}", "${FromBreak} km - ${ToBreak} km"));
					
  					this.map.addLayer(this._resultsLayer);
  					
			        if (this._legendControl==null)
			        {
			        	this._legendControl = new Legend({
			            map : this.map, 
			            autoUpdate:true,
			            respectCurrentMapScale:false,
			            layerInfos : [{
			              layer : this._resultsLayer,
			              title : "Driving Range per charge"  
			            }]
			          }, this.driveTimeLegend);
			          this._legendControl.startup();
			        }  
			        else
			        {
			        	this._legendControl.refresh([{layer : this._resultsLayer,
			              title : "Driving Range per charge"}]);
			        }
			          
			          this.emit('analysis_completed', {data:true});
				console.log(new Date().toUTCString());
			},
			runAnalysis:function(start,end,vehicleRange)
			{
				this.clear();
        		this._vehicleRange = number.parse(vehicleRange);
        		var graphic;
        		var features= [];
        		if (start != null)
        		{
        			graphic = new Graphic(start.geometry,null,{"Id":0, "Location":start.attributes.name});	
  					features.push(graphic.toJson());
        		}
        		if (end != null)
        		{
        			graphic = new Graphic(end.geometry,null,{"Id":1, "Location":end.attributes.name});
  					features.push(graphic.toJson());
        		}
  				
  				var featureSet = new FeatureSet();
  				featureSet.features = features;
>>>>>>> .r22

			}, this.driveTimeController);

			this._dijitDriveTimes.startup();

			on(this._dijitDriveTimes, "job-result", lang.hitch(this, "parseResult"));

			var params = {
				itemParams : {
					description : "Item description.",
					snippet : "A short summary about this item.",
					tags : "test, test2",
					typeKeywords : "keyword1, keyword2"
				},
				jobParams : {
					inputLayer : this.inputLayer,
					breakValues : [(this._vehicleRange / 2), this._vehicleRange],
					breakUnits : "Kilometers"
					//outputName: "{\"serviceProperties\":{\"name\":\"MyDriveTimeServiceTest\"}}"
				}
			};
			console.log(new Date().toUTCString());
			this._dijitDriveTimes.execute(params);
		},
		parseResult : function parseResult(result) {
			this._resultsLayer = new FeatureLayer(result.value.url || result.value);

			this._resultsLayer.renderer.infos[0].symbol.setColor(new Color([255, 0, 0, 0.5]));
			this._resultsLayer.renderer.infos[0].label = "Maximum distance for a return trip (" + this._resultsLayer.renderer.infos[0].value + " km)";
			this._resultsLayer.renderer.infos[1].symbol.setColor(new Color([203, 153, 201, 0.5]));
			;
			this._resultsLayer.renderer.infos[1].label = "Maximum distance for a one way trip (" + this._resultsLayer.renderer.infos[1].value + " km)";

			this._resultsLayer.setInfoTemplate(new InfoTemplate("${Location}", "${FromBreak} km - ${ToBreak} km"));

			this.map.addLayer(this._resultsLayer);

			/*if (this._legendControl == null) {
				this._legendControl = new Legend({
					map : this.map,
					autoUpdate : true,
					respectCurrentMapScale : false,
					layerInfos : [{
						layer : this._resultsLayer,
						title : "Driving Range per charge"
					}]
				}, this.driveTimeLegend);
				this._legendControl.startup();*/
			//} else {
				this._legendControl.refresh([{
					layer : this._resultsLayer,
					title : "Driving Range per charge"
				}]);
			//}
			this._tempLayer.clear();
			this.emit('analysis_completed', {
				data : true
			});
			console.log(new Date().toUTCString());
		},
		runAnalysis : function(start, end, vehicleRange) {
			this.clear();
			this._vehicleRange = number.parse(vehicleRange);
			var graphic;
			var features = [];
			var geoms = [];
			if (start != null) {
				graphic = new Graphic(start.geometry, null, {
					"Id" : 0,
					"Location" : start.attributes.name
				});
				features.push(graphic.toJson());
				geoms.push(start);
				var graphic2 = new Graphic(start.geometry, new SimpleMarkerSymbol(), null);
				this._tempLayer.add(graphic2);
			}
			if (end != null) {
				graphic = new Graphic(end.geometry, null, {
					"Id" : 1,
					"Location" : end.attributes.name
				});
				features.push(graphic.toJson());
				geoms.push(end);
			}

			var featureSet = new FeatureSet();
			featureSet.features = features;

			var layerDefinition = {
				"geometryType" : "esriGeometryPoint",
				"fields" : [{
					"name" : "Id",
					"type" : "esriFieldTypeOID",
					"alias" : "Id"
				}, {
					"name" : "Location",
					"type" : "esriFieldTypeString",
					"alias" : "Location"
				}]
			};

			var featureCollection = {
				"layerDefinition" : layerDefinition,
				"featureSet" : {
					"features" : features,
					"geometryType" : "esriGeometryPoint"
				}
			};
			//var t = '{"layerDefinition": {"geometryType": "esriGeometryPoint","fields": [{ "name": "Id", "type": "esriFieldTypeOID", "alias": "Id" }, { "name": "Name", "type": "esriFieldTypeString", "alias": "Name" } ] }, "featureSet": { "geometryType": "esriGeometryPoint", "spatialReference": { "wkid": 4326 }, "features": [ { "geometry": { "x": -104.44, "y": 34.83 }, "attributes": { "Id": 43, "Name": "Feature 1" } }, { "geometry": { "x": -100.65, "y": 33.69 }, "attributes": { "Id": 67, "Name": "Feature 2" } } ] } }';
			this.inputLayer = JSON.stringify(featureCollection);
			this.createDriveTimePolys();

			//create temporary graphics
			this.createTemporaryBuffer(geoms);
		},
		clear : function() {
			if (this._resultsLayer != null)
				this._resultsLayer.clear();
			if (this._tempLayer != null)
				this._tempLayer.clear();
		},
		createTemporaryBuffer : function(geometries) {
			/*if (this._legendControl == null) {
				this._legendControl = new Legend({
					map : this.map,
					autoUpdate : true,
					respectCurrentMapScale : false,
					layerInfos : [{
						layer : this._tempLayer,
						title : "Driving Range per charge"
					}]
				}, this.driveTimeLegend);
				this._legendControl.startup();
			} else {
				this._legendControl.refresh([{
					layer : this._tempLayer,
					title : "Driving Range per charge"
				}]);
			}*/
			this.bufferCount = 0;
			this.totalBuffers = 2;
			var att = {};
			att.id=0;
			att.ToBreak = this._vehicleRange;
			att.FromBreak = this._vehicleRange/2;
			att.label = "Maximum distance for a return trip (" + this._vehicleRange + " km)";
			att.Location = geometries[0].attributes.name;
			att.type = 1;
			this.buffer(geometries[0].geometry, this._vehicleRange, att);
			att = {};
			att.id=1;
			att.ToBreak = this._vehicleRange/2;
			att.FromBreak = 0;
			att.label = "Maximum distance for a return trip (" + this._vehicleRange/2 + " km)";
			att.Location = geometries[0].attributes.name;
			att.type = 2;
			this.buffer(geometries[0].geometry, (this._vehicleRange/2), att);
			if (geometries.length > 1) {
				this.totalBuffers = 4;
				att = {};
				att.id=3;
				att.ToBreak = this._vehicleRange;
				att.FromBreak = this._vehicleRange/2;
				att.label = "Maximum distance for a return trip (" + this._vehicleRange + " km)";
				att.Location = geometries[1].attributes.name;
				att.type = 1;
				this.buffer(geometries[1].geometry, this._vehicleRange, att);
				att = {};
				att.id=4;
				att.ToBreak = this._vehicleRange/2;
				att.FromBreak = 0;
				att.label = "Maximum distance for a return trip (" + this._vehicleRange/2 + " km)";
				att.Location = geometries[1].attributes.name;
				att.type = 2;
				this.buffer(geometries[1].geometry, (this._vehicleRange/2), att);
			}

		},
		buffer : function(geometry, distance, attributes) {
			var params = new BufferParameters();
			params.distances = [distance];
			params.geodesic = false;
			params.outSpatialReference = this.map.spatialReference;
			params.unit = GeometryService.UNIT_KILOMETER;
			params.geometries = [geometry];
			esriConfig.defaults.geometryService.buffer(params, lang.hitch(this, this.showBufferOutput, attributes));
		},

		showBufferOutput : function(attributes, geometries) {
			this.bufferCount +=1;
			var geometry = geometries[0];
			var symbol;
			if (attributes.type == 1)
				symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([203, 153, 201, 0.5]), 2), new Color([203, 153, 201, 0.5]));
			if (attributes.type == 2)
				symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0, 0.5]), 2), new Color([255, 0, 0, 0.5]));
			graphic = new Graphic(geometry, symbol, attributes);
			graphic.setInfoTemplate(new InfoTemplate("${Location}", "${FromBreak} km - ${ToBreak} km"));
			//this._bufferFeatures.push(graphic.toJson());
			this._tempLayer.add(graphic);
			if (this.bufferCount==this.totalBuffers)
				this.emit('analysis_temp_completed', {
					data : true
				});
				
		},
		createLegend:function()
		{
			if (this._legendControl == null) {
						this._legendControl = new Legend({
							map : this.map,
							autoUpdate : true,
							respectCurrentMapScale : false,
							layerInfos : [{
								layer : this._tempLayer,
								title : "Driving Range per charge"
							}]
						}, this.driveTimeLegend);
						this._legendControl.startup();
					} else {
						this._legendControl.refresh([{
							layer : this._tempLayer,
							title : "Driving Range per charge"
						}]);
					}
		}
	});
}); 