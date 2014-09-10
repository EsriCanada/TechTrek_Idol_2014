// @formatter:off
require(
	[
  "esri/map",
  "esri/geometry/Point",
  "esri/SpatialReference",
  "dojo/ready", 
  "dojo/parser", 
  "dojo/on", 
  "js/sunrisesunset", 
  "dijit/layout/ContentPane", 
  "dijit/layout/LayoutContainer", 
  "dijit/layout/BorderContainer", 
  "esri/layers/FeatureLayer", 
  "esri/lang", "esri/graphic", "esri/symbols/SimpleMarkerSymbol",
  "dojo/html", "dojo/number"

  	], 

  function(
    Map, Point, SpatialReference,
    ready, parser, on, sunrisesunset,
    ContentPane, LayoutContainer, BorderContainer, 
    FeatureLayer, esriLang, Graphic, SimpleMarkerSymbol, html, number
    ) {
// @formatter:on

  // Wait until DOM is ready *and* all outstanding require() calls have been resolved
  ready(function() {

    // Parse DOM nodes decorated with the data-dojo-type attribute
    parser.parse();
    

    // Create the map
    map = new Map("LaCarte", {
      basemap : "satellite",
      center : [2, 48],
      zoom : 4,
    });
    
    var coucheVilles = new FeatureLayer("http://services.arcgis.com/pGoeHmYZOCXOU5IQ/arcgis/rest/services/CitiesOfTheWorld/FeatureServer/0", 
    {mode: FeatureLayer.MODE_SNAPSHOT,
	 outFields: ["Country", "Population", "City", "CoordX", "CoordY", "ZONE_"]
     });
     
    map.addLayer(coucheVilles);
    
    //Initialize the object
    var ephemeridesObj = new sunrisesunset( 48.8819970629341, -2.43299734457971, 1, 09, 09,2014);
    //console.log("qc=" + ephemeridesObj.Lever())
    //console.log("qc=" + ephemeridesObj.Coucher())
	
	function closeDialog(){
		map.graphics.clear();
	};
	
	
	map.on("load", function(){
		 map.graphics.enableMouseEvents(); //load mouse event on graphic layer.
		 map.graphics.on("mouse-out", closeDialog);

		});
	
	//Highlight point symbole on mouse over
	var highlightSymbol = new SimpleMarkerSymbol({
  		"color": [255,255,255,64],
  		"size": 14,
  		"angle": -30,
  		"xoffset": 0,
  		"yoffset": 0,
  		"type": "esriSMS",
  		"style": "esriSMSCircle",
  		"outline": {
    	"color": [0,255,0,255],
    	"width": 2,
    	"type": "esriSLS",
    	"style": "esriSLSSolid"}
    	});

	
		
	coucheVilles.on("mouse-over", function(evt){
          //Prepare variables for ephemeride object. 
          var latitude = esriLang.substitute(evt.graphic.attributes,"${CoordY}"); 
          var longitude = esriLang.substitute(evt.graphic.attributes,"${CoordX}");
          var fuseauHoraire  = esriLang.substitute(evt.graphic.attributes,"${ZONE_}");
          
          var t = "Country: ${Country}<br>"
          	+"City: ${City}<br>"
          	+"Pop: ${Population:NumberFormat} habs.<br>"
            +"Latitude: ${CoordY}<br>"
            +"Longitude: ${CoordX}<br>"
            +"Time zone: ${ZONE_}";
  
          var content = esriLang.substitute(evt.graphic.attributes,t);
          var highlightGraphic = new Graphic(evt.graphic.geometry,highlightSymbol);
          map.graphics.add(highlightGraphic);
  		  
  		  //Set ephemerides object infos
  		  ephemeridesObj.latitude = parseFloat(latitude);
  		  ephemeridesObj.longitude = parseFloat(longitude); //Mettre le -1 dans l'objet ephemeride
          ephemeridesObj.Decalage = parseInt(fuseauHoraire);
          
  		  //Set infos of the city
  		  html.set(dojo.byId("infosVilles"), content);
  		  //Set infos of ephemerides
  		  html.set(dojo.byId("infosEphemerides"), "Sunrise: " + ephemeridesObj.Conversion_DecJour_Heure(ephemeridesObj.Lever()) + "<br>Sunset: " + ephemeridesObj.Conversion_DecJour_Heure(ephemeridesObj.Coucher()) +"<br>daytime: "+ ephemeridesObj.DureeJour() ); 

          
		  /*console.log("lat =" + ephemeridesObj.latitude);
		  console.log("long =" + ephemeridesObj.longitude);
		  console.log("fuseau =" + ephemeridesObj.Decalage);
		  console.log(ephemeridesObj.Lever());
		  console.log(ephemeridesObj.Coucher());
			
          //dialog.setContent(content);

          //domStyle.set(dialog.domNode, "opacity", 0.85);
          //dijitPopup.open({
          //  popup: dialog, 
          //  x: evt.pageX,
          //  y: evt.pageY
          //});
        });
	
	
	
	map.on("click", function(evt){
		//map.graphics.clear();
		console.log("Lat:" + evt.mapPoint.getLatitude());
		console.log("Long:" + evt.mapPoint.getLongitude());
		ephemeridesObj.latitude = evt.mapPoint.getLatitude();
		ephemeridesObj.longitude = evt.mapPoint.getLongitude();
		console.log(ephemeridesObj.longitude);
		console.log(ephemeridesObj.Lever());
		console.log(ephemeridesObj.Coucher());
		*/
		
	});   

  });
});
