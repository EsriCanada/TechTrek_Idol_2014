var mediaWikiApi = require('./mediaWikiApi');

// Castles
mediaWikiApi.writeCategoryItemsToFile("http://awoiaf.westeros.org/api.php?format=json&action=query&list=categorymembers&cmtitle=Category:Castles", "GoTCastles.json");