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
    "dojo/text!./templates/rsPanel.html",
    "dojo/i18n!./nls/resources",
    
    "dijit/form/Button",
    "dijit/form/NumberSpinner",
    "dijit/form/RadioButton",
    "dijit/layout/ContentPane",
    
    "esri/dijit/Geocoder",
    "esri/dijit/PopupTemplate",
    "esri/graphic",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color",
    
    "./rsListing"
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
    SimpleMarkerSymbol,
    SimpleFillSymbol,
    SimpleLineSymbol,
    Color,
    
    rsListing
) {
    console.log('rspanel i18n',i18n);
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        i18n: i18n,
        map:null,
        startup: function(opts)
        {
            this.map = opts.map;
            this.inherited(arguments);
            
            this.backButton = new Button({style:"margin-left:0.5em;",label:this.i18n.destinationPanel.backButton},this.backButton);
            this.backButton.startup();
            this.backButton.on('click',lang.hitch(this,function(){
                this.emit('back-selected');
            }));
            
            this.searchButton = new Button({style:"margin-left:0.5em;",label:this.i18n.destinationPanel.searchButton},this.searchButton);
            this.searchButton.startup();
            this.searchButton.on('click',lang.hitch(this,function(){
                this.clearList();
                this.emit('search-clicked',{insideDAs:this.radioInsideMyDAs.checked});
            }));
            
            this.radioInsideMyDAs = new RadioButton({
                checked: true,
                name: "MaS_insideORoutside"
            },this.radioInsideMyDAs);
            this.radioInsideMyDAs.startup();
            
            this.radioOutsideMyDAs = new RadioButton({
                checked: false,
                name: "MaS_insideORoutside"
            },this.radioOutsideMyDAs);
            this.radioOutsideMyDAs.startup();
            
            on(this.summaryList,"click",lang.hitch(this,this.clickedListing));
            on(this.summaryList,"mousemove",lang.hitch(this,this.hoverListing));
            on(this.summaryList,mouse.leave,lang.hitch(this,this.unhoverListing)); 
        },
        
        setRealestateListings: function(listings,totalpossible)
        {
            if (listings && listings.length>0)
            {
                this._listings = listings;
                domStyle.set(this.summaryPane,"display","block");
                this.currentListingsLabel.innerHTML = this._listings.length;
                this.totalListingsCount.innerHTML = totalpossible;
                this.clearList();
                
                var i = 1;
                array.forEach(this._listings,lang.hitch(this,function(listing){
                    var rsItem = new rsListing();
                    rsItem.startup({
                        map:this.map,
                        listingFeature:listing,
                        itemNumber:i,
                        listingAddress:listing.attributes.address,
                        listingPrice:listing.attributes.price,
                        housingType:listing.attributes.housing_type
                    });
                    domConstruct.place(rsItem.domNode,this.summaryList,"last");
                    i++;
                    console.log(rsItem);
                }));
            }
            else
            {
                this.clearPanel();
            }
        },
        
        clearList:function()
        {
            while (!!this.summaryList.children[0])
            {
                this.summaryList.removeChild(this.summaryList.children[0]);
            }
        },
        
        clearPanel: function()
        {
            this.clearList();
        },
        
        clickedListing: function(e)
        {
            console.log('clicked',e.toElement._listingFeature.attributes);
            if (e.toElement._listingFeature)
            {
                this.map.infoWindow.setFeatures([e.toElement._listingFeature]);
                this.map.infoWindow.show(this.map.toScreen(e.toElement._listingFeature.geometry));
                this.map.centerAt(e.toElement._listingFeature.geometry);
            }
        },
        
        hoverListing: function(e)
        {
            if (e.toElement._listingFeature)
            {
                console.log('highlight',e.toElement._listingFeature);
                if (!this._highlightGraphic)
                {
                    this._highlightGraphic = new Graphic(
                        e.toElement._listingFeature.geometry,
                        new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,255,255]), 2), new Color([0,0,0,0]))
                    );
                }
                else
                {
                    this._highlightGraphic.setGeometry(e.toElement._listingFeature.geometry);
                }
                if (!this._highlightGraphic.getLayer())
                {
                    this.map.graphics.add(this._highlightGraphic);
                }
            }
        },
        
        unhoverListing: function(e)
        {
            if (this._highlightGraphic && this._highlightGraphic.getLayer())
            {
                this._highlightGraphic.getLayer().remove(this._highlightGraphic);
                this._highlightGraphic = null;
            }
        }
    });
 
});