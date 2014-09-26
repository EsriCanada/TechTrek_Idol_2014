define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/_base/lang",
  "dojo/on",
  "dijit/form/CheckBox",
  "dojo/text!./template/welcomePage.html"
], function(declare,_WidgetBase,_TemplatedMixin,_WidgetsInTemplateMixin,lang,on,CheckBox,template){
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], 
	{
		templateString: template,
		baseClass:"welcome_page",
		constructor:function(args)
		{
			console.log("pagerenderer constructor");
			//this.templateString = args.template;
		},
		postCreate: function() 
    	{
    		this.inherited(arguments);
    		console.log("pagerenderer postcreate");
    	},
    	onBtnContinueClick:function()
    	{
    		this.emit('page_change', {page:1});
    	}
	});
});