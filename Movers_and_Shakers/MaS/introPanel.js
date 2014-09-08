define([
    "require",
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/on",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/Evented",
    "dojo/dom-style",
    "dojo/text!./templates/introPanel.html",
    "dojo/i18n!./nls/resources",
    
    "esri/dijit/Geocoder"
], function(require, declare, array, lang, on, _WidgetBase, _TemplatedMixin, Evented, domStyle, template, i18n, Geocoder) {
    
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        i18n: i18n,
        
        noDataClusterGraphic: require.toUrl("./clustergraphics/ClusterDesc_67.png"),
        
        startup: function()
        {
            this.inherited(arguments);
            this.geocoder = new Geocoder({map:this.map,arcgisGeocoder:{sourceCountry:"CAN"},autoNavigate:false,autoComplete:false},this.geocoderNode);
            this.geocoder.startup();
            this.geocoder.on("find-results",lang.hitch(this,this.geocoderFoundResult));
        },
        
        geocoderFoundResult: function(e)
        {
            if (/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(e.results.value))
            {
                array.some(e.results.results,lang.hitch(this,function(result){
                    if (result.feature.attributes.score==100 && /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(result.name))
                    {
                        this.emit('postal-code-found',{postalCode:result});
                        return true;
                    }
                }));
            }
            else
            {
                console.log("Invalid Postal Code");
            }
        },
        
        setClusterInfo: function(daFeature,clusterFeature)
        {
            console.log('setClusterInfo',daFeature,clusterFeature);
            if (clusterFeature && clusterFeature.attributes["Cluster"]!=67)
            {
                this.clusterGraphic.src = require.toUrl("./clustergraphics/ClusterDesc_"+this.pad(clusterFeature.attributes["Cluster"],2)+".png");
                domStyle.set(this.clusterDetails,"display","block");
                this.clusterTitle.innerHTML = i18n.introPanel.homeClusterTitle;
            }
            else
            {
                this.clusterGraphic.src = require.toUrl("./clustergraphics/ClusterDesc_67.png");
                domStyle.set(this.clusterDetails,"display","block");
                this.clusterTitle.innerHTML = i18n.introPanel.noDataClusterTitle;
            }
            
        },
        
        // Function for padding integers with zeros (credits to: https://gist.github.com/aemkei/1180489 ):
        pad: function(a,b){return([1e15]+a).slice(-b)}
        
    });
 
});