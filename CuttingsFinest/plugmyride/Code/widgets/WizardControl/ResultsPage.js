define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/dom-construct",
  "dojo/_base/lang",
  "dojo/on",
  "dojo/topic",
  "dojo/dom-class",
  "dojo/_base/html",
  "./Controls/EVRouter/EVRouter",
  "./Controls/EVDriveTime/EVDriveTime",
  "./Controls/ProgressCheckList/ProgressCheckList",
  "dojo/text!./template/resultsPage.html"
], function(declare,_WidgetBase,_TemplatedMixin,_WidgetsInTemplateMixin,domConstruct,lang,on,topic,domClass,html,EVRouter,EVDriveTime,ProgressCheckList,template){
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], 
	{
		templateString: template,
		baseClass:"results_page",
		evRouter:null,
		analysisCount:0,
		analysisCompletedCount:0,
		createRoute:false,
		createDTpolys:false,
		constructor:function(args)
		{
			console.log("pagerenderer constructor");
			//this.templateString = args.template;
		},
		postCreate: function() 
    	{
    		this.inherited(arguments);
    		console.log("pagerenderer postcreate");
    		this.evRouter = new EVRouter({config:this.config.directions,map:this.map});
    		domConstruct.place(this.evRouter.containerNode, this.routingController);
    		this.own(on(this.evRouter , "analysis_completed", lang.hitch(this, this.displayControls)));
    		this.evDriveTime = new EVDriveTime({config:this.config.drivetime,map:this.map});
    		domConstruct.place(this.evDriveTime.containerNode, this.driveTimeController);
    		this.own(on(this.evDriveTime , "analysis_completed", lang.hitch(this, this.displayControls)));
    		this.own(on(this.evDriveTime , "analysis_temp_completed", lang.hitch(this, this.completeTempTask)));
    		this.progress = new ProgressCheckList({config:this.config});
    		domConstruct.place(this.progress.containerNode, this.loadingController);
    		//domConstruct.place('<img class="jimu-loading" src="' + require.toUrl('jimu') + '/images/loading.gif">', this.loadingController);
    		topic.subscribe('/widgets/WizardControl/InputPage/RouteParams', lang.hitch(this, function (data) {
        	   
        	    if (this.evRouter  != null)
        	    {
        	    	this.progress.addTask({id:1,label:"Route Analysis ..."});
        	    	this.createRoute = true;
        	    	domClass.remove(this.loadingController, "hidden");
        	    	this.evRouter.runRoute(data.stopA,data.stopB,data.rate); 
        	    	this.analysisCount++;
        	    }
            }));
            topic.subscribe('/widgets/WizardControl/InputPage/DriveTimeParams', lang.hitch(this, function (data) {
        	    if (this.evDriveTime  != null)
        	    {
        	    	this.progress.addTask({id:2,label:"Create Temporary Distance Polygons ..."});
        	    	this.progress.addTask({id:3,label:"Driving Distance Analysis ..."});
        	    	this.createDTpolys = true;
        	    	domClass.remove(this.loadingController, "hidden"); 
        	    	this.evDriveTime.runAnalysis(data.stopA,data.stopB,data.rate);
        	    	this.analysisCount++;
        	    }
            }));
            topic.subscribe('/widgets/WizardControl/InputPage/ClearResults', lang.hitch(this, function (data) {
        	   
        	    this.clear();
            }));
    	},
    	clear:function()
    	{
    		 this.analysisCount=0;
    		 this.analysisCompletedCount=0;
    		 this.evDriveTime.clear();
    		 this.evRouter.clearDirections();
    		 domClass.add(this.routingController, "hidden");
    		 domClass.add(this.driveTimeController, "hidden");
        	 this.createRoute = false;
        	 this.createDTpolys = false;
        	 this.progress.clear();
        	 html.setStyle(this.infoController, {width: '100%',height:'86%'});
    	},
    	completeTempTask:function(evt)
    	{
    		this.progress.completeTask({id:2});
    		domClass.remove(this.driveTimeController, "hidden");
    		
    	},
    	displayControls:function(evt)
    	{
    		this.analysisCompletedCount++;
    		if (this.createRoute)
    		{
    			this.progress.completeTask({id:1});
    			domClass.remove(this.routingController, "hidden");
    		}
    			
    		if (this.analysisCompletedCount==this.analysisCount)
    		{
    			if (this.createDTpolys)
    			{
    				this.progress.completeTask({id:3});
    				domClass.remove(this.driveTimeController, "hidden");
    			}
    				
    			domClass.add(this.loadingController, "hidden");
    			html.setStyle(this.infoController, {width: '100%',height:'92%'});
    		}		
    	},
    	onBtnBackClick:function()
    	{
    		this.emit('page_change', {page:1});
    	}
    	
	});
});