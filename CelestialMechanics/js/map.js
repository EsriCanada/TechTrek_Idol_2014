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
    "js/ephemeridesTheme"							


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
      center : [0, 48],
      zoom : 3,
    });
    //Define the layer of cities
    var coucheVilles = new FeatureLayer("http://services.arcgis.com/pGoeHmYZOCXOU5IQ/arcgis/rest/services/CitiesOfTheWorld/FeatureServer/0", 
    {mode: FeatureLayer.MODE_SNAPSHOT,
	 outFields: ["Country", "Population", "City", "CoordX", "CoordY", "ZONE_"]
     });
    
    //Add cities layer 
    map.addLayer(coucheVilles);
    
    //Get the date for the ephemeridesObj
    var newDate = new Date();
    
    
    //Initialize the object
    var ephemeridesObj = new sunrisesunset( 48.8819970629341, -2.43299734457971, 1, newDate.getDate() , newDate.getMonth() + 1,newDate.getFullYear());

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
        	radius:60,
        	fontColor:"white"
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
  		  var txtSunrise = ephemeridesObj.Conversion_DecJour_Heure(ephemeridesObj.Lever());
  		  var txtSunset = ephemeridesObj.Conversion_DecJour_Heure(ephemeridesObj.Coucher());
  		  var txtDayTime = ephemeridesObj.Conversion_DecJour_Heure(ephemeridesObj.DureeJour());
  		  var txtNightTime = ephemeridesObj.Conversion_DecJour_Heure(ephemeridesObj.DureeNuit());
  		  
  		  
  		  //Set it in HTML format
  		  html.set(dojo.byId("infosEphemerides"), "Sunrise: " + txtSunrise + "<br>Sunset: " + txtSunset +"<br>Daytime: " + txtDayTime +  "<br>Nigthtime: " +  txtNightTime);  
		 
		
		  //Set City info and time info in HTML format
		  html.set(dojo.byId("cityNameAndTimeNow"), city + "<br>" +  ephemeridesObj.convertTimeFormat("h", ephemeridesObj.getTimebyTimeZone(fuseauHoraire))); 
	  	
    	  //pieChart add data
    	  pieChart.addSeries("Day and Night time",[{y: dayTime, text: "Day (" + Math.round(dayTime*100) + "%)" ,   stroke: "white", tooltip:  txtDayTime},
    	  {y: nightTime, text: "Night (" + Math.round(nightTime*100) + "%)",   stroke: "white", tooltip: txtNightTime}]);
    		pieChart.render();
    		//Set pie chart background transparent
    		pieChart.surface.rawNode.childNodes[1].setAttribute('fill-opacity','0');
			pieChart.surface.rawNode.childNodes[2].setAttribute('stroke-opacity','0');
			pieChart.surface.rawNode.childNodes[3].setAttribute('fill-opacity','0');
		
		
		var decimalTime = ephemeridesObj.decHour(ephemeridesObj.getTimebyTimeZone(fuseauHoraire));
		var dayOrNight = ephemeridesObj.dayOrNight(parseFloat(decimalTime),parseFloat(ephemeridesObj.Lever()), parseFloat(ephemeridesObj.Coucher()) )
		console.log(decimalTime + "," + ephemeridesObj.Lever()+ "," + ephemeridesObj.Coucher())
		console.log(ephemeridesObj.dayOrNight(parseFloat(decimalTime),parseFloat(ephemeridesObj.Lever()), parseFloat(ephemeridesObj.Coucher()) ))
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
