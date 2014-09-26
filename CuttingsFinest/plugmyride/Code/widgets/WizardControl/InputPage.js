define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/dom-construct",
  "dojo/_base/lang",
  'dojo/on',
  "dojo/dom-attr",
  "dijit/focus",
  "dojo/topic",
  "dojo/dom-style",
  "dojo/dom-class",
  "dojo/query",
  "esri/dijit/Geocoder",
  "esri/dijit/LocateButton",
  "esri/geometry/Extent",
  "esri/geometry/Polygon",
  "esri/request",
  "./Controls/ImageListTool/ImageListTool",
  "dojo/text!./template/inputPage.html"
], function(declare,_WidgetBase,_TemplatedMixin,_WidgetsInTemplateMixin,domConstruct,lang,on,domAttr,focusUtil, topic,domStyle,domClass,query,
	Geocoder,LocateButton,Extent,Polygon,esriRequest,ImageListTool,template){
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], 
	{
		templateString: template,
		baseClass: "input_page",
		imageList:null,
		runRouteAnalysis:true,
		runDriveTimeAnalysisAroundStart:true,
		runDriveTimeAnalysisAroundEnd:false,
		startingStop:null,
		endingStop:null,
		constructor:function(args)
		{
			console.log("inputpage constructor");
			//this.templateString = args.template;
		},
		postCreate: function() 
    	{
    		this.inherited(arguments);		
    		this.imageList= new ImageListTool({});
    		domConstruct.place(this.imageList.containerNode, this.vehicleController);
    		this.startGeocoder = new Geocoder({
	            map: this.map,
                autoComplete: true,
                autoNavigate: false
    		}, this.startingController);
    		
    		this.startGeoLocator= new LocateButton({
	            map: this.map,
                highlightLocation: false,
                centerAt:false,
                setScale:false
    		}, this.startingLocateButton);

            this.startGeoLocator.startup();
            on(this.startGeoLocator, "locate", lang.hitch(this, function(evt)
            {
            	console.log(evt.position.coords.latitude);
            	query('input',this.startGeocoder.containerNode).forEach(
            		function(node,idx)
            		{
            			node.value = "Current Location";
            		}
            	);
            	this.startGeocoder.results.push({extent:null,feature:evt.graphic,name:"Current Location"});
            }));
            
            this.stopGeocoder = new Geocoder({
	            map: this.map,
                autoComplete: true,
                autoNavigate: false
    		}, this.stopingController);
            this.stopGeocoder.startup();
	        
	        this.stopGeoLocator= new LocateButton({
	            map: this.map,
                highlightLocation: false,
                centerAt:false,
                setScale:false
    		}, this.stopingLocateButton);

            this.stopGeoLocator.startup();
            on(this.stopGeoLocator, "locate", lang.hitch(this, function(evt)
            {
            	console.log(evt.position.coords.latitude);
            	query('input',this.stopGeocoder.containerNode).forEach(
            		function(node,idx)
            		{
            			node.value = "Current Location";
            		}
            	);
            	this.stopGeocoder.results.push({extent:null,feature:evt.graphic,name:"Current Location"});
            }));
	            
    		this.eventGroupClick = on(this.btnGroup, "click", lang.hitch(this, "onGroupClick"));
    		this.eventGroupClick = on(this.lblGroup, "click", lang.hitch(this, "onGroupClick"));
    		this.eventCheckbox = on(this.chkRoute, "click", lang.hitch(this, "onchkRouteChange"));
    		this.eventCheckbox = on(this.chkRoute, "onkeyup", lang.hitch(this, "onchkRoutekeyup"));
    		this.eventCheckbox = on(this.chkDistanceStart, "click", lang.hitch(this, "onchkDistanceStartChange"));
    		this.eventCheckbox = on(this.chkDistanceEnd, "click", lang.hitch(this, "onchkDistanceEndChange"));
    		 esriRequest.setRequestPreCallback(function(ioArgs){   
		          if(ioArgs.url === "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest"){  
		            ioArgs.content.location = "-79.68,43.45";  
		            ioArgs.content.distance = 500000;  
		          console.log(ioArgs);  
		          }  
		          return ioArgs;  
		     });  
		     
		     //console.log(domAttr.get(this.chkRoute, "tabindex")); // get
  			 //domAttr.set(this.chkRoute, "tabindex", -1); // set
    	},
    	onchkRoutekeyup:function(evt)
    	{
    		console.log(evt);
    	},
    	onGroupClick:function(evt)
    	{
    		if (evt)
    			evt.stopPropagation();
    		if (domClass.contains(this.optionsBox,"collapsed"))
    		{
    			domClass.replace(this.optionsBox, "section_renderer", "section_renderer collapsed");
    			domClass.add(this.btnGroup, "groupIconTurn");	
    			domAttr.set(this.chkRoute, "tabindex", 0);
    			domAttr.set(this.chkDistanceStart, "tabindex", 0);
    			domAttr.set(this.chkDistanceEnd, "tabindex", 0);	
    		}
    		else
    		{
    			domClass.replace(this.optionsBox, "section_renderer collapsed", "section_renderer");
    			domClass.remove(this.btnGroup, "groupIconTurn");
    			domAttr.set(this.chkRoute, "tabindex", -1);	
    			domAttr.set(this.chkDistanceStart, "tabindex", -1);
    			domAttr.set(this.chkDistanceEnd, "tabindex", -1);	
    			
    		}
    			
    	},
    	onchkRouteChange:function(evt)
		{
    		evt.stopPropagation();
    		if ((this.chkRoute.checked))
    			this.runRouteAnalysis=true;
    		else
    			this.runRouteAnalysis=false;
    	},
    	onchkDistanceStartChange:function(evt)
		{
    		evt.stopPropagation();
    		if ((this.chkDistanceStart.checked))
    			this.runDriveTimeAnalysisAroundStart=true;
    		else
    			this.runDriveTimeAnalysisAroundStart=false;
    	},
    	onchkDistanceEndChange:function(evt)
		{
    		evt.stopPropagation();
    		if ((this.chkDistanceEnd.checked))
    			this.runDriveTimeAnalysisAroundEnd=true;
    		else
    			this.runDriveTimeAnalysisAroundEnd=false;
    	},
    	onBtnContinueClick:function()
    	{
    		if (this.valid())
    		{
    			this.submitRouteParameters();
    			this.emit('page_change', {page:2});
    			this.zoomToSelectionSet([this.startGeocoder.results[(this.startGeocoder.results.length-1)].feature,this.stopGeocoder.results[(this.stopGeocoder.results.length-1)].feature]);
    		}
    		
    		
    	},
    	onBtnBackClick:function()
    	{
    		this.emit('page_change', {page:0});
    	},
    	submitRouteParameters:function()
    	{
    		topic.publish("/widgets/WizardControl/InputPage/ClearResults", null);
    		
    		if (this.runRouteAnalysis)
    		{
    			var data={};
	    		if (this.startGeocoder.results.length>0)
	    		{
	    			data.stopA = this.startGeocoder.results[(this.startGeocoder.results.length-1)];
	    		}
	    		if (this.stopGeocoder.results.length>0)
	    		{
	    			data.stopB = this.stopGeocoder.results[(this.stopGeocoder.results.length-1)];
	    		}
	    		data.rate = this.imageList.selectedValue;
	    		topic.publish("/widgets/WizardControl/InputPage/RouteParams", data);
    		}   
    		if ((this.runDriveTimeAnalysisAroundStart)&&(this.runDriveTimeAnalysisAroundEnd))
    		{
    			var data={};
    			data.stopA = null;	
	    		data.stopB = null;
	    		if (this.startGeocoder.results.length>0)
                {
	    			data.stopA = this.startGeocoder.results[(this.startGeocoder.results.length-1)].feature;
                    data.stopA.attributes.name = this.startGeocoder.results[(this.startGeocoder.results.length-1)].name;
                }
	    		if (this.stopGeocoder.results.length>0)
                {
	    			data.stopB = this.stopGeocoder.results[(this.stopGeocoder.results.length-1)].feature;
                    data.stopB.attributes.name = this.stopGeocoder.results[(this.stopGeocoder.results.length-1)].name;
                }
	    		data.rate = this.imageList.selectedValue;
	    		topic.publish("/widgets/WizardControl/InputPage/DriveTimeParams", data);
    		}
    		else if (this.runDriveTimeAnalysisAroundStart)
    		{
    			var data={};
    			data.stopA = null;	
	    		data.stopB = null;
	    		if (this.startGeocoder.results.length>0)
                {
	    			data.stopA = this.startGeocoder.results[(this.startGeocoder.results.length-1)].feature;
                    data.stopA.attributes.name = this.startGeocoder.results[(this.startGeocoder.results.length-1)].name;
                }
	    		data.rate = this.imageList.selectedValue;
	    		topic.publish("/widgets/WizardControl/InputPage/DriveTimeParams", data);
    		}else if (this.runDriveTimeAnalysisAroundEnd)
    		{
    			var data={};
	    		data.stopA = null;	
	    		data.stopB = null;
	    		if (this.stopGeocoder.results.length>0)
                {
	    			data.stopB = this.stopGeocoder.results[(this.stopGeocoder.results.length-1)].feature;
                    data.stopB.attributes.name = this.stopGeocoder.results[(this.stopGeocoder.results.length-1)].name;
                }
	    		
	    		data.rate = this.imageList.selectedValue;
	    		topic.publish("/widgets/WizardControl/InputPage/DriveTimeParams", data);
    		}		
    	},
    	valid:function()
    	{
    		var value = true;	
    		domClass.remove(this.stopGeocoder.containerNode, "invalid");
    		domClass.remove(this.startGeocoder.containerNode, "invalid");
    		if (this.stopGeocoder.results.length==0)
    		{
    			domClass.add(this.stopGeocoder.containerNode, "invalid");
    			value= false;
    		}
    		if (this.startGeocoder.results.length==0)
    		{
    			domClass.add(this.startGeocoder.containerNode, "invalid");
    			value= false;
    		}
    			
    		return value;
    	},
    	zoomToSelectionSet: function(features)
		{
			var extentAll=null;
			
			for (var i = 0, len = features.length; i < len; i++) 
		    {
		    	var extent;
		     	var type = features[i].geometry.type;
		     	var json = {};
		     	json.spatialReference = features[i].geometry.spatialReference;
			    var geometry;
		     	 switch (type) {
			            case "multipoint":
			            case "point":
			            	extent = new Extent(features[i].geometry.x-5, features[i].geometry.y-5, features[i].geometry.x+5, features[i].geometry.y+5,features[i].geometry.spatialReference);
			            	break;
			            case "polyline":
			            case "extent":
			            case "polygon":
			            	json.rings = features[i].geometry.rings;
			              	geometry = new Polygon(json);
			             	extent = geometry.getExtent();
			            	break;
			            default:
			              	break;
			          }
			    if (extentAll == null)
				{
					extentAll = extent;
				}
	  			else
				{
					extentAll = extentAll.union(extent);
				}
		    }
			this.map.setExtent(extentAll.expand(2));
			
		}
    	
	});
});