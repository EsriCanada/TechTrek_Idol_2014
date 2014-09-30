var mapMain;
var xValues = new Array
var yValues = new Array
var min_x
var min_y
var max_x
var max_y
var date_counter = 0;
var CityName;
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

          // //add a text symbol to the map listing the location of the matched address.
          //     var displayText = candidate.address;
          //     var font = new Font(
          //       "16pt",
          //       Font.STYLE_NORMAL,
          //       Font.VARIANT_NORMAL,
          //       Font.WEIGHT_BOLD,
          //       "Helvetica"
          //     );

              var textSymbol = new TextSymbol(
                displayText,
                font,
                new Color("#666633")
              );
              textSymbol.setOffset(0,8);
              mapMain.graphics.add(new Graphic(geometryLocation, textSymbol));

          // exit the loop after displaying the first good match
          return false;
        }
      });


      // Center and zoom the map on the result

      if (geometryLocation !== undefined) {
      mapMain.centerAndZoom(geometryLocation, 4);

        xValues.push(geometryLocation.x)
        yValues.push(geometryLocation.y)

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

    }

    function createArray (cities) {
      // looping through the cities array
	  var count = 1;

	  //console.log(daydisplay)
		for (var code = 0; code < cities.length; code++) {
			if (cities[code] != "") {
				console.log(code);
				doAddressToLocations(cities[code]);
			}
		}
		var dates = makeDateList();
		Weather(cities, dates);
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

function Weather (citiesarray, datesarray) {

   //Resets temp squares when locate button is clicked
  var myNode = document.getElementById("TheWeather");
  while (myNode.firstChild) {
   myNode.removeChild(myNode.firstChild);
  }
   date_counter = 0;
	console.log(citiesarray);
	console.log(datesarray);
  mapMain.graphics.clear();

	for (var c = 0; c < citiesarray.length; c++) {
		console.log(citiesarray[c]);
		if (citiesarray[c] != "") {
			var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + citiesarray[c] +'&mode=json&units=metric&cnt=16';
			$.getJSON(url,function(Result1){
				l = Result1.list;
        CityName = Result1.city.name;
        date_counter +=1;
				l.forEach(logArrayElements1);
			});
      // console.log(counter);
		}
	}
}

function logArrayElements1(element, index, array, counter) {
	console.log(counter + " " + "count")
  var todayDateObj = new Date();
	var todayDay = todayDateObj.getDate();
	var todayMonth = todayDateObj.getMonth() + 1;
	var todayYear = todayDateObj.getFullYear();

  // the current date is todayDate in mm/dd/yyyy format
	var todayDate = todayMonth + "/" + todayDay + "/" + todayYear;
	var todayDateFormat = new Date(todayDate);
  var date_div_id = "date" + date_counter;
	var todayDate2 = document.getElementById(date_div_id).value;
	var todayDateFormat2 = new Date(todayDate2);

	var diffDate = Math.abs(todayDateFormat2-todayDateFormat);
  // the number of days after the current date (index 0) is daysDate
	var daysDate = (diffDate/86400000);
  console.log(diffDate + " " +"diff date")

  if (daysDate >= 15) {
   daysDate = 14;
  }

	if (index == daysDate) { //currently pulling today's date for all cities
		var daytemp = element.temp.day;
		var weatherIcon = element.weather[0].icon;
		var weatherUrl = "images/" + weatherIcon + ".png";
    var weatherCondition = element.weather[0].description;



		var div = document.createElement("div");
		div.className = "DayDivs";
		var newd = new Date();
		var weatherSquareID = "testid" + newd.getMilliseconds();

		div.setAttribute('id', weatherSquareID);

		var parentDiv = document.getElementById("TheWeather");
		parentDiv.appendChild(div);

		//interior weather data

    var divCityName = document.createElement("div");
    divCityName.className = "DayDivsCityName";

		var divDate = document.createElement("div");
		divDate.className = "DayDivsDate";

		var divIcon = document.createElement("div");
		divIcon.className = "DayDivsIcon";

    var divDesc = document.createElement("div");
    divDesc.className = "DayDivsDesc";

		var divTemp = document.createElement("div");
		divIcon.className = "DayDivsTemp";


		//add to
		var innerParentDiv = document.getElementById(weatherSquareID);
		innerParentDiv.appendChild(divCityName);
    innerParentDiv.appendChild(divDate);
		innerParentDiv.appendChild(divIcon);
    innerParentDiv.appendChild(divDesc);
		innerParentDiv.appendChild(divTemp);


		var weatherText = document.createTextNode("Temp:" + "  " + daytemp + "°");
		var weatherPhoto = document.createElement("img");


		weatherPhoto.setAttribute('src', weatherUrl);
		weatherPhoto.style.height = '80px';
		weatherPhoto.style.width = '80px';

		divTemp.appendChild(weatherText);
		divIcon.appendChild(weatherPhoto);
    divDate.innerHTML=todayDate2;
    divDesc.innerHTML=weatherCondition;
    divCityName.innerHTML=CityName;



	}


}
