define([
    "require",
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/on",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/Evented",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/text!./templates/destinationPanel.html",
    "dojo/i18n!./nls/resources",
    
    "dijit/form/Button",
    "dijit/form/NumberSpinner",
    "dijit/layout/ContentPane",
    
    "esri/dijit/Geocoder",
    "esri/dijit/PopupTemplate",
    "esri/graphic"
], function(require, declare, array, lang, on, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented, domStyle, domConstruct, template, i18n, Button, NumberSpinner, ContentPane, Geocoder, PopupTemplate, Graphic) {
    
    return declare([_WidgetBase, _TemplatedMixin,_WidgetsInTemplateMixin], {
        templateString: template,
        i18n: i18n,
        startup: function()
        {
            this.inherited(arguments);
            this.geocoder = new Geocoder({map:this.map,arcgisGeocoder:{sourceCountry:"CAN"},autoNavigate:false,autoComplete:true},this.geocoderNode);
            this.geocoder.startup();
            this.geocoder.on("select",lang.hitch(this,this.geocoderFoundResult));
            
            this.backButton = new Button({style:"margin-left:0.5em;",label:this.i18n.destinationPanel.backButton},this.backButton);
            this.backButton.startup();
            this.backButton.on('click',lang.hitch(this,function(){
                this.emit('back-selected');
            }));
            
            this.moreButton = new Button({style:"display:none;margin-left:0.5em;",label:this.i18n.destinationPanel.moreButton},this.moreButton);
            this.moreButton.startup();
            this.moreButton.on('click',lang.hitch(this,function(){
                this.emit('more-selected',{daFeature:this._currentDAFeature,clusterFeature:this._currentClusterFeature});
            }));
            
            this.destinationDetails = new ContentPane({"region":"center"},this.destinationDetails);
            this.destinationDetails.startup();
            
            this.searchRadius = new NumberSpinner({"class":"MaS-searchRadius",value:"10",smallDelta:1,constraints: {min:1,max:50,places:0}},this.searchRadius);
            this.searchRadius.startup();
            
        },
        
        geocoderFoundResult: function(e)
        {   
            if (e && e.result && e.result.feature)
            {
                console.log('found new destination',e.result.feature);
                this.emit('new-destination',{destination:e.result});
                return true;
            }
            else
            {
                console.log("Unable to find destination");
            }
        }
    });
 
});