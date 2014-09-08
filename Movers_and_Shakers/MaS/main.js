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
    
    "esri/Color",
    "esri/symbols/SimpleFillSymbol",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",
    "esri/tasks/query",
    "esri/tasks/RelationshipQuery",
    "esri/renderers/UniqueValueRenderer", 
    
    "esri/IdentityManager",
    
    "./introPanel",
    "./Chart"
    
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
    
    Color,
    SimpleFillSymbol,
    GraphicsLayer,
    FeatureLayer,
    Query,
    RelationshipQuery,
    UniqueValueRenderer,
    
    IdentityManager,
    
    introPanel,
    Chart
) {
    
    
    return declare(null, {
        startup: function(app,toolConfig,toolbar)
        {
        
            console.log(this);
    
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
            
            this.daLayer = new FeatureLayer(this.toolConfig.daFeatures);
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
            this.renderer.addValue("SAME_GROUP",new SimpleFillSymbol().setColor(new Color([255,122,0,0.3])));
            
            this.daDisplayLayer = new GraphicsLayer({id:"daDisplayLayer"});
            this.daDisplayLayer.setRenderer(this.renderer);
            this.daLayer.setRenderer(this.renderer);
            
            this.map.addLayer(this.daDisplayLayer);
            this.map.addLayer(this.daLayer);
            
            var deferred = new Deferred();
            
            // Set the tooltip for the module name...this is what shows up for the tooltip of the icon in the toolbar, as well as the panel header.
            this.config.i18n.tooltips[toolConfig.name] = i18n.toolName;
            
            var tool = toolbar.createTool(toolConfig, "large");
            
            this.intro = new introPanel({map:this.toolbar.map},tool);
            this.intro.startup();
            
            this.intro.on('postal-code-found',lang.hitch(this,this.getDAInfo));
            
            //domClass.add(contentNode, toolConfig.name+"-content");
            toolbar.activateTool(this.config.activeTool || toolConfig.name);
            deferred.resolve(true);
            
            return deferred.promise;
        },
        
        getDAInfo: function(e)
        {
            console.log('getDAInfo',e);
            var query = new Query();
            query.outFields = [ "*" ];
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
                
                this.daHomeFeature = results.features[0];
                this.daHomeOid = this.daHomeFeature.attributes[this.daOidFieldName]
                
                this.daDisplayLayer.clear();
                this.daDisplayLayer.add(this.daHomeFeature);
                
                this.daOidFieldName = results.objectIdFieldName;
                var clusterQuery = new RelationshipQuery();
                clusterQuery.outFields = ["*"];
                clusterQuery.objectIds = [this.daHomeFeature.attributes[this.daOidFieldName]];
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
                this.intro.setClusterInfo(this.daHomeFeature,results[this.daHomeOid].features[0]);
                this.toolbar.map.setExtent(this.daHomeFeature.geometry.getExtent(),true);
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
