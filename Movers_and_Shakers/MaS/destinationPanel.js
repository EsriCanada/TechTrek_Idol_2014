define([
    "require",
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/mouse",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
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
    "esri/graphic",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color",
    
    "./destinationDA"
], function(
    require,
    declare,
    array,
    lang,
    on,
    mouse,
    _WidgetBase,
    _TemplatedMixin,
    domStyle,
    domConstruct,
    template,
    i18n,
    
    Button,
    NumberSpinner,
    RadioButton,
    ContentPane,
    
    Geocoder,
    PopupTemplate,
    Graphic,
    SimpleFillSymbol,
    SimpleLineSymbol,
    Color,
    
    destinationDA
) {
    
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        i18n: i18n,
        map:null,
        spinnerImageUrl: require.toUrl("./templates/spinner.gif"),
        startup: function(opts)
        {
            this.map = opts.map;
            this.inherited(arguments);
            this.geocoder = new Geocoder({map:this.map,arcgisGeocoder:{sourceCountry:"CAN"},autoNavigate:false,autoComplete:true},this.geocoderNode);
            this.geocoder.startup();
            this.geocoder.on("select",lang.hitch(this,this.geocoderFoundResult));
            this.geocoder.on("clear",lang.hitch(this,this.clearPanel));
            
            this.backButton = new Button({style:"margin-left:0.5em;",label:this.i18n.destinationPanel.backButton},this.backButton);
            this.backButton.startup();
            this.backButton.on('click',lang.hitch(this,function(){
                this.emit('back-selected');
            }));
            
            this.rsButton = new Button({style:"display:none;margin-left:0.5em;",label:this.i18n.destinationPanel.showRealEstateButtonLabel},this.rsButton);
            this.rsButton.startup();
            this.rsButton.on('click',lang.hitch(this,function(){
                this.emit('realestate-search-selected');
            }));
            
            this.destinationDetails = new ContentPane({"region":"center"},this.destinationDetails);
            this.destinationDetails.startup();
            
            this.searchRadius = new NumberSpinner({"class":"MaS-searchRadius",value:"10",smallDelta:1,constraints: {min:1,max:100,places:0}},this.searchRadius);
            this.searchRadius.startup();
            
            this.radioLikeMyCluster = new RadioButton({
                checked: true,
                name: "MaS_clusterORgroup"
            },this.radioLikeMyCluster);
            this.radioLikeMyCluster.startup();
            if (this._homeCluster!=false) this.setHomeCluster(this._homeCluster);
            
            this.radioLikeMyGroup = new RadioButton({
                checked: false,
                name: "MaS_clusterORgroup"
            },this.radioLikeMyGroup);
            this.radioLikeMyGroup.startup();
            
            this.searchButton = new Button({label:this.i18n.destinationPanel.searchButton},this.searchButton);
            this.searchButton.startup();
            this.searchButton.on('click',lang.hitch(this,function(){
                this.clearList();
                this.showProgress();
                this.emit('search-destinations',{radius:this.searchRadius.getValue(),byGroup:this.radioLikeMyGroup.checked});
            }));
            
            on(this.summaryList,"click",lang.hitch(this,this.clickedDA));
            on(this.summaryList,"mousemove",lang.hitch(this,this.hoverDA));
            on(this.summaryList,mouse.leave,lang.hitch(this,this.unhoverDA));  
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
                this.clearPanel();
            }
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
        
        setDestinationInfo: function(daFeatures,daOidFieldName,clusterData)
        {
            this.hideProgress();
            if (daFeatures && daFeatures.length>0)
            {
                this.clearList();
                this._daFeatures = daFeatures;
                this._daOidFieldName = daOidFieldName;
                this._clusterData = clusterData;
                domStyle.set(this.summaryPane,"display","block");
                domStyle.set(this.rsButton.domNode,"display","inline-block");
                this.totalDestinationDAsCount.innerHTML = daFeatures.length;
                
                var i = 1;
                array.forEach(daFeatures,lang.hitch(this,function(da){
                    var daItem = new destinationDA();
                    daItem.startup({
                        map:this.map,
                        daFeature:da,
                        itemNumber:i,
                        clusterName:clusterData.clusters[""+da.attributes["DOM_PRIZMC2"]].attributes.Cluster_Name
                    });
                    domConstruct.place(daItem.domNode,this.summaryList,"last");
                    i++;
                    console.log(daItem);
                }));
            }
            else
            {
                this.clearPanel();
            }
        },
        
        clearList: function()
        {
            domStyle.set(this.summaryPane,"display","none");
            domStyle.set(this.rsButton.domNode,"display","none");
            while (!!this.summaryList.children[0])
            {
                this.summaryList.removeChild(this.summaryList.children[0]);
            }
        },
        
        clearPanel: function()
        {
            this.clearList();
            domStyle.set(this.destinationDetails.domNode,"display","none");
            this.emit('panel-cleared');
        },
        
        showProgress: function()
        {
            domStyle.set(this.progressIndicator,"display","block");
        },
        
        hideProgress: function()
        {
            domStyle.set(this.progressIndicator,"display","none");
        },
        
        clickedDA: function(e)
        {
            var target = e.target||e.toElement;
            console.log('clicked',e);
            if (target._daFeature)
            {
                this.map.setExtent(target._daFeature.geometry.getExtent().expand(2),true);
            }
        },
        
        hoverDA: function(e)
        {
            var target = e.target||e.toElement;
            if (target._daFeature)
            {
                console.log('highlight',target._daFeature);
                if (!this._highlightGraphic)
                {
                    this._highlightGraphic = new Graphic(
                        target._daFeature.geometry,
                        new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,255,255]), 5),new Color([0,0,0,0]))
                    );
                }
                else
                {
                    this._highlightGraphic.setGeometry(target._daFeature.geometry);
                }
                if (!this._highlightGraphic.getLayer())
                {
                    this.map.graphics.add(this._highlightGraphic);
                }
            }
        },
        
        unhoverDA: function(e)
        {
            if (this._highlightGraphic && this._highlightGraphic.getLayer())
            {
                this._highlightGraphic.getLayer().remove(this._highlightGraphic);
                this._highlightGraphic = null;
            }
        }
    });
 
});