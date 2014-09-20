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
    "dijit/form/RadioButton",
    "dijit/layout/ContentPane",
    
    "esri/dijit/Geocoder",
    "esri/dijit/PopupTemplate",
    "esri/graphic"
], function(require, declare, array, lang, on, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented, domStyle, domConstruct, template, i18n, Button, NumberSpinner, RadioButton, ContentPane, Geocoder, PopupTemplate, Graphic) {
    
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
                this.emit('more-selected');
            }));
            
            this.destinationDetails = new ContentPane({"region":"center"},this.destinationDetails);
            this.destinationDetails.startup();
            
            this.searchRadius = new NumberSpinner({"class":"MaS-searchRadius",value:"10",smallDelta:1,constraints: {min:1,max:50,places:0}},this.searchRadius);
            this.searchRadius.startup();
            
            this.radioLikeMyCluster = new RadioButton({
                checked: true,
                name: "MaS_clusterorgroup"
            },this.radioLikeMyCluster);
            this.radioLikeMyCluster.startup();
            if (this._homeCluster!=false) this.setHomeCluster(this._homeCluster);
            
            this.radioLikeMyGroup = new RadioButton({
                checked: false,
                name: "MaS_clusterorgroup"
            },this.radioLikeMyGroup);
            this.radioLikeMyGroup.startup();
            
            this.searchButton = new Button({label:this.i18n.destinationPanel.searchButton},this.searchButton);
            this.searchButton.startup();
            this.searchButton.on('click',lang.hitch(this,function(){
                this.emit('search-destinations',{radius:this.searchRadius.getValue(),byGroup:this.radioLikeMyGroup.checked});
            }));
            
        },
        
        setHomeCluster: function(homeCluster)
        {
            this._homeCluster = homeCluster;
            console.log('setHomeCluster',homeCluster);
            if (this._homeCluster) this.labelForLikeMyCluster.innerHTML = i18n.destinationPanel.likeMyCluster + " (" + this._homeCluster.attributes["Cluster_Name"] + ")";
            else this.labelForLikeMyCluster.innerHTML = i18n.destinationPanel.likeMyCluster;
        },
        
        showSearchOptions: function()
        {
            domStyle.set(this.destinationDetails.domNode,"display","block");
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