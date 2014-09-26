define([
    "require",
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/Evented",
    "dojo/Deferred",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/i18n!./nls/resources",
    
    "esri/urlUtils",
    "esri/request",
    "esri/graphic",
    "esri/geometry/webMercatorUtils",
    "esri/geometry/Point",
    "esri/SpatialReference",
    
    "esri/Color",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    
    "./rsConfig",
    "./popupTemplates"
], function(
    require,
    declare,
    array,
    lang,
    on,
    Evented,
    Deferred,
    domStyle,
    domConstruct,
    i18n,
    
    urlUtils,
    esriRequest,
    Graphic,
    webMercatorUtils,
    Point,
    SpatialReference,
    
    Color,
    SimpleFillSymbol,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    
    rsConfig,
    popupTemplates
) {
    return declare([Evented], {
        i18n: i18n,
        
        startup: function(opts)
        {
            window.rs = this;
            this.map = opts.map;
            this.inherited(arguments);
            if (rsConfig.proxyRule) urlUtils.addProxyRule(rsConfig.proxyRule);
        },
        
        newSearchParams: function()
        {
            return lang.mixin({},rsConfig.searchParamsTemplate);
        },
        
        submitSearch: function(daFeatures,options)
        {
            this._searchDeferred = new Deferred();
            this.listings = [];
            this._daFeatures = daFeatures;
            
            // Apply custom logic here.  Successful completion of the search must resolve the returned promise object with an object of the following form: {listings:[],totalpossible:123}
            
            return this._searchDeferred.promise;
        }
    });
 
});