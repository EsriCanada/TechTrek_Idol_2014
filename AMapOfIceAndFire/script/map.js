require([
            "dojo/on",
            "dojo/dom",
            "dijit/registry",
            "dojo/dom-construct",
            "dojo/parser",
            "esri/map",
            "esri/arcgis/utils",
            "esri/dijit/Popup",
            "esri/symbols/SimpleMarkerSymbol",
            "esri/symbols/SimpleLineSymbol",
            "esri/Color",
            "esri/request",
            "dojo/request/xhr",
            "esri/layers/ArcGISTiledMapServiceLayer",
            "esri/layers/FeatureLayer",
            "esri/InfoTemplate",
            "esri/symbols/PictureMarkerSymbol",
            "esri/lang",
            "esri/graphic",
            "dijit/popup",
            "dojo/dom-style",
            "dijit/TooltipDialog",
            "esri/layers/GraphicsLayer",
            "esri/geometry/Extent",

            "dijit/layout/ContentPane",
            "dojo/domReady!"
], function (
            on,
            dom,
            registry,
            domConstruct,
            parser,
            Map,
            arcgisUtils,
            Popup,
            SimpleMarkerSymbol,
            SimpleLineSymbol,
            Color,
            esriRequest,
            xhr,
            Tiled,
            FeatureLayer,
            InfoTemplate,
            PictureMarkerSymbol,
            esriLang,
            Graphic,
            dijitPopup,
            domStyle,
            TooltipDialog,
            GraphicsLayer,
            Extent
        ) {

    parser.parse();

    var map = new Map("mapDiv", {
        logo: false,
        extent: new Extent({
            xmax: 975100.5672678016,
            xmin: -548902.4807382945,
            ymax: 3488390.661247988,
            ymin: 2623995.1824570308,
            spatialReference: { wkid: 102100 }
        })
    });
    map.on("load", function () {
        map.graphics.enableMouseEvents();
    });
    //map.on("extent-change", function () {
    //    console.log(map.extent);
    //});

    var dialog = new TooltipDialog({
        id: "tooltipDialog",
        style: "position: absolute; z-index:100"
    });
    dialog.startup();

    var tiled = new Tiled("http://tiles.arcgis.com/tiles/EgePHk52tsFjmhbJ/arcgis/rest/services/GoT_Basemap/MapServer");
    map.addLayer(tiled);

    var infoTemplate = new InfoTemplate();

    // Cities Layer
    var city_rest = "http://services.arcgis.com/EgePHk52tsFjmhbJ/ArcGIS/rest/services/GoTFeatures_FINAL/FeatureServer/0";
    var cityLayer = new FeatureLayer(city_rest, {
        mode: FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: infoTemplate,
        outFields: ["Name", "Type"]
    });
    cityLayer.on("mouse-over", displayPointName);
    cityLayer.on("mouse-out", hidePointName);
    map.addLayer(cityLayer);

    // Castles Layer
    var castle_rest = "http://services.arcgis.com/EgePHk52tsFjmhbJ/ArcGIS/rest/services/GoTFeatures_FINAL/FeatureServer/1";
    var castleLayer = new FeatureLayer(castle_rest, {
        mode: FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: infoTemplate,
        outFields: ["Name", "Type"]
    });
    castleLayer.on("mouse-over", displayPointName);
    castleLayer.on("mouse-out", hidePointName);
    map.addLayer(castleLayer);

    // Town Layer
    var town_rest = "http://services.arcgis.com/EgePHk52tsFjmhbJ/ArcGIS/rest/services/GoTFeatures_FINAL/FeatureServer/2";
    var townLayer = new FeatureLayer(town_rest, {
        mode: FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: infoTemplate,
        outFields: ["Name", "Type"]
    });
    townLayer.on("mouse-over", displayPointName);
    townLayer.on("mouse-out", hidePointName);
    map.addLayer(townLayer);

    // Ruin Layer
    var ruin_rest = "http://services.arcgis.com/EgePHk52tsFjmhbJ/ArcGIS/rest/services/GoTFeatures_FINAL/FeatureServer/3";
    var ruinLayer = new FeatureLayer(ruin_rest, {
        mode: FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: infoTemplate,
        outFields: ["Name", "Type"]
    });
    ruinLayer.on("mouse-over", displayPointName);
    ruinLayer.on("mouse-out", hidePointName);
    map.addLayer(ruinLayer);

    // 'Other' Layer
    var other_rest = "http://services.arcgis.com/EgePHk52tsFjmhbJ/ArcGIS/rest/services/GoTFeatures_FINAL/FeatureServer/4";
    var otherLayer = new FeatureLayer(other_rest, {
        mode: FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: infoTemplate,
        outFields: ["Name", "Type"]
    });
    otherLayer.on("mouse-over", displayPointName);
    otherLayer.on("mouse-out", hidePointName);
    map.addLayer(otherLayer);

    var hoverGraphics = new GraphicsLayer();
    map.addLayer(hoverGraphics);

    // Popup
    map.infoWindow.set("popupWindow", false);
    initializeSidebar(map);

    function displayPointName(evt) {
        var highlightSymbol = new esri.symbol.SimpleMarkerSymbol();
        var iconPath = "M6 16c0-0.381 0.022-0.756 0.063-1.126l-5.781-1.878c-0.185 0.973-0.283 1.977-0.283 3.004 0 4.601 1.943 8.748 5.052 11.666l3.571-4.916c-1.629-1.779-2.623-4.149-2.623-6.751zM26 16c0 2.602-0.994 4.972-2.623 6.751l3.571 4.916c3.109-2.919 5.052-7.065 5.052-11.666 0-1.027-0.098-2.031-0.283-3.004l-5.781 1.878c0.041 0.37 0.063 0.745 0.063 1.126zM18 6.2c2.873 0.583 5.298 2.398 6.702 4.87l5.781-1.878c-2.287-4.857-6.945-8.377-12.482-9.067v6.076zM7.298 11.070c1.403-2.471 3.829-4.286 6.702-4.87v-6.076c-5.537 0.691-10.195 4.21-12.482 9.067l5.78 1.878zM20.142 25.104c-1.262 0.575-2.665 0.896-4.142 0.896s-2.88-0.321-4.142-0.896l-3.572 4.916c2.288 1.261 4.917 1.98 7.714 1.98s5.426-0.719 7.714-1.98l-3.572-4.916z";
        highlightSymbol.setPath(iconPath);
        highlightSymbol.setColor(new Color("red"));
        highlightSymbol.setOutline(null);
        highlightSymbol.setSize("35");

        console.log(evt.graphic);

        var t = "<b>${Name}</b>";

        var content = esriLang.substitute(evt.graphic.attributes, t);
        var highlightGraphic = new Graphic(evt.graphic.geometry, highlightSymbol);
        hoverGraphics.add(highlightGraphic);

        dialog.setContent(content);

        domStyle.set(dialog.domNode, "opacity", 0.85);
        dijitPopup.open({
            popup: dialog,
            x: evt.pageX,
            y: evt.pageY
        });

    };

    function hidePointName() {
        hoverGraphics.clear();
        dijitPopup.close(dialog);
    }

    function initializeSidebar(map) {
        var popup = map.infoWindow;
        var symbol = new esri.symbol.SimpleMarkerSymbol();
        var iconPath = "M6 16c0-0.381 0.022-0.756 0.063-1.126l-5.781-1.878c-0.185 0.973-0.283 1.977-0.283 3.004 0 4.601 1.943 8.748 5.052 11.666l3.571-4.916c-1.629-1.779-2.623-4.149-2.623-6.751zM26 16c0 2.602-0.994 4.972-2.623 6.751l3.571 4.916c3.109-2.919 5.052-7.065 5.052-11.666 0-1.027-0.098-2.031-0.283-3.004l-5.781 1.878c0.041 0.37 0.063 0.745 0.063 1.126zM18 6.2c2.873 0.583 5.298 2.398 6.702 4.87l5.781-1.878c-2.287-4.857-6.945-8.377-12.482-9.067v6.076zM7.298 11.070c1.403-2.471 3.829-4.286 6.702-4.87v-6.076c-5.537 0.691-10.195 4.21-12.482 9.067l5.78 1.878zM20.142 25.104c-1.262 0.575-2.665 0.896-4.142 0.896s-2.88-0.321-4.142-0.896l-3.572 4.916c2.288 1.261 4.917 1.98 7.714 1.98s5.426-0.719 7.714-1.98l-3.572-4.916z";
        symbol.setPath(iconPath);
        symbol.setColor(new Color([29, 119, 209, 1]));
        symbol.setOutline(null);
        symbol.setSize("35");

        popup.set("markerSymbol", symbol);

        ////when the selection changes update the side panel to display the popup info for the
        ////currently selected feature.
        popup.on("selection-change", function () {
            displayPopupContent(popup.getSelectedFeature());
        });

        popup.on("clear-features", function () {
            document.getElementById("popSummary").innerHTML = "";
            document.getElementById("popTitle").innerHTML = "";
            if ($(".topRightFloatingContainer").is(':visible')) {
                $(".topRightFloatingContainer").slideUp("slow");
            }
        });
    }

    function displayPopupContent(feature) {
        if (feature) {

            var category
            fcName = feature.attributes.Name;
            fcType = feature.attributes.Type
            xhr(["data", fcType, fcName + ".json"].join("/"), {
                handleAs: "json"
            }).then(function (data) {
                console.log(data);
                // Popup Title
                document.getElementById("popTitle").innerHTML = data.name;
                // Popup Body
                if (data.images.length > 0) {
                    document.getElementById("popSummary").innerHTML = data.summary + generateImageGallery(data);
                }
                else {
                    document.getElementById("popSummary").innerHTML = data.summary;
                }

                // Show slider
                console.log("Showing popup");
                $(".topRightFloatingContainer").slideDown("slow");
            },
            function () {
                // Popup Title
                document.getElementById("popTitle").innerHTML = feature.attributes.Name;
                // Popup Body
                document.getElementById("popSummary").innerHTML = "<p>Mysterious place.</p>";
                // Show slider
                console.log("Showing popup");
                $(".topRightFloatingContainer").slideDown("slow");
            });
        }
    }

    function generateImageGallery(data) {
        // fancybox Image Gallery
        var galleryString = "<div id='tabPictures'><div><div class='pictureGallery'>";
        //galleryString += 
        data.images.forEach(function (element, index) {
            var picPosition = "pictureStackUnder";
            if (index == 1) { picPosition = "pictureStackOver"; }
            galleryString += "<a class='fancybox' title='Click to open gallery' rel='group' href='" + element.url + "'><img src='" + element.url + "' class='pictureStack " + picPosition + "' alt='" + element.caption + "' /></a>"
        });
        galleryString += "</div></div></div>";
        return galleryString;
    }

    function flipCard() {
        console.log("flipping card...");
        document.querySelector(".flipper").classList.toggle("flipped");
    }

    $(".fancybox").fancybox({
        beforeShow: function () {
            var alt = this.element.find('img').attr('alt');
            this.inner.find('img').attr('alt', alt);
            this.title = alt;
        }
    });

    $(".credits").fancybox();
});