var mediaWikiApi = require('./mediaWikiApi');

// Noble Houses
mediaWikiApi.writeCategoryItemsToFile("http://awoiaf.westeros.org/api.php?format=json&action=query&list=categorymembers&cmtitle=Category:Noble_houses", "GoTNobleHouses.json");