


var mapMain;

// @formatter:off
require([
  "esri/map",
  "esri/graphic",
  "esri/dijit/Geocoder",
  "esri/tasks/locator",

  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/TextSymbol",
  "esri/symbols/Font",

  "dojo/_base/Color",
  "dojo/_base/array",

  "dojo/dom",
  "dojo/on",
  "dojo/parser",
  "dojo/ready",
  "dijit/form/DateTextBox",


  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane"],
  function(
    Map, Graphic, Geocoder, Locator,
    SimpleMarkerSymbol, TextSymbol, Font,
    Color, array,
    dom, on, parser, ready,
    BorderContainer, ContentPane
    ) {
// @formatter:on
  dojo.query(".xspInputFieldDateTimePicker .dijitTextBox").style({
  width:"100px",
  height:"24px"
});
  // Wait until DOM is ready *and* all outstanding require() calls have been resolved
  ready(function() {

    var taskLocator;

    // Parse DOM nodes decorated with the data-dojo-type attribute
    parser.parse();

    // Create the map
    mapMain = new Map("cpCenter", {
      basemap : "topo",
      center : [-79.38, 43.65],
      zoom : 13
    });




    // Locator

    taskLocator = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");


    //  Locate button's onclick event handler
	
    on(dom.byId("btnLocate"), "click", makeCityList);
	
	// Get weather's on cclick even handler
	
	//on(dom.byId("btnWeather"), "click", logArrayElements);
	// $(document).ready(function() {
			
				
		// var city1 = [document.getElementById("taAddress").value]
		// var city2 = [document.getElementById("taAddress2").value]
		
		// var url1 = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + city1 +'&mode=json&units=metric&cnt=16';
			
			// $.getJSON(url1,function(Result1){
				// l = Result1.list;						
				// l.forEach(logArrayElements1);
			// });	
			
		// var day1 = 0;
				
		// function logArrayElements1(element, index, array) {					
			// if (index == day1) {document.getElementById("FirstdayDiv").innerHTML = "Day Temp = " + element.temp.day}
		// }
		
		// var url2 = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + city2 +'&mode=json&units=metric&cnt=16';
			
			// $.getJSON(url2,function(Result2){
				// l = Result2.list;						
				// l.forEach(logArrayElements2);
			// });	
			
		// var day2 = 1;
				
		// function logArrayElements2(element, index, array) {					
			// if (index == day2) {document.getElementById("SeconddayDiv").innerHTML = "Day Temp = " + element.temp.day}
		// }
			
	// });
		

    //  Wire the task's completion event handler

    taskLocator.on("address-to-locations-complete", showResults)


    function doAddressToLocations(singlePlace) {
      console.log(singlePlace);
      //  Locator input parameters
      var objAddress = {
        "SingleLine" : singlePlace
        // "SingleLine" : dom.byId("taAddress").value
        }
      var params = {
        address : objAddress,
        outFields : ["Loc_name"]
        }

      taskLocator.addressToLocations(params);

    }

    function showResults(candidates) {
      // Define the symbology used to display the results
      var symbolMarker = new SimpleMarkerSymbol();
      symbolMarker.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
      symbolMarker.setColor(new Color("#6699FF"));
      var font = new Font("14pt", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, "Halvetica");

      // loop through the array of AddressCandidate objects
      var geometryLocation;
      array.every(candidates.addresses, function(candidate) {

        // if the candidate was a good match
        if (candidate.score > 80) {

          // retrieve attribute info from the candidate
          var attributesCandidate = {
            address : candidate.address,
            score : candidate.score,
            locatorName : candidate.attributes.Loc_name
          };


            // Retrieve the result's geometry

          geometryLocation = candidate.location;


          //  Display the geocoded location on the map

          var graphicResult = new Graphic(geometryLocation, symbolMarker, attributesCandidate);
          mapMain.graphics.add(graphicResult);


          // exit the loop after displaying the first good match
          return false;
        }
      });

      // Center and zoom the map on the result
      if (geometryLocation !== undefined) {
        mapMain.centerAndZoom(geometryLocation, 10);
      }
    }

    /*
     * make a list of the cities from the Textareas
     *  and place the list results into the testing pane
     */
    function makeCityList(){
      var cities = [document.getElementById("taAddress").value,
                    document.getElementById("taAddress2").value,
                    document.getElementById("taAddress3").value,
                    document.getElementById("taAddress4").value,
                    document.getElementById("taAddress5").value];
      // testing console log
      console.log(cities);
      createArray(cities);
    }

    function makeDateList(){
      var dates = [document.getElementById("date1").value,
                    document.getElementById("date2").value,
                    document.getElementById("date3").value,
                    document.getElementById("date4").value,
                    document.getElementById("date5").value];
      // testing console log
      console.log(dates);
	  //Calculate the difference between dates in days
		var a = new Date(dates[0]);
		console.log(a);
		var d = new Date();
		console.log(d);
		//var dates1 = document.getElementById("date1").innerHTML = a.toUTCString();
		//console.log(datestring);
		var n = a.getDate(); 
		console.log(n);
		var m = d.getDate();
		var diff = Math.abs(a-d);
		console.log(diff);
		var days = (diff/86400000);
		console.log(days);
		
    }
		
    function createArray (cities) {
      // looping through the cities array
	  var count = 1;
	  
	  //console.log(daydisplay)
      for (var code = 0; code < cities.length; code++) {
         doAddressToLocations(cities[code]);
		 var daydisplay = 'Day'+ count;
		 //creating a count to see how many location have been entered
		 console.log(count);
		 console.log(daydisplay);
		 document.getElementById(daydisplay).innerHTML = cities[code];
		count+= 1;
        }
		
		var datesa = makeDateList();
		
		Weather(cities,dates);
		
		console.log(cities);
		console.log(dates);
		
      }



  });


});



// function RunApp() {
  // makeCityList();
  // makeDateList();
  // console.log("hi");
  // Weather();
  
//}

	// function WeatherDate(){
		// var d = new Date("July 18, 1983 01:15:00");
		// var n = d.getDate()
		// document.getElementById("Day2").innerHTML = n;
	// }

	function Weather (citiesarray,datesarray) {
		console.log(citiesarray);
		//console.log(datesarray);
		var a = new Date("8/1/2014");
		var d = new Date("9/2/2014");
		var n = d.getDate(); 
		console.log(n);
		var diff = Math.abs(a-d);
		var days = (diff / (1000*60*60*24));
		
		var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + cities[0] +'&mode=json&units=metric&cnt=16';
		console.log(url);	
			$.getJSON(url1,function(Result1){
				l = Result1.list;
				console.log(l);
				l.forEach(logArrayElements1);
			});
			
		var day1 = 0; 		
		function logArrayElements1(element, index, array) {					
			if (index == day1) {document.getElementById("Weath1").innerHTML = "Day Temp = " + element.temp.day}
		}
	}
	
		
		
			
		
	