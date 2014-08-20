var mapMain;
var RunApp;
var xValues = new Array
var yValues = new Array
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
      center : [-79.38, 43.65],
      zoom : 13
    });




    // Locator

    taskLocator = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");


    //  Locate button's onclick event handler

    on(dom.byId("btnLocate"), "click", RunApp);


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
      if (geometryLocation != undefined) {
        mapMain.centerAndZoom(geometryLocation, 10);
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
      var max_of_array = Math.max.apply(Math, xValues);
      console.log(max_of_array)
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
      createArray(cities)	  
    }

    function extentChange (){
      var newExtent = new esri.geometry.Extent();
      newExtent.xmin =
      newExtent.ymin =
      newExtent.xmax =
      newExtent.ymax =
      newExtent.spatialReference =

      mapMain.setExtent(newExtent)
    }

    function makeDateList(){
      var dates = [document.getElementById("date1").value,
                    document.getElementById("date2").value,
                    document.getElementById("date3").value,
                    document.getElementById("date4").value,
                    document.getElementById("date5").value];
      // testing console log
      console.log(dates);
    }

    function createArray (cities) {
      // looping through the cities array
		for (var code = 0; code < cities.length; code++) {
			if (cities[code] != "") {
				doAddressToLocations(cities[code]);
			}
		}
    }

  });


});
