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
          
    "esri/IdentityManager",
    
    "./introPanel",
    "./destinationPanel",
    
    "./popupTemplates",
    "./clusterGroups"
    
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
    
    IdentityManager,
    
    introPanel,
    destinationPanel,
    
    popupTemplates,
    clusterGroups
) {
    
    
    return declare(null, {
        startup: function(app,toolConfig,toolbar)
        {
        
            window.map = toolbar.map;
    
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
            
            this.daLayer = new FeatureLayer(this.toolConfig.daFeatures,{outFields:["*"]});
            this.daLayer.hide();
            
            this.daOidFieldName = "OBJECTID";
            this.daHomeOid = -1;
            this.daHomeFeature = {attributes:{}};
            this.renderer = new UniqueValueRenderer(null, function(feature){
                if (feature.attributes[this.daOidFieldName]==this.daHomeOid)
                {
                    return "HOME_DA";
                }
                else if (feature.attributes["DOM_PRIZMC2"]==this.daHomeFeature.attributes["DOM_PRIZMC2"])
                {
                    return "SAME_CLUSTER";
                }
                else if (array.some(this.daHomeSocialGroupClusters,lang.hitch(this,function(cluster){ cluster==this.daHomeFeature.attributes["DOM_PRIZMC2"] })))
                {
                    return "SAME_GROUP";
                }
            });
            this.renderer.addValue("HOME_DA",new SimpleFillSymbol().setColor(new Color([255,0,0,0.3])));
            this.renderer.addValue("SAME_CLUSTER",new SimpleFillSymbol().setColor(new Color([255,122,0,0.3])));
            this.renderer.addValue("SAME_GROUP",new SimpleFillSymbol().setColor(new Color([255,0,122,0.3])));
            
            this.daDisplayLayer = new GraphicsLayer({id:"daDisplayLayer"});
            this.daDisplayLayer.setRenderer(this.renderer);
            this.daLayer.setRenderer(this.renderer);
            
            this.map.addLayer(this.daDisplayLayer);
            this.map.addLayer(this.daLayer);
            
            var deferred = new Deferred();
            
            // Set the tooltip for the module name...this is what shows up for the tooltip of the icon in the toolbar, as well as the panel header.
            this.config.i18n.tooltips[toolConfig.name] = i18n.toolName;
            
            var tool = toolbar.createTool(toolConfig, "large");
            
            this.contentPanel = new ContentPane({"class":"MaS-contentPanel","region":"center"});
            this.contentPanel.startup();
            
            this.intro = new introPanel({map:this.toolbar.map});
            this.intro.startup();
            
            this.destination = new destinationPanel({map:this.toolbar.map});
            this.destination.startup();
            this.destination.on('back-selected',lang.hitch(this,function(){
                this.dropPanelContent();
                this.contentPanel.setContent(this.intro.domNode);
            }));
            
            this.contentPanel.setContent(this.intro.domNode);
            this.contentPanel.placeAt(tool);
            
            this.intro.on('postal-code-found',lang.hitch(this,this.getDAInfo));
            this.intro.on('home-selected',lang.hitch(this,function(){
                this.destination.setHomeCluster(this.homeClusterFeature);
                this.dropPanelContent();
                this.contentPanel.setContent(this.destination.domNode);
            }));
            
            this.destination.on('new-destination',lang.hitch(this,this.getDestinationDA));
            this.destination.on('search-destinations',lang.hitch(this,this.searchDestinations));
            
            toolbar.activateTool(this.config.activeTool || toolConfig.name);
            deferred.resolve(true);
            
            return deferred.promise;
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
            }
            else
            {
                console.log('foundDAInfo',results);
                
                this.daOidFieldName = results.objectIdFieldName;
                this.daHomeFeature = results.features[0];
                this.daHomeOid = this.daHomeFeature.attributes[this.daOidFieldName]
                
                this.daDisplayLayer.clear();
                this.daDisplayLayer.add(this.daHomeFeature);
                
                var clusterQuery = new RelationshipQuery();
                clusterQuery.outFields = ["*"];
                clusterQuery.objectIds = [this.daHomeOid];
                clusterQuery.relationshipId = 0;
                this.daLayer.queryRelatedFeatures(clusterQuery).then(lang.hitch(this,this.foundClusterInfo),function(e){console.log("Error:",e);});
            }
        },
        
        foundClusterInfo: function(results)
        {
            if (!results || !results[this.daHomeFeature.attributes[this.daOidFieldName]] || !results[this.daHomeFeature.attributes[this.daOidFieldName]].features  || !results[this.daHomeOid].features.length>0)
            {
                console.log("No Cluster Found",results,this.daHomeFeature,this.daOidFieldName);
                this.intro.setClusterInfo(this.daHomeFeature,null);
                this.toolbar.map.setExtent(this.daHomeFeature.geometry.getExtent(),true);
            }
            else
            {
                this.homeClusterFeature = results[this.daHomeOid].features[0];
                this.intro.setClusterInfo(this.daHomeFeature,this.homeClusterFeature);
                this.toolbar.map.setExtent(this.daHomeFeature.geometry.getExtent(),true);
            }
        },
        
        getDestinationDA: function(e)
        {
            map.graphics.clear();
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
            }
            else
            {
                console.log('foundDestinationDAInfo',results,destinationCoord);
                
                this.daDestinationFeature = results.features[0];
                this.daDestinationOid = this.daDestinationFeature.attributes[this.daOidFieldName];
                
                this.daDestinationFeature.setInfoTemplate(popupTemplates.daTemplate);
                this.daDestinationCoordinate = new Graphic(
                    destinationCoord.geometry,
                    new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 1), new Color([0,255,0,0.25])),
                    this.daDestinationFeature.attributes,
                    ((this.daDestinationFeature.attributes["DOM_PRIZMC2"]*1)==67?popupTemplates.noClusterGraphic:popupTemplates.daTemplate)
                );
                this.toolbar.map.graphics.add(this.daDestinationCoordinate)
                this.toolbar.map.setExtent(this.daDestinationFeature.geometry.getExtent(),true);
                this.destination.showSearchOptions();
            }
        },
        
        searchDestinations: function(searchParams)
        {
            console.log(clusterGroups[this.homeClusterFeature.attributes["Social_Group"]]);
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
