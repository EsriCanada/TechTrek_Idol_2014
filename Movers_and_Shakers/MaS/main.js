define([
    "require",
    "dojo/ready",
    "dojo/json",
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom",
    "dojo/dom-geometry",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/on",
    "dojo/Deferred",
    "dojo/promise/all",
    "dojo/query",
    "dojo/i18n!./nls/resources",
    
    "dijit/layout/ContentPane",
    
    "esri/Color",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",
    "esri/tasks/query",
    "esri/tasks/RelationshipQuery",
    "esri/renderers/UniqueValueRenderer", 
    "esri/graphic",
    
    "esri/tasks/GeometryService",
    "esri/tasks/BufferParameters",
          
    "esri/config",
    "esri/IdentityManager",
    "esri/urlUtils",
    
    "./introPanel",
    "./destinationPanel",
    "./rsPanel",
    "./rsModule",
    
    "./popupTemplates"
    
], function (
    require,
    ready,
    JSON,
    array,
    declare,
    lang,
    dom,
    domGeometry,
    domAttr,
    domClass,
    domConstruct,
    domStyle,
    on,
    Deferred,
    all,
    query,
    i18n,
    
    ContentPane,
    
    Color,
    SimpleFillSymbol,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    GraphicsLayer,
    FeatureLayer,
    Query,
    RelationshipQuery,
    UniqueValueRenderer,
    Graphic,
    
    GeometryService,
    BufferParameters,
    
    esriConfig,
    IdentityManager,
    urlUtils,
    
    introPanel,
    destinationPanel,
    rsPanel,
    rsModule,
    
    popupTemplates
) {
    
    
    return declare(null, {
        startup: function(app,toolConfig,toolbar)
        {
        
            window.mas = this;
    
            if (window && window.localStorage && window.localStorage.getItem("idManagerCredentials"))
            {
                IdentityManager.initialize(JSON.parse(window.localStorage.getItem("idManagerCredentials")));
            }
            
            // Save credentials when we get credentials matching our feature service:
            IdentityManager.on('credential-create',lang.hitch(this,this.saveCredential));
            
            // Clear credentials if the IdentityManger object says to do so:
            IdentityManager.on('credentials-destroy',lang.hitch(this,this.cearCredential));
            
            console.log('mas startup',app,app.config);
            this.app = app;
            this.config = this.app.config;
            this.toolConfig = toolConfig;
            this.toolbar = toolbar;
            this.map = this.toolbar.map;
            
            if (this.toolConfig.proxyRule)
            {
                urlUtils.addProxyRule(this.toolConfig.proxyRule);
            }
            
            // Initialize cluster data from the clusterData feature service
            this.clusterData = {clusters:{},groups:{}};
            var query = new Query();
            query.outFields = ["*"];
            query.returnGeometry = false;
            query.where = "1=1";
            var clusterDataDeferred = new Deferred();
            this.clusterDataLayer = new FeatureLayer(this.toolConfig.clusterData,{outFields:["*"]});
            this.clusterDataReady = clusterDataDeferred.promise;
            this.clusterDataLayer = this.clusterDataLayer.queryFeatures(query).then(lang.hitch(this,function(results){
                this.parseClusterData(results,clusterDataDeferred);
            }),function(error){
                console.log("Error retrieving cluster data: ",error);
            });
            
             this.daLayer = new FeatureLayer(this.toolConfig.daFeatures,{outFields:["*"]});
            this.daLayer.hide();
            
            this.daOidFieldName = "OBJECTID";
            this.daHomeOid = -1;
            this.daHomeFeature = {attributes:{}};
            
            // When we have cluster info ready, setup the renderer for the graphics layers.
            this.clusterDataReady.then(lang.hitch(this,function(){
                this.renderer = new UniqueValueRenderer(null, lang.hitch(this,function(feature){
                    if (feature.attributes[this.daOidFieldName]==this.daHomeOid)
                    {
                        return "HOME_DA";
                    }
                    else if (feature.attributes["DOM_PRIZMC2"]==this.daHomeFeature.attributes["DOM_PRIZMC2"])
                    {
                        return "SAME_CLUSTER";
                    }
                    else
                    {
                        homeGroup = this.clusterData.clusters[""+this.daHomeFeature.attributes["DOM_PRIZMC2"]].attributes.Social_Group;
                        groupClusters = this.clusterData.groups[homeGroup].clusters;
                        if (array.some(groupClusters,lang.hitch(this,function(cluster){ return (""+cluster)==(""+feature.attributes["DOM_PRIZMC2"]); })))
                        {
                            return "SAME_GROUP";
                        }
                        else
                        {
                            console.log('Unrendered feature.',feature.attributes["DOM_PRIZMC2"]);
                        }
                    }
                }));
                this.renderer.addValue("HOME_DA",new SimpleFillSymbol().setColor(new Color([255,0,0,0.3])));
                this.renderer.addValue("SAME_CLUSTER",new SimpleFillSymbol().setColor(new Color([255,0,0,0.3])));
                this.renderer.addValue("SAME_GROUP",new SimpleFillSymbol().setColor(new Color([255,122,0,0.3])));
                this.daLayer.setRenderer(this.renderer);
                this.daDisplayLayer.setRenderer(this.renderer);
            }));
            
            this.daDisplayLayer = new GraphicsLayer({id:"daDisplayLayer"});
            
            this.map.addLayer(this.daDisplayLayer);
            this.map.addLayer(this.daLayer);
            
            var deferred = new Deferred();
            
            // Set the tooltip for the module name...this is what shows up for the tooltip of the icon in the toolbar, as well as the panel header.
            this.config.i18n.tooltips[toolConfig.name] = i18n.toolName;
            
            var tool = toolbar.createTool(toolConfig, "large");
            
            this.contentPanel = new ContentPane({"class":"MaS-contentPanel","region":"center"});
            this.contentPanel.startup();
            
            this.intro = new introPanel({map:this.map});
            this.intro.startup();
            
            this.destination = new destinationPanel();
            this.destination.startup({map:this.toolbar.map});
            this.destination.on('back-selected',lang.hitch(this,function(){
                this.dropPanelContent();
                this.contentPanel.setContent(this.intro.domNode);
                this.showHomeDA();
            }));
            
            this.destination.on('realestate-search-selected',lang.hitch(this,function(){
                this.dropPanelContent();
                this.realestate._destinationDAFeatures = this._destinationDAFeatures;
                this.realestate.clearList();
                this.contentPanel.setContent(this.realestate.domNode);
            }));
            
            this.realestate = new rsPanel();
            this.realestate.startup({map:this.map});
            this.realestate.on('back-selected',lang.hitch(this,function(){
                this.dropPanelContent();
                this.contentPanel.setContent(this.destination.domNode);
                this.showDestinationDAs();
            }));
            
            this.rsModule = new rsModule();
            this.rsModule.startup({map:this.map});
            this.realestate.on('search-clicked',lang.hitch(this,this.executeRealestateSearch));
            
            this.contentPanel.setContent(this.intro.domNode);
            this.contentPanel.placeAt(tool);
            
            this.intro.on('postal-code-found',lang.hitch(this,this.getDAInfo));
            this.intro.on('home-selected',lang.hitch(this,function(){
                this.destination.setHomeCluster(this.homeClusterFeature);
                this.destination.clearPanel();
                //this.daDisplayLayer.clear();
                this.dropPanelContent();
                this.contentPanel.setContent(this.destination.domNode);
            }));
            this.intro.on('clear-home',lang.hitch(this,function(){
                this.map.graphics.clear();
                this.daDisplayLayer.clear();
                this._destinationDAFeatures = [];
            }));
            
            this.destination.on('new-destination',lang.hitch(this,this.getDestinationDA));
            this.destination.on('search-destinations',lang.hitch(this,this.searchDestinations));
            this.destination.on('panel-cleared',lang.hitch(this,this.clearDestinationLocation));
            
            toolbar.activateTool(this.config.activeTool || toolConfig.name);
            deferred.resolve(true);
            
            return deferred.promise;
        },
        
        parseClusterData: function(results,clusterDataDeferred)
        {
            if (!results || !results.features || !results.features.length>0)
            {
                console.log("No Cluster Info Found");
            }
            else
            {
                array.forEach(results.features,lang.hitch(this,function(cluster){
                    this.clusterData.clusters[""+cluster.attributes.Cluster] = cluster;
                    if (!this.clusterData.groups[cluster.attributes.Social_Group])
                    {
                        this.clusterData.groups[cluster.attributes.Social_Group] = {clusters:[]}
                    }
                    this.clusterData.groups[cluster.attributes.Social_Group].clusters.push(cluster.attributes.Cluster);
                }));
                
                clusterDataDeferred.resolve(true);
            }
        },
        
        getDAInfo: function(e)
        {
            console.log('getDAInfo',e);
            var query = new Query();
            query.outFields = ["*"];
            query.returnGeometry = true;
            query.geometry = e.postalCode.feature.geometry;
            this.daLayer.queryFeatures(query).then(lang.hitch(this,this.foundDAInfo),function(e){console.log("Error:",e);});
            
        },
        
        foundDAInfo: function(results)
        {
            if (!results || !results.features || !results.features.length>0)
            {
                console.log("No DA Found");
                alert(i18n.alerts.noDestinationDAsFound);
                this.destination.hideProgress();
            }
            else
            {
                console.log('foundDAInfo',results);
                
                this.daOidFieldName = results.objectIdFieldName;
                this.daHomeFeature = results.features[0];
                this.daHomeOid = this.daHomeFeature.attributes[this.daOidFieldName]
                
                this.showHomeDA();
            }
        },
        
        showHomeDA: function()
        {
            this.daDisplayLayer.clear();
            this.daDisplayLayer.add(this.daHomeFeature);
            
            this.clusterDataReady.then(lang.hitch(this,function(){
                if (this.clusterData.clusters[""+this.daHomeFeature.attributes["DOM_PRIZMC2"]])
                {
                    this.homeClusterFeature = this.clusterData.clusters[""+this.daHomeFeature.attributes["DOM_PRIZMC2"]];
                    this.intro.setClusterInfo(this.daHomeFeature,this.homeClusterFeature);
                    this.toolbar.map.setExtent(this.daHomeFeature.geometry.getExtent(),true);
                }
                else
                {
                    console.log("No Cluster Found",results,this.daHomeFeature,this.daOidFieldName);
                    this.intro.setClusterInfo(this.daHomeFeature,null);
                    this.toolbar.map.setExtent(this.daHomeFeature.geometry.getExtent(),true);
                }
            }));
        },
        
        getDestinationDA: function(e)
        {
            this.map.graphics.clear();
            var query = new Query();
            query.outFields = ["*"];
            query.returnGeometry = true;
            query.geometry = e.destination.feature.geometry;
            this.daLayer.queryFeatures(query).then(lang.hitch(this,function(results){this.foundDestinationDAInfo(results,e.destination.feature);}),function(e){console.log("Error:",e);});
        },
        
        
        foundDestinationDAInfo: function(results,destinationCoord)
        {
            if (!results || !results.features || !results.features.length>0)
            {
                console.log("No DA Found");
                alert(i18n.alerts.noDestinationDAsFound);
                this.destination.hideProgress();
            }
            else
            {
                console.log('foundDestinationDAInfo',results,destinationCoord);
                
                this.daDestinationFeature = results.features[0];
                this.daDestinationOid = this.daDestinationFeature.attributes[this.daOidFieldName];
                
                this.daDestinationFeature.setInfoTemplate(popupTemplates.daTemplate);
                this.daDestinationCoordinate = new Graphic(
                    destinationCoord.geometry,
                    new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 2), new Color([0,255,0,0.5])),
                    this.daDestinationFeature.attributes,
                    ((this.daDestinationFeature.attributes["DOM_PRIZMC2"]*1)==67?popupTemplates.noClusterGraphic:popupTemplates.daTemplate)
                );
                this.showDestinationLocation();
            }
        },
        
        showDestinationLocation: function()
        {
            this.map.graphics.clear();
            if (this.daDestinationCoordinate && this.daDestinationFeature)
            {
                this.map.graphics.add(this.daDestinationCoordinate)
                this.map.setExtent(this.daDestinationFeature.geometry.getExtent(),true);
                this.destination.showSearchOptions();
            }
        },
        
        clearDestinationLocation: function()
        {
            if (this.daDestinationCoordinate && this.daDestinationCoordinate.getLayer()==this.map.graphics)
            {
                this.map.graphics.remove(this.daDestinationCoordinate);
            }
            
            this.clearDestinationDAs();
        },
        
        searchDestinations: function(searchParams)
        {
            this.clearDestinationDAs();
            var params = new BufferParameters();
            params.distances = [ searchParams.radius ];
            params.bufferSpatialReference = this.daDestinationCoordinate.geometry.spatialReference;
            params.outSpatialReference = this.daDestinationCoordinate.geometry.spatialReference;
            params.unit = GeometryService.UNIT_KILOMETER;
            params.geometries = [this.daDestinationCoordinate.geometry];
            esriConfig.defaults.geometryService.buffer(params).then(
                lang.hitch(this,function(bufferResult){
                    if (bufferResult && bufferResult[0])
                    {
                        this.clusterDataReady.then(lang.hitch(this,function(){
                            var query = new Query();
                            query.outFields = ["*"];
                            query.returnGeometry = true;
                            if (searchParams.byGroup)
                            {
                                query.where = "DOM_PRIZMC2 in (" + this.clusterData.groups[this.homeClusterFeature.attributes["Social_Group"]].clusters.join(",") + ")";
                            }
                            else
                            {
                                query.where = "DOM_PRIZMC2 = "+this.daHomeFeature.attributes["DOM_PRIZMC2"];
                            }
                            query.geometry = bufferResult[0];
                            this.daLayer.queryFeatures(query).then(lang.hitch(this,this.foundDestinationSearchResults),function(error){
                                console.log("Error performing destination DA search: ",error);
                            });
                        }));
                    }
                }),
                lang.hitch(this,function(error){
                    console.log("Error generating buffer geometry: ",error);
                })
            );
        },
        
        foundDestinationSearchResults: function(results)
        {
            if (!results || !results.features || !results.features.length>0)
            {
                console.log("No DA Found");
                alert(i18n.alerts.noDestinationDAsFound);
                this.destination.clearList();
                this.destination.hideProgress();
            }
            else
            {
                this._destinationDAFeatures = results.features;
                this.showDestinationDAs();
            }
        },
        
        showDestinationDAs: function()
        {
            if (this._destinationDAFeatures && this._destinationDAFeatures.length>0)
            {
                //this.daDisplayLayer.clear();
                var zoomExtent = this.daDestinationFeature.geometry.getExtent();
                array.forEach(this._destinationDAFeatures,lang.hitch(this,function(da){
                    da.setInfoTemplate(popupTemplates.daTemplate);
                    this.daDisplayLayer.add(da);
                    zoomExtent = zoomExtent.union(da.geometry.getExtent());
                }));
                
                this.destination.setDestinationInfo(this._destinationDAFeatures,this.daOidFieldName,this.clusterData);
                this.toolbar.map.setExtent(zoomExtent,true);
            }
            else
            {
                this.destination.clearPanel();
            }
        },
        
        clearDestinationDAs: function()
        {
            if (this._destinationDAFeatures && this._destinationDAFeatures.length>0)
            {
                array.forEach(this._destinationDAFeatures,lang.hitch(this,function(da){
                    this.daDisplayLayer.remove(da);
                }));
                this.destination.clearList();
                this._destinationDAFeatures = [];
            }
        },
        
        executeRealestateSearch: function(options)
        {
            this.rsModule.submitSearch(this._destinationDAFeatures,options).then(lang.hitch(this,this.showRealestateSearchResults),function(error){
                console.log("Error executing real estate search: ",error);
            });  
        },
        
        showRealestateSearchResults: function(e)
        {
            console.log("got search results: ",e);
            if (e && e.listings && e.listings.length)
            {
                this._rsListings = e.listings;
                array.forEach(this._rsListings,lang.hitch(this,function(listing){
                    this.map.graphics.add(listing);
                }));
                
                this.realestate.setRealestateListings(this._rsListings,e.totalpossible);
            }
            else
            {
                alert(i18n.alerts.noRealestateListingsFound);
                this.realestate.hideProgress();
            }
        },
        
        clearRealestateSearchResults: function()
        {
            if (this._rsListings && this._rsListings.length>0)
            {
                array.forEach(this._rsListings,lang.hitch(this,function(listing){
                    this.map.graphics.remove(listing);
                }));
                this.realestate.clearList();
                this._rsListings = [];
            }
        },
        
        // This removes content from the content panel without destroying nodes (so they can be added again later).  The ContentPane.setContent() method destroys any existing content that it contains before adding new content.
        dropPanelContent: function()
        {
            while (!!this.contentPanel.containerNode.children[0])
            {
                this.contentPanel.containerNode.removeChild(this.contentPanel.containerNode.children[0]);
            }
        },
        
        saveCredential: function(credentialInfo)
        {
            if (array.some(credentialInfo.credential.resources,lang.hitch(this,function(resource){ return resource==this.toolConfig.daFeatures; } )))
            {
                console.log('got credential',credentialInfo);
                var idJson = JSON.stringify(IdentityManager.toJson());
                if (window && window.localStorage)
                {
                    window.localStorage.setItem("idManagerCredentials",idJson);
                }
            }
        },
        
        clearCredential: function()
        {
            if (window && window.localStorage && window.localStorage.getItem("idManagerCredentials"))
            {
                window.localStorage.setItem("idManagerCredentials",false);
            }
        }
        
    });
});
