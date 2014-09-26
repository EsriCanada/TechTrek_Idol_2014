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
    "dojo/text!./templates/introPanel.html",
    "dojo/i18n!./nls/resources",
    
    "dijit/form/Button",
    "dijit/layout/ContentPane",
    
    "esri/dijit/Geocoder",
    "esri/graphic",
    
    "./popupTemplates"
], function(require, declare, array, lang, on, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented, domStyle, domConstruct, template, i18n, Button, ContentPane, Geocoder, Graphic, popupTemplates) {
    console.log(popupTemplates)
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        i18n: i18n,
        startup: function()
        {
            this.inherited(arguments);
            this.geocoder = new Geocoder({map:this.map,arcgisGeocoder:{sourceCountry:"CAN"},autoNavigate:false,autoComplete:false},this.geocoderNode);
            this.geocoder.startup();
            this.geocoder.on("find-results",lang.hitch(this,this.geocoderFoundResult));
            this.geocoder.on("clear",lang.hitch(this,function(){
                this.emit('clear-home');
            }));
            this.nextButton = new Button({style:"display:none;margin-left:0.5em;",label:this.i18n.introPanel.nextButton},this.nextButton);
            this.nextButton.startup();
            this.nextButton.on('click',lang.hitch(this,function(){
                this.emit('home-selected',{daFeature:this._currentDAFeature,clusterFeature:this._currentClusterFeature});
            }));
            this.clusterDetails = new ContentPane({},this.clusterDetails);
            this.clusterDetails.startup();
            
            this.on('clear-home',lang.hitch(this,this.clearPanel));
        },
        
        geocoderFoundResult: function(e)
        {
            console.log(e);
            if (e && e.results && e.results.results && e.results.results.length>0)
            {
                return array.some(e.results.results,lang.hitch(this,function(result){
                    if (result.feature && result.feature.attributes.score==100 && /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(result.name))
                    {
                        console.log('postal-code-found',result);
                        this.emit('postal-code-found',{postalCode:result});
                    }
                }));
            }
            else
            {
                console.log("Invalid Postal Code");
                this.emit('clear-home');
            }
        },
        
        setClusterInfo: function(daFeature,clusterFeature)
        {
            console.log('setClusterInfo',daFeature,clusterFeature);
            if (clusterFeature && clusterFeature.attributes["Cluster"]!=67 && !!clusterFeature.attributes["Cluster"])
            {
                daFeature.setInfoTemplate(popupTemplates.homeDaTemplate);
                this.setDemographicInfo(daFeature,clusterFeature);
                domStyle.set(this.nextButton.domNode,"display","inline-block");
                this._currentDAFeature = daFeature;
                this._currentClusterFeature = clusterFeature;
            }
            else
            {
                this.setDemographicInfo(popupTemplates.noClusterHomeGraphic,null);
                domStyle.set(this.nextButton.domNode,"display","none");
                this._currentDAFeature = null;
                this._currentClusterFeature = null;
            }
            
        },
        
        setDemographicInfo: function(daFeature,clusterFeature)
        {
            console.log(daFeature);
            var content = daFeature.getContent();
            this.clusterDetails.set("content",content);
            domStyle.set(this.clusterDetails.domNode,"display","block");
        },
        
        clearPanel: function()
        {
            while (!!this.clusterDetails.domNode.children[0])
            {
                this.clusterDetails.domNode.removeChild(this.clusterDetails.domNode.children[0]);
            }
            domStyle.set(this.clusterDetails.domNode,"display","none");
        },
        
        // Function for padding integers with zeros (credits to: https://gist.github.com/aemkei/1180489 ):
        pad: function(a,b){return([1e15]+a).slice(-b)}
        
    });
 
});