define([
	"esri/tasks/query", 
	"esri/tasks/QueryTask",
	"dojo/dom", 
	"dojo/on", 
	"dojo/domReady!"
     ], function (Query, QueryTask, dom, on) {
  var questions = function() {
        var queryTask = new QueryTask("http://services.arcgis.com/AtfpSdJcsnQiIRhL/arcgis/rest/services/quiz/FeatureServer/0");

        var query = new Query();
        query.returnGeometry = false;
        query.outFields = [
          "Question1"
        ];

        on(dom.byId("execute"), "click", execute);

        function execute () {
          query.text = "Question1";
          queryTask.execute(query, showResults);
        }

        function showResults (results) {
          var resultItems = [];
          var resultCount = results.features.length;
          for (var i = 0; i < resultCount; i++) {
            var featureAttributes = results.features[i].attributes;
            for (var attr in featureAttributes) {
              resultItems.push("<b>" + attr + ":</b>  " + featureAttributes[attr] + "<br>");
            }
            resultItems.push("<br>");
          }
          dom.byId("info").innerHTML = resultItems.join("");
        }
        };
      });