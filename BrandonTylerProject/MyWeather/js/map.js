var mapMain;
var RunApp;
var xValues = new Array
var yValues = new Array
var min_x
var min_y
var max_x
var max_y
// @formatter:off
require([
  "esri/map",
  "esri/SpatialReference",
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
    Map, SpatialReference, Graphic, Geocoder, Locator,
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
    // var xValues = new Array
    // var yValues = new Array
    var taskLocator;

    // Parse DOM nodes decorated with the data-dojo-type attribute
    parser.parse();

    // Create the map
    mapMain = new Map("cpCenter", {
      basemap : "topo",
      center : [-94.46, 49.35],
      zoom : 4,
    });

    // Locator
    taskLocator = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");


    //  Locate button's onclick event handler
    on(dom.byId("btnLocate"), "click", makeCityList);	

    //  Wire the task's completion event handler
    taskLocator.on("address-to-locations-complete", showResults)

    function doAddressToLocations(singlePlace) {
      // console.log(singlePlace);
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
      mapMain.centerAndZoom(geometryLocation, 4);

        xValues.push(geometryLocation.x)
        yValues.push(geometryLocation.y)
        // console.log(xValues)
        // console.log(yValues)

      }
    }

    /* ****** SPECIAL ****** */
    // Function that will run the main app functions
    // in a specific order
    RunApp = function () {
      makeCityList();
      makeDateList();
      console.log(xValues)
      console.log(yValues)
      extentChange();


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
	  //console.log("FINISH");
    }



    function makeDateList(){
      var dates = [document.getElementById("date1").value,
                    document.getElementById("date2").value,
                    document.getElementById("date3").value,
                    document.getElementById("date4").value,
                    document.getElementById("date5").value];
      // testing console log
      console.log(dates);
	  
	  return dates;
	  //Calculate the difference between dates in days
		/* var a = new Date(dates[0]);
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
		console.log(days); */
		
    }		

    function createArray (cities) {
      // looping through the cities array
	  var count = 1;
	  
	  //console.log(daydisplay)
      for (var code = 0; code < cities.length; code++) {
        if (cities[code] != "") {
          doAddressToLocations(cities[code]);
        }
		
		var dates = makeDateList();		
		Weather(cities, dates);	
		
      }
    }


    function extentChange (){
      var max_x = Math.max.apply(Math, xValues);
      console.log(max_x)
      var max_y = Math.max.apply(Math, yValues);
      console.log(max_y)
      var min_x = Math.min.apply(Math, xValues);
      console.log(min_x)
      var min_y = Math.min.apply(Math, yValues);
      console.log(min_y)
      var newExtent = new esri.geometry.Extent();
      newExtent.xmin = min_x;
      newExtent.ymin = min_y;
      newExtent.xmax = max_x;
      newExtent.ymax = max_y;
      newExtent.spatialReference = new esri.SpatialReference({wkid:4326});

      mapMain.setExtent(newExtent);
      console.log("new Extent?")

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
		
	/* function Weather (citiesarray, datesarray) {		
		console.log(citiesarray);
		console.log(datesarray);
		var a = new Date("8/1/2014");
		var d = new Date("9/2/2014");
		var n = d.getDate(); 
		//console.log(n);
		var diff = Math.abs(a-d);
		var days = (diff / (1000*60*60*24));
		
		for (var c = 0; c < citiesarray.length; c++) {			
			console.log(c);
			if (citiesarray[c] != "") {
				var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + citiesarray[c] +'&mode=json&units=metric&cnt=16';
				console.log(url);	
					$.getJSON(url,function(Result1){
						l = Result1.list;
						l.forEach(logArrayElements1);			
					});
			}
			
		}

		function logArrayElements1(element, index, array) {
			//console.log(this);						
			if (index == 0) {
				console.log("HHHERERERE");				
				var weatherID = "Weather" + c
				document.getElementById(weatherID).innerHTML = "Temp = " + element.temp.day;
			}
		
		
		}
	
	
	} */
	
	function Weather (citiesarray, datesarray) {		
		console.log(citiesarray);
		console.log(datesarray);
		var a = new Date("8/1/2014");
		var d = new Date("9/2/2014");
		var n = d.getDate(); 
		//console.log(n);
		var diff = Math.abs(a-d);
		var days = (diff / (1000*60*60*24));
		
		for (var c = 0; c < citiesarray.length; c++) {			
			//console.log(c);
			if (citiesarray[c] != "") {
				var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + citiesarray[c] +'&mode=json&units=metric&cnt=16';
				console.log(url);	
				$.getJSON(url,function(Result1){
					l = Result1.list;
					console.log(l);
					l.forEach(logArrayElements1);
				});
			}
		}	
	}	
	
			
		

	function logArrayElements1(element, index, array) {
		//console.log(element);	
		
		var todayDateObj = new Date();
		var todayDay = todayDateObj.getDate();
		var todayMonth = todayDateObj.getMonth() + 1;
		var todayYear = todayDateObj.getFullYear();
		
		//var todayDate = new Date(todayYear, todayMonth, todayDay);
		var todayDate = todayMonth + "/" + todayDay + "/" + todayYear;
		var todayDateFormat = new Date(todayDate)
		console.log("TODAY" + todayDateFormat);		
		
		//var todayDate2 = todayMonth + "/" + "14" + "/" + todayYear;
		var todayDate2 = document.getElementById("date1").value;
		var todayDateFormat2 = new Date(todayDate2);	
		console.log(todayDateFormat2);
		
		var diffDate = Math.abs(todayDateFormat2-todayDateFormat);		
		var daysDate = (diffDate/86400000);
		console.log(daysDate);
		
		if (index == daysDate) { //currently pulling today's date for all cities
			var daytemp = element.temp.day;
			var weatherIcon = element.weather[0].icon;			
			var weatherUrl = "images/" + weatherIcon + ".png";
			console.log(weatherUrl);
			
			var div = document.createElement("div");
			div.className = "DayDivs";
			var newd = new Date();
			var weatherSquareID = "testid" + newd.getMilliseconds();
			console.log(weatherSquareID);
			div.setAttribute('id', weatherSquareID);
			
			var parentDiv = document.getElementById("TheWeather");
			parentDiv.appendChild(div);	
			
			//interior weather data
			var divDate = document.createElement("div");
			divDate.className = "DayDivsDate";
			
			var divIcon = document.createElement("div");
			divIcon.className = "DayDivsIcon";
			
			var divTemp = document.createElement("div");
			divIcon.className = "DayDivsTemp";
			
			
			//add to 
			var innerParentDiv = document.getElementById(weatherSquareID);			
			innerParentDiv.appendChild(divDate);
			innerParentDiv.appendChild(divIcon);
			innerParentDiv.appendChild(divTemp);
			
			
			var weatherText = document.createTextNode("Temp = " + daytemp);
			var weatherPhoto = document.createElement("img");
			
			weatherPhoto.setAttribute('src', weatherUrl);
			weatherPhoto.style.height = '80px';
			weatherPhoto.style.width = '80px';
			
			divTemp.appendChild(weatherText);
			divIcon.appendChild(weatherPhoto);
					
			
		}
	}