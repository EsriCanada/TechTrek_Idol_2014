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
  "dojo/html", "dojo/number", 
  "js/coordinatesTools", "dojox/charting/Chart",
    "dojox/charting/plot2d/Pie",
    "dojox/charting/action2d/Tooltip",
    "dojox/charting/action2d/MoveSlice",
    "js/ephemeridesTheme"								//**********************************************


  	], 

  function(
    Map, Point, SpatialReference,
    ready, parser, on, sunrisesunset,
    ContentPane, LayoutContainer, BorderContainer, 
    FeatureLayer, esriLang, Graphic, SimpleMarkerSymbol, html, number, coordinatesTools, Chart, Pie, Tooltip, MoveSlice, theme
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
    
    //Get the date 
    var newDate = new Date();
    
    
    //Initialize the object
    var ephemeridesObj = new sunrisesunset( 48.8819970629341, -2.43299734457971, 1, newDate.getDate() , newDate.getMonth() + 1,newDate.getFullYear());
    //console.log("qc=" + ephemeridesObj.Lever())
    //console.log("qc=" + ephemeridesObj.Coucher())
	
	//Clear graphic when mouse out.
	function closeDialog(){
		map.graphics.clear();
	};
	
	//Define Pie Chart
	var pieChart = new Chart('pieChartGraph');
	pieChart.setTheme(theme);
	
	map.on("load", function(){
		 map.graphics.enableMouseEvents(); //load mouse event on graphic layer.
		 map.graphics.on("mouse-out", closeDialog);
		  //Add Pie chart to maps.		  
		  pieChart.addPlot("default", {
       		type: Pie,
        	markers: true,
        	radius:60
    		});
    	 // Create the tooltip
    	   var tip = new Tooltip(pieChart,"default");
 	    // Create the slice mover
    	   var mag = new MoveSlice(pieChart,"default");

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
    	"color": [255,171,38,255],
    	"width": 2,
    	"type": "esriSLS",
    	"style": "esriSLSSolid"}
    	});

	
		
	coucheVilles.on("mouse-over", function(evt){
          //Prepare variables for ephemeride object. 
          var latitude = esriLang.substitute(evt.graphic.attributes,"${CoordY}"); 
          var longitude = esriLang.substitute(evt.graphic.attributes,"${CoordX}");
          var fuseauHoraire  = esriLang.substitute(evt.graphic.attributes,"${ZONE_}");
          var city = esriLang.substitute(evt.graphic.attributes,"${City}");
          var country = esriLang.substitute(evt.graphic.attributes,"${Country}");
          var population = esriLang.substitute(evt.graphic.attributes,"${Population:NumberFormat}");
          var timeZone = esriLang.substitute(evt.graphic.attributes,"${ZONE_}");
          
          var highlightGraphic = new Graphic(evt.graphic.geometry,highlightSymbol);
          map.graphics.add(highlightGraphic);
  		  
  		  //Set ephemerides object infos
  		  ephemeridesObj.latitude = parseFloat(latitude);
  		  ephemeridesObj.longitude = parseFloat(longitude); 
          ephemeridesObj.Decalage = parseInt(fuseauHoraire);
          
    	  //Add formated latitude and longitude and others to content
  		  var content = "Country: " +  country + "<br>City: " + city + "<br>Population: " + population +
  		  " Habs.<br>Time Zone: " + timeZone + "<br>Latitude: "+ coordinatesTools.DDtoDMStoTXT(latitude) + "<br>Longitude: " + coordinatesTools.DDtoDMStoTXT(longitude); 
          
          //Get day time and night time
          var dayTime = ephemeridesObj.DureeJour();
		  var nightTime = 1-dayTime;
                   
  		  //Set infos of the city
  		  html.set(dojo.byId("infosVilles"), content);
  		  //Set infos of ephemerides
  		  html.set(dojo.byId("infosEphemerides"), "Sunrise: " + ephemeridesObj.Conversion_DecJour_Heure(ephemeridesObj.Lever()) + "<br>Sunset: " + ephemeridesObj.Conversion_DecJour_Heure(ephemeridesObj.Coucher()) +"<br>Daytime: " + ephemeridesObj.Conversion_DecJour_Heure(ephemeridesObj.DureeJour())+
  		  "<br>Nigthtime: " + ephemeridesObj.Conversion_DecJour_Heure(ephemeridesObj.DureeNuit())); 
		  
	  
    	  //pieChart add data
    	  pieChart.addSeries("Day and Night time",[{y: dayTime, text: "Day",   stroke: "white", tooltip: Math.round(dayTime*100) + "% of the day"},
    	  {y: nightTime, text: "Night",   stroke: "white", tooltip: Math.round(nightTime*100) + "% of the day"}]);
    		pieChart.render();
    		//Set background transparent
    		pieChart.surface.rawNode.childNodes[1].setAttribute('fill-opacity','0');
			pieChart.surface.rawNode.childNodes[2].setAttribute('stroke-opacity','0');
			pieChart.surface.rawNode.childNodes[3].setAttribute('fill-opacity','0');
		  /*
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
