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
		"esri/tasks/BufferParameters",
		"esri/tasks/GeometryService",
		"esri/tasks/ProjectParameters",
		"esri/InfoTemplate",
		"dojo/text!./template/template.html"
	],
	function(declare, Deferred, Evented, _WidgetBase,_TemplatedMixin,_WidgetsInTemplateMixin,ContentPane, CreateDriveTimeAreas, HomeButton, BasemapGallery, Legend, on, lang, array, number,domConstruct, 
		Point,FeatureLayer, Graphic, UniqueValueRenderer, SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, Color, SpatialReference, FeatureSet,BufferParameters,GeometryService,ProjectParameters,InfoTemplate, template) {
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
				
				//var layerDefinition = {"geometryType": "esriGeometryPoint","fields": [{ "name": "Id", "type": "esriFieldTypeOID", "alias": "Id" }] };

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
						"name" : "FacilityOID",
						"type" : "esriFieldTypeInt",
						"alias" : "Location"
					}]
				};
	
				var featureCollection = {
					"layerDefinition" : layerDefinition,
					"featureSet" : {
						"features" :[],
						"geometryType" : "esriGeometryPoint"
					}
				};
				
        		this._tempLayer =new FeatureLayer(featureCollection);
				//this._tempLayer.setRenderer(renderer);
				//this._tempLayer.setInfoTemplate(new InfoTemplate("${Location}", "${FromBreak} km - ${ToBreak} km"));
				this._tempLayer.setOpacity(.5);
				this.map.addLayer(this._tempLayer);
			
			},
			createDriveTimePolys:function()
			{
				
				this._dijitDriveTimes = new CreateDriveTimeAreas({
					map: this.map,
					inputLayer: this.map.getLayer(this.map.graphicsLayerIds[0]),
					returnFeatureCollection: true,
					portalUrl: "http://esrica-psvt.maps.arcgis.com"
				
				}, this.driveTimeController);

				this._dijitDriveTimes.startup();

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
    					return (feature.attributes.ToBreak.toString() + feature.attributes.FacilityOID.toString());
  					});

  					myRenderer.addValue({value: this._resultsLayer.renderer.infos[0].value.toString() + this._resultsLayer.graphics[0].attributes.FacilityOID.toString(), 
  										symbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0,0.5]),2),new Color([255,0,0,0.2])), 
  										label: "Maximum distance for a return trip from start (" + this._resultsLayer.renderer.infos[0].value + " km)",
  										description:""});
  					
  					myRenderer.addValue({value: this._resultsLayer.renderer.infos[1].value.toString() + this._resultsLayer.graphics[1].attributes.FacilityOID.toString(), 
  										symbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([203,153,201,0.5]),2),new Color([203,153,201,0.25])), 
  										label: "Maximum distance for a one way trip from start (" + this._resultsLayer.renderer.infos[1].value + " km)",
  										description:""});

  					if (this._resultsLayer.graphics.length > 2)
  					{
  						myRenderer.addValue({value: this._resultsLayer.renderer.infos[0].value.toString() + this._resultsLayer.graphics[2].attributes.FacilityOID.toString(), 
  										symbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255,0.5]),2),new Color([0,0,255,0.25])), 
  										label: "Maximum distance for a return trip from destination (" + this._resultsLayer.renderer.infos[0].value + " km)",
  										description:""});

  						myRenderer.addValue({value: this._resultsLayer.renderer.infos[1].value.toString() + this._resultsLayer.graphics[3].attributes.FacilityOID.toString(), 
  										symbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([201,153,255,0.5]),2),new Color([201,153,255,0.25])), 
  										label: "Maximum distance for a one way trip from destination (" + this._resultsLayer.renderer.infos[1].value + " km)",
  										description:""});
  					}
  					//this._resultsLayer.renderer =myRenderer;
  					this._resultsLayer.renderer = this.createRenderer(this._resultsLayer.graphics);

					this._resultsLayer.setInfoTemplate(new InfoTemplate("${Location}", "${FromBreak} km - ${ToBreak} km ${FacilityOID}"));
					
  					this.map.addLayer(this._resultsLayer);
  					
			        /*if (this._legendControl==null)
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
			        }*/
					this._tempLayer.clear(); 
					this.createLegend(this._resultsLayer);
			        this.emit('analysis_completed', {data:true});
					console.log(new Date().toUTCString());
			},
			runAnalysis:function(start,end,vehicleRange)
			{
				this.clear();
        		this._vehicleRange = number.parse(vehicleRange);
        		var graphic;
        		var features= [];
        		var geoms = [];
        		if (start != null)
        		{
        			graphic = new Graphic(start.geometry,null,{"Id":0, "Location":start.attributes.name});	
  					features.push(graphic.toJson());
  					geoms.push(start);
        		}
        		if (end != null)
        		{
        			graphic = new Graphic(end.geometry,null,{"Id":1, "Location":end.attributes.name});
  					features.push(graphic.toJson());
  					geoms.push(end);
        		}
  				
  				var featureSet = new FeatureSet();
  				featureSet.features = features;

  				var layerDefinition = {"geometryType": "esriGeometryPoint","fields": [{ "name": "Id", "type": "esriFieldTypeOID", "alias": "Id" },{"name": "Location", "type": "esriFieldTypeString", "alias": "Location" }] };

				var featureCollection = {
          			"layerDefinition": layerDefinition,
          			"featureSet": {
            			"features": features,
            			"geometryType": "esriGeometryPoint"
          			}
        		};
        		//var t = '{"layerDefinition": {"geometryType": "esriGeometryPoint","fields": [{ "name": "Id", "type": "esriFieldTypeOID", "alias": "Id" }, { "name": "Name", "type": "esriFieldTypeString", "alias": "Name" } ] }, "featureSet": { "geometryType": "esriGeometryPoint", "spatialReference": { "wkid": 4326 }, "features": [ { "geometry": { "x": -104.44, "y": 34.83 }, "attributes": { "Id": 43, "Name": "Feature 1" } }, { "geometry": { "x": -100.65, "y": 33.69 }, "attributes": { "Id": 67, "Name": "Feature 2" } } ] } }';
        		this.inputLayer = JSON.stringify(featureCollection);
				this.createDriveTimePolys();
				
				//create temporary graphics
				this.createTemporaryBuffer(geoms);
			},
			clear:function()
			{
				if (this._resultsLayer!= null)
					this._resultsLayer.clear();
				this._bufferFeatures =[];
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
			att.FacilityOID = 1;
			this.buffer(geometries[0].geometry, this._vehicleRange, att);
			att = {};
			att.id=1;
			att.ToBreak = this._vehicleRange/2;
			att.FromBreak = 0;
			att.label = "Maximum distance for a return trip (" + this._vehicleRange/2 + " km)";
			att.Location = geometries[0].attributes.name;
			att.FacilityOID = 1;
			this.buffer(geometries[0].geometry, (this._vehicleRange/2), att);
			if (geometries.length > 1) {
				this.totalBuffers = 4;
				att = {};
				att.id=3;
				att.ToBreak = this._vehicleRange;
				att.FromBreak = this._vehicleRange/2;
				att.label = "Maximum distance for a return trip (" + this._vehicleRange + " km)";
				att.Location = geometries[1].attributes.name;
				att.FacilityOID = 2;
				this.buffer(geometries[1].geometry, this._vehicleRange, att);
				att = {};
				att.id=4;
				att.ToBreak = this._vehicleRange/2;
				att.FromBreak = 0;
				att.label = "Maximum distance for a return trip (" + this._vehicleRange/2 + " km)";
				att.Location = geometries[1].attributes.name;
				att.FacilityOID = 2;
				this.buffer(geometries[1].geometry, (this._vehicleRange/2), att);
			}

		},
		buffer : function(geometry, distance, attributes) {
			var params = new BufferParameters();
			params.distances = [distance];
			params.geodesic = true;
			params.bufferSpatialReference = new SpatialReference({wkid: 4326});
			params.outSpatialReference = this.map.spatialReference;
			params.unit = GeometryService.UNIT_KILOMETER;
			params.geometries = [geometry];
			esriConfig.defaults.geometryService.buffer(params, lang.hitch(this, this.showBufferOutput, attributes));
		},
		showBufferOutput : function(attributes, geometries) {
			this.bufferCount +=1;
			var geometry = geometries[0];
			var symbol;
			graphic = new Graphic(geometry, null, attributes);
			graphic.setInfoTemplate(new InfoTemplate("${Location}", "${FromBreak} km - ${ToBreak} km"));
			this._tempLayer.add(graphic);
			if (this.bufferCount==this.totalBuffers)
			{
				this._tempLayer.setRenderer(this.createRenderer(this._tempLayer.graphics));
				this._tempLayer.refresh();
				//this._tempLayer.redraw();
				this.createLegend(this._tempLayer);
				this.emit('analysis_temp_completed', {
					data : true
				});
			}			
		},
		createLegend:function(layer)
		{
			if (this._legendControl == null) {
				this._legendControl = new Legend({
					map : this.map,
					autoUpdate : true,
					respectCurrentMapScale : false,
					layerInfos : [{
						layer : layer,
						title : "Driving Range per charge"
					},{
						layer : this.map.getLayer(this.map.graphicsLayerIds[0]),
						title : "Charging Stations by number of bays"
					}
					]
				}, this.driveTimeLegend);
				this._legendControl.startup();
			} else {
				this._legendControl.refresh([{
					layer : layer,
					title : "Driving Range per charge"
				},{
						layer : this.map.getLayer(this.map.graphicsLayerIds[0]),
						title : "Charging Stations by number of bays"
					}]);
			}
		},
		createRenderer:function(features)
		{
			//redorder the items
			var obj1 = [];
			var obj2 = [];
			
			for (var i = 0; i < features.length; i++) 
			{
				if (features[i].attributes.FacilityOID.toString() =="1")
				{
					if (obj1.length == 0)
						obj1.push(features[i]);
					else
					{
						if (obj1[0].attributes.ToBreak < features[i].attributes.ToBreak)
							obj1.push(features[i]);
						else
							obj1.unshift(features[i]);
					}
				}
				else
				{
					if (obj2.length == 0)
						obj2.push(features[i]);
					else
					{
						if (obj2[0].attributes.ToBreak < features[i].attributes.ToBreak)
							obj2.push(features[i]);
						else
							obj2.unshift(features[i]);
					}
					
				}
			}
			
			var graphics = obj1.concat(obj2);
			
			// create a unique value renderer
			var myRenderer = new UniqueValueRenderer(null, function(feature) { 
    					return (feature.attributes.ToBreak.toString() +","+ feature.attributes.FacilityOID.toString());
  					});

  			
  			myRenderer.addValue({
	  					value: graphics[0].attributes.ToBreak.toString()+","+ graphics[0].attributes.FacilityOID.toString(), 
	  					symbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0,0.5]),2),new Color([255,0,0,0.25])), 
	  					label: "Maximum distance for a return trip from start (" + graphics[0].attributes.ToBreak.toString() + " km)",
	  					description:""
	  				});
  					
  					myRenderer.addValue({value: graphics[1].attributes.ToBreak.toString() +","+ graphics[1].attributes.FacilityOID.toString(), 
  										symbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([203,153,201,0.5]),2),new Color([203,153,201,0.25])), 
  										label: "Maximum distance for a one way trip from start (" + graphics[1].attributes.ToBreak.toString() + " km)",
  										description:""});
  										
  				if (graphics.length > 2)
  					{
  						myRenderer.addValue({
  							value: graphics[2].attributes.ToBreak.toString()  +","+ graphics[2].attributes.FacilityOID.toString(), 
  							symbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255,0.5]),2),new Color([0,0,255,0.25])), 
  							label: "Maximum distance for a return trip from destination (" +graphics[2].attributes.ToBreak.toString() + " km)",
  							description:""});

  						myRenderer.addValue({
  							value: graphics[3].attributes.ToBreak.toString() +","+ graphics[3].attributes.FacilityOID.toString(), 
  							symbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([201,153,255,0.5]),2),new Color([201,153,255,0.25])), 
  							label: "Maximum distance for a one way trip from destination (" + graphics[3].attributes.ToBreak.toString() + " km)",
  							description:""});
  					}		
  					
			return myRenderer;
		}
		
					
		});
	});