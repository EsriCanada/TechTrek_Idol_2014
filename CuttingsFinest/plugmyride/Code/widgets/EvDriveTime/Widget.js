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
		'dojo/Deferred',
		'jimu/BaseWidget',
		'esri/dijit/analysis/CreateDriveTimeAreas',
		"esri/dijit/HomeButton",
		"esri/dijit/BasemapGallery",
		'dojo/on',
		'dojo/_base/lang',
		'dojo/_base/array',
		'esri/geometry/Point',
		"esri/layers/FeatureLayer",
		"esri/graphic",
		"esri/symbols/SimpleMarkerSymbol",
		"esri/SpatialReference",
		"esri/tasks/FeatureSet"
	],
	function(declare, Deferred, BaseWidget, CreateDriveTimeAreas, HomeButton, BasemapGallery, on, lang, array, Point, FeatureLayer, Graphic, SimpleMarkerSymbol, SpatialReference, FeatureSet) {
		return declare([BaseWidget], {
			_dijitDriveTimes:null,

			postCreate: function() {
				
				this.inherited(arguments);
				this.preProcessConfig();

				var pt = new Point(-118.15, 33.80, new SpatialReference({ wkid: 4326 }));
				var attr = {"TAG":"Joe Smith"};
				var graphic = new Graphic(pt, null, attr);

        		var featureLayer = this.map.getLayer(this.map.graphicsLayerIds[0]);
        		featureLayer.applyEdits([graphic], null, featureLayer.graphics);
				
				this._dijitDriveTimes = new CreateDriveTimeAreas({
					map: this.map,
					inputLayer: this.map.getLayer(this.map.graphicsLayerIds[0]),
					returnFeatureCollection: true,
					portalUrl: "http://esrica-psvt.maps.arcgis.com"
				
				}, this.driveTimeController);

				this._dijitDriveTimes.startup();

				this._dijitDriveTimes.on("job-result", parseResult);

				function parseResult(result) {
  					var resultLayer = new FeatureLayer(result.value.url || result.value);
  					this.map.addLayer(resultLayer);
				};

				var features= [];
  				features.push(graphic);
  				var featureSet = new FeatureSet();
  				featureSet.features = features;

  				var layerDefinition = {"geometryType": "esriGeometryPoint"};

				var featureCollection = {
          			"layerDefinition": layerDefinition,
          			"featureSet": {
            			"features": features,    
            			"geometryType": "esriGeometryPoint"
          			}
        		};
				
				var params = {
  					itemParams: {
    					description: "Item description.",
    					snippet: "A short summary about this item.",
    					tags: "test, test2",
    					typeKeywords: "keyword1, keyword2"
  					},
  					jobParams: {
  						inputLayer: JSON.stringify({"url": this.map.getLayer(this.map.graphicsLayerIds[0]).url}),
  						breakValues: [5.0, 10.0],
  						breakUnits: "Kilometers"
    					//outputName: "{\"serviceProperties\":{\"name\":\"MyDriveTimeServiceTest\"}}"
  					}
				};

				this._dijitDriveTimes.execute(params);
			},

			preProcessConfig:function(){
				//console.log(this.map.getLayer(this.map.graphicsLayerIds[0]));
			
			}			
		});
	});