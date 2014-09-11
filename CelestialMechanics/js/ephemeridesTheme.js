define([
    "dojox/charting/Theme",
    "dojox/charting/themes/common",
    "dojox/gfx/gradutils"
], function(Theme, themes){
 
    var gradient = Theme.generateGradient;
 
    /* fill settings for gradation */
    defaultFill = {type: "linear", space: "shape", x1: 0, y1: 0, x2: 0, y2: 100};
 
    /* create theme */
    themes.ephemeridesTheme = new Theme({
 
        /* customize the chart wrapper */
        chart: {
            fill: "#333",
            stroke: { color: "#333" },
            pageStyle: {
                backgroundColor: "#000",
                color: "#fff"
            }
        },
 
        /* plotarea definition */
        plotarea: { fill: "#000" },
 
        /* axis definition */
        axis:{
            stroke: { // the axis itself
                color: "#fff",
                width: 1
            },
            tick: { // used as a foundation for all ticks
                color: "#fff",
                position: "center",
                font: "normal normal normal 7pt Helvetica, Arial, sans-serif",  // labels on axis
                fontColor: "#fff" // color of labels
            }
        },
 
        /* series definition */
        series: {
            stroke: { width: 2.5, color: "#fff" },
            outline: null,
            font: "normal normal normal 8pt Helvetica, Arial, sans-serif",
            fontColor: "#fff"
        },
 
        /* marker definition */
        marker: {
            stroke: { width: 1.25, color: "#fff" },
            outline: { width: 1.25, color: "#fff" },
            font: "normal normal normal 8pt Helvetica, Arial, sans-serif",
            fontColor: "#fff"
        },
 
        /* series theme with gradations! */
        //light => dark
        //defaultFill object holds all of our gradation settings
        seriesThemes: [
            { fill: gradient(defaultFill, "#FFFF00", "#FFD700") },
            { fill: gradient(defaultFill, "#0000CD", "#191970") }
        ],
 
        /* marker theme */
        markerThemes: [
            {fill: "#bf9e0a", stroke: {color: "#ecc20c"}},
            {fill: "#73b086", stroke: {color: "#95e5af"}},
            {fill: "#216071", stroke: {color: "#277084"}},
            {fill: "#c7212d", stroke: {color: "#ed2835"}},
            {fill: "#87ab41", stroke: {color: "#b6e557"}}
        ]
    });
 
    return themes.ephemeridesTheme;
});