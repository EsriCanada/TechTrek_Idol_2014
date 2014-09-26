define([
'dojo/_base/declare',
'jimu/BaseWidget',
'dojo/_base/html',
'dojo/_base/lang',
'dojo/query',
'dojo/on',
"dojo/dom-construct",
"dojo/topic",
"./WelcomePage",
"./InputPage",
"./ResultsPage",
"dojo/text!./template/welcomePage.html"]
,function(declare,BaseWidget,html,lang,query,on,domConstruct,topic,WelcomePage,InputPage,ResultsPage,welcomeTemplate)
{
	return declare([BaseWidget], 
	{
		baseClass: 'widget_wizard_control',
		name: 'WizardControl',
        title: "",
        pages:[],
		postCreate: function() 
    	{
    		console.log("wizardcontrol postcreate "+ this.id);
    		//initialize the widget
            this.inherited(arguments);
            //this.initiateTab();
            this.loadPages();
            this.showPage({page:0});
            topic.subscribe("/widgets/HeaderWizard/pageChange", lang.hitch(this, function (data) { 
 				this.showPage({page:(data.page-1)});
			}));
    	},
    	loadPages:function()
    	{
    		//var page = new WelcomePage({config:this.config.directions,map:this.map});//.placeAt(this.wizardContainer,'last');
    		var page = new WelcomePage({config:this.config});
    		page.startup(); 
    		this.own(on(page, "page_change", lang.hitch(this, this.showPage)));
    		//page.placeAt(this.wizardContainer,'last');
    		this.pages.push(page);  
    		//page = new InputPage({config:this.config.directions,map:this.map});//.placeAt(this.wizardContainer,'last');
    		page = new InputPage({config:this.config,map:this.map});
    		this.own(on(page, "page_change", lang.hitch(this, this.showPage)));
    		page.startup(); 
    		this.pages.push(page);   
    		page = new ResultsPage({config:this.config,map:this.map});
    		this.own(on(page, "page_change", lang.hitch(this, this.showPage)));
    		page.startup(); 
    		this.pages.push(page);                                                                                         
    	},
    	showPage:function(evt)
    	{
    		//domConstruct.empty(this.wizardContainer);
    		this.removeChildElements();
    		this.pages[evt.page].placeAt(this.wizardContainer,'last');
    		topic.publish("/widgets/WizardControl/pageChange", {page:evt.page});
    	},
    	removeChildElements:function()
    	{
			while (this.wizardContainer.hasChildNodes()) {
			    this.wizardContainer.removeChild(this.wizardContainer.lastChild);
			}
    	}
	});
});