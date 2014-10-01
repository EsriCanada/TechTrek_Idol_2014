var request = require('request');
var fs = require('fs');

var categoryItems = [];

function addCategoryItemToArray(item) {
	categoryItems.push(item.title);
}

function writeCategoryItemsToFile(url, nameOfOutputFile) {

	console.log("Making a request to: " + url);
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var response = JSON.parse(body);
			response.query.categorymembers.forEach(addCategoryItemToArray);
			
			if (response["query-continue"] != null) {
				writeCategoryItemsToFile(url + "&cmcontinue=" + response["query-continue"].categorymembers.cmcontinue, nameOfOutputFile);
			}
			else {
				console.log(categoryItems);
				fs.writeFileSync(nameOfOutputFile, JSON.stringify(categoryItems));
				console.log("DONE");
			}			
		}
	})
}

exports.writeCategoryItemsToFile = writeCategoryItemsToFile;