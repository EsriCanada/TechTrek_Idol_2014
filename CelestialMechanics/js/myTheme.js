define([
    "dojox/charting/SimpleTheme",
    "dojox/charting/themes/common"
], function(SimpleTheme, themes){
     
    themes.SitePen = new SimpleTheme({
        colors: [
            "#A4CE67",
            "#739363",
            "#6B824A",
            "#343434",
            "#636563"
        ]
    });
    return themes.SitePen;
});