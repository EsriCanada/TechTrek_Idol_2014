var mediaWikiApi = require('./mediaWikiApi');

// Cities
mediaWikiApi.writeCategoryItemsToFile("http://awoiaf.westeros.org/api.php?format=json&action=query&list=categorymembers&cmtitle=Category:Cities", "GoTCities.json");