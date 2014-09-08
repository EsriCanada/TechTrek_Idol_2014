    require([
        "dojo/ready", 
        "dojo/on",
        "dojo/_base/connect", 
        "dojo/dom",
        "dijit/registry",
        "dojo/dom-construct",
        "dojo/parser", 
        "dijit/layout/BorderContainer", 
        "dijit/layout/ContentPane",
		"dijit/TitlePane",
        "esri/map",
        "esri/arcgis/utils",
        "esri/domUtils",
        "esri/dijit/Popup",
		"esri/dijit/PopupTemplate",
		"esri/dijit/HomeButton",
		"esri/dijit/BasemapGallery",
		"esri/dijit/LocateButton",
		"esri/dijit/Geocoder",
		"dojo/fx",
        "dojo/_base/fx",
		"dojo/_base/window",
		"dojo/domReady!"
    ], function(
        ready, 
        on, 
        connect,
        dom,
        registry,
        domConstruct,
        parser, 
        BorderContainer, 
        ContentPane,
		TitlePane,
        Map,
        arcgisUtils,
        domUtils,
        Popup,
		PopupTemplate,
		HomeButton,
		BasemapGallery,
		LocateButton,
		Geocoder,
		coreFx,
        baseFx,
		win
    ) {
        ready(function(){

            parser.parse();
			
			var currentMap, previousMap, home, basemapGallery2, geoLocate, geocode, resizeHandle, counter = -1, webmaps = [
            "e67b38315a4845219595e0442e42198d", // world news
            "27bfa107fb8c416995b902fde1ee4f3b", // top stories
            "48627105dd7a4f0e82b029195390ffe2", // canada news
            "2ea8cc95f4f04b1f8f92098ad1b72d5c" // sports news
          ];
		  on(dom.byId("radio"), "click" ,player);
          on(dom.byId("show_next"), "click", nextMap);
          loadNext();
		  function player(){
		  dom.byId("cbc").src="http://player.staging.streamtheworld.com/_players/cbcradioreskin/?callsign=CBC_R1_TOR"
		  dom.byId("cbc").width="510"
		  dom.byId("cbc").height="270"}

            //setup event handlers for the next/previous buttons
            on(dom.byId("previous"), "click", selectPrevious);
            on(dom.byId("next"), "click", selectNext);
			on(dom.byId("zoom"), "click", zoomTo);
			
			function loadNext(map) {
            //create the content pane for the map
            var mapPane = new ContentPane({
              "content": "",
              "id": "map" + (++counter),
              "region": "center"
            }, domConstruct.create("div"));
		
            //add the newly constructed content pane to the page 
            registry.byId("map").addChild(mapPane);
			
            var deferred;
            if( map && map.hasOwnProperty("extent") ){
              deferred = arcgisUtils.createMap((webmaps[counter % webmaps.length]),mapPane.domNode.id,{
                mapOptions: {extent: map.extent,slider: true,nav:false,showAttribution:false,fadeOnZoom:true,center: [0, 0],
          zoom: 2}});
			

            } else {
              deferred = arcgisUtils.createMap((webmaps[counter % webmaps.length]), mapPane.domNode.id,{
                mapOptions: {slider: true,nav:false,showAttribution:false,fadeOnZoom:true,center: [0, 0],
          zoom: 2}});
			

            }
			
            deferred.then(function(response){
              dom.byId("current_map").innerHTML = response.itemInfo.item.title;
			  
			  setupMap(response.map);
              fadeMap(response.map);
			  
            });
			
		}	
			
          function fadeMap(map){
            currentMap = map;
			
            //set the popup's popupWindow property to false. This prevents the popup from displaying
            map.infoWindow.set("popupWindow", false);
			
            initializeSidebar(currentMap);
			
            if ( currentMap.loaded ) {
			
              if ( previousMap ) {
                // References:
                // http://dojotoolkit.org/documentation/tutorials/1.6/effects/
                // http://dojotoolkit.org/documentation/tutorials/1.6/animation/
                var combinedAnim = coreFx.combine([
                  baseFx.fadeIn({ 
                    node: currentMap.container, 
                    duration: 1000
                  }),
                  baseFx.fadeOut({ 
                    node: previousMap.container,
                    duration: 1000, 
                    onEnd: removePrevious 
                  })
                ]);
                combinedAnim.play();
				
              } else {
                baseFx.fadeIn({ node: currentMap.container }).play();
              }
			  
            } else {
              // handle map onLoad from webmap
              map.on("load", function(){
                fadeMap(map);
				
              });
            }
          }

          function removePrevious() {
            previousMap.destroy();
            domConstruct.destroy(previousMap.container);
			
          }
		
          function nextMap(){
			
			home.destroyRecursive();
			geoLocate.destroyRecursive();
			basemapGallery2.destroyRecursive();
			geocoder.destroyRecursive();
			
			var homeb = domConstruct.create("div", {id: "HomeButton1"}, "map");	
			var LocateB = domConstruct.create("div", {id: "LocateButton1"}, "map");
			var basemapG = domConstruct.create("div", {id: "basemapGallery1"}, "basemap");
			var geocodeG = domConstruct.create("div", {id: "geocode1"}, "map");
			
            if( currentMap ){
              previousMap = currentMap;
			  
              loadNext(currentMap);
			  
                //dom.byId replaces dojo.byId
                dom.byId("featureCount").innerHTML = "Click to select a CBC News Story";
                //registry.byId replaces dijit.byId
				registry.byId("leftPane").set("content", "");
				domUtils.hide(dom.byId("pager"));
				domUtils.hide(dom.byId("pager2"));
				
			}
          }

			function setupMap(map){

			 home = new HomeButton({
				map: map
				}, "HomeButton1");
			home.startup();
				
			 geoLocate = new LocateButton({
				map: map
				}, "LocateButton1");
			geoLocate.startup();
			
			 basemapGallery2 = new BasemapGallery({
				showArcGISBasemaps: true,
				map: map
			}, "basemapGallery1");
			basemapGallery2.startup();
			
			geocoder = new Geocoder({ 
			arcgisGeocoder: {placeholder: "Find a place"}, 
            autoComplete: true,
            map: map 
			}, "geocode1");
			geocoder.startup();

			}
            function initializeSidebar(map){
                var popup = map.infoWindow;
				
                //when the selection changes update the side panel to display the popup info for the 
                //currently selected feature. 
                connect.connect(popup, "onSelectionChange", function(){
                    displayPopupContent(popup.getSelectedFeature());
                });

                //when the selection is cleared remove the popup content from the side panel. 
                connect.connect(popup, "onClearFeatures", function(){
                    //dom.byId replaces dojo.byId
                    dom.byId("featureCount").innerHTML = "Click to select a CBC News Story";
                    //registry.byId replaces dijit.byId
                    registry.byId("leftPane").set("content", "");
                    domUtils.hide(dom.byId("pager"));
					domUtils.hide(dom.byId("pager2"));
                });

                //When features are associated with the  map's info window update the sidebar with the new content. 
                connect.connect(popup, "onSetFeatures", function(){
                    displayPopupContent(popup.getSelectedFeature());
                    dom.byId("featureCount").innerHTML = popup.features.length + " CBC news stories";

                    //enable navigation if more than one feature is selected 
                    popup.features.length > 1 ? domUtils.show(dom.byId("pager")) : domUtils.hide(dom.byId("pager"));
					popup.features.length > 0 ? domUtils.show(dom.byId("pager2")) : domUtils.hide(dom.byId("pager2"));
                });
				
				
            }

            function displayPopupContent(feature){
                if(feature){
                    var content = feature.getContent();
                    registry.byId("leftPane").set("content", content);
                }
            }

            function selectPrevious(){
                currentMap.infoWindow.selectPrevious();
				var loc1 = currentMap.infoWindow.getSelectedFeature().geometry;
				currentMap.centerAt(loc1);
            }

            function selectNext(){
                currentMap.infoWindow.selectNext();
				var loc2 = currentMap.infoWindow.getSelectedFeature().geometry;
				currentMap.centerAt(loc2);
            }
			function zoomTo(){
            var loc = currentMap.infoWindow.getSelectedFeature().geometry;
                currentMap.centerAndZoom(loc, 9);
            }
			
		});
		
    });