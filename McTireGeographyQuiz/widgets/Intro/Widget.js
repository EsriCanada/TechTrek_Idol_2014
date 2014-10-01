define(['dojo/_base/declare', 'jimu/BaseWidget', 'esri/tasks/query',
  'esri/tasks/QueryTask',
  'dojo/dom',
  'dojo/dom-class',
  'dojo/dom-construct',
  'dojo/on',
  'esri/geometry/Point',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/symbols/PictureMarkerSymbol',
  'esri/geometry/Extent',
  'esri/graphic',
  'esri/layers/GraphicsLayer',
  'esri/tasks/DistanceParameters',
  'esri/geometry/Polyline',
  'dojo/domReady!','dojo/dom-style'],
function(declare, BaseWidget, Query, QueryTask, dom, domClass, domConstruct, on, Point, SimpleMarkerSymbol, PictureMarkerSymbol, Extent,
        Graphic, GraphicsLayer, DistanceParameters, Polyline, domStyle)
{
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget],
  {
    // DemoWidget code goes here 

    //please note that this property is be set by the framework when widget is loaded.
    //templateString: template,

    baseClass: 'jimu-widget-demo',

    name: 'demo',

    postCreate: function()
    {
      this.inherited(arguments);
      console.log('postCreate');
      //console.log(this.map);

    },

    startup: function()
    {
      this.inherited(arguments);
      console.log('startup');
      var inputPoints = [];
      var resultItems = [];
      var resultAnswerItems = [];
      var answerPointItems=[];
      var questionCounter = 0;
      var gl = "";
      var addPoints= "";
      var mctires=5000;
      var resultCount = 0;
      mapz = this.map;
      var content = "";
      var queryTask = new QueryTask("http://services.arcgis.com/AtfpSdJcsnQiIRhL/arcgis/rest/services/quiz/FeatureServer/0");
                                      //http://services.arcgis.com/AtfpSdJcsnQiIRhL/arcgis/rest/services/Quiz/FeatureServer/0
                                    
      var query = new Query();
      query.returnGeometry = true;
      query.outFields = ["Question1", "Answer1"];

      var el = document.querySelector('.odometer');

      od = new Odometer({
          el: el,
          format: 'd,ddd',
          value: '5000',
          theme: 'minimal'
      });

      execute();

      function execute ()
      {
        query.where = "Name LIKE 'question%'";
        queryTask.execute(query, showResults);
      }

      //gives all questions in feature layer
      function showResults (results)
      {

        console.log("results");
        console.log(results.features[0].geometry.x);
        
        //Determine the number of questions in the feature service
        resultCount = results.features.length;
        console.log("results Length: " + resultCount);

        for (var i = 0; i < resultCount; i++)
        {
            var featureAttributes = results.features[i].attributes;
            //console.log(featureAttributes);
            resultItems.push(results.features[i].attributes["Question1"]);
            resultAnswerItems.push(results.features[i].attributes["Answer1"]);
            answerPoint = new esri.geometry.Point(results.features[i].geometry.x, results.features[i].geometry.y, results.features[i].geometry.spatialReference);
            answerPointItems.push(answerPoint);
            console.log("resultItems[" + i + "]: " + resultItems[i]);
            console.log("resultAnswerItems[" + i + "]: " + resultAnswerItems[i]);
            // for (var attr in featureAttributes) {
            //   console.log("attr: " + attr)
            //   console.log("feater Attributes: " + featureAttributes[attr]);
            //   resultItems.push(featureAttributes[i].attributes["Question1"]);
            // }
        }
        showRes();
      }
       
      //write the first question to the widget UI 
      function showRes ()
      {
        console.log ("in showRes");
        console.log("First Question: " + resultItems[questionCounter]);
        dom.byId("question").innerHTML = resultItems[questionCounter];
      }

      //this is somehow activating the draw function (looks like you need to click execute but you don't)
      draw(mapz, inputPoints);
      //on(dom.byId("next"), "click", showRes());

      // draws the user answer - hh beyond the execute button how is it getting called
      function draw(mapz, inputPoints)
      {
        console.log("in draw");
        var symbol = new PictureMarkerSymbol({"angle":0,"xoffset":0,"yoffset":10,"type":"esriPMS","url":"http://static.arcgis.com/images/Symbols/Shapes/RedPin1LargeB.png","imageData":"iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADImlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1MzA4NzI3NkQyN0MxMUUwQUU5NUVFMEYwMTY0NzUwNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1MzA4NzI3N0QyN0MxMUUwQUU5NUVFMEYwMTY0NzUwNSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjUzMDg3Mjc0RDI3QzExRTBBRTk1RUUwRjAxNjQ3NTA1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjUzMDg3Mjc1RDI3QzExRTBBRTk1RUUwRjAxNjQ3NTA1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQg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","contentType":"image/png","width":24,"height":24});
        gl = new GraphicsLayer({ id: "point" });
        var point = dom.byId("point");
        mapz.addLayer(gl);
        addPoint = mapz.on("click", function(e)
        {
          console.log(e);
          console.log(e.mapPoint.x);
          var point = new Point(
          {
            "x": e.mapPoint.x,
            "y": e.mapPoint.y,
            "spatialReference": {"wkid": e.mapPoint.spatialReference.wkid }
          });

          //user added point
          var inPoint = new esri.geometry.Point(e.mapPoint.x, e.mapPoint.y, e.mapPoint.spatialReference);
          inputPoints.push(inPoint);

          var userSymbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 12, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([153, 51, 51]), 1), new dojo.Color([204, 51, 51, 0.65]));
          var graphic = new Graphic(point, userSymbol);
          if (gl.graphics.length < 1) {
            gl.add(graphic);
            console.log("user graphic drawn");
            distance(mapz, inputPoints, gl);
          }
          else {
            return;
          }
                    
        });

      }

      //determine the distance between the user [oint and the feature
      function distance(mapz, inputPoints, gl)
      {
        console.log("in distance");
        
        var totalDistance = 0, legDistance = [];
        geometryService = new esri.tasks.GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
        
        //define the symbology for the graphics
        var symbol = new PictureMarkerSymbol({"angle":0,"xoffset":0,"yoffset":10,"type":"esriPMS","url":"http://static.arcgis.com/images/Symbols/Shapes/GreenPin1LargeB.png","imageData":"iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADImlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBQTQxMkU2NEQzMUUxMUUwQUU5NUVFMEYwMTY0NzUwNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBQTQxMkU2NUQzMUUxMUUwQUU5NUVFMEYwMTY0NzUwNSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkFBNDEyRTYyRDMxRTExRTBBRTk1RUUwRjAxNjQ3NTA1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkFBNDEyRTYzRDMxRTExRTBBRTk1RUUwRjAxNjQ3NTA1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+KRBDEgAACmVJREFUeF7tWg1MVecZ/kRwm8msrKt02jqYmQKKjaAkNHPZunV2Rro4S0y2aNPWn4ammV1EaXROO5y22qmtpem6NTprrYMWlCpuFOWCFf//+BEo9ScFRIyA/KgR9dvznPN9l4/D5Wc0ufcauMmTczj33HPO87zP+37v9x2ElFL0Z/Rr8gz8gAD92f4DDhhIgYEaMFAEB0aBgVFgoBMcaIX7dR3o1+T73AmK++DT2+LeJwfcB/x7zavXJ5qKmgIEBweLkJAQMWrUKBEWFibGjh0rIiMjRVRUlJg0aZKIiYkRkydPFlOmTLFw8+bNsDt37sy8e/fuqra2ttc0bty4Mauurm4Mrh0IBACDiGHDhomhQ4eKIUOGiKCgIBEYGCgCAgIsDBrEUzx/vOaAESNGdCA/fvx4MXHiRBEdHW0Rjo2NtUjjgTbcu3fvIrbdfiDMpebm5tTDhw9HgNq3lCCWGCQ/ePBg/xJg5MiRIjQ01B15kzyJg9AWMm692yzTGz6Si2sWSVEZJUX5EEBIUQacA8qHyRe+fk7+q/592XznuiXS9evXP87KypoI8kOBIO2MnqJPT3jNAaNHjxZjxowRERERHSJPm+MhGkg8pXalFBUjgRAguCN5LUApRCBKbLxU9SKEaJS4TtOpU6deAKfvKSGYIl17X2WE1wRg3o8bN05MmDDBynk+HPObETzU7JLiq2hF/vtWlEV5gB11TZzRd5AXxThWZB//z/XdlhvOnz+/Gdf+AfBdYIhRJzwWAa8JwOiz6NH6Jvm3697sOuokbRI3Iu8mTwHOAmeE/GP1HywRSkpK/o57/BAYruqDLpadRPCaAKz6uvAp28tNdetAHhG37D60c9SdEaftGXUdeYM8BRCnhXy5KtESIS0tLRlsOVoEGyL4TgDanwKoSt9wsPmAsroH4jrqKs/dpJ3EVeQ1eXEKIpwUcnd9mmxpaWmdM2dOghKBTmA6dKoJXnMABeADIPpbW+42SfHl2J7z3BltHXEncUTeIn8COG5vr7TUymPHjrlwz8dVOrAmdCqMXhOAKdDY2Pgj2nPZ5eT2AuepunuyOUmbxJXlafsO5I/g78NCxp+bKZuamuS0adMSQXyyKowcJlkP3B+vCcDoo5vbZEXfrOye7M5Ie4o2SZvETfLH8B3JFwJfAAeF/PraRYn+IA/3ng6wYeIQyT7BnQpeFYAd3vb6D+zK3t2w5inanohr25vkQVzkA3lCrq5YKSsqKhpB+DmVCo9gSxd4XwD277Q/uziP47kucE7yjLITJN4DebFfyPCjcbK2tlZijvFXkJ6hXMCCyFpgfbzlgEHI/wQKYNlfV3c9rJmW1zZ3Rlzb3STPgmfaXkVe5OL45wC21dXVMjExMQ1c5wJTgIcBzh0sF3hNgNbW1tWWAM6hzRP5riJukmfFP2oXPCvnC2zbW+RzgH1AtpCXLl2SGzduPAKuLwM/B0LNNPCWAAGoyGssAbqq8F0VOE3aSd6Z9y4Qhu2tyJP8XuAzIQ+Wu+S6detOgDQbI6YBx+MHAGs08JYAgQ0NDa9bAnRX4c3IO4mjwWGT4x7rzejT+gc6kxdZQlZWVsq1a9eeBteVwDNAFPCgrgNeE6C+vv4NS4DuxnMtQHfkaX0d/UP2cGdZn5H/r217Rl7sBnYJWV5eLlNSUs6C8GrgdwBnYg95W4CgsrKyZ90p0Bu764jrqJO4SZ65T/La+sx7k3ymLUBpaamcPXt2PgivBeYAbIpGAOwHvJYCQVu3bo2hAHEXnmwf1sxImxbXZJ1bVv3urK8jT/KfCDl2X4wsLi6WmIrv8rUAHHcfunXrVvVbV9fbY7gzsl2R1v09bU/yHPac1mfR2wMg54UiL9KFTHK9Ivfv338D9/7Q1ylAAR68ePHitobb19oLGUlpYiSnoY+b35O4HvO19TnkMe9Z8U3yafj73xgBThbINWvWnMe9t/i6CHLIeWD58uVP3L59W/6mcpZNRoP5TJjHnPv8XkfemfdO8juF/NneX0gskUksxX2Oe78P+HQYZNfFHjwUVTm7tvmyHW1OXEhKg39raFG4NSY47qKnx3vmPYqd+BRg5D+2o19w3CU3bNhQjXumA28BPm2EKADbz4fnz5//NHqC1rSa7XYVd4JdHaFFUTM7q9NzNjueyEOAjXmvy4KCgjZEP8/If5+2whxxWAeGAxGbN29OwVK2nHcOEyM2MRokSZii8G/d45udnq74jDwKnhX5HUI+s3emPH78uIyPjz+Ne2UA7wJJgE8nQxRApwGnpI9nZGRkwglyXglEYGRNaEF4jE2Os8fX5DM6k8cqkFyyZAkL3x5gG8CZoO+nw0oANh9clODixPQdO3bsu3btmvzowpb2KGvC3LK91VFntedwR/Isepo8Cp4AaHuST0pKIvlsYCewCVjEe6l7+nRBhC7gaMBiyHV7dmQJeOBtVVVVty5cqZTTT8XbhDVY6Jwtrq74tD2I/3TPE9J19IB0uVxtM2bMOKPIc/qbCrzKe6h78Z4+XRLTacBawAVKrttzwfL3eD+4Hilx7urVq/Kdir/ZpAljWuuOPBsdkkelfy3vT1a+r1+//jJeuh5UtmfkSX4Zr63uwXv5dlGU7NWHtYBL1MMBrttPVQ/6akJCwidXrlyxi6C2vO7vzciDPFOA5KdOnXoSv98HsN1lx0fbM/Ikz2vzHryXb5fFDQG4y1TgsMiXFnxAOoFWfSUzM7No15dp7gWNDpFHf8/Is+L/M/9dRr5Gkf8U2w+AN3gNdS1e039ejDgEoAu0CIwOLcqaEB8XF7espqYGRTGsvb/XjY4e7jIfsQoebM9ZHsn/A/gL8CKvoa7lX6/GHALwTy0Crcn8ZJGaAPwKLsjJqchun9cbec/o7/xiu1y1atUlnLsb2AKkAPP4W3UN/3s56kEAfYhCsDCyQnOeHhkeHj4LKzk3flnwVHuba1T9/Pz8Nvw3CHv8HcCbAF9+TONv1TV4Lf96Pd6NAKYbvq0IPJaenr6T63nuPl8JkH3kM7l06dKvcB67vPcATnJ+CzymfstrdPk22Pkc3loS64G/+2vdJzyK1+hPFRUVXX3p0EJ7ogMBFuY+L3Nycm4i+jn4xXaAqzzPAz8BHlUu6vDqq6cb+5sATAfdLUampqZuOF12wl7fQx0oPHNIzp07txjnsPCxx18MsMen9Tt1eT2R5/f+JgCfSbuAc4a4s2fPWi5ILJgvkfutOJYFsMfnIuezPAfQr7z+r+j7qwC6KA7HA4YnJycv5dI23vHxTW8ujrHwvQ0sAn7NcwCe26ui53SFPzqAz0gRvgNwOIstLCwszc3NvYD9dxT+jC07vVh1Ds/t8R+inOT91QFaAEaUb3B+vGLFisULFizgcLdcYSG2T/I7dU6fou/PAmgR2C6HAHyZwWLHnCe4z2P8zv2i01OEezrmrymgn3swdvTMMRr7fLlJcF/P8HhOnz/+LoBeS+SkiZWelie4z2PfKPr+ngKmC0iUTuBYT3Cfx75R9O8XAegCEmWhI2n9j9E81qfKb+aLv6eAflYS9YQ+577+YW8F+B9qeoIXi5c7vQAAAABJRU5ErkJggg==","contentType":"image/png","width":24,"height":24});
        var markerSymbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 12, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([204, 102, 51]), 1), new dojo.Color([158, 184, 71, 0.65]));
        var polylineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([15, 70, 112]), 2);
        console.log(inputPoints);

        var distParams = new DistanceParameters();
        distParams.distanceUnit = esri.tasks.GeometryService.UNIT_KILOMETER;

        console.log("length of inputPoints: " + inputPoints.length);
        
        distParams.geometry1 = inputPoints[0];

        console.log("answer point");
        console.log(answerPoint);
        distParams.geometry2 = answerPointItems[questionCounter];
        
        distParams.geodesic = true;

        //draw a polyline to connect the answer point to the user input point
        var polyline = new Polyline(this.mapz.spatialReference);
        polyline.addPath([distParams.geometry1, distParams.geometry2]);
        gl.add(new esri.Graphic(polyline, polylineSymbol));

        //draw a answer point
        var point = new Point(
        {
              "x": answerPointItems[questionCounter].x,
              "y": answerPointItems[questionCounter].y,
              "spatialReference": {"wkid": answerPointItems[questionCounter].spatialReference.wkid }
        });
        

        var graphic = new Graphic(point, symbol);
        this.mapz.graphics.add(graphic);
        console.log("input Points");
        console.log(inputPoints[0].x);

        //Calculate the geodesic distance 
        geometryService.distance(distParams, function(distance)
        {
          legDistance.push(dojo.number.format(distance,
          {
            places: 2
          }));
        
          totalDistance += distance;
          
        
          console.log("totalDistance: " + totalDistance);

          domClass.remove("status", "ribbon left_ribbon incorrect correct");
          domConstruct.empty("status");

          if (totalDistance<=100)
          {
            gl.suspend();
            this.mapz.centerAndZoom(point, 6);
            domClass.add("status", "ribbon left_ribbon correct");
            var nodeCorrect = domConstruct.toDom("<img src=widgets/Demo/images/checkmark.png align=left><p>Correct Answer! Someone came to play!</p>");
            domConstruct.place(nodeCorrect, "status");
            //Add Correct Answer HERE!!!
            dom.byId("question").innerHTML = "Correct Answer: " + "<b>" + resultAnswerItems[questionCounter] + "</b>";
            //on(next, "click", function() { nextQuestion(content); } );//nextQuestion(content));
          }
          else
          {
            var extent = new Extent(inputPoints[0].x + 10, inputPoints[0].y + 10, answerPointItems[questionCounter].x + 10, answerPointItems[questionCounter].y + 10, new esri.SpatialReference({wkid:102100}) );
            this.mapz.setExtent(extent, true);
            domClass.add("status", "ribbon left_ribbon incorrect");
            var displayMctires = dojo.number.format((totalDistance), {places: 0});
            if (totalDistance < 500) {
              var nodeIncorrect = domConstruct.toDom("<img src=widgets/Demo/images/xmark.png align=left><p>Wow, not even close. You were off by: " + displayMctires + "km</p>");
              domConstruct.place(nodeIncorrect, "status");
            }
            else if (totalDistance >= 500 && totalDistance < 1000) {
              var nodeIncorrect2 = domConstruct.toDom("<img src=widgets/Demo/images/xmark.png align=left><p>Close, you must have minored in Geography. You were off by: " + displayMctires + "km</p>");
              domConstruct.place(nodeIncorrect2, "status");
            }
            else {
              var nodeIncorrect3 = domConstruct.toDom("<img src=widgets/Demo/images/xmark.png align=left><p>The goal is to get your answer as close as possible, not the fartherest away. You were off by: " + displayMctires + "km</p>");
              domConstruct.place(nodeIncorrect3, "status");
            }
            mctires= mctires - totalDistance;
            content = dojo.number.format((mctires), {places: 0});
            //Add Correct Answer HERE!!!
            dom.byId("question").innerHTML = "Correct Answer: " + "<b>" + resultAnswerItems[questionCounter] + "</b>";
            if (mctires>0)
            {
              if (resultCount > questionCounter)
              {
                dojo.byId('distanceDollars').innerHTML = content;
              }
              else
              {
                dojo.byId('status').innerHTML ="You win!";
              }
            }
            else
            {
              dojo.byId('status').innerHTML ="You have run out of McTires; Game Over!";
              document.getElementById('distanceDollars').innerHTML = '0';
            }
          
          }
        });
      }


      var next = dom.byId("execute");
      on(next, "click", function() { 
        if (gl.graphics.length>0){
          nextQuestion(content);   
        }
        else
        {          
          domClass.add("status", "ribbon left_ribbon incorrect");
          var nodeIncorrect = domConstruct.toDom("<img src=widgets/Demo/images/xmark.png align=left><p>Nice Try! You must answer the question before moving to the next question.</p>");
          domConstruct.place(nodeIncorrect, "status");
        }
      } );
      
      function nextQuestion(content)
          {

          //resetting and moving onto the next question
          domClass.remove("status", "ribbon left_ribbon incorrect correct");
          domConstruct.empty("status");
          this.mapz.graphics.clear();
          gl.resume();
          gl.clear();
          var initialExtent = new Extent(-24865812.053519942,10002859.358822502,3311934.053519942,18632294.10410347,new esri.SpatialReference({wkid:102100}));
          this.mapz.setExtent(initialExtent, true);
          inputPoints.length=0;
          questionCounter++;
          showRes();
        }
    },

    onOpen: function()
    {
      console.log('onOpen');
    },

    onClose: function()
    {
      console.log('onClose');

    },

    onMinimize: function()
    {
      console.log('onMinimize');
    },

    onMaximize: function()
    {
      console.log('onMaximize');
    },

    onSignIn: function(credential)
    {
      /* jshint unused:false*/
      console.log('onSignIn');
    },

    onSignOut: function()
    {
      console.log('onSignOut');
    }
  });
});